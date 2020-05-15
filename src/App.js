import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import { getToken, removeUserSession, setUserSession } from './Utils/Common';
import Login from './Login';
import Home from './Home';

class App extends Component {
    componentDidMount() {
        const token = getToken();
        if (!token) {
            return;
        }

        fetch('https://accountant.tubalt.com/api/verifyToken?token=${token}')
            .then(response => {
                setUserSession(response.data.token, response.data.user);
            })
            .catch(error => {
                removeUserSession();
            });
    }

    render() {
        return (
            <div className="App">
              <BrowserRouter>
                <div>
                  <div className="header">
                    <NavLink exact activeClassName="active" to="/">Home</NavLink>
                    <NavLink activeClassName="active" to="/login">Login</NavLink>
                  </div>
                  <div className="content">
                    <Switch>
                      <PrivateRoute exact path="/" component={Home} />
                      <PublicRoute path="/login" component={Login} />
                    </Switch>
                  </div>
                </div>
              </BrowserRouter>
            </div>
          );
    }
}

export default App;