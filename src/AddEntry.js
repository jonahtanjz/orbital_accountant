class AddEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      people : ["John","Tube","P","Cheow"],
      displayPay : [],
      displayConsume : [],
      currency : ["SGD","MYR","THB"],
    }
    this.onChangePay = this.onChangePay.bind(this);
    this.onChangeConsume = this.onChangeConsume.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

  onChangePay(e) {
    let display = [];
    for (let i = 0; i < e.length; i++) {
      display.push(e[i].value);
    }
    this.setState({
      displayPay : display,
    });
  }
  onChangeConsume(e) {
    let display = [];
    for (let i = 0; i < e.length; i++) {
      display.push(e[i].value);
    }
    this.setState({
      displayConsume : display,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    alert(e.target.equal.checked);
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
        />
        <AmountDisplay
        onSubmit = {this.onSubmit}
        display = {this.state.displayPay}
        type = "pay"
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
        />
        <br/>
        <CurrencyList currency = {this.state.currency} />
        <br/>
        <br/>
        <input type = "checkbox" id="equal" /> 
        <lable>Equal</lable>
        <br/>
        <input type="text" id="desc" placeholder="Description of Transaction"/>
        <br/> 
        {submitButton}
      </form>
      </div>
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
}

onSubmit(e) {
  this.props.onSubmit(e);
}

render() {
  const listAmounts = this.props.display.map((person) => {
    return (
      <div key = {person}>
      <p>{person}</p>
      <input
      type = "number"
      name = {person + this.props.type} 
      id = {person + this.props.type} 
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

export default AddEntry;