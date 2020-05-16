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
    this.removePay = this.removePay.bind(this);
    this.removeConsume = this.removeConsume.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

  onChangePay(e) {
    const theName = e.target.value;
    var display = this.state.displayPay.slice();
    if (! display.includes(theName)) {
      display.push(theName);
      this.setState({
        displayPay : display,
      });
    }
  }
  onChangeConsume(e) {
    const theName = e.target.value;
    var display = this.state.displayConsume.slice();
    if (! display.includes(theName)) {
      display.push(theName);
      this.setState({
        displayConsume : display,
      });
    }
  }

  removePay(theName) {
    var display = this.state.displayPay.slice();
    const index = display.findIndex((x) => x === theName);
    display.splice(index,1);
    this.setState({
      displayPay : display,
    });
  }

  removeConsume(theName) {
    var display = this.state.displayConsume.slice();
    const index = display.findIndex((x) => x === theName);
    display.splice(index,1);
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
        remove = {this.removePay}
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
        remove = {this.removeConsume}
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
    this.remove = this.remove.bind(this);
  }

  onSubmit(e) {
    this.props.onSubmit(e);
  }

  remove(e) {
    this.props.remove(e);
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
        <input type = "button" onClick ={ () => {this.remove(person)}} value = "Delete"/>
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
      return (<option key = {person} value = {person}> {person} </option>);
    } );
    return (
      <div>
        <select multiple = {true}
          onChange = {this.onChange}>
          {list}
        </select>
      </div>
    );
  }
}

export default AddEntry;