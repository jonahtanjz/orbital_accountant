import React from 'react';
import { withRouter } from 'react-router-dom';
import { setUserSession } from '../Utils/Common';
import  PropTypes  from 'prop-types';
import  { Button, TextField, withStyles, Card, CardActions, Grid, CardMedia, CardActionArea } from '@material-ui/core';
import '../CSS/Login.css'

const styles = themes => ({
  // textField : {
  //   color: 'white !important',
  //   'MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated Mui-required Mui-required': {
  //     color: 'white !important'
  //   }
  // },
  // root: {
  //   width: 330,
  // },
  card : {
    width : '40vw',
    height : '90vh',
    backgroundColor : 'white',
  },
  media: {
    width : '100%',
    height : '35vh',
  },
});

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
    this.gotoLogin = this.gotoLogin.bind(this);
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

  gotoLogin(e) {
    this.props.history.push("/login");
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        >
        <Card className = {classes.card}>
        <CardActionArea>
            <CardMedia
              className={classes.media}
              image={require('../images/tubalt_logo.png')}
              title="Logo"
            />
        </CardActionArea>
          <CardActions className = "cardAction">
            <form onSubmit={this.onSubmit}>
              <TextField
                required
                variant="outlined"
                name='username'
                label='Username'
                onChange={this.onChange}
                value={this.state.username} />
                <br/><br/>
              <TextField
                required
                variant="outlined"
                name='password'
                label='Password'
                type='password'
                onChange={this.onChange}
                value={this.state.password} />
                <br/><br/>
              <TextField
                required
                variant="outlined"
                name='cPassword'
                label='Confirm Password'
                type='password'
                onChange={this.onChangePassword}
                value={this.state.cPassword} /> 
              <p>{this.state.validated || this.state.cPassword === '' ? "" : "Passwords do not match"}</p>   
              <br />
              <Button class = "button" type="submit">Sign Up</Button>
              <br/>
              <Button class = "toggleLogin" onClick = {this.gotoLogin}>Already have an account? Log in</Button>
            </form>
            </CardActions>
          </Card>
          </Grid>
      </div>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Signup));