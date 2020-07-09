import React from 'react';
import { Button, withStyles, TextField, Typography, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getUser } from '../Utils/Common';


const styles = theme => ({
    paper: {
        width: 335,
        backgroundColor : 'white',
        borderRadius: "10px",
        marginTop: '20px',
        paddingTop: '30px',
        paddingBottom: '25px',
        textAlign: "center",
    },
    page: {
        width: 335,
        textAlign: "center",
        justifyContent: "center",
        marginRight: "auto",
        marginLeft: "auto",
    },
    textfield: {
        width: 300,
        marginBottom: "10px",
    },
    submitButton: {
        width: "300px",
        marginTop: '20px'
    },
    cancelButton: {
        width: "300px",
        marginTop: "15px"
    }
});

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword : "",
            newPassword : "",
            cPassword : "",
            validated : false,
        };
        this.onChangeVal = this.onChangeVal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentDidMount() {
        this.props.functionProps["updatePageName"]("Change Password");
    }

    onSubmit() {
        if (! this.state.validated) {
            alert("Please ensure both your passwords are the same.");
            return;
        }
        fetch('https://accountant.tubalt.com/api/users/changepassword', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                currentPassword: this.state.oldPassword,
                newPassword: this.state.newPassword,
                user_id: getUser().user_id,
            })
        })
        .then(response => {
          if (response.status === 401) {
            response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
          } else {
            response.json().then(res => {
                
                this.props.functionProps["toggleSuccessCallback"](res.message)    
            });
          }
        })
        .catch(error => {
          console.log(error);
          alert("Oops! Something went wrong");
        });


    }

    onChangeVal(e) {
        let validated = false;
        if (e.target.name === "cPassword" && e.target.value === this.state.newPassword) {
            validated = true;
        }
        this.setState({
            [e.target.name] : e.target.value,
            validated: validated
        });
    }

    onCancel() {
        this.props.history.goBack();
    }

    render() {
        const { classes } = this.props;
        return(
            <div className={classes.page}>
                <Paper className={classes.paper} >
                    <TextField 
                        className={classes.textfield}
                        variant="outlined"
                        onChange={this.onChangeVal} 
                        value={this.state.oldPassword} 
                        name="oldPassword" 
                        label="Current Password" />
                    <br/>
                    <TextField 
                        className={classes.textfield}
                        variant="outlined"
                        onChange={this.onChangeVal} 
                        value={this.state.newPassword} 
                        name="newPassword" 
                        label="New Password" />
                    <br/>
                    <TextField 
                        className={classes.textfield}
                        variant="outlined"
                        error = { this.state.validated || this.state.cPassword !== ''} 
                        onChange={this.onChangeVal} 
                        value={this.state.cPassword} 
                        name="cPassword" 
                        label="Confirm Password" />
                    <Typography color= "error">
                        {this.state.validated || this.state.cPassword === '' ? "" : "Passwords do not match"}
                    </Typography>   
                    <Button className={classes.submitButton} color="primary" variant="contained" fullWidth onClick={this.onSubmit}>Submit</Button>
                    <br/>
                    <Button className={classes.cancelButton} color="disabled" variant="contained" fullWidth onClick={this.onCancel}>Cancel</Button>
                </Paper>
            </div>
        );
    }

}

ChangePassword.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(withRouter(ChangePassword));