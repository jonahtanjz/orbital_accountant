import React from 'react';
import { Button, withStyles, Paper, Grid, IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ToggleOn, ToggleOff, AlternateEmail } from '@material-ui/icons';
import { subscribeUser, getPushSubscription, pushUnsubscribe } from '../serviceWorker';
import { getUser } from '../Utils/Common';

const styles = theme => ({
    homeContainer: {
        width: 335,
        textAlign: "center",
        justifyContent: "center",
        marginRight: "auto",
        marginLeft: "auto",    
    },
    paper: {
        width: '335px',
        padding: '10px',
    },
    button: {
        width: "100%",
        textAlign:"left",
        justifyContent: "left",
        textTransform: "none",
        
    },
    settingsText: {
        padding: "8px",
    },
});

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            notification: false,
        }
        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.toggleNoti = this.toggleNoti.bind(this);
    }

    async componentDidMount() {
        this.props.functionProps["updatePageName"]("Settings");
        let notificationState = await getPushSubscription(getUser().user_id);
        this.setState({
            notification: notificationState
        })
    }


    changeUsername(){
        this.props.history.push('/changeusername')
    }

    changePassword(){
        this.props.history.push('/changepassword');
    }
    
    async toggleNoti(){
        let notificationState;
        if (this.state.notification) {
            notificationState = await pushUnsubscribe(getUser().user_id);
        } else {
            notificationState = await subscribeUser(getUser().user_id);
        }
        this.setState({
            notification: notificationState
        })
    }

    render() {
        const { classes } = this.props;
        return(
            <div className={classes.homeContainer}>
                <Paper className={classes.paper}>
                    {/* <Button disabled onClick= {this.changeUsername}>Change Username</Button>
                    <br/> */}
                    <Button 
                        className={classes.button} 
                        onClick= {this.changePassword}
                    >
                        <Typography variant="body1" align="left">
                            Change Password
                        </Typography>
                    </Button>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Typography className={classes.settingsText}>
                            Push Notifications
                        </Typography>
                        <IconButton onClick={this.toggleNoti}>
                            {(this.state.notification)
                                ? <ToggleOn color="primary" style={{ fontSize: 40 }}/>
                                : <ToggleOff style={{ fontSize: 40 }} />
                            }
                        </IconButton>
                    </Grid>
                </Paper>
            </div>
        );
    }

}

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(withRouter(Settings));