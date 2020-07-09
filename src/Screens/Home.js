import React from 'react';
import { getUser, removeUserSession } from '../Utils/Common';
import { withRouter } from 'react-router-dom';
import ViewTrip from '../Components/ViewTrips';
import PropTypes from 'prop-types';
import {Typography, withStyles, Box, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { updateUser } from '../serviceWorker';

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
 
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            user_id: '',
            username: '',
        }
    }

    componentDidMount() {
        this.props.functionProps["updatePageName"]("Current Trips");
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
        updateUser("");
        this.props.history.push('/');
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
            <Box display="flex" justifyContent="center" className={classes.homeContainer}>
                <ViewTrip />
            </Box>
            <Fab className={classes.fab} color="secondary" onClick={() => this.props.history.push('/addtrip')} aria-label="add">
                <AddIcon />
            </Fab>
            </div>
          );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
  };
 
export default withStyles(styles)(withRouter(Home));