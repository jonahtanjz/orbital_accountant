import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, NavLink, Redirect} from 'react-router-dom';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import { getToken, getUser, removeUserSession, setUserSession } from './Utils/Common';
import Login from './Screens/Login';
import Home from './Screens/Home';
import Welcome from './Screens/Welcome';
import Signup from './Screens/Signup';
import PastTrips from './Screens/PastTrips';
import AddTrip from './Components/AddTrip';
import AddEntry from './Components/AddEntry';
import ViewLedger from './Components/ViewLedger';
import SuggestedPayments from './Components/SuggestedPayments';
import EditTrip from './Components/EditTrip';
import EditEntry from './Components/EditEntry';
import Settings from './Screens/Settings';
import ChangePassword from './Components/ChangePassword';
import ChangeUsername from './Components/ChangeUsername';
import { AppBar, Toolbar, IconButton, InputAdornment, Typography, withStyles, Button, SwipeableDrawer, List, ListItem, ListItemText, Snackbar, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Divider, Menu, MenuItem, TextField} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import Alert from './Components/Alert';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ThreeDRotationSharp } from '@material-ui/icons';
import { CSVLink } from "react-csv";
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  drawerList: {
    width: 280
  },
  drawerListItem: {
    margin: "10px 0",
    height: 50
  },
  drawerListItemText: {
    textDecoration: "none",
    color: "rgba(0,0,0,0.87)",
    width: "100%",
    height: "100%"
  },
  drawerListItemTextActive: {
    backgroundColor: "rgba(0, 131, 226, 0.2)"
  },
  deleteIcon: {
    color: "#FFF",
  },
  welcomeText: {
    fontFamily: "Roboto",
    fontWeight: 600
  },
  csvText: {
    textDecoration: "none",
    color: "inherit"
  }
});

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        pageName: 'The Accountant',
        drawerState: false,
        successCallback: false,
        failCallback: false,
        successCallbackMessage: "",
        failCallbackMessage: "",
        trip_id: -1,
        transaction_id: -1,
        deleteTransactionDialog: false,
        refreshPage: false,
        anchorElLedgerMenu: null,
        linkDialog: false,
        csvHeaders: [],
        csvData: [],
        csvTitle: "",
      }
      this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
      this.handleDrawerClose = this.handleDrawerClose.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.updatePageName = this.updatePageName.bind(this);
      this.toggleSuccessCallback = this.toggleSuccessCallback.bind(this);
      this.toggleFailCallback = this.toggleFailCallback.bind(this);
      this.closeSuccessCallback = this.closeSuccessCallback.bind(this);
      this.closeFailCallback = this.closeFailCallback.bind(this);
      this.deleteTransaction = this.deleteTransaction.bind(this);
      this.updateTripData = this.updateTripData.bind(this);
      this.toggleDeleteTransactionDialog = this.toggleDeleteTransactionDialog.bind(this);
      this.toggleRefreshPage = this.toggleRefreshPage.bind(this);
      this.toggleLedgerMenu = this.toggleLedgerMenu.bind(this);
      this.toggleLinkDialog = this.toggleLinkDialog.bind(this);
      this.updateCSVData = this.updateCSVData.bind(this);
    }
    componentDidMount() {
        const token = getToken();
        if (!token) {
            return;
        }
        fetch('https://accountant.tubalt.com/api/users/verifyToken?token=' + token)
            .then(response => {
                if (response.status === 401) {
                  removeUserSession();
                } else {
                  response.json().then(res => setUserSession(res.token, res.user));
                }
            })
            .catch(error => {
                console.log(error);
                removeUserSession();
            });
    }

    handleDrawerOpen() {
      this.setState({drawerState: true});
    }

    handleDrawerClose() {
      this.setState({drawerState: false})
    }

    handleLogout = () => {    
      removeUserSession();
      updateUser("");
    } 

    updatePageName(name) {
      this.setState({
        pageName: name,
        deleteTransactionDialog: false,
        linkDialog: false,
        anchorElLedgerMenu: null
      });
    }

    toggleSuccessCallback(message) {
      let newState = true;
      this.setState({
        successCallback: newState,
        successCallbackMessage: message,
      });
    }

    toggleFailCallback(message) {
      let newState = true;
      this.setState({
        failCallback: newState,
        failCallbackMessage: message,
      });
    }

    closeSuccessCallback() {
      this.setState({
        successCallback: false,
      });
    }
    
    closeFailCallback() {
      this.setState({
        failCallback: false,
      });
    }

    deleteTransaction() {
      this.toggleDeleteTransactionDialog();
      fetch("https://accountant.tubalt.com/api/trips/deletetransaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            transaction_id : this.state.transaction_id,
          })
        })
        .then(response => {
          if (response.status === 401) {
            response.json().then(res => this.toggleFailCallback(res.message));
          } else {
            response.json().then(res => {
              this.toggleSuccessCallback("Deleted");
              this.toggleRefreshPage();
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.toggleFailCallback("Oops! Something went wrong");
        });
    }

    updateTripData(data) {
      this.setState({
        trip_id: data["trip_id"],
        transaction_id: data["transaction_id"],
      });
    }

    toggleDeleteTransactionDialog() {
      let newState = !this.state.deleteTransactionDialog;
      this.setState({
        deleteTransactionDialog: newState,
      });
    }

    toggleRefreshPage() {
      let newState = !this.state.refreshPage;
      this.setState({
        refreshPage: newState,
      });
    }

    toggleLedgerMenu(e) {
      if (Boolean(this.state.anchorElLedgerMenu)) {
        this.setState({ anchorElLedgerMenu: null });
      } else {
        this.setState({ anchorElLedgerMenu: e.currentTarget });
      }
    }

    toggleLinkDialog() {
      let newState = !this.state.linkDialog;
      this.setState({ linkDialog: newState });
    }

    updateCSVData(headers, data, title) {
      this.setState({
        csvHeaders: headers,
        csvData: data,
        csvTitle: title,
      });
    }

    render() {
        const { classes } = this.props;
        const functionProps = {
          updatePageName: this.updatePageName,
          toggleSuccessCallback: this.toggleSuccessCallback,
          toggleFailCallback: this.toggleFailCallback,
          updateTripData: this.updateTripData,
          refreshPage: this.state.refreshPage,
          toggleRefreshPage: this.toggleRefreshPage,
          updateCSVData: this.updateCSVData,
        }
        return (
            <div className="App">
              <BrowserRouter>
                <div>
                <AppBar position="static">
                  <Toolbar>
                    { (getToken())
                      ? <IconButton onClick={this.handleDrawerOpen} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                          <MenuIcon />
                        </IconButton>
                      : null
                    }  
                    <Typography variant="h6" className={classes.title}>
                      {this.state.pageName}
                    </Typography>
                    { (this.state.pageName === "Edit Transaction")
                        ? <React.Fragment>
                            <IconButton onClick={this.toggleDeleteTransactionDialog}>
                              <DeleteOutlineIcon className={classes.deleteIcon} />
                            </IconButton>
                            <Dialog open={this.state.deleteTransactionDialog} onClose={this.toggleDeleteTransactionDialog} aria-labelledby="form-dialog-title">
                              <DialogTitle id="form-dialog-title">Delete Transaction?</DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  Are you sure you want to delete this transaction? This action cannot be undone.
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={this.toggleDeleteTransactionDialog} color="primary">
                                  No, Cancel
                                </Button>
                                <Button onClick={this.deleteTransaction} color="primary" autoFocus>
                                  Yes, Delete
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </React.Fragment>
                        : (this.state.pageName === "Ledger")
                          ? <React.Fragment>
                              <IconButton onClick={this.toggleLedgerMenu}>
                                <MoreVertIcon className={classes.deleteIcon} />
                              </IconButton>
                              <Menu
                                anchorEl={this.state.anchorElLedgerMenu}
                                keepMounted
                                open={Boolean(this.state.anchorElLedgerMenu)}
                                onClick={this.toggleLedgerMenu}
                              >
                                <MenuItem onClick={this.toggleLinkDialog}>Generate Ledger Link</MenuItem>
                                <MenuItem onClick={this.toggleLedgerMenu}>
                                  <CSVLink className={classes.csvText} data={this.state.csvData} headers={this.state.csvHeaders} filename={this.state.csvTitle+".csv"}>
                                    Export Ledger to CSV
                                  </CSVLink>
                                </MenuItem>
                              </Menu>
                              <Dialog open={this.state.linkDialog} onClose={this.toggleLinkDialog} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Generate Link</DialogTitle>
                                <DialogContent>
                                  <DialogContentText>
                                    Paste this link in your browser to view the ledgers
                                  </DialogContentText>
                                  <TextField
                                    id = "ledgerLink"
                                    margin="dense"
                                    label="Link"
                                    fullWidth
                                    InputProps = {{
                                      endAdornment: 
                                        (<InputAdornment position="end">
                                          <IconButton
                                            aria-label="Copy"
                                            edge="end"
                                            onClick = {() =>{ 
                                              let copyText = document.getElementById("ledgerLink")
                                              copyText.select();
                                              copyText.setSelectionRange(0, 99999);
                                              document.execCommand("copy");
                                              }
                                            }>
                                              <AssignmentOutlinedIcon/>
                                          </IconButton>
                                        </InputAdornment>),
                                    }}
                                    value={"https://accountant.tubalt.com/viewledger/" + this.state.trip_id}
                                  />
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={this.toggleLinkDialog} color="primary">
                                    OK
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </React.Fragment>
                          : null  
                    }
                  </Toolbar>
                </AppBar>
                { (getToken()) 
                  ? <SwipeableDrawer
                      open={this.state.drawerState}
                      onClose={this.handleDrawerClose}
                      onOpen={this.handleDrawerOpen}
                    >
                      <List className={classes.drawerList} component="nav" aria-label="main navigation">
                        <ListItem>
                          <img width="100%" src={require('./images/logo_side.png')} />
                        </ListItem>
                          <ListItem>
                              <p className={classes.welcomeText}>
                                Welcome, {getUser().username}
                              </p>
                          </ListItem>
                        <Divider />
                        <ListItem className={classes.drawerListItem} onClick={this.handleDrawerClose} button>
                          <NavLink className={classes.drawerListItemText} activeClassName="active" to="/home">
                            <Typography>
                              Current Trips
                            </Typography>
                          </NavLink>
                        </ListItem>
                        <ListItem className={classes.drawerListItem} onClick={this.handleDrawerClose} button>
                          <NavLink className={classes.drawerListItemText} activeClassName="active" to="/pasttrips">
                            <Typography>
                              Past Trips
                            </Typography>
                          </NavLink>
                        </ListItem>
                        <ListItem className={classes.drawerListItem} onClick={this.handleDrawerClose} button>
                          <NavLink className={classes.drawerListItemText} activeClassName="active" to="/settings">
                            <Typography>
                              Settings
                            </Typography>
                          </NavLink>
                        </ListItem>
                        <ListItem className={classes.drawerListItem} onClick={this.handleDrawerClose} button>
                        <ListItemText primaryTypographyProps={{variant: "body1"}} onClick={this.handleLogout} primary="Logout"/>
                        </ListItem>
                      </List>
                    </SwipeableDrawer>
                  : null
                }  
                  {/* <div className="header">
                    <NavLink activeClassName="active" to="/home">Home</NavLink>
                    <NavLink className={classes.drawerListItemText} activeClassName="active" to="/pasttrips">Past Trips</NavLink>
                    <NavLink activeClassName="active" to="/login">Login</NavLink>
                    <NavLink activeClassName="active" to="/signup">Sign Up</NavLink>
                  </div> */}
                  <div className="content">
                    <Switch>
                      {/* <Route exact path="/" render={(props) => <Welcome {...props} functionProps={functionProps} />} /> */}
                      <PrivateRoute exact path="/" component={Home} functionProps={functionProps} />
                      <Route path="/viewledger/:trip_id" render={(props) => <ViewLedger {...props} functionProps={functionProps} />} />
                      <Route path="/viewledger/" render={(props) => <ViewLedger {...props} functionProps={functionProps} />} />
                      <Route path="/suggestedpayments" render={(props) => <SuggestedPayments {...props} functionProps={functionProps} />} />
                      <PrivateRoute path="/home" component={Home} functionProps={functionProps} />
                      <PrivateRoute path="/settings" component={Settings} functionProps={functionProps} />
                      <PrivateRoute path="/pasttrips" component={PastTrips} functionProps={functionProps} />
                      <PrivateRoute path="/addtrip" component={AddTrip} functionProps={functionProps} />
                      <PrivateRoute path ="/edittrip" component = {EditTrip} functionProps={functionProps} />
                      <PrivateRoute path="/addentry" component ={AddEntry} functionProps={functionProps} />
                      <PrivateRoute path = "/editentry" component = {EditEntry} functionProps={functionProps} />
                      <PrivateRoute path = "/changeusername" component = {ChangeUsername} functionProps={functionProps} />
                      <PrivateRoute path = "/changepassword" component = {ChangePassword} functionProps={functionProps} />
                      <PublicRoute path="/login" component={Login} functionProps={functionProps} />
                      <PublicRoute path="/signup" component={Signup} functionProps={functionProps}  />
                    </Switch>
                    <Snackbar open={this.state.successCallback} autoHideDuration={3000} onClose={this.closeSuccessCallback}>
                      <Alert onClose={this.closeSuccessCallback} severity="success">
                        {this.state.successCallbackMessage}
                      </Alert>
                    </Snackbar>
                    <Snackbar open={this.state.failCallback} autoHideDuration={3000} onClose={this.closeFailCallback}>
                      <Alert onClose={this.closeFailCallback} severity="error">
                        {this.state.failCallbackMessage}
                      </Alert>
                    </Snackbar>
                  </div>
                </div>
              </BrowserRouter>
            </div>
          );
    }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);