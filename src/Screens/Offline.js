import React from 'react';
import { Typography, withStyles, Box } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
    mainContainer: {
        textAlign: 'center',
    },
    noNetworkText: {
        marginTop: "10px",
        color: "#717171",
    },
    noNetworkSymbol: {
        marginTop: "100px",
        color: "#717171",
        fontSize: "36px"
    }
});

class Offline extends React.Component {
    componentDidMount() {
        fetch("https://accountant.tubalt.com/api")
        .then(res => {
            if (res.status === 200) {
                if (this.props.location.state !== undefined && this.props.location.state.canGoBack) {
                    this.props.history.goBack();
                } else {
                    this.props.history.push('/');
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
    render() {
        const { classes } = this.props;
        return (
            <Box className={classes.mainContainer}>
                <ErrorOutlineIcon className={classes.noNetworkSymbol} />
                <Typography className={classes.noNetworkText} variant="h5">No Internet Connection</Typography>
            </Box>
        );
    }
}

Offline.propTypes = {
    classes: PropTypes.object.isRequired,
};
 
export default withStyles(styles)(withRouter(Offline));