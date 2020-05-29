import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { getUser } from '../Utils/Common';



class EditTrip extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user_id: '',
        currentUsers : [],
        currencies : [],
        currencyNames : [],
        tripName : "",
        originalUser : [],
        trip_id : 0,
      }
      this.addUser = this.addUser.bind(this);
      this.addCurrency = this.addCurrency.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.updateTripName = this.updateTripName.bind(this);
      this.deleteCurrency = this.deleteCurrency.bind(this);
      this.deleteUser = this.deleteUser.bind(this);
      this.enterCheck = this.enterCheck.bind(this);
      this.changeUserName = this.changeUserName.bind(this);
      this.setNewTripInfo = this.setNewTripInfo.bind(this);
    }

    componentDidMount() {
        const user = getUser();
        this.setState({
            user_id: user.user_id,
        });
        fetch("https://accountant.tubalt.com/api/trips/gettripinfo?tripid=" + this.props.location.state.trip_id)
        .then(response => response.json())
        .then(response => {
          console.log(response);
            this.setState({
                tripName: response.trip[0].trip_name,
                currentUsers: response.users,
                currencies: response.currency.map(currency=>[currency.name,currency.value,currency.in_trip]),
                currencyNames : response.currency.map(currency=>currency.name),
                trip_id: this.props.location.state.trip_id,
                //ended: response.trip[0].ended,
            });
        })

    }

    setNewTripInfo(response) {
      
      this.setState({
        tripName: response.trip[0].trip_name,
        currentUsers: response.users,
        currencies: response.currency.map(currency=>[currency.name,currency.value,currency.in_trip]),
        currencyNames : response.currency.map(currency=>currency.name),
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
    }

  
    deleteCurrency(e) {
      // e.preventDefault();
      // let name = e.target.name;
      // let currencies = this.state.currencies.slice();
      // let currNames = this.state.currencyNames.slice();
      // for (let i = 0; i < currNames.length; i++) {
      //   if (currNames[i] === name) {
      //     currNames.splice(i,1);
      //   }
      //   if (currencies[i][0] === name) {
      //     currencies.splice(i,1);
      //   }
      // }
      // this.setState({
      //   currencies : currencies,
      //   currencyNames : currNames,
      // });
    }
  
    onSubmit(e) {
      e.preventDefault();
      alert("In Progress");
    //   fetch("https://accountant.tubalt.com/api/trips/newtrip", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       tripName: this.state.tripName,
    //       users: this.state.currentUsers,
    //       currency: this.state.currencies,
    //       user_id: this.state.user_id,
    //     })
    //   })
    //   .then(response => {
    //     if (response.status === 401) {
    //       response.json().then(res => alert(res.message));
    //     } else {
    //       response.json().then(res => {
    //         alert("Success");
    //         this.props.history.push("/home");
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     alert("Oops! Something went wrong");
    //   });
  
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
      // if (currNames.includes(newCurrencyName)){return;}
      currencies.push(newCurr);
      currNames.push(newCurrencyName);
      this.setState({
        currencyNames : currNames,
        currencies : currencies,
      });
      fetch("https://accountant.tubalt.com/api/trips/addcurrency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currency : newCurr,
          trip_id : this.state.trip_id,
        })
      })
      .then(response => {
        console.log("Sent");
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
            this.setNewTripInfo(res);
            alert("Success");
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert("Oops! Something went wrong");
      });

    }
  
    addUser(e) {
      e.preventDefault();
      let newName = document.getElementById('username').value;
      document.getElementById('username').value = '';
      if (newName === "") {
        alert("Please enter a name.");
        return;
      }
      // if (curr.includes(newName)) {
      //   alert("Name already included.");
      //   return;
      // }
      fetch("https://accountant.tubalt.com/api/trips/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username : newName,
          trip_id : this.state.trip_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
            alert("Success");
            this.setNewTripInfo(res);
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert("Oops! Something went wrong");
      });

    }

    changeUserName(e) {
      let users = this.state.currentUsers.slice();
      let index = users.findIndex((user) =>{ 
        return (user.id == e.target.id)
        });
      users[index].name = e.target.value;
      this.setState({
        currentUsers : users,
      });
    }

  
    render() {
      return(
        <TripForm 
        onSubmit = {this.onSubmit}
        enterCheck = {this.enterCheck}
        updateTripName = {this.updateTripName}
        tripName = {this.state.tripName}
        addUser = {this.addUser}
        deleteUser = {this.deleteUser}
        currentUsers = {this.state.currentUsers}
        changeUserName = {this.changeUserName}
        addCurrency = {this.addCurrency}
        currencies = {this.state.currencies}
        deleteCurrency = {this.deleteCurrency}
        trip_id = {this.state.trip_id}
        setNewTripInfo = {this.setNewTripInfo}
        history = {this.props.history}
        />
      );
    }
  }

  class TripForm extends React.Component {
    render(){
      return(
      <div>
        <form >
          <InputTripName enterCheck = {this.props.enterCheck} updateTripName = {this.props.updateTripName} tripName = {this.props.tripName} trip_id = {this.props.trip_id} setNewTripInfo = {this.props.setNewTripInfo} />
          <br/>
          <InputUsers addUser = {this.props.addUser} enterCheck = {this.props.enterCheck} />
          <DisplayUsers deleteUser = {this.props.deleteUser} currentUsers = {this.props.currentUsers} changeUserName = {this.props.changeUserName} trip_id = {this.props.trip_id} setNewTripInfo = {this.props.setNewTripInfo} />
          <br/>
          <InputCurrency enterCheck = {this.props.enterCheck} addCurrency = {this.props.addCurrency} />
          <DisplayCurrencies currencies = {this.props.currencies} deleteCurrency = {this.props.deleteCurrency} setNewTripInfo = {this.props.setNewTripInfo} trip_id = {this.props.trip_id} />
          <br/>
          <EndTrip trip_id = {this.props.trip_id} history = {this.props.history} />
        </form>
      </div>
      );
    }
  }
  class InputTripName extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        editing : false,
        editingText: "",
      }
      this.updateTripName = this.updateTripName.bind(this);
      this.enterCheck = this.enterCheck.bind(this);
      this.toggleEditing = this.toggleEditing.bind(this);
      this.editTripName = this.editTripName.bind(this);
    }

    enterCheck(e) {
      this.props.enterCheck(e);
    }

    updateTripName(e) {
      let newTripName = e.target.value;
      this.setState({
        editingText: newTripName
      });
    }

    toggleEditing(e) {
      let tripName = this.props.tripName;
      let editState = this.state.editing;
      this.setState({
        editing : !editState,
        editingText: tripName,
      });
    }
    editTripName(e) {
      this.setState({
        editing : false,
      });
      fetch("https://accountant.tubalt.com/api/trips/edittrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tripName: this.state.editingText,
          trip_id : this.props.trip_id
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
            this.props.setNewTripInfo(res);
            alert("Success");
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert("Oops! Something went wrong");
      });
    }

    render() {
     
      return(
        <div>
          <label>Trip Name: </label>
          {(! this.state.editing) 
            ? <div><span>{this.props.tripName}</span> <button type = "button" onClick = {this.toggleEditing}>Edit</button> </div>
            : <div><input type = "text" id = "tripName" value = {this.state.editingText} onChange = {this.updateTripName} onKeyPress ={this.enterCheck}/> <button type = "button" onClick = {this.editTripName}>Done</button><button type = "button" onClick = {this.toggleEditing}>Cancel</button></div>
          }
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
      this.state = {
        editing : {},
        editingText: {},
      };
      this.deleteUser = this.deleteUser.bind(this);
      this.toggleEditing = this.toggleEditing.bind(this);
      this.submitEditedName = this.submitEditedName.bind(this);
      this.changeUserName = this.changeUserName.bind(this);
    }

    deleteUser(e) {
      let link_id = e.target.id;
      let userName = this.props.currentUsers.filter((user) => user.id == link_id)[0].name;
      fetch("https://accountant.tubalt.com/api/trips/removeuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id : link_id,
          username : userName,
          trip_id : this.props.trip_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
            this.props.setNewTripInfo(res);
            alert("Success");
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert("Oops! Something went wrong");
      });
      this.props.deleteUser(e);
    }

    toggleEditing(e) {
      let newEdit = {};
      let newEditText = {};
      Object.assign(newEdit, this.state.editing);
      Object.assign(newEditText, this.state.editingText);
      let id = e.target.id;
      newEdit[id] = !newEdit[id];
      if (newEdit[id]) {
        newEditText[id] = this.props.currentUsers.filter((user) => user.id == id)[0].name;
      } else {
        delete newEditText[id];
      }
      this.setState({
        editing: newEdit,
        editingText: newEditText,
      });
    }

    submitEditedName(e) {
      this.toggleEditing(e);
      let link_id = e.target.id;
      let newName = this.state.editingText[link_id];
      fetch("https://accountant.tubalt.com/api/trips/edittripuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id : link_id,
          newUsername : newName,
          trip_id : this.props.trip_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
            this.props.setNewTripInfo(res);
            alert("Success");
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert("Oops! Something went wrong");
      });
    }

    changeUserName(e) {
      let newName = e.target.value;
      let newEditText = {};
      Object.assign(newEditText, this.state.editingText);
      newEditText[e.target.id] = newName;
      this.setState({
        editingText: newEditText,
      }); 
    }

    render() {
      const displayUsers = this.props.currentUsers.filter(user => user.in_trip === 1).map((user) => {
        return (
          (!this.state.editing[user.id]) 
          ?
          <div>
            <p>{user.name}</p>
            <button type= "button" id= {user.id}  onClick = {this.deleteUser}>Delete</button>
            <button type = "button" id= {user.id} onClick = {this.toggleEditing}>Edit</button>
          </div>
          :
          <div>
            <input type = "text" id = {user.id} value = {this.state.editingText[user.id]} onChange = {this.changeUserName}/>
            <button type = "button" id = {user.id} onClick={this.submitEditedName}>Done</button>
            <button type = "button" id = {user.id} onClick={this.toggleEditing}>Cancel</button>
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
      this.state = {
        editing : {},
        editingText : {},
      }
      this.deleteCurrency = this.deleteCurrency.bind(this);
      this.toggleEditing = this.toggleEditing.bind(this);
      this.changeCurrencyName = this.changeCurrencyName.bind(this);
      this.changeCurrencyValue = this.changeCurrencyValue.bind(this);
      this.submitCurrency = this.submitCurrency.bind(this);
    }

    deleteCurrency(e) {
      // this.props.deleteCurrency(e);
      e.preventDefault();
      fetch("https://accountant.tubalt.com/api/trips/removecurrency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name : e.target.name,
          trip_id : this.props.trip_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
            this.props.setNewTripInfo(res);
            alert("Success");
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert("Oops! Something went wrong");
      });

    }

    toggleEditing(e) {
      let newText = {}
      Object.assign(newText,this.state.editingText);
      console.log(newText);
      let newEditing = {}
      Object.assign(newEditing, this.state.editing);
      newEditing[e.target.name] = !newEditing[e.target.name]
      if (newEditing[e.target.name]) {
        newText[e.target.name] = this.props.currencies.filter(([name,val,it])=>name == e.target.name).map(([name,val])=>
       {return ({
           newName : name,
          newVal : val
        });
        })[0];
      } else {
        delete newText[e.target.name];
      }

      this.setState({
        editing : newEditing,
        editingText : newText,
      })
    }

    changeCurrencyName(e) {
      let newText = {}
      Object.assign(newText,this.state.editingText);
      newText[e.target.id]["newName"] = e.target.value;
      this.setState({
        editingText : newText,
      });

    }

    changeCurrencyValue(e) {
      let newText = {}
      Object.assign(newText,this.state.editingText);
      newText[e.target.id]["newVal"] = e.target.value;
      this.setState({
        editingText : newText,
      });
    }

    submitCurrency(e) {
      let oldName = e.target.name;
      this.toggleEditing(e);
      console.log(oldName);
      console.log(this.state.editingText[oldName]["newName"]);
      console.log(this.state.editingText[oldName]["newVal"]);

      fetch("https://accountant.tubalt.com/api/trips/edittripcurrency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          originalName : oldName,
          newName : this.state.editingText[oldName]["newName"],
          newValue : this.state.editingText[oldName]["newVal"],
          trip_id : this.props.trip_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
            this.props.setNewTripInfo(res);
            alert("Success");
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert("Oops! Something went wrong");
      });
    }

    render() {
      const displayCurrencies = this.props.currencies.filter(currency => currency[2]==1).map(([name,val,it]) =>{
        if (!this.state.editing[name]) {
          return(
          <div>
            <p>{name + " : " + val}</p>
            <button type ="button"  name = {name} onClick = {this.deleteCurrency}>Delete</button>
            <button type ="button" name = {name} onClick = {this.toggleEditing}>Edit</button>
          </div>
          )
        } else {
          return(
            <div>
              <input type = "text" id = {name} value = {this.state.editingText[name]["newName"]} onChange = {this.changeCurrencyName} />
              <input type = "text" id = {name} value = {this.state.editingText[name]["newVal"]} onChange = {this.changeCurrencyValue} />
              <button type ="button" name = {name} onClick = {this.submitCurrency}>Done</button>
              <button type ="button" name = {name} onClick = {this.toggleEditing}>Cancel</button>
            </div>
          );
        }
      });
      return(
        <div>
          {displayCurrencies}
        </div>
      );
    }

  }

  class EndTrip extends React.Component {
    constructor(props) {
      super(props);
      this.endTrip = this.endTrip.bind(this);
    }
    
    endTrip(e) {
      fetch("https://accountant.tubalt.com/api/trips/endtrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          trip_id : this.props.trip_id,
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
      return(
      <div>
        <button type = "button" onClick={this.endTrip}>End Trip</button>
      </div>
      );
    }
  }
  export default withRouter(EditTrip);