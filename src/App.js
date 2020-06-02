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
import { AppBar, Toolbar, IconButton, Typography, withStyles, Button, SwipeableDrawer, List, ListItem, ListItemText} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';

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
      }
      this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
      this.handleDrawerClose = this.handleDrawerClose.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.updatePageName = this.updatePageName.bind(this);
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

    render() {
        const { classes } = this.props;
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
                      <Route exact path="/" render={(props) => <Welcome {...props} updatePageName={this.updatePageName} />} />
                      <Route path="/viewledger" render={(props) => <ViewLedger {...props} updatePageName={this.updatePageName} />} />
                      <PrivateRoute path="/home" component={Home} updatePageName={this.updatePageName} />
                      <PrivateRoute path="/pasttrips" component={PastTrips} updatePageName={this.updatePageName} />
                      <PrivateRoute path="/addtrip" component={AddTrip} updatePageName={this.updatePageName} />
                      <PrivateRoute path ="/edittrip" component = {EditTrip} updatePageName={this.updatePageName} />
                      <PrivateRoute path="/addentry" component ={AddEntry} updatePageName={this.updatePageName} />
                      <PrivateRoute path = "/editentry" component = {EditEntry} updatePageName={this.updatePageName} />
                      <PublicRoute path="/login" component={Login} updatePageName={this.updatePageName} />
                      <Route path="/signup" render={(props) => <Signup {...props} updatePageName={this.updatePageName} />}  />
                    </Switch>
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