import React from 'react';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {withRouter} from 'react-router-dom';
import { Grid, withStyles, Typography, TextField, InputAdornment, MenuItem, Select, InputLabel, FormControlLabel, Checkbox } from '@material-ui/core';
import { ChatOutlined } from '@material-ui/icons'
import '../CSS/Login.css'

const styles = themes => ({
  textField: {
    width: 330,
  },
  dropDownSelect: {
    width: 330,
    borderRadius: 10,
  },
  currSelect: {
    width: 330,
    borderRadius: 10,
    backgroundColor: "white",
    height: 40,
    border: "none",
  },
});

//Main component to render when editing transactions in the trips
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
  //Loads up trip and transaction data to pre-fill forms.
  componentDidMount() {
    this.props.updatePageName("Edit Transaction");
    fetch("https://accountant.tubalt.com/api/trips/gettransaction?transactionid="+ this.props.location.state.transaction_id + "&trip_id=" + this.props.location.state.trip_id)
      .then(response => response.json())
      .then(response => {
        //Format currency
        let selectedCurrency = response.transactions[0].currency;
        let curr = response.currency.filter((currency) => currency.in_trip === 1 || currency.name === selectedCurrency).map((currency) => currency.name);
        curr.push("SGD")

        //Load the names that were involved in transaction
        let namesInTransactions = response.transactions.map((transaction) => transaction.name);

        //Load the options for people who paid
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

        //Load the options for those who consumed
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
  //Updates the description upon change
  updateDesc(e) {
    this.setState({
      desc : e.target.value,
    });
  }
  //Updates equal upon change
  changeEqual(e) {
    this.setState({
      equal : !this.state.equal,
    });
  }
  //Updates pay array with amount upon change
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
  //Updates consume array with amount upon change
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
  //Updates pay array with display upon change
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
  //Updates consume array with display upon change
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
  //Updates selectedCurrency upon change
  changeCurrency(e) {
     this.setState({
       selectedCurrency : e.target.value
     });
  }
  //Evaluates string amount and returns float
  evaluateAmount(strAmount) {
    try {
      return parseFloat(eval(strAmount));
    } catch (err) {
      throw err;
    }
  };
  //Validates expressions entered
  validateExpression(exp) {
    let regex = /[^0-9.+*/-/s]/;
    return regex.test(exp);
  }

  //Submits Post request to API
  onSubmit(e) {
    e.preventDefault();
    //Checking for empty pay
    if (this.state.pay.filter((person)=> person.display).length === 0) {
      alert("Please select the people who payed.")
      return null;
    }
    //Checking for no amounts entered in pay array
    if (this.state.pay.filter((person)=> person.display && (! person.amount)).length !== 0) {
      alert("Please enter the amounts for the people who payed.")
      return null;
    }
    //Checking for valid amounts in pay array 
    if (this.state.pay.filter((person) => person.display && this.validateExpression(person.amount)).length !== 0 ) {
      alert("Please enter a valid expression");
      return null;
    }
    //Checking for empty consume
    if (this.state.consume.filter((person)=> person.display).length === 0) {
      alert("Please select the people who consumed.")
      return null;
    }
    //Checking for no amounts entered in consume array when is not equal 
    if (this.state.consume.filter((person)=> person.display && (! person.amount)).length !== 0 && (! this.state.equal)) {
      alert("Please enter the amounts for people who consumed.")
      return null;
    }
    //Checking for valid amounts in consume array 
    if (this.state.consume.filter((person) => person.display && this.validateExpression(person.amount)).length !== 0 && (! this.state.equal)) {
      alert("Please enter a valid expression");
      return null;
    }
    //Checking for empty description
    if (!this.state.desc) {
      alert("Please enter a transaction description.");
      return null;
    }
    //Calculates (if equal) and formats consume array
    let newConsume = [];
    try {
      if (this.state.equal) {
        let pay = this.state.pay.slice().filter(person => person["display"]);
        let consume = this.state.consume.slice().filter(person => person["display"]);
        let total = 0;
        for(let i = 0; i < pay.length; i++) {
          total = total + this.evaluateAmount(pay[i]["amount"]);
        }
        const avg = (total/consume.length);
        for (let i = 0; i < consume.length; i++) {
          newConsume.push([consume[i]["name"],avg]);
        }
      } else {
        newConsume = this.state.consume.filter((person) => person["display"]).map((person) =>[person.name,this.evaluateAmount(person.amount)]);
      }
    } catch (err) {
      alert("Please enter a valid expression");
      return null;
    }
    //Formats pay array
    let newPay;
    try {
      newPay = this.state.pay.filter((person) => person["display"]).map((person) => [person.name,this.evaluateAmount(person.amount)])
    } catch (err) {
      alert("Please enter a valid expression");
      return null;
    }
    //Post request
    fetch("https://accountant.tubalt.com/api/trips/edittransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payees: newPay,
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
  //Deletes the transaction
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
  //Renders the components for EditEntry
  render() {
    const submitButton = (<input class="button" type = "submit" value = "Submit"/> ) ;
    const { classes } = this.props;
    return (
      <div>
        <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        >
        <form onSubmit = {this.onSubmit}>
          <Grid item>
            <TextField 
              required
              type="text"   
              className = {classes.textField}      
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ChatOutlined />
                  </InputAdornment>
                ),
                }}
              variant = "outlined"
              value = {this.state.desc}
              id="desc"
              onChange={this.updateDesc} 
              label="Description"
            />
          </Grid>
          <br/>
          <Grid item>
            <Typography align = "left">People who paid:</Typography>
          </Grid>
          <Grid item>
            <NameList 
            onChange = {this.onChangePay}
            display = {this.state.pay}
            classes = {classes}
            />
          </Grid>
          <br/>
          <Grid item>
            <AmountDisplay
            display = {this.state.pay}
            onChange = {this.updatePay}
            />
          </Grid>
          <Grid item>
            <Typography align= "left">People who consumed:</Typography>
          </Grid>
          <Grid item>
            <NameList 
            onChange = {this.onChangeConsume}
            display = {this.state.consume}
            classes = {classes}
            />
          </Grid>
          <br/>
          <Grid item>
            <AmountDisplay
            display = {this.state.consume}
            onChange = {this.updateConsume}
            />
          </Grid>
          <Grid item>
            <CurrencyList 
            currency = {this.state.currency}
            changeCurrency = {this.changeCurrency}
            selectedCurrency = {this.state.selectedCurrency}
            classes = {classes}
            />
          </Grid>
          <Grid item>
            <Equals 
            changeEqual = {this.changeEqual} 
            equal = {this.state.equal} 
            />
          </Grid>
          <Grid item>
            {submitButton}
          </Grid>
          <br/>
          <Grid item>
            <button class = "delbutton" type = "button" onClick ={this.deleteTransaction}>Delete</button>
          </Grid>
        </form>
        </Grid>
      </div>
    );
  }
}

// Implements the Equals checkbox to indicate weather total amount is to be split equally among people
class Equals extends React.Component {
  constructor(props) {
    super(props);
    this.changeEqual = this.changeEqual.bind(this);
  }
  //Calls props changeEqual function
  changeEqual(e) {
    this.props.changeEqual(e);
  }
  
  render() {
    return (
      <div>
        <FormControlLabel
          control={
            <Checkbox
                checked={this.props.equal}
                onChange={this.changeEqual}
                id = "equal"
                name="checkbox"
                color="primary"
              />
          }
          label="Split bill equally"
        />
      </div>
    );
  }
}

//Implements the list of currencies that can be selected from
class CurrencyList extends React.Component {
  constructor(props) {
    super(props);
    this.changeCurrency = this.changeCurrency.bind(this);
  }
  //Calls props changeCurrency function
  changeCurrency(e) {
    this.props.changeCurrency(e);
  }

  render () {
    const currencyDisplay = this.props.currency.map((curr) => 
      <MenuItem id = {curr} name = {curr} value = {curr}>{curr}</MenuItem>
    );
    return (
      <div>
        <InputLabel id="curr-label">Currency</InputLabel>
        <Select
          size = "sm"
          className = {this.props.classes.currSelect}
          variant = "outlined"
          id = "curr"
          labelId = "curr-label"
          onChange={this.changeCurrency}
          value = {this.props.selectedCurrency}
          >
          {currencyDisplay}
        </Select>
      </div>
    );
  }
}

//Implements the display of names selected and input box to add the amounts.
class AmountDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  //Calls the props onChange function
  onChange(e) {
    this.props.onChange(e);
  }

  render() {
    const listAmounts = this.props.display.filter((person) => person["display"]).map((person) => {
      return (
        <div key = {person["name"]}>
          <TextField
            variant = "outlined"
            size = "small"
            type = "text"
            name = {person["name"]} 
            onChange = {this.onChange}
            id = {person["name"]} 
            label ={person["name"]}
            value = {person["amount"]}
            helperText = "Input Amount"
          />
          <br/><br/>
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

//Implements the multiselect dropdown list to choose users involved in transaction.
class NameList extends React.Component {
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this)
  }
  //Calls the props onChange function
  onChange(e) {
    this.props.onChange(e);
  }

  render() {
    //Loads Options for dropdown list
    const options = this.props.display.map((person) => {
      return ( 
        { label: person["name"], value: person["name"] }
      );
    });
    //Loads the values selected
    const display = this.props.display.filter((person) => person["display"]).map(person => {
        return(
            { label: person["name"], value: person["name"] }
        );
    });
    
    return (
      <ReactMultiSelectCheckboxes className = {this.props.classes.dropDownSelect} value = {display} options = {options} onChange = {this.onChange} />
    );
  }
}

export default withStyles(styles)(withRouter(EditEntry));