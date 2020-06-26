import React from 'react';
import { withRouter } from 'react-router-dom';
import { getUser } from '../Utils/Common';
import TripForm from './TripForm';
import { Box, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    width: "335px",
    textAlign: "center",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "20px" 
  },
});


class AddTrip extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user_id: '',
        currentUsers : [],
        currencies : [],
        currencyNames : [],
        tripName : "",
      }
      this.addUser = this.addUser.bind(this);
      this.addCurrency = this.addCurrency.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.updateTripName = this.updateTripName.bind(this);
      this.deleteCurrency = this.deleteCurrency.bind(this);
      this.deleteUser = this.deleteUser.bind(this);
      this.enterCheck = this.enterCheck.bind(this);
    }

    componentDidMount() {
      this.props.functionProps["updatePageName"]("New Trip");
        const user = getUser();
        this.setState({
            user_id: user.user_id,
        });
    }
    
    enterCheck(e) {
      if (e.key == "Enter") {
        if (e.target.id === "username") {
          this.addUser(e);
        } else if (e.target.id === "currency" || e.target.id === "currencyVal" ) {
          this.addCurrency(e);
        } else {
          e.preventDefault();
        }
      }
    }
  
    deleteUser(name, e) {
      e.preventDefault();
      let userName = name
      let usernames = this.state.currentUsers;
      let index = usernames.findIndex((x) => {
        return x === userName
      });
      usernames.splice(index,1);
      this.setState({
        currentUsers : usernames,
      });
    }
  
    deleteCurrency(currency, e) {
      e.preventDefault();
      let name = currency;
      let currencies = this.state.currencies.slice();
      let currNames = this.state.currencyNames.slice();
      for (let i = 0; i < currNames.length; i++) {
        if (currNames[i] === name) {
          currNames.splice(i,1);
        }
        if (currencies[i][0] === name) {
          currencies.splice(i,1);
        }
      }
      this.setState({
        currencies : currencies,
        currencyNames : currNames,
      });
    }
  
    onSubmit(e) {
      e.preventDefault();
      //Check for empty trip name
      if (!this.state.tripName) {
        alert("Please enter a name for the trip.");
        return null;
      }
      //Check for empty users
      if (this.state.currentUsers.length === 0) {
        alert("Please enter the users for the trip.");
        return null;
      }
      let users = this.state.currentUsers;
      let username = getUser().username
      if (!users.includes(username)) {
        users.push(username);
      }
      //Print values to check
      console.log(users);
      console.log(this.state.tripName);
      console.log(this.state.currencies);
      console.log(this.state.user_id);
      fetch("https://accountant.tubalt.com/api/trips/newtrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tripName: this.state.tripName,
          users: users,
          currency: this.state.currencies,
          user_id: this.state.user_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
        } else {
          response.json().then(res => {
            this.props.functionProps["toggleSuccessCallback"]("Success");
            this.props.history.goBack();
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
      });
  
    }
  
    updateTripName(e) {
      let name = e.target.value;
      this.setState({
        tripName : name,
      });
    }
  
    addCurrency(e) {
      e.preventDefault();
      let currencies = this.state.currencies.slice();
      let currNames = this.state.currencyNames.slice();
      let newCurrencyName = document.getElementById('currency').value;
      let newCurrencyValue = document.getElementById('currencyVal').value;
      if (newCurrencyName.toUpperCase() === "SGD") {
        alert("SGD will automatically be added into your currencies.");
        return;
      }
      if (newCurrencyName === "" || newCurrencyValue === "") {
        alert("Please enter a valid currency");
        return;
      }
      document.getElementById('currency').value = '';
      document.getElementById('currencyVal').value = '';
      let newCurr = [ newCurrencyName, newCurrencyValue]
      if (currNames.includes(newCurrencyName)){
        currencies.forEach((curr)=> {
          if (curr[0] === newCurrencyName) {
            curr[1] = newCurrencyValue;
          }
        });
      } else {
        currencies.push(newCurr);
        currNames.push(newCurrencyName);
      }
      this.setState({
        currencyNames : currNames,
        currencies : currencies,
      });
    }
  
    addUser(e) {
      e.preventDefault();
      let curr = this.state.currentUsers.slice();
      let newName = document.getElementById('username').value;
      document.getElementById('username').value = '';
      if (newName === "") {
        alert("Please enter a name.");
        return;
      }
      if (curr.includes(newName)) {
        alert("Name already included.");
        return;
      }
      curr.push(newName);
      this.setState({
        currentUsers : curr,
      });
    }
  
    render() {
      const { classes } = this.props;
      return(
        <Box className={classes.root}>
            <TripForm 
            onSubmit = {this.onSubmit}
            enterCheck = {this.enterCheck}
            updateTripName = {this.updateTripName}
            tripName = {this.state.tripName}
            addUser = {this.addUser}
            deleteUser = {this.deleteUser}
            currentUsers = {this.state.currentUsers}
            addCurrency = {this.addCurrency}
            currencies = {this.state.currencies}
            deleteCurrency = {this.deleteCurrency}
            />
        </Box>
      );
    }
  }

  AddTrip.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(withRouter(AddTrip));