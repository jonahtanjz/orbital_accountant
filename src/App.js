import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import { getToken, removeUserSession, setUserSession } from './Utils/Common';
import Login from './Screens/Login';
import Home from './Screens/Home';
import Welcome from './Screens/Welcome';
import Signup from './Screens/Signup';
import AddTrip from './Components/AddTrip';
import AddEntry from './Components/AddEntry';
import ViewLedger from './Components/ViewLedger';
import EditTrip from './Components/EditTrip';

class App extends Component {
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

    render() {
        return (
            <div className="App">
              <BrowserRouter>
                <div>
                  <div className="header">
                    <NavLink activeClassName="active" to="/home">Home</NavLink>
                    <NavLink activeClassName="active" to="/login">Login</NavLink>
                    <NavLink activeClassName="active" to="/signup">Sign Up</NavLink>
                  </div>
                  <div className="content">
                    <Switch>
                      <Route exact path="/" component={Welcome} />
                      <Route path="/viewledger" component={ViewLedger} />
                      <PrivateRoute path="/home" component={Home} />
                      <PrivateRoute path="/addtrip" component={AddTrip} />
                      <PrivateRoute path ="/edittrip" component = {EditTrip} />
                      <PrivateRoute path="/addentry" component ={AddEntry} />
                      <PublicRoute path="/login" component={Login} />
                      <Route path="/signup" component={Signup} />
                    </Switch>
                  </div>
                </div>
              </BrowserRouter>
            </div>
          );
    }
}

export default App;