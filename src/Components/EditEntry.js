import React from 'react';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {withRouter} from 'react-router-dom'

class EditEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      people : [],
      pay : [],
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
        console.log(this.props.location.state.transaction_id);

        let selectedCurrency = response.transactions[0].currency;
        let curr = response.currency.filter((currency) => currency.in_trip === 1 || currency.name === selectedCurrency).map((currency) => currency.name);
        curr.push("SGD")

        let namesInTransactions = response.transactions.map((transaction) => transaction.name);

        let pay = response.users.filter(person => person.in_trip === 1 || namesInTransactions.includes(person.name)).map((person)=>{ 
          return {name : person.name, amount : null, display : false};
        });
        response.transactions.filter(transaction => transaction.type === "payee")
            .map(transaction => {
              pay.forEach((person)=>{
                if (person.name === transaction.name) {
                  person["amount"] = transaction.amount;
                  person["display"] = true;
                }
              });
            });


        let consume = response.users.filter(person => person.in_trip === 1 || namesInTransactions.includes(person.name)).map((person)=>{ 
              return {name : person.name, amount : null, display : false};
            });
        response.transactions.filter(transaction => transaction.type === "payer")
            .map(transaction => {
              consume.forEach((person)=>{
                if (person.name === transaction.name) {
                  person["amount"] = transaction.amount;
                  person["display"] = true;
                }
              });
            });

        this.setState({
          trip : response.trip[0],
          people : response.users.filter(person => person.in_trip === 1).map((person)=> person.name),
          currency : curr,
          selectedCurrency : selectedCurrency,
          pay: pay,
          consume: consume,
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


  updatePay(e) {
    let person = e.target.name;
    let value = e.target.value;
    let pay = this.state.pay.slice();
    for (let i = 0; i < pay.length; i++) {
      if (pay[i]["name"] == person) {
        pay[i]["amount"] = value;
        this.setState({
          pay : pay
        });
        return;
      }
    }
  }

  updateConsume(e) {
    let person = e.target.name;
    let value = e.target.value;
    let consume = this.state.consume.slice();
    for (let i = 0; i < consume.length; i++) {
      if (consume[i]["name"] == person) {
        consume[i]["amount"] = value;
        this.setState({
          consume : consume
        });
        return;
      }
    }
  }

  onChangePay(e) {
    let pay = this.state.pay.slice();
    pay.forEach((person)=>{
        person["display"] = false;
    });
    for (let i = 0; i < e.length; i++) {
      pay.forEach((person)=>{
        if (person["name"] === e[i].value) {
          person["display"] = true;
        }
      });
    }
    this.setState({
      pay : pay,
    });
  }

  onChangeConsume(e) {
    let consume = this.state.consume.slice();
    consume.forEach((person)=>{
      person["display"] = false;
    });
    for (let i = 0; i < e.length; i++) {
      consume.forEach((person)=>{
        if (person["name"] === e[i].value) {
          person["display"] = true;
        }
      });
    }
    this.setState({
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
    let newConsume = [];
    if (this.state.equal) {
      let pay = this.state.pay.slice().filter(person => person["display"]);
      let consume = this.state.consume.slice().filter(person => person["display"]);
      let total = 0;
      for(let i = 0; i < pay.length; i++) {
        total = total + pay[i]["amount"];
      }
      const ave = (total/consume.length);
      for (let i = 0; i < consume.length; i++) {
        consume.push([consume[i]["name"],ave]);
      }
    } else {
      newConsume = this.state.consume
          .filter((person) => person["display"])
          .map(person => [person.name,parseFloat(eval(person.amount))])
    }
    fetch("https://accountant.tubalt.com/api/trips/edittransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payees: this.state.pay.filter((person) => person["display"]).map(person => [person.name,parseFloat(eval(person.amount))]),
        payers: newConsume,
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
    console.log(this.state.pay);
    const submitButton = (<input type = "submit" value = "Submit"/> ) ;
    return (
      <div>
      <div>
      <form onSubmit = {this.onSubmit}>
      <p>People who paid:</p>
        <NameList 
        onChange = {this.onChangePay}
        display = {this.state.pay}
        />
        <AmountDisplay
        onSubmit = {this.onSubmit}
        display = {this.state.pay}
        onChange = {this.updatePay}
        />
        <p>People who consumed:</p>
        <NameList 
        onChange = {this.onChangeConsume}
        display = {this.state.consume}
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
  const listAmounts = this.props.display.filter((person) => person["display"]).map((person) => {
    return (
      <div key = {person["name"]}>
      <p>{person["name"]}</p>
      <input
      type = "number"
      name = {person["name"]} 
      value = {person["amount"]}
      onChange = {this.onChange}
      id = {person["name"]} 
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
  const list = this.props.display.map((person) => {
    return ( 
      { label: person["name"], value: person["name"] }
    );
  });
  const display = this.props.display.filter((person) => person["display"]).map(person => {
      return(
          { label: person["name"], value: person["name"] }
      );
  });
  return (
    <ReactMultiSelectCheckboxes value = {display} options = {list} onChange = {this.onChange} />
  );
}
}

export default withRouter(EditEntry);