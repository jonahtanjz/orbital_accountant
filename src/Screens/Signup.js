import React from 'react';
import { withRouter } from 'react-router-dom';
import { setUserSession } from '../Utils/Common';
import  { Button, TextField, Card, CardActions } from '@material-ui/core';
//import '../CSS/Signup.css'

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      username: '',
      password: '',
      cPassword: '',
      validated: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onChangePassword = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (this.state.password === e.target.value) {
      this.setState({validated: true,});
    } else {
      this.setState({validated: false,});
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    //Check for empty username
    if (! this.state.username) {
      alert("Please enter a username");
      return null;
    }
    if (! this.state.password) {
      alert("Please enter a password");
      return null;
    }
    //Check for matching password
    if (! this.state.validated) {
      alert("Passwords do not match")
      return null;
    }

    fetch('https://accountant.tubalt.com/api/users/signup', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            username: this.state.username,
            password: this.state.password
        })
    })
    .then(response => {
      if (response.status === 401) {
        response.json().then(res => alert(res.message));
      } else {
        response.json().then(res => {
          setUserSession(res.token, res.user);
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
    return (
      <div>
        <Card className = "center">
          <CardActions className = "colour">
            <form onSubmit={this.onSubmit}>
              <TextField
                required
                name='username'
                placeholder='Username'
                onChange={this.onChange}
                value={this.state.username} />
              <TextField
                required
                name='password'
                placeholder='Password'
                type='password'
                onChange={this.onChange}
                value={this.state.password} />
              <TextField
                required
                name='cPassword'
                placeholder='Confirm Password'
                type='password'
                onChange={this.onChangePassword}
                value={this.state.cPassword} /> 
              <p>{this.state.validated || this.state.cPassword === '' ? "" : "Passwords do not match"}</p>   
              <br />
              <Button class = "button" type="submit">Sign Up</Button>
            </form>
            </CardActions>
          </Card>
      </div>
    );
  }
}

export default withRouter(Signup);