import React from 'react';
import { getUser, removeUserSession } from '../Utils/Common';
import { withRouter } from 'react-router-dom';
import ViewPastTrips from '../Components/ViewPastTrips';
import PropTypes from 'prop-types';
import {Typography, withStyles, Box, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    homeContainer: {
      maxWidth: '100%',
      padding: 0
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
      },
});
 
class PastTrips extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            user_id: '',
            username: ''
        }
    }

    componentDidMount() {
        this.props.functionProps["updatePageName"]("Past Trips");
        const user = getUser();
        this.setState({
            user_id: user.user_id,
            username: user.username
        });
    }

    gotoAddTrip = () => {
        this.props.history.push('/addtrip');
    }

    handleLogout = () => {    
        removeUserSession();
        this.props.history.push('/');
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Box display="flex" justifyContent="center" className={classes.homeContainer}>
                    <ViewPastTrips/>
                </Box>
            </div>
          );
    }
}

PastTrips.propTypes = {
    classes: PropTypes.object.isRequired,
  };
 
export default withStyles(styles)(withRouter(PastTrips));