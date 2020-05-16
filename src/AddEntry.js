class AddEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      people : ["John","Tube","P","Cheow"],
      displayPay : [],
      displayConsume : [],
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
    alert(e.target.Ppay.value);
  }

  render() {
    const submitButton =  (<input type = "submit" value = "Submit"/> );
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
        
        {submitButton}
      </form>
      </div>
      </div>
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