import React from 'react';
import { getUser } from '../Utils/Common';
import { withRouter } from 'react-router-dom';
import { Grid, withStyles, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, IconButton, Select, MenuItem, Button, InputLabel, CircularProgress } from '@material-ui/core';
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
      }
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
            loaded: false
        };
        this.changeSelectedName = this.changeSelectedName.bind(this);
    }

    componentDidMount() {
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


    render() {
        let chooseName = this.state.users.map((person)=>{
                return(<MenuItem key ={person.name} value = {person.name}>{person.name}</MenuItem>);
                
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
                        <InputLabel id="select-person-label">Select Person</InputLabel>
                        <Select className = {classes.selectPerson}
                            labelId="select-person-label"
                            id="select-person"
                            value={this.state.selectedName}
                            onChange={this.changeSelectedName}
                        >
                            {chooseName}
                        </Select>
                    </Grid>
                    <br/>
                    <Grid item>
                        <Button color = 'primary' onClick = {() => this.props.history.push('/suggestedpayments',{trip_id : this.state.trip.trip_id})}>
                            Suggested Payments
                        </Button>
                    </Grid>
                    <br/>
                    <Grid item>
                        <Ledger currency = {this.state.currency} users={this.state.users} transactions={filteredTransactions} self={this.state.selectedName} history = {this.props.history} trip = {this.state.trip} />
                    </Grid>
                    <br/>
                </Grid>
            </div>
        );
    }
}

class Ledger extends React.Component {
    constructor(props) {
        super(props);

    }

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
                    <DisplayTable currency = {this.props.currency} otherPerson = {personName} transactions = {entries} self ={this.props.self} history = {this.props.history} trip = {this.props.trip} />
                </div>
                );
            } else {
                return (null);
            }
                
        });
        return(
            <div>
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
        let desc;
        if (total > 0) {
            desc = " To Receive"
        } else {
            desc = " To Pay"
        }
        return(
            <ExpansionPanel>
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
                                            {"Total" + desc}
                                        </p>
                                    </TableCell>
                                    <TableCell colSpan={2} align="right">
                                        <Typography>
                                            {Math.abs(total).toFixed(2)}
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
