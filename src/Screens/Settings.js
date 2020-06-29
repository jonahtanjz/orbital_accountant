import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
    homeContainer: {
      maxWidth: '100%',
      padding: 0,
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
      },
});

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    changeUsername(){
        this.props.history.push('/changeusername')
    }

    changePassword(){
        this.props.history.push('/changepassword');
    }

    render() {
        const { classes } = this.props;
        return(
            <div>
                <Button onClick= {this.changeUsername}>Change Username</Button>
                <Button onClick= {this.changePassword}>Change Password</Button>
            </div>
        );
    }

}

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(withRouter(Settings));