import React from 'react';

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
    if (this.state.password == e.target.value) {
      this.setState({validated: true,});
      console.log("YO");
    } else {
      this.setState({validated: false,});
      console.log("BITCH");
    }
  }

  onSubmit = () => {
    if (this.state.validated) {
        alert("Submitted: " + this.state.username + " " + this.state.password);
    } else {
        alert("f");
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
          <p>{this.state.validated || this.state.cPassword == '' ? "" : "password does not match"}</p>   
          <p>{this.state.validated.toString()}</p>
          <br />
          <button type="submit">Sign Up</button>
          </form>
      </div>
    );
  }
}

export default Signup;