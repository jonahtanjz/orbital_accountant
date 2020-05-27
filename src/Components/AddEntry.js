import React from 'react';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {withRouter} from 'react-router-dom'

class AddEntry extends React.Component {
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
      trip : {}
    }
    this.onChangePay = this.onChangePay.bind(this);
    this.onChangeConsume = this.onChangeConsume.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updatePay = this.updatePay.bind(this);
    this.updateConsume = this.updateConsume.bind(this);
    this.changeEqual = this.changeEqual.bind(this);
    this.updateDesc = this.updateDesc.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);

  }

  componentDidMount() {
    fetch("https://accountant.tubalt.com/api/trips/gettripinfo?tripid="+this.props.location.state.trip_id)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        let curr = response.currency.filter((currency) => currency.in_trip === 1).map((currency) => currency.name);
        curr.push("SGD")

        let pay = response.users.filter(person => person.in_trip === 1).map((person)=>{ 
          return {name : person.name, amount : null, display : false};
        });

        let consume = response.users.filter(person => person.in_trip === 1).map((person)=>{ 
          return {name : person.name, amount : null, display : false};
        });

        this.setState({
          trip : response.trip[0],
          people : response.users.filter((person) => person.in_trip === 1).map((person)=> person.name),
          currency : curr,
          selectedCurrency : curr[0],
          pay : pay,
          consume : consume,
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
      consume = this.state.consume.filter((person) => person["display"]).map((person) => [person.name,parseFloat(eval(person.amount))]);
    }
    fetch("https://accountant.tubalt.com/api/trips/addtransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payees: this.state.pay.filter((person) => person["display"]).map((person) => [person.name,parseFloat(eval(person.amount))]),
        payers: consume,
        trip_id: this.state.trip.trip_id,
        description : this.state.desc,
        currency : this.state.selectedCurrency,
        equal : (this.state.equal) ? 1 : 0,
      })
    })
    .then(response => {
      if (response.status === 401) {
        response.json().then(res => alert(res.message));
      } else {
        response.json().then(res => {
          alert("Success");
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
    const submitButton = (<input type = "submit" value = "Submit"/> ) ;
    return (
      <div>
      <div>
      <h1>{this.state.trip.trip_name}</h1>
      <form onSubmit = {this.onSubmit}>
      <p>People who paid:</p>
        <NameList 
        display = {this.state.pay}
        onChange = {this.onChangePay}
        />
        <AmountDisplay
        onSubmit = {this.onSubmit}
        display = {this.state.pay}
        onChange = {this.updatePay}
        />
        <p>People who consumed:</p>
        <NameList 
        display = {this.state.consume}
        onChange = {this.onChangeConsume}
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
  const listAmounts = this.props.display.filter((person)=> person["display"]).map((person) => {
    return (
      <div key = {person["name"]}>
      <p>{person["name"]}</p>
      <input
      type = "text"
      name = {person["name"]} 
      onChange = {this.onChange}
      id = {person["name"]} 
      placeholder = "Input Amount"
      value = {person["amount"]}
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
  this.props.onChange(e);
}

render() {
  const list = this.props.display.map((person) => {
    return ( { label: person["name"], value: person["name"] });
  } );

  const value = this.props.display.filter((person) => person["display"]).map((person) => {
    return ( { label: person["name"], value: person["name"] });
  })
  return (
    <ReactMultiSelectCheckboxes value = {value} options = {list} onChange = {this.onChange} />
  );
}
}

export default withRouter(AddEntry);