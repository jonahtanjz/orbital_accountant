import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles, Grid, Button, Typography, CircularProgress, Paper, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
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
    loadingCircleContainer: {
        width: "100%",
        textAlign: "center"
    }, 
    loadingCircle: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "250px",
    },
    settledText: {
        marginTop: "100px",
        color: "#717171",
    },
    paperContainer: {
        borderRadius: "10px",
    }
  });

class SuggestedPayments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users : [],
            transactions : [],
            currency : [],
            trip : [],
            loaded: false,
            paymentDialog: {},
        }
        this.submitPayment = this.submitPayment.bind(this);
        this.togglePaymentDialog = this.togglePaymentDialog.bind(this);
    }

    componentDidMount() {
        this.props.functionProps["updatePageName"]("Suggested Payments");
        this.props.functionProps["closeAlertBox"]();
        if (!this.props.location.state) {
            this.props.functionProps["toggleFailCallback"]("Invalid link. Please try again.");
            setTimeout(()=>this.props.history.push("/"),3000);
            return;
        }
        fetch("https://accountant.tubalt.com/api/trips/getledger?tripid=" + this.props.location.state.trip_id)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            this.setState({
                trip : response.trip[0] ,
                users :response.users ,
                transactions : response.transactions,
                currency : response.currency,
                loaded: true,
            });
        })
        .catch(err => {
            this.props.functionProps["toggleFailCallback"]("Invalid link. Please try again.");
            setTimeout(()=>this.props.history.push("/"),3000);
        })
    }

    submitPayment(amt,payer,payee, key) {
        this.togglePaymentDialog(key);
        //Post request
        fetch("https://accountant.tubalt.com/api/trips/makepayment", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            payees: [[payer,amt]],
            payers: [[payee,amt]],
            trip_id: this.state.trip.trip_id,
            description : "Settlement",
            currency : "SGD",
            equal : 0,
            })
        })
        .then(response => {
            if (response.status === 401) {
            response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
            } else {
            response.json().then(response => {
                this.setState({
                    trip : response.trip[0] ,
                    users :response.users ,
                    transactions : response.transactions,
                    currency : response.currency,
                });
                this.props.functionProps["toggleSuccessCallback"]("Success");
            });
            }
        })
        .catch(error => {
            console.log(error);
            this.props.functionProps["toggleFailCallback"]("Oops! Something went wrong");
        });
    }

    togglePaymentDialog(key) {
        if (this.state.paymentDialog[key] === undefined) {
            let newPaymentDialog = this.state.paymentDialog;
            newPaymentDialog[key] = true;
            this.setState({ paymentDialog: newPaymentDialog });
        } else {
            let newPaymentDialog = this.state.paymentDialog;
            newPaymentDialog[key] = !this.state.paymentDialog[key];
            this.setState({ paymentDialog: newPaymentDialog });
        }
    }

    render() {
        const { classes } = this.props;
        if (!this.state.loaded) { 
            return (
              <div className={classes.loadingCircleContainer}>
                <CircularProgress className={classes.loadingCircle} />
              </div>
            );
        }
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


        
        let arr = [];
        let knnccb = [];
        // let arr = Object.keys(total);
        this.state.users.forEach((user) => {
            let amt = (total[user.name].toFixed(2));
            let com = [user.name, parseFloat(amt)];
            arr.push(com);
            knnccb.push([user.name,parseFloat(amt)]);
            });
        let payeeArr = arr.filter((item)=> item[1] < 0);
        let payerArr = arr.filter((item)=> item[1] > 0);
        let consolidatedTransactions = [];

        let copyPayer = payerArr.map(item => [item[0],Math.round(item[1]*100)]);
        let copyPayee = payeeArr.map(item => [item[0],Math.round(-item[1]*100)]);
        let counterKey = 0;

        for (let i = 0; i < payerArr.length; i++) {
            for (let j = 0; j < payeeArr.length; j++) {
                if (copyPayer[i][1] === 0) {
                    break;
                }
                if (copyPayee[j][1] === 0) {
                    continue;
                }
                let obj = {};
                obj.key = counterKey;
                obj.payee = copyPayee[j][0];
                obj.payer = copyPayer[i][0];
                if (copyPayer[i][1] > copyPayee[j][1]) {
                    obj.amt = copyPayee[j][1];
                } else {
                    obj.amt = copyPayer[i][1];
                }
                console.log(obj.amt + obj.amt);
                copyPayee[j][1] = copyPayee[j][1] - obj.amt;
                copyPayer[i][1] = copyPayer[i][1] - obj.amt;
                consolidatedTransactions.push(obj);
                counterKey++;
            }
        }

        let display = consolidatedTransactions.map(trans => {
            let finalAmt = (trans.amt/100).toFixed(2)
            return(
                <React.Fragment>
                    <Paper className={classes.paperContainer}>
                        <div className="singleTransaction">
                            <div className="payment-info-container">
                                <div className="payer-container">
                                    <div className="payer-name">
                                        <Typography>{trans.payer}</Typography>
                                    </div>
                                </div>
                            </div>
                            <div className="innerArrow payment-info-container">
                                <div className="amount-to-pay">
                                    ${finalAmt}
                                </div>
                                <div>
                                    <img src= {require('../images/arrow_right.png')} width = "100px"/>
                                </div>
                            </div>
                            <div className="payment-info-container">
                                <div className="payee-container">
                                    <div className="payee-name">
                                        <Typography>{trans.payee}</Typography>
                                    </div>
                                </div>
                            </div>
                            <div className="payment-info-button-container">
                                <div className="pay-button-container">
                                    <div className="pay-button">
                                        <Button color="primary" onClick = {() => this.togglePaymentDialog(trans.key)}>Pay</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Paper>
                    <Dialog
                    open={this.state.paymentDialog[trans.key]}
                    onClose={() => this.togglePaymentDialog(trans.key)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Pay {trans.payee}?</DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Make a payment to this user? Once completed, this transaction will be 
                            recorded as "Settlement". 
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={() => this.togglePaymentDialog(trans.key)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.submitPayment(finalAmt,trans.payer,trans.payee, trans.key)} color="primary" autoFocus>
                            Pay
                        </Button>
                        </DialogActions>
                </Dialog>
              </React.Fragment>
            );
        })

        // const arr3 = Object.keys(total).map((key) => [key, total[key]]);
        // let arr2 =arr3.sort((c,d) => {
        //     let a = c[1];
        //     let b = d[1];
        //     if (a > 0 && b > 0) {
        //         return a  - b;
        //     } else if (a < 0 && b < 0) {
        //         return -b + a;
        //     } else {
        //         return -a + b;
        //     }
        // })
        // let amt = 0;
        // let display = arr2.filter((total) => total[1].toFixed(2) !=0 ).map((total) =>{
        //     amt += total[1]
            
        //         if (amt.toFixed(2) != 0) {
        //             return(
        //                 <div>
        //                 <Grid item>
        //                     <Typography align="center" variant = "h6">
        //                         {total[0]}
        //                     </Typography>
        //                 </Grid>
        //                 <Grid container item direction = "row" justify="center" alignItems="center">
        //                     <Grid item>
        //                         <Button varient = "contained" color= "primary">
        //                             Pay
        //                         </Button>
        //                     </Grid>
        //                     <Grid item>
        //                         <img src= "https://i.ya-webdesign.com/images/avatar-arrow-png-7.png" width = "100px"/>
        //                     </Grid>
        //                     <Grid>
        //                         <Typography>Pays</Typography>
        //                         <Typography >{"$" + amt.toFixed(2)}</Typography>
        //                     </Grid>
        //                 </Grid>
        //                 {/* {total[0]+ " Pays $" + amt.toFixed(2) + " -> "} */}
        //                 </div>
        //             );
        //         } else {
        //             return(
        //                 <div>
        //                     <Grid item>
        //                         <Typography align="center" variant = "h6">
        //                             {total[0]}
        //                         </Typography>
        //                     </Grid>
        //                 </div>
        //             );
        //         }
        // });

        return(
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                <div>
                    {
                        display.length === 0
                        ? <Typography className={classes.settledText} variant="h5">All Payments Settled</Typography>
                        : display
                    }
                </div>
            </Grid>
        );
    }
}

SuggestedPayments.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(withRouter(SuggestedPayments));