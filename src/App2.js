import React, { Component } from 'react';
 
class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      data: null,
    };
  }
 
  componentDidMount() {
    fetch('https://accountant.tubalt.com/api/users/signin', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            username: "testnet",
            password: "testnet123"
        })
    })
    .then(response => response.json())
    .then(res => this.setState({data: res}));
  }

  render() {
      return (
        <div>
          <h1>FIne</h1>
        </div>
      );
  }
}

export default App;