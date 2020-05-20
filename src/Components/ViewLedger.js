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
    }

    componentDidMount() {
        fetch("https://accountant.tubalt.com/api/getledger?tripid=" + this.props.location.state.trip_id)
        .then(response => response.json())
        .then(response => {
            this.setState({
                trip : response.trip ,
                users :response.users ,
                transactions : response.transactions,
                currency : response.currency,
            });
        })
    }


    render() {
        let selectedName = this.state.selectedName;
        let filteredTransactions = this.state.transactions.filter((entry) => entry.payee === selectedName || entry.payer=== selectedName);

        return(
            <div>
                <Ledger users={this.state.users} transactions={filteredTransactions} self={selectedName} />
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
            return (
            <div>
                <h1>Ledger of {personName}</h1>
                <Table transactions = {entries} />
            </div>
            );
                
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
            return(
                <tr>
                    <td>{entry.description}</td>
                    <td>{entry.amount}</td>
                    <td>{entry.payee}</td>
                    <td>{entry.payer}</td>
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
