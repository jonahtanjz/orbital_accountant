import React from 'react';
import { getUser } from '../Utils/Common';
import { withRouter } from 'react-router-dom';

class ViewLedger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trip : [],
            users : [],
            currency : [],
            transactions : [],
            selectedName : getUser().username,
        };
        this.changeSelectedName = this.changeSelectedName.bind(this);
    }

    componentDidMount() {
        fetch("https://accountant.tubalt.com/api/trips/getledger?tripid=" + this.props.location.state.trip_id)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            this.setState({
                trip : response.trip[0] ,
                users :response.users ,
                transactions : response.transactions,
                currency : response.currency,
            });
        })
    }

    changeSelectedName(e) {
        this.setState({
            selectedName : e.target.value,
        });
    }


    render() {
        let chooseName = this.state.users.map((person)=>{
                if (person.name === getUser().username) {
                    
                    return(<option key ={person.name} value = {person.name} selected>{person.name}</option>);
                } else {
                    return(<option key ={person.name} value = {person.name}>{person.name}</option>);
                }
                
        })
        let filteredTransactions = this.state.transactions.filter((entry) =>
            entry.payee === this.state.selectedName || entry.payer=== this.state.selectedName
        );

        return(
            <div>
                <select id = "nameSelect" onChange = {this.changeSelectedName}>
                    {chooseName}
                </select>
                <UndoEndTrip trip = {this.state.trip} history = {this.props.history}/>
                <SuggestPay users= {this.state.users} transactions = {this.state.transactions} currency = {this.state.currency}/>
                <Ledger currency = {this.state.currency} users={this.state.users} transactions={filteredTransactions} self={this.state.selectedName} history = {this.props.history} trip = {this.state.trip} />
            </div>
        );
    }
}

class Ledger extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let displayLedger = this.props.users.map((person)=>{
            let personName = person.name;
            if (personName === this.props.self) {return null;}
            let entries = this.props.transactions
                .filter((entry) =>
                    entry.payee === personName || entry.payer=== personName);
            if (entries.length !== 0) { 
                return (
                <div>
                    <h1>Ledger of {personName}</h1>
                    <Table currency = {this.props.currency} transactions = {entries} self ={this.props.self} history = {this.props.history} trip = {this.props.trip} />
                </div>
                );
            } else {
                return (null);
            }
                
        });
        return(
            <div>
                {displayLedger}
            </div>
        );
    }

}

class Table extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let total = 0;
        const table = this.props.transactions.map((entry) => {
            let conversion;
            let usedCurrency = this.props.currency.filter((curr) => curr.name === entry.currency);
            if (usedCurrency.length === 0) {
                conversion = 1;
            } else {
                conversion = usedCurrency[0].value;
            }
            let value = (entry.amount/conversion)
            if (entry.payer == this.props.self) {
                value = (0 - (entry.amount/conversion))
            }
            total = total + value;
            return(
                <tr>
                    <td>{entry.description}</td>
                    <td>{value.toFixed(2)}</td>
                    <td>{entry.payee}</td>
                    <td>{entry.payer}</td>
                    <td>{entry.currency}</td>
                    <td>{conversion}</td>
                    <td><button onClick = {() => this.props.history.push("/editentry",{transaction_id : entry.transaction_id, trip_id : this.props.trip.trip_id})}>Edit</button></td>
                </tr>
            );
        });
        let desc;
        if (total > 0) {
            desc = " To Pay"
        } else {
            desc = " To Be Paid"
        }
        return(
            <table>
                <tbody>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Payee</th>
                        <th>Payer</th>
                    </tr>
                    {table}
                    <tr>
                        <td>{"Total" + desc}</td>
                        <td>{total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

class SuggestPay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total : {}
        }
    }

    render() {
        let total = {}
        this.props.users.map((user) => {
            total[user.name] = 0
            return user;
        });
        this.props.transactions.map((entry) =>{
            let conversion;
            let usedCurrency = this.props.currency.filter((curr) => curr.name === entry.currency);
            if (usedCurrency.length === 0) {
                conversion = 1;
            } else {
                conversion = usedCurrency[0].value;
            }
            let value = parseFloat((entry.amount/conversion).toFixed(2));
            total[entry.payee] = total[entry.payee] - value;
            total[entry.payer] += value;
            return entry;
        });
        const arr = Object.keys(total).map((key) => [key, total[key]]);
        let arr2 =arr.sort((c,d) => {
            let a = c[1];
            let b = d[1];
            if (a > 0 && b > 0) {
                return a  - b;
            } else if (a < 0 && b < 0) {
                return -b + a;
            } else {
                return -a + b;
            }
        })
        let amt = 0;
        let display = arr2.filter((total) => total[1].toFixed(2) !=0 ).map((total) =>{
            amt += total[1]
            
                if (amt.toFixed(2) != 0) {
                    return(
                    <span>{total[0]+ " Pays $" + amt.toFixed(2) + " -> "}</span>
                    );
                } else {
                    return(
                    <span>{total[0]}</span>
                    );
                }

        });
        return(
            <div>
                {display}
            </div>
        );
    }
}

class UndoEndTrip extends React.Component {
    constructor(props) {
      super(props);
      this.undoEndTrip = this.undoEndTrip.bind(this);
    }
    
    undoEndTrip(e) {
      fetch("https://accountant.tubalt.com/api/trips/undoendtrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          trip_id : this.props.trip.trip_id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => alert(res.message));
        } else {
          response.json().then(res => {
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
        if (this.props.trip.ended == 1) {
            return(
            <div>
                <button type = "button" onClick={this.undoEndTrip}>Restart Trip</button>
            </div>
            );
        } else {
            return null;
        }
    }
  }
export default withRouter(ViewLedger);
