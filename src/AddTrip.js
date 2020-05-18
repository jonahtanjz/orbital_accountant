import React from 'react';

class AddTrip extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
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
          user_id: 13,
        })
      }).then(response => response.json()).then(res => console.log(res.trip_id));
  
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
      const displayUsers = this.state.currentUsers.map((user) => {
        return (
          <div>
            <p>{user}</p>
            <button type= "button" name = {user} onClick = {this.deleteUser}>Delete</button>
          </div>
  
        );
      });
      const displayCurrencies = this.state.currencies.map(([name,val]) =>{
        return(
        <div>
          <p>{name + " : " + val}</p>
          <button type ="button"  name = {name} onClick = {this.deleteCurrency}>Delete</button>
        </div>
        )
      });
      return(
        <form onSubmit = {this.onSubmit} onkeydown = "return event.key != 'Enter'" >
          <label>Trip Name</label>
          <input type = "text" id = "tripName" value = {this.state.tripName} onChange = {this.updateTripName} onKeyPress ={this.enterCheck}/>
          <br/>
          <label>Username</label>
          <input type = "text" name = "username" id = "username" onKeyPress ={this.enterCheck} />
          <input type = "button" value = "Add User" onClick = {this.addUser}  />
          {displayUsers}
          <br/>
          <label>Currency</label>
          <input type = "text" name = "currency" id = "currency" placeholder = "Name" onKeyPress ={this.enterCheck}/>
          <input type = "number" name = "currencyVal" id = "currencyVal" placeholder = "Value" onKeyPress ={this.enterCheck} />
          <input type = "button" value = "Add Currency" onClick = {this.addCurrency} />
          {displayCurrencies}
          <br/>
          <input type="submit" value = "Submit" />
        </form>
      );
    }
  
  }

  export default AddTrip;