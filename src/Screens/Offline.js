import React from 'react';
import { Typography, withStyles, Box } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import PropTypes from 'prop-types';

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
        this.props.functionProps["updatePageName"]("The Accountant");
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
 
export default withStyles(styles)(Offline);