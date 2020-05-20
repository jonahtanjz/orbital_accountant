import React from 'react';
import { withRouter } from 'react-router-dom';
import { setUserSession } from '../Utils/Common';

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
          <br />
          <button type="submit">Login</button>
          </form>
      </div>
    );
  }
}

export default withRouter(Login);