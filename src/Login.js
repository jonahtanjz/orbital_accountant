import React from 'react';

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
    alert("Submitted: " + this.state.username + " " + this.state.password);
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