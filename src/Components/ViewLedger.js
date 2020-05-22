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
        fetch("https://accountant.tubalt.com/api/getledger?tripid=" + this.props.location.state.trip_id)
        .then(response => response.json())
        .then(response => {
            console.log(response.users);
            this.setState({
                trip : response.trip ,
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
                <Ledger currency = {this.state.currency} users={this.state.users} transactions={filteredTransactions} self={this.state.selectedName} />
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
                    <Table currency = {this.props.currency} transactions = {entries} />
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
        const table = this.props.transactions.map((entry) => {
            let conversion;
            let usedCurrency = this.props.currency.filter((curr) => curr.name === entry.currency);
            if (usedCurrency.length === 0) {
                conversion = 1;
            } else {
                conversion = usedCurrency[0].value;
            }
            return(
                <tr>
                    <td>{entry.description}</td>
                    <td>{(entry.amount/conversion).toFixed(2)}</td>
                    <td>{entry.payee}</td>
                    <td>{entry.payer}</td>
                    <td>{entry.currency}</td>
                    <td>{conversion}</td>
                </tr>
            );
        });
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
                </tbody>
            </table>
        );
    }
}

export default withRouter(ViewLedger);
