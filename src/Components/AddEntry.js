import React from 'react';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {withRouter} from 'react-router-dom'
import  PropTypes  from 'prop-types';
import { withStyles, Grid, InputLabel, Typography, TextField, InputAdornment, NativeSelect, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
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


// Main component to render for adding transactions to the trips.
class AddEntry extends React.Component {
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
      trip : {}
    }
    //Bindings
    this.onChangePay = this.onChangePay.bind(this);
    this.onChangeConsume = this.onChangeConsume.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updatePay = this.updatePay.bind(this);
    this.updateConsume = this.updateConsume.bind(this);
    this.changeEqual = this.changeEqual.bind(this);
    this.updateDesc = this.updateDesc.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
    this.evaluateAmount = this.evaluateAmount.bind(this);
    this.validateExpression = this.validateExpression.bind(this);
  }
  //To fetch data when component mounts
  componentDidMount() {
    this.props.functionProps["updatePageName"]("Add Transactions");
    fetch("https://accountant.tubalt.com/api/trips/gettripinfo?tripid="+this.props.location.state.trip_id)
      .then(response => response.json())
      .then(response => {
        //Formatting currency
        let curr = response.currency.filter((currency) => currency.in_trip === 1).map((currency) => currency.name);
        curr.push("SGD")
        //Formatting pay array
        let pay = response.users.filter(person => person.in_trip === 1).map((person)=>{ 
          return {name : person.name, amount : null, display : false};
        });
        //Formating consume array
        let consume = response.users.filter(person => person.in_trip === 1).map((person)=>{ 
          return {name : person.name, amount : null, display : false};
        });
        //Setting state to update values
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
  //Updates description upon change
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
  //Updates amount in pay array
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
  //Updates amount in consume array
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
  //Updates display in pay array
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
    console.log(pay);
    this.setState({
      pay : pay,
    });
  }
  //Updates display in consume array
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
  //Changes selectedCurrency value
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

  //Submits a post request to API
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
    if (this.state.consume.filter((person) => person.display && this.validateExpression(person.amount) ).length !== 0  && (! this.state.equal)) {
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
    fetch("https://accountant.tubalt.com/api/trips/addtransaction", {
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
      })
    })
    .then(response => {
      if (response.status === 401) {
        response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
      } else {
        response.json().then(res => {
          this.props.functionProps["toggleSuccessCallback"]("Success");
          this.props.history.push("/home");
        });
      }
    })
    .catch(error => {
      console.log(error);
      this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
    });
  }
  //Renders the Componenets needed for AddEntry form
  render() {
    const submitButton = (<input class = "button" type = "submit" value = "Submit"/> ) ;
    const { classes } = this.props;
    return (
      <div>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant= "h5" align = "center">{this.state.trip.trip_name}</Typography>
          </Grid>
          <Grid 
          container
          item 
          direction="column"
          justify="center"
          alignItems="center">
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
                <Typography align= "left">People who paid:</Typography>
              </Grid>
              <Grid item>
                <NameList 
                classes = {classes}
                display = {this.state.pay}
                onChange = {this.onChangePay}
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
                classes = {classes}
                display = {this.state.consume}
                onChange = {this.onChangeConsume}
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
            </form>
          </Grid>
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
        {/* <input type = "checkbox" checked = {this.props.equal} onChange={this.changeEqual} id="equal" />  */}
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
        <NativeSelect
        size = "sm"
        className = {this.props.classes.currSelect}
        variant = "outlined"
        id = "curr"
        labelId = "curr-label"
        onChange={this.changeCurrency}
        value = {this.props.selectedCurrency}
        >
          {currencyDisplay}
        </NativeSelect>
     </div>
    );
  }
}

//Implements the multiselect dropdown list to choose users involved in transaction.
class NameList extends React.Component {
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
  
  }
  // calls props onChange function
  onChange(e) {
    this.props.onChange(e);
  }
  
  render() {
    //All users as options
    const options = this.props.display.map((person) => {
      return ( { label: person["name"], value: person["name"] });
    } );
    //Only selected users as value
    const value = this.props.display.filter((person) => person["display"]).map((person) => {
      return ( { label: person["name"], value: person["name"] });
    })

    return (
      <ReactMultiSelectCheckboxes 
      className = {this.props.classes.dropDownSelect} value = {value} options = {options} onChange = {this.onChange} />
    );
  }
}

//Implements the display of names selected and input box to add the amounts.
class AmountDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  //Calls props onChange function
  onChange(e) {
    this.props.onChange(e);
  }

  render() {
    //Mapping to display name and input box
    const listAmounts = this.props.display.filter((person)=> person["display"]).map((person) => {
      return (
        <div key = {person["name"]}>
          {/* <Typography>{person["name"]}</Typography> */}
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



export default withStyles(styles)(withRouter(AddEntry));