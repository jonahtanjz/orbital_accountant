import React from 'react';
import { getUser } from '../Utils/Common';
import { withRouter } from 'react-router-dom';
import { Grid, Paper, withStyles, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, IconButton, Select, NativeSelect, MenuItem, Button, InputLabel, CircularProgress } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { Edit } from '@material-ui/icons';
import '../CSS/Login.css';

const styles = theme => ({
    selectPerson: {
      width: "150px",
    },
    loadingCircleContainer: {
        width: "100%",
        textAlign: "center"
    },
    loadingCircle: {
        marginTop: "250px",
    },
    totalToPay: {
        width: "295px",
        textAlign: "center",
        padding: "20px",
        borderRadius: "10px 10px 0 0",
    },
    ledgerExpansion: {
        width: "335px",
        borderRadius: "0 !important",
    },
  });

class ViewLedger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trip : [],
            users : [],
            currency : [],
            transactions : [],
            selectedName : getUser() ? getUser().username : null,
            loaded: false,
            updatedCSVData: false,
            isMobile : false,
        };
        this.changeSelectedName = this.changeSelectedName.bind(this);
        this.updateCSVData = this.updateCSVData.bind(this);
    }

    componentDidMount() {
        if (window.screen.availWidth < 769) {
            this.setState({
                isMobile: true,
            });
        }
        const trip_id = (this.props.match.params.trip_id ) ? this.props.match.params.trip_id : this.props.location.state.trip_id;
        this.props.functionProps["updatePageName"]("Ledger");
        let newData = {
            trip_id: trip_id,
            transaction_id: -1
          }
        this.props.functionProps["updateTripData"](newData);
        fetch("https://accountant.tubalt.com/api/trips/getledger?tripid=" + trip_id)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            this.setState({
                trip : response.trip[0] ,
                users :response.users ,
                transactions : response.transactions,
                currency : response.currency,
                loaded: true,
            });
        })
    }

    changeSelectedName(e) {
        this.setState({
            selectedName : e.target.value,
        });
    }

    updateCSVData() {
        if (!this.state.updatedCSVData && this.state.loaded){
            let headers = [{label: "Description", key:"desc"},
                {label: "Currency", key:"curr"}];
            this.state.users.forEach((user) => 
                        headers.push({label: user.name, key: user.name}));

            let data = {};
            this.state.transactions.forEach((entry)=>{
                let id = entry.transaction_id;
                if (! data[id]) {
                    data[id] = {desc: entry.description, curr: entry.currency}
                    this.state.users.forEach((user) => {
                        data[id][user.name] = null;
                    });
                }
                data[id][entry.payer] += (0 - entry.amount);
                data[id][entry.payee] += entry.amount;
            })
            data = Object.values(data)
            console.log(this.state.trip.trip_name);
            this.props.functionProps["updateCSVData"](headers,data,this.state.trip.trip_name);
            this.setState({
                updatedCSVData: true,
            })
        }
    }


    render() {
        this.updateCSVData();

        //Calcs totals 
        let total = {}
        this.state.users.map((user) => {
            total[user.name] = 0
            return user;
        });
        this.state.transactions.map((entry) =>{
            let conversion;
            let usedCurrency = this.state.currency.filter((curr) => curr.name === entry.currency);
            if (usedCurrency.length === 0) {
                conversion = 1;
            } else {
                conversion = usedCurrency[0].value;
            }
            let value = parseFloat((entry.amount/conversion).toFixed(2));
            total[entry.payee] = total[entry.payee] - value;
            total[entry.payer] += value;
            return entry;
        });

        let filteredTransactions = this.state.transactions.filter((entry) =>
            entry.payee === this.state.selectedName || entry.payer=== this.state.selectedName
        );
        let { classes } = this.props;
        if (!this.state.loaded) { 
            return (
              <div className={classes.loadingCircleContainer}>
                <CircularProgress className={classes.loadingCircle} />
              </div>
            );
        }
        return(
            <div>
                <Grid
                    container
                    item 
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <Grid item>
                        <SelectLedger classes = {classes} isMobile={this.state.isMobile} changeSelectedName= {this.changeSelectedName} selectedName={this.state.selectedName} users={this.state.users}/>
                    </Grid>
                    <br/>
                    <Grid item>
                        <Button color = 'primary' onClick = {() => this.props.history.push('/suggestedpayments',{trip_id : this.state.trip.trip_id})}>
                            Suggested Payments
                        </Button>
                    </Grid>
                    <br/>
                    <Grid item>
                        <Paper className={classes.totalToPay}>
                            <Typography variant="h6">
                                {(Math.round(total[this.state.selectedName]*100)/100 < 0) ? "Total to Receive: S$"+Math.abs(Math.round(total[this.state.selectedName]*100)/100) : "Total to Pay: S$"+Math.round(total[this.state.selectedName]*100)/100}
                            </Typography>
                        </Paper>
                        <Ledger classes={classes} currency = {this.state.currency} users={this.state.users} transactions={filteredTransactions} self={this.state.selectedName} history = {this.props.history} trip = {this.state.trip} />
                    </Grid>
                    <br/>
                </Grid>
            </div>
        );
    }
}

class SelectLedger extends React.Component {

    render() {
        let selectOptions;
        let selectObject;
        if (this.props.isMobile) {
            selectOptions = this.props.users.map((person)=>{
                return(<option key ={person.name} value = {person.name}>{person.name}</option>);
            });
            selectObject =
            <div>
                <InputLabel id="select-person-label">Select Person</InputLabel>
                <NativeSelect
                    size = "sm"
                    className = {this.props.classes.selectPerson}
                    variant = "outlined"
                    id = "select-person"
                    labelId = "select-person-label"
                    onChange={this.props.changeSelectedName}
                    value = {this.props.selectedName}
                    >
                    {selectOptions}
                </NativeSelect> 
            </div>
        } else {
            selectOptions = this.props.users.map((person)=>{
                return(<MenuItem key ={person.name} value = {person.name}>{person.name}</MenuItem>);
            });
            selectObject = 
                <div>
                    <InputLabel id="select-person-label">Select Person</InputLabel>
                    <Select className = {this.props.classes.selectPerson}
                        labelId="select-person-label"
                        id="select-person"
                        value={this.props.selectedName}
                        onChange={this.props.changeSelectedName}
                        >
                        {selectOptions}
                    </Select>
                </div>
        }
        
        return(
            <div>
                {selectObject}
            </div>
        );
    }
}

class Ledger extends React.Component {

    render() {
        let displayLedger = this.props.users.map((person)=>{
            let personName = person.name;
            if (personName === this.props.self) {return null;}
            let entries = this.props.transactions
                .filter((entry) =>
                    entry.payee === personName || entry.payer=== personName);
            if (entries.length !== 0) { 
                return (
                <div>
                    <DisplayTable classes={this.props.classes} currency = {this.props.currency} otherPerson = {personName} transactions = {entries} self ={this.props.self} history = {this.props.history} trip = {this.props.trip} />
                </div>
                );
            } else {
                return (null);
            }
                
        });
        return(
            <div className="ledgerTable">
                {displayLedger}
            </div>
        );
    }

}

class DisplayTable extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let total = 0;
        const table = this.props.transactions.map((entry) => {
            let conversion;
            let usedCurrency = this.props.currency.filter((curr) => curr.name === entry.currency);
            if (usedCurrency.length === 0) {
                conversion = 1;
            } else {
                conversion = usedCurrency[0].value;
            }
            let value = (entry.amount/conversion)
            if (entry.payer == this.props.self) {
                value = (0 - value)
            }
            total = total + value;
            let valueColor =( (value > 0) ? "" : "secondary");
            return(

                <TableRow key={entry.description}>
                    <TableCell colSpan={3}>{entry.description}</TableCell>
                    <TableCell align="right">
                        <Typography color = {valueColor}>
                            {value.toFixed(2)}
                        </Typography>
                    </TableCell>
                    <TableCell>

                        <IconButton size="small" aria-label="edit" onClick = {() => this.props.history.push("/editentry",{transaction_id : entry.transaction_id, trip_id : this.props.trip.trip_id})}>
                            <Edit/>
                        </IconButton>
                    </TableCell>
                </TableRow>
            );
        });
        let totalColor = ((total > 0) ? "" : "secondary");
        return(
            <ExpansionPanel className={this.props.classes.ledgerExpansion}>
                <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography >{"Ledger of " + this.props.otherPerson}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <TableContainer >
                        <Table size="small"  aria-label="spanning table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" colSpan={3}>
                                    Description
                                    </TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {table}
                                <TableRow>
                                    
                                    <TableCell colSpan={3}>
                                        <p class= "totalDesc">
                                            {"Total: "}
                                        </p>
                                    </TableCell>
                                    <TableCell colSpan={2} align="right">
                                        <Typography color = {totalColor}>
                                            {(total).toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ExpansionPanelDetails>
            </ExpansionPanel>

        );
    }
}

class UndoEndTrip extends React.Component {
    constructor(props) {
      super(props);
      this.undoEndTrip = this.undoEndTrip.bind(this);
    }
    
    undoEndTrip(e) {
      fetch("https://accountant.tubalt.com/api/trips/undoendtrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          trip_id : this.props.trip.trip_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
            this.props.history.push("/home");
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert("Oops! Something went wrong");
      });
    } 

    render() {
        if (this.props.trip.ended == 1) {
            return(
            <div>
                <button class = "button" type = "button" onClick={this.undoEndTrip}>Restart Trip</button>
            </div>
            );
        } else {
            return null;
        }
    }
}

  ViewLedger.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(withRouter(ViewLedger));
