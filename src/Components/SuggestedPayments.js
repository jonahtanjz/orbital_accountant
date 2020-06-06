import React from 'react';
import { getUser } from '../Utils/Common';
import { withRouter } from 'react-router-dom';


class SuggestedPayments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users : [],
            transactions : [],
            currency : [],
            trip : [],
        }
    }

    componentDidMount() {
        this.props.functionProps["updatePageName"]("Suggested Payments");
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

    render() {
        let total = {}
        this.state.users.map((user) => {
            total[user.name] = 0
            return user;
        });
        this.state.transactions.map((entry) =>{
            let conversion;
            let usedCurrency = this.state.currency.filter((curr) => curr.name === entry.currency);
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

export default withRouter(SuggestedPayments);