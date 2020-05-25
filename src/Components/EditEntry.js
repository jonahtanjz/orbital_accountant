import React from 'react';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {withRouter} from 'react-router-dom'

class EditEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      people : [],
      displayPay : [],
      pay : [],
      displayConsume : [],
      consume : [],
      currency : [],
      selectedCurrency : "",
      equal : false,
      desc : "",
      trip : {},
    }
    this.onChangePay = this.onChangePay.bind(this);
    this.onChangeConsume = this.onChangeConsume.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updatePay = this.updatePay.bind(this);
    this.updateConsume = this.updateConsume.bind(this);
    this.changeEqual = this.changeEqual.bind(this);
    this.updateDesc = this.updateDesc.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
    this.deleteTransaction = this.deleteTransaction.bind(this);
  }

  componentDidMount() {
    fetch("https://accountant.tubalt.com/api/trips/gettransaction?transactionid="+ this.props.location.state.transaction_id + "&trip_id=" + this.props.location.state.trip_id)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        let curr = response.currency.map((currency) => currency.name);
        curr.push("SGD")

        let pay = response.transactions.filter(transaction => transaction.type === "payee")
            .map(transaction => [transaction.name, transaction.amount]);
        let displayPay = response.transactions.filter(transaction => transaction.type === "payee")
            .map(transaction => transaction.name);

        let consume = response.transactions.filter(transaction => transaction.type === "payer")
            .map(transaction => [transaction.name, transaction.amount]);
        let displayConsume = response.transactions.filter(transaction => transaction.type === "payer")
            .map(transaction => transaction.name);

        this.setState({
          trip : response.trip[0],
          people : response.users.map((person)=> person.name),
          currency : curr,
          selectedCurrency : response.transactions[0].currency,
          pay: pay,
          displayPay : displayPay ,
          consume: consume,
          displayConsume : displayConsume ,
          desc : response.transactions[0].description,
          equal : (response.transactions[0].equal == 1) ? true : false,
        })
      });
  }

  updateDesc(e) {
    this.setState({
      desc : e.target.value,
    });
  }

  changeEqual(e) {
    this.setState({
      equal : !this.state.equal,
    });
  }

  matchArr(display,amounts) {
    for (let i = 0; i < amounts.length; i++) {
      if(! display.includes(amounts[i][0])) {
        amounts.splice(i,1);
        i--;
      }
    }
    return amounts
  }

  updatePay(e) {
    let person = e.target.name;
    let value = e.target.value;
    let pay = this.state.pay.slice();
    for (let i = 0; i < pay.length; i++) {
      if (pay[i][0] == person) {
        pay[i][1] = parseFloat(value);
        this.setState({
          pay : pay
        });
        return;
      }
    }
    pay.push([person,parseFloat(value)]);
    this.setState({
      pay : pay
    });
  }

  updateConsume(e) {
    let person = e.target.name;
    let value = e.target.value;
    let consume = this.state.consume.slice();
    for (let i = 0; i < consume.length; i++) {
      if (consume[i][0] == person) {
        consume[i][1] = parseFloat(value);
        this.setState({
          consume : consume
        });
        return;
      }
    }
    consume.push([person,parseFloat(value)]);
    this.setState({
      consume : consume
    });
  }

  onChangePay(e) {
    let display = [];
    let pay = this.state.pay.slice();
    for (let i = 0; i < e.length; i++) {
      display.push(e[i].value);
    }
    pay = this.matchArr(display,pay);
    this.setState({
      displayPay : display,
      pay : pay,
    });
  }

  onChangeConsume(e) {
    let display = [];
    let consume = this.state.consume.slice();
    for (let i = 0; i < e.length; i++) {
      display.push(e[i].value);
    }
    consume = this.matchArr(display,consume)
    this.setState({
      displayConsume : display,
      consume : consume,
    });
  }

  changeCurrency(e) {
     this.setState({
       selectedCurrency : e.target.value
     });
  }

  onSubmit(e) {
    e.preventDefault();
    let consume = [];
    if (this.state.equal) {
      let pay = this.state.pay.slice();
      let displayConsume = this.state.displayConsume.slice();
      let total = 0;
      for(let i = 0; i < pay.length; i++) {
        total = total + pay[i][1];
      }
      const ave = (total/displayConsume.length);
      for (let i = 0; i < displayConsume.length; i++) {
        consume.push([displayConsume[i],ave]);
      }
    } else {
      consume = this.state.consume;
    }
    fetch("https://accountant.tubalt.com/api/trips/edittransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payees: this.state.pay,
        payers: consume,
        trip_id: this.state.trip.trip_id,
        description : this.state.desc,
        currency : this.state.selectedCurrency,
        equal : (this.state.equal) ? 1 : 0,
        transaction_id : this.props.location.state.transaction_id,
      })
    })
    .then(response => {
      if (response.status === 401) {
        response.json().then(res => alert(res.message));
      } else {
        response.json().then(res => {
          alert("Success");
          this.props.history.push("/viewledger",{trip_id : this.props.location.state.trip_id});
        });
      }
    })
    .catch(error => {
      console.log(error);
      alert("Oops! Something went wrong");
    });
  }

  deleteTransaction(e) {
    e.preventDefault();
    fetch("https://accountant.tubalt.com/api/trips/deletetransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          transaction_id : this.props.location.state.transaction_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
            alert("Success");
            this.props.history.push("/viewledger",{trip_id : this.props.location.state.trip_id});
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert("Oops! Something went wrong");
      });
  }

  render() {
    const submitButton = (<input type = "submit" value = "Submit"/> ) ;
    return (
      <div>
      <div>
      <form onSubmit = {this.onSubmit}>
      <p>People who paid:</p>
        <NameList 
        people = {this.state.people}
        onChange = {this.onChangePay}
        display = {this.state.displayPay}
        />
        <AmountDisplay
        onSubmit = {this.onSubmit}
        display = {this.state.pay}
        onChange = {this.updatePay}
        />
        <p>People who consumed:</p>
        <NameList 
        people = {this.state.people}
        onChange = {this.onChangeConsume}
        display = {this.state.displayConsume}
        type = "consume"
        />
        <AmountDisplay
        onSubmit = {this.onSubmit}
        display = {this.state.consume}
        onChange = {this.updateConsume}
        />
        <br/>
        <CurrencyList 
        currency = {this.state.currency}
        changeCurrency = {this.changeCurrency}
        />
        <br/>
        <br/>
        <Equals 
        changeEqual = {this.changeEqual} 
        equal = {this.state.equal} 
        />
        <br/>
        <input type="text" value = {this.state.desc} id="desc" onChange={this.updateDesc} placeholder="Description of Transaction"/>
        <br/> 
        {submitButton}
        <br/>
        <br/>
        <br/>
        <button type = "button" onClick ={this.deleteTransaction}>Delete</button>
      </form>
      </div>
      </div>
    );
  }
}

class Equals extends React.Component {
  constructor(props) {
    super(props);
    this.changeEqual = this.changeEqual.bind(this);
  }

  changeEqual(e) {
    this.props.changeEqual(e);
  }

  render() {
    return (
      <div>
        <input type = "checkbox" checked = {this.props.equal} onChange={this.changeEqual} id="equal" /> 
        <lable>Equal</lable>
      </div>
    );
  }
}

class CurrencyList extends React.Component {
  constructor(props) {
    super(props);
    this.changeCurrency = this.changeCurrency.bind(this);
  }
  changeCurrency(e) {
    this.props.changeCurrency(e);
  }
render () {
  const currencyDisplay = this.props.currency.map((curr) => 
  <option id = {curr} name = {curr} value = {curr}>{curr}</option>
  );
  return (
    <select onChange = {this.changeCurrency} id = "curr" className = "css-1r4vtzz">
      {currencyDisplay}
    </select>
  );
}
}

class AmountDisplay extends React.Component {
constructor(props) {
  super(props);
  this.onSubmit = this.onSubmit.bind(this);
  this.onChange = this.onChange.bind(this);
}

onSubmit(e) {
  this.props.onSubmit(e);
}

onChange(e) {
  this.props.onChange(e);
}

render() {
  const listAmounts = this.props.display.map((person) => {
    return (
      <div key = {person[0]}>
      <p>{person[0]}</p>
      <input
      type = "number"
      name = {person[0]} 
      value = {person[1]}
      onChange = {this.onChange}
      id = {person[0]} 
      placeholder = "Input Amount"
      />
      </div>
    );
  })
  return (
    <div>
      {listAmounts}
    </div>
  );
}
}

class NameList extends React.Component {
constructor(props){
  super(props);
  this.onChange = this.onChange.bind(this);

}

onChange(e) {
    console.log(e);
  this.props.onChange(e);
}

render() {
  const list = this.props.people.map((person) => {
    return ( { label: person, value: person });
  });
  const display = this.props.display.map(person => {
      return(
          { label: person, value: person }
      );
  });
  return (
    <ReactMultiSelectCheckboxes value = {display} options = {list} onChange = {this.onChange} />
  );
}
}

export default withRouter(EditEntry);