import React from 'react';
import { withRouter } from 'react-router-dom';
import { setUserSession } from '../Utils/Common';
import  PropTypes  from 'prop-types';
import  { Button, TextField, withStyles, Card, CardActions, Grid, CardMedia, CardActionArea, Typography, InputAdornment, IconButton } from '@material-ui/core';
import { VpnKey, Visibility, VisibilityOff, AccountCircle } from '@material-ui/icons';
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
    maxWidth: 600,
    minWidth: 350,
    backgroundColor : 'white',
    borderRadius: "10px",
    marginTop: '30px'
  },
  media: {
    width : '100%',
    height: 320
  },
  loginForm: {
    marginTop: '20px'
  }
});

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      username: '',
      password: '',
      cPassword: '',
      validated: false,
      showPassword : false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.gotoLogin = this.gotoLogin.bind(this);
    this.toggleShowPassword = this.toggleShowPassword.bind(this);
  }

  componentDidMount() {
    this.props.updatePageName("Sign Up");
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

  toggleShowPassword(e) {
    this.setState({
      showPassword: !this.state.showPassword,
    });
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
            <form className={classes.loginForm} onSubmit={this.onSubmit}>
              <TextField
                required
                fullWidth
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
                <br/><br/>
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
              <TextField
                error = {!(this.state.validated || this.state.cPassword === '')}
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
                name='cPassword'
                label='Confirm Password'
                type={this.state.showPassword ? 'text' : 'password'}
                onChange={this.onChangePassword}
                value={this.state.cPassword}
                /> 
              <Typography color= "error">
                {this.state.validated || this.state.cPassword === '' ? "" : "Passwords do not match"}
              </Typography>   
              <br />
              <Button class = "button" type="submit">Sign Up</Button>
              <br/><br/>
              <Typography align="center">
                Already have an account?
                <Button class = "toggleLogin" onClick = {this.gotoLogin}>Login</Button>
              </Typography>
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