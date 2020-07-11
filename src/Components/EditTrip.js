import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { getUser } from '../Utils/Common';
import { Tooltip, Grid, TextField, Button, Chip, withStyles, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import HelpIcon from '@material-ui/icons/Help';

const styles = theme => ({
  root: {
    width: "335px",
    textAlign: "center",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "20px" 
  },
  tripNameTitle: {
    display: "inline",
  },
  tripNameField: {
    width: "230px",
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
    marginBottom: "10px",
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
    maxWidth: "100%"
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
    maxWidth: "100%"
  },
  createTripButton: {
    width: "330px"
  },
  editCurrencyField: {
    width: "45%",
    marginRight: "10px"
  },
  iconButtons: {
    marginTop: "5px"
  },
  loadingCircleContainer: {
    width: "100%",
    textAlign: "center"
  },
  loadingCircle: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "250px",
  },
  tooltipDesign: {
    maxWidth: "150px",
    fontSize: "12px",
    padding: "10px 15px",
    whiteSpace: "pre-wrap",
    backgroundColor: "rgba(50, 50, 50, 1)",
  },
  tooltipDesignUser: {
    marginTop: "22px"
  },
  tooltipIcon: {
    marginTop: "2px",
  }
});

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
        owner_id : 0,
        loaded: false,
        userToAdd: "",
        isUserDialog: false,
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
      this.addNonOrExistingUser = this.addNonOrExistingUser.bind(this);
      this.toggleIsUserDialog = this.toggleIsUserDialog.bind(this);
    }

    componentDidMount() {
      if (!this.props.location.state) {
        this.props.functionProps["toggleFailCallback"]("Invalid link. Please try again.");
        setTimeout(()=>this.props.history.push("/"),3000);
        return;
      }
      this.props.functionProps["updatePageName"]("Edit Trip");
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
                currencies: response.currency,
                currencyNames : response.currency.map(currency=>currency.name),
                trip_id: this.props.location.state.trip_id,
                owner_id: response.trip[0].owner,
                loaded: true,
            });
        })
        .catch(err => {
          this.props.history.push("/offline", {canGoBack: true});
        });

    }

    setNewTripInfo(response) {
      console.log(response);
      this.setState({
        tripName: response.trip[0].trip_name,
        currentUsers: response.users,
        currencies: response.currency,
        currencyNames : response.currency.map(currency=>currency.name),
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
      let newCurrencyName = document.getElementById('currency').value;
      let newCurrencyValue = document.getElementById('currencyVal').value;
      if (newCurrencyName === "" || newCurrencyValue === "" || newCurrencyValue == 0) {
        alert("Please enter a valid currency");
        return;
      }
      document.getElementById('currency').value = '';
      document.getElementById('currencyVal').value = '';
      let newCurr = [ newCurrencyName, newCurrencyValue]
      console.log(currencies);
      if (currencies.filter(currency => currency.in_trip === 1 && currency.name === newCurrencyName).length > 0){
        alert("Currency name already exists.")
        return;
      }
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
          response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
        } else {
          response.json().then(res => {
            this.setNewTripInfo(res);
            this.props.functionProps["toggleSuccessCallback"]("Currency Added");
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
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
      if (this.state.currentUsers.filter((person) => person.name.toUpperCase() === newName.toUpperCase() && person.in_trip === 1).length !== 0) {
        alert("Name already included.");
        return;
      }
      fetch("https://accountant.tubalt.com/api/users/checkusername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: newName
        })
      })
      .then(response => response.json())
      .then(res => {
        if (res.exists) {
          this.setState({
            isUserDialog: true,
            userToAdd: newName
          })
        } else {
          this.addNonOrExistingUser(false, false, newName);
        }
      })
      .catch( err => {
        this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
      });
    }

    addNonOrExistingUser(status, toggle, name) {
      if (toggle) {this.toggleIsUserDialog();}
      let newUser = {
        username: (toggle ? this.state.userToAdd : name),
        hasAccount: status
      };
      fetch("https://accountant.tubalt.com/api/trips/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user : newUser,
          trip_id : this.state.trip_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
        } else {
          response.json().then(res => {
            this.props.functionProps["toggleSuccessCallback"]("User Added");
            this.setNewTripInfo(res);
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
      });
    }

    toggleIsUserDialog() {
      let newState = !this.state.isUserDialog;
      this.setState({
        isUserDialog: newState
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
      const { classes } = this.props;
      if (!this.state.loaded) { 
        return (
          <div className={classes.loadingCircleContainer}>
            <CircularProgress className={classes.loadingCircle} />
          </div>
        );
      }
      return(
        <React.Fragment>
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
          owner_id = {this.state.owner_id}
          classes = { classes }
          functionProps = {this.props.functionProps}
          />
          <Dialog open={this.state.isUserDialog} onClose={this.toggleIsUserDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Does {this.state.userToAdd} have an account?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                The username entered matches a user account. Does {this.state.userToAdd} have an account? If yes, add {this.state.userToAdd} as a user and this trip will automatically be added to {this.state.userToAdd}'s trip. 
                If not, add {this.state.userToAdd} as a non-user.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.addNonOrExistingUser(false, true, null)} color="primary">
                Add as Non-User
              </Button>
              <Button onClick={() => this.addNonOrExistingUser(true, true, null)} color="primary" autoFocus>
                Add as user
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      );
    }
  }

  class TripForm extends React.Component {
    render(){
      return(
      <div className={this.props.classes.root}>
        <form >
          <InputTripName functionProps = {this.props.functionProps} classes = {this.props.classes} enterCheck = {this.props.enterCheck} updateTripName = {this.props.updateTripName} tripName = {this.props.tripName} trip_id = {this.props.trip_id} setNewTripInfo = {this.props.setNewTripInfo} />
          <br/>
          <InputUsers functionProps = {this.props.functionProps} classes = {this.props.classes} addUser = {this.props.addUser} enterCheck = {this.props.enterCheck} />
          <DisplayUsers functionProps = {this.props.functionProps} classes = {this.props.classes} deleteUser = {this.props.deleteUser} currentUsers = {this.props.currentUsers} changeUserName = {this.props.changeUserName} trip_id = {this.props.trip_id} owner_id = {this.props.owner_id} setNewTripInfo = {this.props.setNewTripInfo} />
          <br/>
          <InputCurrency functionProps = {this.props.functionProps} classes = {this.props.classes} enterCheck = {this.props.enterCheck} addCurrency = {this.props.addCurrency} />
          <DisplayCurrencies functionProps = {this.props.functionProps} classes = {this.props.classes} currencies = {this.props.currencies} deleteCurrency = {this.props.deleteCurrency} setNewTripInfo = {this.props.setNewTripInfo} trip_id = {this.props.trip_id} />
          <br/>
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
      if (!this.state.editingText) {
        alert("Please enter a trip name.");
        return null;
      }
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
          response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
        } else {
          response.json().then(res => {
            this.props.setNewTripInfo(res);
            this.props.functionProps["toggleSuccessCallback"]("Updated");
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
      });
    }

    render() {
     
      return(
        <div>
          {(! this.state.editing) 
            ? <div>
                <TextField className={this.props.classes.tripNameField} id="tripName" label="Trip Name" variant="outlined" value = {this.props.tripName} disabled/>
                <IconButton className={this.props.classes.iconButtons} color="primary" onClick = {this.toggleEditing}>
                  <EditIcon />
                </IconButton> 
              </div>
            //? <div><span>{this.props.tripName}</span> <button type = "button" onClick = {this.toggleEditing}>Edit</button> </div>

            : <div>
                <TextField autoFocus className={this.props.classes.tripNameField} id="tripName" label="Trip Name" variant="outlined" value = {this.state.editingText} onChange = {this.updateTripName} onKeyPress ={this.enterCheck}/>
                <IconButton className={this.props.classes.iconButtons} color="primary" onClick = {this.editTripName}>
                  <DoneIcon />
                </IconButton> 
                <IconButton className={this.props.classes.iconButtons} color="secondary" onClick = {this.toggleEditing}>
                  <CloseIcon />
                </IconButton>
              </div>
            //: <div><input type = "text" id = "tripName" value = {this.state.editingText} onChange = {this.updateTripName} onKeyPress ={this.enterCheck}/> <button type = "button" onClick = {this.editTripName}>Done</button><button type = "button" onClick = {this.toggleEditing}>Cancel</button></div>
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
          <TextField className={this.props.classes.usernameField} label="Username" id = "username" onKeyPress={this.enterCheck} />
          <Button className={this.props.classes.addUserButton} size="small" variant="contained" color="primary" type="button" onClick={this.addUser}>Add</Button>
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
        deleteUserDialog: {},
        ownerDialog: false,
        isUserDialog: false,
        userToAdd: "",
        linkIdToEdit: 0,
      };
      this.deleteUser = this.deleteUser.bind(this);
      this.toggleEditing = this.toggleEditing.bind(this);
      this.submitEditedName = this.submitEditedName.bind(this);
      this.changeUserName = this.changeUserName.bind(this);
      this.toggleDeleteUserDialog = this.toggleDeleteUserDialog.bind(this);
      this.toggleOwnerDialog = this.toggleOwnerDialog.bind(this);
      this.addNonOrExistingUser = this.addNonOrExistingUser.bind(this);
      this.toggleIsUserDialog = this.toggleIsUserDialog.bind(this);
    }

    deleteUser(e, id) {
      let link_id = id;
      let userName = this.props.currentUsers.filter((user) => user.id == link_id)[0].name;
      if (this.props.currentUsers.filter(person => person.in_trip === 1).length === 1) {
        alert("There has to be at least one person in the trip at all times.");
        return null;
      }
      if (this.props.currentUsers.filter(person => person.user_id === this.props.owner_id)[0].name === userName) {
        alert("The owner of the is not allowed to be removed.");
        return null;
      }
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
          response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
        } else {
          response.json().then(res => {
            this.props.setNewTripInfo(res);
            this.props.functionProps["toggleSuccessCallback"]("User Removed");
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
      });
      this.props.deleteUser(e);
      this.toggleDeleteUserDialog(id);
    }

    toggleEditing(id) {
      let newEdit = {};
      let newEditText = {};
      Object.assign(newEdit, this.state.editing);
      Object.assign(newEditText, this.state.editingText);
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

    submitEditedName(id) {
      this.toggleEditing(id);
      let newName = this.state.editingText[id];
      if (!newName) {
        alert("Please enter a valid name.");
        return null;
      }
      if (this.props.currentUsers.filter(person => person.id !== id).filter(person => person.in_trip === 1 && person.name.toUpperCase() === newName.toUpperCase()).length > 0) {
        alert("Name already exists");
        return null;
      }
      fetch("https://accountant.tubalt.com/api/users/checkusername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: newName
        })
      })
      .then(response => response.json())
      .then(res => {
        if (res.exists) {
          this.setState({
            isUserDialog: true,
            userToAdd: newName,
            linkIdToEdit: id
          });
        } else {
          this.addNonOrExistingUser(false, false, newName, id);
        }
      })
      .catch( err => {
        this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
      });
    }

    addNonOrExistingUser(status, toggle, name, id) {
      if (toggle) {this.toggleIsUserDialog();}
      let link_id = (toggle ? this.state.linkIdToEdit : id);
      let newName = (toggle ? this.state.userToAdd : name);
      let newUser = {
        username: newName,
        hasAccount: status
      };
      fetch("https://accountant.tubalt.com/api/trips/edittripuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id : link_id,
          newUser : newUser,
          trip_id : this.props.trip_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
        } else {
          response.json().then(res => {
            this.props.setNewTripInfo(res);
            this.props.functionProps["toggleSuccessCallback"]("Updated");
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
      });
    }

    toggleIsUserDialog() {
      let newState = !this.state.isUserDialog;
      this.setState({
        isUserDialog: newState
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

    toggleDeleteUserDialog(id) {
      let newDeleteUserDialog = this.state.deleteUserDialog;
      newDeleteUserDialog[id] = !this.state.deleteUserDialog[id];
      this.setState({
        deleteUserDialog: newDeleteUserDialog
      });
    }

    toggleOwnerDialog() {
      let newState = !this.state.ownerDialog;
      this.setState({ ownerDialog: newState });
    }

    render() {
      const displayUsers = this.props.currentUsers.filter(user => user.in_trip === 1).map((user) => {
        if (user.user_id !== this.props.owner_id) {
          return (
            <React.Fragment>
              <Chip className={this.props.classes.peopleChip} clickable color="primary" onClick={() => this.toggleEditing(user.id)} onDelete={() => this.toggleDeleteUserDialog(user.id)} label={user.name} />
              
              <Dialog open={this.state.editing[user.id]} onClose={() => this.toggleEditing(user.id)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Username</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Once completed, all transactions relating to this user will be renamed to the new edited name. 
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id={user.id}
                    label="Username"
                    fullWidth
                    value={this.state.editingText[user.id]}
                    onChange={this.changeUserName}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => this.toggleEditing(user.id)} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={() => this.submitEditedName(user.id)} color="primary">
                    Change
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={this.state.deleteUserDialog[user.id]}
                onClose={() => this.toggleDeleteUserDialog(user.id)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Remove {user.name} from the trip?</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Removing this user from the trip will remove his name from future transactions. All existing
                    transactions with this user will still be present in the ledger.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => this.toggleDeleteUserDialog(user.id)} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={(e) => this.deleteUser(e, user.id)} color="primary" autoFocus>
                    Remove
                  </Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          );
        } else {
          return(
            <React.Fragment>
                <Chip className={this.props.classes.peopleChip} onClick={this.toggleOwnerDialog} label={user.name} />
                
                <Dialog open={this.state.ownerDialog} onClose={this.toggleOwnerDialog} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Creator of Trip</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {user.name} is the creator of this trip. Creator's data cannot be edited or removed from
                      the trip. 
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.toggleOwnerDialog} color="primary">
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>
          );
        }

          // (!this.state.editing[user.id]) 
          // ?
          // <div>
          //   <p>{user.name}</p>
          //   {(user.user_id !== this.props.owner_id)
          //     ?<div>
          //       <button type= "button" id= {user.id}  onClick = {this.deleteUser}>Delete</button>
          //       <button type = "button" id= {user.id} onClick = {this.toggleEditing}>Edit</button>
          //     </div>
          //     :<div>
          //       <button type= "button" id= {user.id}  onClick = {this.deleteUser} disabled>Delete</button>
          //       <button type = "button" id= {user.id} onClick = {this.toggleEditing} disabled>Edit</button>
          //     </div>
          // 	}
          // </div>
          // :
          // <div>
          //   <input type = "text" id = {user.id} value = {this.state.editingText[user.id]} onChange = {this.changeUserName}/>
          //   <button type = "button" id = {user.id} onClick={this.submitEditedName}>Done</button>
          //   <button type = "button" id = {user.id} onClick={this.toggleEditing}>Cancel</button>
          // </div>
          
      });
      return(
        <div className={this.props.classes.currency}>
          <Grid container item>
            <Typography className={this.props.classes.peopleTitle}>On this trip:&nbsp;</Typography>
              <Tooltip classes={{ tooltip: this.props.classes.tooltipDesign }} leaveTouchDelay="10000" enterTouchDelay="10" 
                title={'To edit the username, click on the user you wish to edit below.'}
                arrow>
                <HelpIcon className={this.props.classes.tooltipDesignUser} color="disabled" fontSize="small" />
              </Tooltip>
          </Grid>
          {displayUsers}
          <Dialog open={this.state.isUserDialog} onClose={this.toggleIsUserDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Does {this.state.userToAdd} have an account?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                The username entered matches a user account. Does {this.state.userToAdd} have an account? If yes, add {this.state.userToAdd} as a user and this trip will automatically be added to {this.state.userToAdd}'s trip. 
                If not, add {this.state.userToAdd} as a non-user.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.addNonOrExistingUser(false, true, null, null)} color="primary">
                Add as Non-User
              </Button>
              <Button onClick={() => this.addNonOrExistingUser(true, true, null, null)} color="primary" autoFocus>
                Add as user
              </Button>
            </DialogActions>
          </Dialog>
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
                        + 'For example, if 1 SGD = 0.72 USD, then enter USD as the name and 0.72 as the value. \n\n'
                        + 'To edit the currency name or value, click on the currency you wish to edit below.'}
                arrow>
                <HelpIcon className={this.props.classes.tooltipIcon} color="disabled" fontSize="small" />
              </Tooltip>
          </Grid>
          <div className={this.props.classes.currencyContainer}>
            <TextField className={this.props.classes.currencyField} id = "currency" label="Name" onKeyPress ={this.enterCheck} />
            <TextField className={this.props.classes.currencyField} type="number" id = "currencyVal" label="Value" onKeyPress ={this.enterCheck} />
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
      this.state = {
        editing : {},
        editingText : {},
        deleteCurrencyDialog: {},
      }
      this.deleteCurrency = this.deleteCurrency.bind(this);
      this.toggleEditing = this.toggleEditing.bind(this);
      this.changeCurrencyName = this.changeCurrencyName.bind(this);
      this.changeCurrencyValue = this.changeCurrencyValue.bind(this);
      this.submitCurrency = this.submitCurrency.bind(this);
    }

    deleteCurrency(e, name) {
      // this.props.deleteCurrency(e);
      e.preventDefault();
      this.toggleDeleteCurrencyDialog(name);
      fetch("https://accountant.tubalt.com/api/trips/removecurrency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name : name,
          trip_id : this.props.trip_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
        } else {
          response.json().then(res => {
            this.props.setNewTripInfo(res);
            this.props.functionProps["toggleSuccessCallback"]("Currency Removed");
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
      });

    }

    toggleEditing(name) {
      let newText = {}
      Object.assign(newText,this.state.editingText);
      console.log(newText);
      let newEditing = {}
      Object.assign(newEditing, this.state.editing);
      newEditing[name] = !newEditing[name]
      if (newEditing[name]) {
        newText[name] = this.props.currencies.filter((currency)=>currency.name == name).map((currency)=>
       {return ({
          newName : currency.name,
          newVal : currency.value,
        });
        })[0];
      } else {
        delete newText[name];
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

    submitCurrency(name) {
      let oldName = name;
      this.toggleEditing(name);
      let newName = this.state.editingText[oldName]["newName"];
      let newVal = this.state.editingText[oldName]["newVal"];
      if (! newName || !newVal || newVal == 0) {
        alert("Please enter a valid currency");
        return null;
      }
      // if (this.props.currencies.filter(currency => currency.in_trip === 1 && currency.name === newName).length > 0) {
      //   alert("Currency name already exists.");
      //   return null;
      // }
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
          response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
        } else {
          response.json().then(res => {
            this.props.setNewTripInfo(res);
            this.props.functionProps["toggleSuccessCallback"]("Updated");
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
      });
    }

    toggleDeleteCurrencyDialog(name) {
      let newDeleteCurrencyDialog = this.state.deleteCurrencyDialog;
      newDeleteCurrencyDialog[name] = !this.state.deleteCurrencyDialog[name];
      this.setState({
        deleteCurrencyDialog: newDeleteCurrencyDialog
      });
    }

    render() {
      const displayCurrencies = this.props.currencies.filter(currency => currency.in_trip === 1).map((currency) =>{
        return( 
          <React.Fragment>
            <Chip className={this.props.classes.currencyChip} label={currency.name + ": " + currency.value} clickable color="primary" onClick={() => this.toggleEditing(currency.name)} onDelete={() => this.toggleDeleteCurrencyDialog(currency.name)} />
            
            <Dialog open={this.state.editing[currency.name]} onClose={() => this.toggleEditing(currency.name)} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Currency</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Once completed, all transactions relating to this currency will be renamed to the new edited currency and value. 
                </DialogContentText>
                <TextField
                  autoFocus
                  className={this.props.classes.editCurrencyField}
                  margin="dense"
                  label="Name"
                  id = {currency.name} 
                  value = {this.state.editing[currency.name] ? this.state.editingText[currency.name]["newName"] : currency.name} 
                  onChange = {this.changeCurrencyName}
                />
                <TextField
                  autoFocus
                  className={this.props.classes.editCurrencyField}
                  margin="dense"
                  label="Value"
                  id = {currency.name} 
                  value = {this.state.editing[currency.name] ? this.state.editingText[currency.name]["newVal"] : currency.value} 
                  onChange = {this.changeCurrencyValue}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => this.toggleEditing(currency.name)} color="primary">
                  Cancel
                </Button>
                <Button onClick={() => this.submitCurrency(currency.name)} color="primary">
                  Change
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={this.state.deleteCurrencyDialog[currency.name]}
              onClose={() => this.toggleDeleteCurrencyDialog(currency.name)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Remove {currency.name} from the trip?</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Removing this currency from the trip will remove the currency from future transactions. All existing
                  transactions with this currency will still be present in the ledger.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => this.toggleDeleteCurrencyDialog(currency.name)} color="primary">
                  Cancel
                </Button>
                <Button onClick={(e) => this.deleteCurrency(e, currency.name)} color="primary" autoFocus>
                  Remove
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>)
        // if (!this.state.editing[currency.name]) {
        //   return(
        //   <div>
        //     <p>{currency.name + " : " + currency.value}</p>
        //     <button type ="button"  name = {currency.name} onClick = {this.deleteCurrency}>Delete</button>
        //     <button type ="button" name = {currency.name} onClick = {this.toggleEditing}>Edit</button>
        //   </div>
        //   )
        // } else {
        //   return(
        //     <div>
        //       <input type = "text" id = {currency.name} value = {this.state.editingText[currency.name]["newName"]} onChange = {this.changeCurrencyName} />
        //       <input type = "text" id = {currency.name} value = {this.state.editingText[currency.name]["newVal"]} onChange = {this.changeCurrencyValue} />
        //       <button type ="button" name = {currency.name} onClick = {this.submitCurrency}>Done</button>
        //       <button type ="button" name = {currency.name} onClick = {this.toggleEditing}>Cancel</button>
        //     </div>
        //   );
        // }
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

  // class EndTrip extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.endTrip = this.endTrip.bind(this);
  //   }
    
  //   endTrip(e) {
  //     fetch("https://accountant.tubalt.com/api/trips/endtrip", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         trip_id : this.props.trip_id,
  //       })
  //     })
  //     .then(response => {
  //       if (response.status === 401) {
  //         response.json().then(res => alert(res.message));
  //       } else {
  //         response.json().then(res => {
  //           this.props.history.push("/home");
  //         });
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       alert("Oops! Something went wrong");
  //     });
  //   } 

  //   render() {
  //     return(
  //     <div>
  //       <Button type = "button" color="primary" variant="contained" size="large" fullWidth onClick={this.endTrip}>End Trip</Button>
  //     </div>
  //     );
  //   }
  // }

  EditTrip.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(withRouter(EditTrip));