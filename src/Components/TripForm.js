import React from 'react';
import { withRouter } from 'react-router-dom';

class TripForm extends React.Component {
    render(){
      return(
      <div>
        <form onSubmit = {this.props.onSubmit} >
          <InputTripName enterCheck = {this.props.enterCheck} updateTripName = {this.props.updateTripName} tripName = {this.props.tripName} />
          <br/>
          <InputUsers addUser = {this.props.addUser} enterCheck = {this.props.enterCheck} />
          <DisplayUsers deleteUser = {this.props.deleteUser} currentUsers = {this.props.currentUsers} />
          <br/>
          <InputCurrency enterCheck = {this.props.enterCheck} addCurrency = {this.props.addCurrency} />
          <DisplayCurrencies currencies = {this.props.currencies} deleteCurrency = {this.props.deleteCurrency} />
          <br/>
          <input type="submit" value = "Submit" />
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

  export default withRouter(TripForm);