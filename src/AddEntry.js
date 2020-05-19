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
  }

  componentDidMount() {
    fetch("https://accountant.tubalt.com/api/gettripinfo?tripid="+this.props.location.state.trip_id)
      .then(response => response.json())
      .then(response => {
        let curr = response.currency.map((currency) => currency.name);
        curr.push("SGD")
        this.setState({
          trip : response.trip[0],
          people : response.users.map((person)=> person.name),
          currency : curr,
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
        pay[i][1] = value;
        this.setState({
          pay : pay
        });
        return;
      }
    }
    pay.push([person,value]);
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
        consume[i][1] = value;
        consume.push([person,value]);
        this.setState({
          consume : consume
        });
        return;
      }
    }
    consume.push([person,value]);
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

  onSubmit(e) {
    e.preventDefault();
    alert(e.target.equal.checked);
  }

  render() {
    console.log(this.state.currency);
    const submitButton = (<input type = "submit" value = "Submit"/> ) ;
    return (
      <div>
      <div>
      <form onSubmit = {this.onSubmit}>
      <p>People who paid:</p>
        <NameList 
        people = {this.state.people}
        onChange = {this.onChangePay}
        />
        <AmountDisplay
        onSubmit = {this.onSubmit}
        display = {this.state.displayPay}
        onChange = {this.updatePay}
        />
        <p>People who consumed:</p>
        <NameList 
        people = {this.state.people}
        onChange = {this.onChangeConsume}
        type = "consume"
        />
        <AmountDisplay
        onSubmit = {this.onSubmit}
        display = {this.state.displayConsume}
        onChange = {this.updateConsume}
        />
        <br/>
        <CurrencyList 
        currency = {this.state.currency}
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
render () {
  const currencyDisplay = this.props.currency.map((curr) => 
  <option id = {curr} name = {curr} value = {curr}>{curr}</option>
  );
  return (
    <select id = "curr" className = "css-1r4vtzz">
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
      <div key = {person}>
      <p>{person}</p>
      <input
      type = "number"
      name = {person} 
      onChange = {this.onChange}
      id = {person} 
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
  this.props.onChange(e);
}

render() {
  const list = this.props.people.map((person) => {
    return ( { label: person, value: person });
  } );
  return (
    <ReactMultiSelectCheckboxes options = {list} onChange = {this.onChange} />
  );
}
}

export default withRouter(AddEntry);