import React from 'react';
import { withRouter } from 'react-router-dom';
import { getUser } from './Utils/Common';

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
        const user = getUser();
        this.setState({
            user_id: user.user_id,
        });
    }
    
    enterCheck(e) {
      if (e.key == "Enter") {
        if (e.target.name === "username") {
          this.addUser(e);
        } else if (e.target.name === "currency" || e.target.name === "currencyVal" ) {
          this.addCurrency(e);
        } else {
          e.preventDefault();
        }
      }
    }
  
    deleteUser(e) {
      e.preventDefault();
      let userName = e.target.name;
      let usernames = this.state.currentUsers;
      let index = usernames.findIndex((x) => {
        return x === userName
      });
      usernames.splice(index,1);
      this.setState({
        currentUsers : usernames,
      });
    }
  
    deleteCurrency(e) {
      e.preventDefault();
      let name = e.target.name;
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
      fetch("https://accountant.tubalt.com/api/newtrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tripName: this.state.tripName,
          users: this.state.currentUsers,
          currency: this.state.currencies,
          user_id: this.state.user_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
            alert("Success");
            this.props.history.push("/home");
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert("Oops! Something went wrong");
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
      if (newCurrencyName === "" || newCurrencyValue === "") {
        alert("Please enter a valid currency");
        return;
      }
      document.getElementById('currency').value = '';
      document.getElementById('currencyVal').value = '';
      let newCurr = [ newCurrencyName, newCurrencyValue]
      if (currNames.includes(newCurrencyName)){return;}
      currencies.push(newCurr);
      currNames.push(newCurrencyName);
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

      return(
        <form onSubmit = {this.onSubmit} onkeydown = "return event.key != 'Enter'" >
          <InputTripName enterCheck = {this.enterCheck} updateTripName = {this.updateTripName} tripName = {this.state.tripName} />
          <br/>
          <InputUsers addUser = {this.addUser} enterCheck = {this.enterCheck} />
          <DisplayUsers deleteUser = {this.deleteUser} currentUsers = {this.state.currentUsers} />
          <br/>
          <InputCurrency enterCheck = {this.enterCheck} addCurrency = {this.addCurrency} />
          <DisplayCurrencies currencies = {this.state.currencies} deleteCurrency = {this.deleteCurrency} />
          <br/>
          <input type="submit" value = "Submit" />
        </form>
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
          <label>Trip Name</label>
          <input type = "text" id = "tripName" value = {this.props.tripName} onChange = {this.updateTripName} onKeyPress ={this.enterCheck}/>
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
        <label>Username</label>
        <input type = "text" name = "username" id = "username" onKeyPress ={this.enterCheck} />
        <input type = "button" value = "Add User" onClick = {this.addUser}  />
        </div>
      );
    }
  }

  class DisplayUsers extends React.Component {
    constructor(props) {
      super(props);
      this.deleteUser = this.deleteUser.bind(this);
    }

    deleteUser(e) {
      this.props.deleteUser(e);
    }

    render() {
      const displayUsers = this.props.currentUsers.map((user) => {
        return (
          <div>
            <p>{user}</p>
            <button type= "button" name = {user} onClick = {this.deleteUser}>Delete</button>
          </div>
  
        );
      });
      return(
        <div>
          {displayUsers}
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
        <label>Currency</label>
        <input type = "text" name = "currency" id = "currency" placeholder = "Name" onKeyPress ={this.enterCheck}/>
        <input type = "number" name = "currencyVal" id = "currencyVal" placeholder = "Value" onKeyPress ={this.enterCheck} />
        <input type = "button" value = "Add Currency" onClick = {this.addCurrency} />
        </div>
      );
    }
  }
  class DisplayCurrencies extends React.Component {
    constructor(props) {
      super(props);
      this.deleteCurrency = this.deleteCurrency.bind(this);
    }

    deleteCurrency(e) {
      this.props.deleteCurrency(e);
    }

    render() {
      const displayCurrencies = this.props.currencies.map(([name,val]) =>{
        return(
        <div>
          <p>{name + " : " + val}</p>
          <button type ="button"  name = {name} onClick = {this.deleteCurrency}>Delete</button>
        </div>
        )
      });
      return(
        <div>
          {displayCurrencies}
        </div>
      );
    }

  }

  export default withRouter(AddTrip);