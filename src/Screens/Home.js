import React from 'react';
import { getUser, removeUserSession } from '../Utils/Common';
import { withRouter } from 'react-router-dom';
import ViewTrip from '../Components/ViewTrips';
import PropTypes from 'prop-types';
import {Typography, withStyles, Box} from '@material-ui/core';

const styles = themes => ({
    homeContainer: {
      maxWidth: '100%',
      padding: 0
    }
});
 
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            user_id: '',
            username: ''
        }
    }

    componentDidMount() {
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
                <ViewTrip/>
            </Box>
            <Box display="flex" justifyContent="center">    
                <input type="button" onClick={this.gotoAddTrip} value="Add trip"/><br/>
                <input type="button" onClick={this.handleLogout} value="Logout" />
            </Box>
            </div>
          );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
  };
 
export default withStyles(styles)(withRouter(Home));