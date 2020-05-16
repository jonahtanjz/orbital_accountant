import React from 'react';
import { withRouter } from 'react-router-dom';
import { setUserSession } from './Utils/Common';

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
    if (this.state.validated) {
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
    } else {
      alert("Password does not match")
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            name='username'
            placeholder='Username'
            onChange={this.onChange}
            value={this.state.username} />
          <input
            name='password'
            placeholder='Password'
            type='password'
            onChange={this.onChange}
            value={this.state.password} />
          <input
            name='cPassword'
            placeholder='Confirm Password'
            type='password'
            onChange={this.onChangePassword}
            value={this.state.cPassword} /> 
          <p>{this.state.validated || this.state.cPassword === '' ? "" : "Password does not match"}</p>   
          <br />
          <button type="submit">Sign Up</button>
          </form>
      </div>
    );
  }
}

export default withRouter(Signup);