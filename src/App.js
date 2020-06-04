import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, NavLink, Redirect} from 'react-router-dom';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import { getToken, removeUserSession, setUserSession } from './Utils/Common';
import Login from './Screens/Login';
import Home from './Screens/Home';
import Welcome from './Screens/Welcome';
import Signup from './Screens/Signup';
import PastTrips from './Screens/PastTrips';
import AddTrip from './Components/AddTrip';
import AddEntry from './Components/AddEntry';
import ViewLedger from './Components/ViewLedger';
import EditTrip from './Components/EditTrip';
import EditEntry from './Components/EditEntry';
import { AppBar, Toolbar, IconButton, Typography, withStyles, Button, SwipeableDrawer, List, ListItem, ListItemText, Snackbar} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import Alert from './Components/Alert';

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
    width: 250
  },
  drawerListItem: {
    margin: "10px 0",
    height: 50
  },
  drawerListItemText: {
    textDecoration: "none",
    color: "#000",
    fontWeight: 600,
    width: "100%",
    height: "100%"
  },
  drawerListItemTextActive: {
    backgroundColor: "rgba(0, 131, 226, 0.2)"
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
      }
      this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
      this.handleDrawerClose = this.handleDrawerClose.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.updatePageName = this.updatePageName.bind(this);
      this.toggleSuccessCallback = this.toggleSuccessCallback.bind(this);
      this.toggleFailCallback = this.toggleFailCallback.bind(this);
      this.closeSuccessCallback = this.closeSuccessCallback.bind(this);
      this.closeFailCallback = this.closeFailCallback.bind(this);
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
    } 

    updatePageName(name) {
      this.setState({pageName: name});
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

    render() {
        const { classes } = this.props;
        const functionProps = {
          updatePageName: this.updatePageName,
          toggleSuccessCallback: this.toggleSuccessCallback,
          toggleFailCallback: this.toggleFailCallback
        }
        return (
            <div className="App">
              <BrowserRouter>
                <div>
                <AppBar position="static">
                  <Toolbar>
                    <IconButton onClick={this.handleDrawerOpen} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                      {this.state.pageName}
                    </Typography>
                  </Toolbar>
                </AppBar>
                <SwipeableDrawer
                  open={this.state.drawerState}
                  onClose={this.handleDrawerClose}
                  onOpen={this.handleDrawerOpen}
                >
                  <List className={classes.drawerList} component="nav" aria-label="main navigation">
                    <ListItem className={classes.drawerListItem} onClick={this.handleDrawerClose} button>
                      <NavLink className={classes.drawerListItemText} activeClassName="active" to="/home">Current Trips</NavLink>
                    </ListItem>
                    <ListItem className={classes.drawerListItem} onClick={this.handleDrawerClose} button>
                      <NavLink className={classes.drawerListItemText} activeClassName="active" to="/pasttrips">Past Trips</NavLink>
                    </ListItem>
                    <ListItem className={classes.drawerListItem} onClick={this.handleDrawerClose} button>
                    <ListItemText onClick={this.handleLogout} primary="Logout"/>
                    </ListItem>
                  </List>
                </SwipeableDrawer>
                  {/* <div className="header">
                    <NavLink activeClassName="active" to="/home">Home</NavLink>
                    <NavLink className={classes.drawerListItemText} activeClassName="active" to="/pasttrips">Past Trips</NavLink>
                    <NavLink activeClassName="active" to="/login">Login</NavLink>
                    <NavLink activeClassName="active" to="/signup">Sign Up</NavLink>
                  </div> */}
                  <div className="content">
                    <Switch>
                      <Route exact path="/" render={(props) => <Welcome {...props} functionProps={functionProps} />} />
                      <Route path="/viewledger" render={(props) => <ViewLedger {...props} functionProps={functionProps} />} />
                      <PrivateRoute path="/home" component={Home} functionProps={functionProps} />
                      <PrivateRoute path="/pasttrips" component={PastTrips} functionProps={functionProps} />
                      <PrivateRoute path="/addtrip" component={AddTrip} functionProps={functionProps} />
                      <PrivateRoute path ="/edittrip" component = {EditTrip} functionProps={functionProps} />
                      <PrivateRoute path="/addentry" component ={AddEntry} functionProps={functionProps} />
                      <PrivateRoute path = "/editentry" component = {EditEntry} functionProps={functionProps} />
                      <PublicRoute path="/login" component={Login} functionProps={functionProps} />
                      <Route path="/signup" render={(props) => <Signup {...props} functionProps={functionProps} />}  />
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