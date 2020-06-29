import React from 'react';
import { Button, withStyles, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getUser, setUserSession } from '../Utils/Common';

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

class ChangeUsername extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username : "",
        };
        this.onChangeVal = this.onChangeVal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentDidMount() {
        this.props.functionProps["updatePageName"]("Change Username");
        this.setState({
            username : getUser().username,
        });
    }

    onSubmit() {
        console.log(this.state.username);
        fetch('https://accountant.tubalt.com/api/users/changeusername', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                username: this.state.username,
                user_id: getUser().user_id,
            })
        })
        .then(response => {
          if (response.status === 401) {
            response.json().then(res => this.props.functionProps["toggleFailCallback"](res.message));
          } else {
            response.json().then(res => {
                setUserSession(res.token, res.user);
                this.props.functionProps["toggleSuccessCallback"](res.message)  ;  
            });
          }
        })
        .catch(error => {
          console.log(error);
          alert("Oops! Something went wrong");
        });
    }

    onChangeVal(e) {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    onCancel() {
        this.props.history.goBack();
    }


    render() {
        const { classes } = this.props;
        return(
            <div>
                <TextField onChange={this.onChangeVal} value={this.state.username} name="username" label="Username" />
                <Button onClick={this.onSubmit}>Submit</Button>
                <Button onClick={this.onCancel}>Cancel</Button>
            </div>
        );
    }

}

ChangeUsername.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(withRouter(ChangeUsername));