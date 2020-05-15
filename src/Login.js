import React from 'react';
import { setUserSession } from './Utils/Common';

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

  onSubmit = () => {
    fetch('https://accountant.tubalt.com/api/users/signin', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            username: this.state.username,
            password: this.state.password
        })
    })
    .then(response => {
      setUserSession(response.data.token, response.data.user);
      this.props.history.push('/');
    })
    .catch(error => {
      if (error.response.status === 401) alert(error.response.data.message);
      else alert("Oops! Something went wrong");
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

export default Login;