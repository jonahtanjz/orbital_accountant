import React from 'react';
import { withRouter } from 'react-router-dom';
import { setUserSession } from '../Utils/Common';
import  PropTypes  from 'prop-types';
import  { Button, TextField, withStyles, Card, CardActions, Grid, CardMedia, CardActionArea, InputAdornment, Typography, IconButton } from '@material-ui/core';
import { AccountCircle, VpnKey, Visibility, VisibilityOff } from '@material-ui/icons';
import '../CSS/Login.css';

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
    maxWidth: 600,
    minWidth: 350,
    backgroundColor : 'white',
    borderRadius: "10px",
    marginTop: '30px',
    paddingBottom: '10px'
  },
  media: {
    width : '100%',
    height: 200
  },
  loginForm: {
    marginTop: '20px'
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showPassword : false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.gotoSignup = this.gotoSignup.bind(this);
    this.toggleShowPassword = this.toggleShowPassword.bind(this);
  }

  componentDidMount() {
    this.props.functionProps["updatePageName"]("Login");
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
        response.json().then(res => this.props.functionProps["toggleFailCallback"]("Username or Password is Wrong."));
      } else {
        response.json().then(res => {
          setUserSession(res.token, res.user);
          this.props.history.push("/home");
        });
      }
    })
    .catch(error => {
      console.log(error);
      this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
    });
  }
  
  gotoSignup(e) {
    this.props.history.push("/signup");
  }

  toggleShowPassword(e) {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item>
        <Card className = {classes.card}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={require('../images/et.png')}
              title="Logo"
            />
        </CardActionArea>
          <CardActions className = "cardAction">
          <form className={classes.loginForm} onSubmit={this.onSubmit}>
            <TextField
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              name='username'
              label='Username'
              onChange={this.onChange}
              value={this.state.username} />
            <br/>
            <br/>
            <TextField
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.toggleShowPassword}
                        edge="end"
                      >
                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                ),
              }}
              variant="outlined"
              name='password'
              label='Password'
              type={this.state.showPassword ? 'text' : 'password'}
              onChange={this.onChange}
              value={this.state.password} />
            <br/><br/>
            <Button class="button" type="submit" variant="contained" color = "primary">Login</Button>
            <br/><br/>
            <Typography align= "center">
              Don't have an account? 
              <Button class = "toggleLogin" onClick = {this.gotoSignup}>Sign up</Button>
            </Typography>
          </form>
          </CardActions>
        </Card>
        </Grid>
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Login));