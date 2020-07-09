import React from 'react';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Chip, withStyles, Typography, Tooltip, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import HelpIcon from '@material-ui/icons/Help';

const styles = theme => ({
  root: {
    justifyContent: 'center',
  },
  tripNameField: {
    width: "330px",
  },
  usernameField: {
    width: "250px",
    marginRight: "10px"
  },
  addUserButton: {
    width: "60px",
    marginTop: "15px"
  },
  currencyLabel: {
    textAlign: "left",
    paddingLeft: "3px"
  },
  currencyField: {
    width: "120px",
    marginRight: "10px"
  },
  addCurrencyButton: {
    width: "60px",
    marginTop: "15px"
  },
  peopleTitle: {
    textAlign: "left",
    paddingLeft: "3px",
    marginTop: "20px",
    fontWeight: "bolder",
    color: "rgba(88, 88, 88, 1)"

  },
  people: {
    minHeight: "100px",
    textAlign: "left"
  },
  peopleText: {
    marginTop: "35px",
    textAlign: "center",
    fontWeight: 700,
    color: "rgba(117, 117, 117, 0.7)"
  },
  peopleChip: {
    margin: "5px",
    maxWidth: "100%",
  },
  currencyContainer: {
    marginTop: "10px",
    marginBottom: "10px"
  },
  currencyLabel: {
    textAlign: "left",
    paddingLeft: "3px",
    fontWeight: "bolder",
    color: "rgba(88, 88, 88, 1)"
  },
  currency: {
    minHeight: "80px",
    textAlign: "left"
  },
  currencyText: {
    marginTop: "45px",
    textAlign: "center",
    fontWeight: 700,
    color: "rgba(117, 117, 117, 0.7)"
  },
  currencyChip: {
    margin: "5px",
    maxWidth: "100%",
  },
  createTripButton: {
    width: "330px"
  },
  tooltipDesign: {
    maxWidth: "150px",
    fontSize: "12px",
    padding: "10px 15px",
    whiteSpace: "pre-wrap",
    backgroundColor: "rgba(50, 50, 50, 1)",
  },
  tooltipIcon: {
    marginTop: "2px",
  }
});

class TripForm extends React.Component {
    render(){
      const { classes } = this.props;
      return(
      <div className={classes.root}>
        <form onSubmit = {this.props.onSubmit} >
          <InputTripName classes={classes} enterCheck = {this.props.enterCheck} updateTripName = {this.props.updateTripName} tripName = {this.props.tripName} />
          <br/>
          <InputUsers classes={classes} addUser = {this.props.addUser} enterCheck = {this.props.enterCheck} />
          <DisplayUsers classes={classes} deleteUser = {this.props.deleteUser} currentUsers = {this.props.currentUsers} />
          <br/>
          <InputCurrency classes={classes} enterCheck = {this.props.enterCheck} addCurrency = {this.props.addCurrency} />
          <DisplayCurrencies classes={classes} currencies = {this.props.currencies} deleteCurrency = {this.props.deleteCurrency} />
          <br/>
          <Button className={classes.createTripButton} color="primary" variant="contained" fullWidth type="submit">Create Trip</Button>
        </form>
      </div>
      );
    }
  }
  class InputTripName extends React.Component {
    constructor(props) {
      super(props);
      this.updateTripName = this.updateTripName.bind(this);
      this.enterCheck = this.enterCheck.bind(this);
    }

    enterCheck(e) {
      this.props.enterCheck(e);
    }

    updateTripName(e) {
      this.props.updateTripName(e);
    }

    render() {
      return(
        <div>
          <TextField required className={this.props.classes.tripNameField} id="tripName" label="Trip Name" variant="outlined" value = {this.props.tripName} onChange = {this.updateTripName} onKeyDown ={this.enterCheck} />
        </div>
      );
    }

  }

  class InputUsers extends React.Component {
    constructor(props) {
      super(props);
      this.enterCheck = this.enterCheck.bind(this);
      this.addUser = this.addUser.bind(this);
    }

    addUser(e) {
      this.props.addUser(e);
    }

    enterCheck(e) {
      this.props.enterCheck(e);
    }


    render() {
      return (
        <div>
        <TextField className={this.props.classes.usernameField} label="Username" id = "username" onKeyDown={this.enterCheck} />
        <Button className={this.props.classes.addUserButton} size="small" variant="contained" color="primary" type="button" onClick={this.addUser}>Add</Button>
        </div>
      );
    }
  }

  class DisplayUsers extends React.Component {
    constructor(props) {
      super(props);
      this.deleteUser = this.deleteUser.bind(this);
    }

    deleteUser(name, e) {
      this.props.deleteUser(name, e);
    }

    render() {
      const displayUsers = this.props.currentUsers.map((user) => {
        return (
          <Chip className={this.props.classes.peopleChip} color="primary" onDelete={(e) => this.deleteUser(user.username, e)} label={user.username} />
        );
      });
      return(
        <div className={this.props.classes.people}>
          <Typography className={this.props.classes.peopleTitle}>On this trip: </Typography>
          { displayUsers.length === 0
            ? <p className={this.props.classes.peopleText}>No users added!</p>
            : displayUsers
          }
        </div>
      );
    }
  }

  class InputCurrency  extends React.Component {
    constructor(props) {
      super(props);
      this.enterCheck = this.enterCheck.bind(this);
      this.addCurrency = this.addCurrency.bind(this);
    }

    enterCheck(e) {
      this.props.enterCheck(e);
    }

    addCurrency(e) {
      this.props.addCurrency(e);
    }

    render() {
      return(
        <div>
          <Grid container item>
                <Typography className={this.props.classes.currencyLabel} align= "left">
                  Currency: &nbsp;
                </Typography>
                <Tooltip classes={{ tooltip: this.props.classes.tooltipDesign }} leaveTouchDelay="10000" enterTouchDelay="10" 
                  title={'Enter the currency name and the value compared to 1 SGD. \n\n'
                          + 'For example, if 1 SGD = 0.72 USD, then enter USD as the name and 0.72 as the value.'}
                  arrow>
                  <HelpIcon className={this.props.classes.tooltipIcon} color="disabled" fontSize="small" />
                </Tooltip>
          </Grid>
          <div className={this.props.classes.currencyContainer}>
            <TextField className={this.props.classes.currencyField} id = "currency" label="Name" onKeyDown ={this.enterCheck} />
            <TextField className={this.props.classes.currencyField} type="number" id = "currencyVal" label="Value" onKeyDown ={this.enterCheck} />
            <Button className={this.props.classes.addCurrencyButton} size="small" variant="contained" color="primary" type = "button" onClick = {this.addCurrency}>
              Add
            </Button>
          </div>
        </div>
      );
    }
  }
  class DisplayCurrencies extends React.Component {
    constructor(props) {
      super(props);
      this.deleteCurrency = this.deleteCurrency.bind(this);
    }

    deleteCurrency(currency, e) {
      this.props.deleteCurrency(currency, e);
    }

    render() {
      const displayCurrencies = this.props.currencies.map(([name,val]) =>{
        return(
          <Chip className={this.props.classes.currencyChip} label={name + ": " + val} onDelete={(e) => this.deleteCurrency(name, e)} color="primary" />
        )
      });
      return(
        <div className={this.props.classes.currency}>
          { displayCurrencies.length === 0
            ? <p className={this.props.classes.currencyText}>No currencies added!</p>
            : displayCurrencies
          }
        </div>
      );
    }

  }

TripForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

  export default withStyles(styles)(withRouter(TripForm));