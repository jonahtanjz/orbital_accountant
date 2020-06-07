import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles, Grid, Card, CardActionArea, CardMedia } from '@material-ui/core';
import  PropTypes  from 'prop-types';


const styles = themes => ({
    card : {
      maxWidth: 600,
      minWidth: 40,
      backgroundColor : '#edf3f8',
      borderRadius: "10px",
      marginTop: '30px'
    },
    media: {
        width : '100%',
        height: 100,
      },
  });

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
        const { classes } = this.props;
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
                        <div>
                        <Grid item>
                            {total[0]}
                        </Grid>
                        <Grid container item spacing = {0} direction = "row" justify="center" alignItems="center">
                            <Grid item>
                                <Card className = {classes.card}>
                                    <CardActionArea>
                                        <CardMedia
                                        className={classes.media}
                                        // image={require('../images/tubalt_logo.png')}
                                        image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///8AAAClpaXR0dH5+fm9vb3z8/Pu7u6xsbGpqamEhITb29tiYmJRUVHFxcV2dnaOjo5dXV2ZmZnl5eVoaGiUlJRKSko2NjYeHh7V1dWvr6+goKAsLCyAgIAjIyMODg46Ojpubm5CQkIWFhYetmp8AAAD/UlEQVR4nO2a6VrqQBBECQSCiCziiru+/zteQRDIdE0GvoROeev87ox9spZDdzpCiP+LYjibzoYD7zYao5hnP4wL71aaoZ/tmHg30wSTbJ+edzv1M8gOyb0bqp1pyXDk3VDd5FkZ747qZhIY/rUnsRsYLr1bqpnQsOvdUs3IkB8Z8iNDfmTIjwz5kSE/MuRHhvzIkB8Z8iNDfmTIjwz5kSE/MuRHhvzIkB8Z8iNDfmTIjwz5kSE/MuRHhvzIkB8Z8iNDfmTIjwz5kSE/MuRHhvzIkB8Z8iNDfmTIjwz5kSE/MuRHhvzIkB8Z8iNDfmTIjwz5kSE/MuRHhvzIkB8Z8iNDfmTIjwz5kSE/MuRHhvzIkB8Z8iNDfmTIjwz5kSE/MuRHhvzIkB8Z8iNDfmTIjwz5kSE/MuSH2LDoX8+6k8qyEwzzSfd75UEtXZ7OYr7pd1ZReLRhPtrU3RS1dXsCw13Db5fRymMNL/cqq++QxugftNyLlR5p2DsodVMsSj33I7XHGfZLtV436rzc9AWuPcrwolz7UX/zKZQv4TfXsPgYw+twYZ836jBsJBuh4iMMR8a6sQegOW6NTrIpKE43nFrL4pujSaxznWVzuzjZMHi411R9bpvBeFxW3JnFqYZ39qJPTYpAyq/0Lfe5UZxmmN+DNX2+iDnoJnswPl9JhsUDWtI6aWfgBfWTLYLaFMMFXO/lHDoG8CJmWRBSEwwvjXV8L2Gn84h7KofUasOesQo6X+cjctpL3+hKQ/Te8hWMPTrZ8qCwynCJFwof6rOCX3+H37AKwye4ivViPi/5M2xuP6TGDe14tOLZ7SWzxydsby+kRg3NKLrGDkhnx46SK8a/NTHDMTwehNzzcwNbvNqWRAyv4NE3PjoWON1sQyo0hFHUL8mYmP8rrnn9+fccGQ5e4ZG3nkIhwdbKL2/r7xkwXLzB4yKbPj5YexobVpnENoxkoqG3UMgEd9sDhpEo6rgLjInk8IlpGDknj94yNpGQ2g9v4mEkaztHUUzxBXsOgw+OQl/uURQzwCE1nWfvH9Ti4CuTyqe3QhU4g6VxVf0nvMEhNYUWRVEMDqnVtCqKYmYnC/ps3p8A3pOI47N3fxKRkBqhhVEUEwlkkFZGUUwkVAOigw5tJBJSTVobRTHGz/wRWhxFMZENijKv7Y6ikPw9UfC9Ddu+p5EWUgmiKAZv9u4YVy/TZvCG/RY0n0JDVUiliaIYMJSywWcUqGZiIZUqimLwpprPuFoDoJBKF0Ux9u696wRC3Vg5nDBrxwhCKmsUxZR+CTXH+9jZH6xsyQRC3ewmGlozgVA3HxtB+iiK+ZkMguPuf4HVREPLJhDqZlma6PuD/LHvvBAihX9PnSbD2C0urgAAAABJRU5ErkJggg=="
                                        title="Logo"
                                        />
                                    </CardActionArea>
                                </Card>
                            </Grid>
                            <Grid>
                                <p>Pays</p>
                                <p>{"$" + amt.toFixed(2)}</p>
                            </Grid>
                        </Grid>
                        {/* {total[0]+ " Pays $" + amt.toFixed(2) + " -> "} */}
                        </div>
                    );
                } else {
                    return(
                        <Grid container item direction = "row" justify="center" alignItems="center">
                            <Grid item>
                                {total[0]}
                            </Grid>
                            <Grid item>
                                <Card className = {classes.card}>

                                </Card>
                            </Grid>
                        </Grid>
                    );
                }

        });
        return(
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                {display}
            </Grid>
        );
    }
}

SuggestedPayments.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(withRouter(SuggestedPayments));