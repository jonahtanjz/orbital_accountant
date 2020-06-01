import React from 'react';
import { withRouter } from 'react-router-dom';
import { setUserSession } from '../Utils/Common';
import  PropTypes  from 'prop-types';
import  { Button, TextField, withStyles, Card, CardActions, Grid } from '@material-ui/core';
import '../CSS/Login.css'

const styles = themes => ({
  textField : {
    color: 'white !important',
    'MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated Mui-required Mui-required': {
      color: 'white !important'
    }
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    //Check for empty username
    if(! this.state.username) {
      alert("Please enter a Username");
      return null;
    }
    //Check for empty password
    if(! this.state.password) {
      alert("Please enter a Password");
      return null;
    }
    fetch('https://accountant.tubalt.com/api/users/signin', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            username: this.state.username,
            password: this.state.password
        })
    })
    .then(response => {
      if (response.status === 401) {
        response.json().then(res => alert("Username or Password is Wrong."));
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
    const { classes } = this.props;
    return (
      <Grid  justify="center" alignItems="center">
        <Card className = "card">
          <CardActions className = "cardAction">
          <form onSubmit={this.onSubmit}>
            <TextField
              className = {classes.textField}
              required
              name='username'
              label='Username'
              onChange={this.onChange}
              value={this.state.username} />
            <br/>
            <TextField
              className = {classes.textField}
              required
              name='password'
              label='Password'
              type='password'
              onChange={this.onChange}
              value={this.state.password} />
            <br />
            <br />
            <Button class="button" type="submit" variant="contained" color = "primary">Login</Button>
          </form>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Login));