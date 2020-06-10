import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles, Grid, Button, Typography } from '@material-ui/core';
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
        console.log(total);
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
                            <Typography align="center" variant = "h6">
                                {total[0]}
                            </Typography>
                        </Grid>
                        <Grid container item direction = "row" justify="center" alignItems="center">
                            <Grid item>
                                <Button varient = "contained" color= "primary">
                                    Pay
                                </Button>
                            </Grid>
                            <Grid item>
                                <img src= "https://i.ya-webdesign.com/images/avatar-arrow-png-7.png" width = "100px"/>
                            </Grid>
                            <Grid>
                                <Typography>Pays</Typography>
                                <Typography >{"$" + amt.toFixed(2)}</Typography>
                            </Grid>
                        </Grid>
                        {/* {total[0]+ " Pays $" + amt.toFixed(2) + " -> "} */}
                        </div>
                    );
                } else {
                    return(
                        <div>
                            <Grid item>
                                <Typography align="center" variant = "h6">
                                    {total[0]}
                                </Typography>
                            </Grid>
                        </div>
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
                <div>
                    {display}
                </div>
            </Grid>
        );
    }
}

SuggestedPayments.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(withRouter(SuggestedPayments));