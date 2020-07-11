import React from 'react';
import {withRouter} from 'react-router-dom';
import {getUser} from '../Utils/Common';
import {Button, Card, CardContent, Typography, withStyles, Box, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Snackbar, CircularProgress} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Alert from './Alert';
import PropTypes from 'prop-types';

const styles = themes => ({
  mainContainer: {
    justifyContent: 'center',
  },
  tripsContainer: {
    maxWidth: 600,
    minWidth: 350,
    margin: '10px 0',
    backgroundColor: "#FFF",
    borderRadius: '10px',
  },
  tripsHeader: {
    textAlign: 'center',
    color: '#FFF',
  },
  tripsMenu: {
    marginLeft: 'auto',
    padding: 0,
  },
  tripsTitleContainer: {
    margin: '20px 5px',
  },
  tripsTitle: {
    textAlign: "Left"
  },
  tripsButton: {
    margin: "0 15px 0 0",
    fontWeight: "600"
  },
  loadingCircle: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "250px",
  },
  noTripsText: {
    marginTop: "100px",
    color: "#717171",
},
});

class ViewPastTrips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id : -1,
      trips : [],
      anchorEl: {},
      deleteDialog: {},
      deleteAllDialog: {},
      restartTripDialog: {},
      successCallback: false,
      failCallback: false,
      loaded: false,
    }
    this.viewLedger = this.viewLedger.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.editTrip = this.editTrip.bind(this);
    this.deleteSelf = this.deleteSelf.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleDeleteDialogOpen = this.handleDeleteDialogOpen.bind(this);
    this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
    this.handleDeleteAllDialogOpen = this.handleDeleteAllDialogOpen.bind(this);
    this.handleDeleteAllDialogClose = this.handleDeleteAllDialogClose.bind(this);
    this.toggleRestartTripDialog = this.toggleRestartTripDialog.bind(this);
    this.handleSuccessCallback = this.handleSuccessCallback.bind(this);
    this.handleSuccessCallbackClose = this.handleSuccessCallbackClose.bind(this);
    this.handleFailCallback = this.handleFailCallback.bind(this);
    this.handleFailCallbackClose = this.handleFailCallbackClose.bind(this);
  }

  async componentDidMount() {
    const user =  getUser().user_id;
    fetch("https://accountant.tubalt.com/api/trips/gettrips?userid="+ user)
    .then(response => response.json())
    .then(response => {
      let newAnchorEl = {};
      let newdeleteDialog = {};
      let newdeleteAllDialog = {};
      let newRestartTripDialog = {};
      for (let i = 0; i < response.trips.length; i++) {
        newAnchorEl[i] = null;
        newdeleteDialog[i] = false;
        newdeleteAllDialog[i] = false;
        newRestartTripDialog[i] = false;
      }
      let trips = response.trips.filter(trip => trip[0].deleted === 0);
      let newTrips = [];
      for ( let i = trips.length - 1; i >= 0; i--){
        newTrips.push(trips[i]);
      }
      this.setState({
        trips : newTrips,
        user_id : user,
        anchorEl: newAnchorEl,
        deleteDialog: newdeleteDialog,
        deleteAllDialog: newdeleteAllDialog,
        restartTripDialog: newRestartTripDialog,
        loaded: true,
      })
    })
    .catch(err => {
      this.props.history.push("/offline", {canGoBack: true});
    });
  }

  viewLedger(id) {
      this.props.history.push("/viewledger",{trip_id : id});
  }

  addEntry(id) {
    this.props.history.push("/addentry",{trip_id : id});
  }

  onSelect(e) {
    this.props.history.push("/viewledger",{trip_id : e.target.value});  
  }
  
  editTrip(id) {
    this.props.history.push("/edittrip",{trip_id : id});  
  }

  deleteSelf(id) {
    this.handleDeleteDialogClose(id);
    fetch("https://accountant.tubalt.com/api/trips/deletetrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id : this.state.user_id,
          trip_id : id,
        })
      })
      .then(response => {
        if (response.status === 401) {
          response.json().then(res => this.handleFailCallback(res.message));
        } else {
          response.json().then(res => {
            let trips = res.trips.filter(trip => trip[0].deleted === 0);
            let newTrips = [];
            for ( let i = trips.length - 1; i >= 0; i--){
              newTrips.push(trips[i]);
            }
            this.setState({
              trips : newTrips,
            });
            this.handleSuccessCallback();
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.handleFailCallback();
      });
  }

  handleMenuOpen(id, e) {
    let tripId = id;
    let newAnchorEl = this.state.anchorEl;
    newAnchorEl[tripId] = e.currentTarget;
    this.setState({anchorEl: newAnchorEl});
  }

  handleMenuClose(id) {
    let tripId = id;
    let newAnchorEl = this.state.anchorEl;
    newAnchorEl[tripId] = null;
    this.setState({anchorEl: newAnchorEl});
  }
  
  deleteAll(id){
    this.handleDeleteAllDialogClose(id);
    fetch("https://accountant.tubalt.com/api/trips/deletetripall", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id : this.state.user_id,
        trip_id : id,
      })
    })
    .then(response => {
      if (response.status === 401) {
        response.json().then(res => this.handleFailCallback(res.message));
      } else {
        response.json().then(res => {
          let trips = res.trips.filter(trip => trip[0].deleted === 0);
          let newTrips = [];
          for ( let i = trips.length - 1; i >= 0; i--){
            newTrips.push(trips[i]);
          }
          this.setState({
            trips : newTrips,
          });
          this.handleSuccessCallback();
        });
      }
    })
    .catch(error => {
      console.log(error);
      this.handleFailCallback();
    });
  }

  handleDeleteDialogOpen(id) {
    let newdeleteDialog = this.state.deleteDialog;
    newdeleteDialog[id] = true;
    this.setState({ deleteDialog: newdeleteDialog });
  }

  handleDeleteDialogClose(id) {
    let newdeleteDialog = this.state.deleteDialog;
    newdeleteDialog[id] = false;
    this.setState({ deleteDialog: newdeleteDialog });
  }

  handleDeleteAllDialogOpen(id) {
    let newDeleteAllDialog = this.state.deleteAllDialog;
    newDeleteAllDialog[id] = true;
    this.setState({ deleteAllDialog: newDeleteAllDialog });
  }

  handleDeleteAllDialogClose(id) {
    let newDeleteAllDialog = this.state.deleteAllDialog;
    newDeleteAllDialog[id] = false;
    this.setState({ deleteAllDialog: newDeleteAllDialog });
  }

  restartTrip(id) {
    this.toggleRestartTripDialog(id);
    fetch("https://accountant.tubalt.com/api/trips/undoendtrip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: this.state.user_id,
        trip_id: id,
      })
    })
    .then(response => {
      if (response.status === 401) {
        response.json().then(res => this.handleFailCallback(res.message));
      } else {
        response.json().then(res => {
          let trips = res.trips.filter(trip => trip[0].deleted === 0);
          let newTrips = [];
          for ( let i = trips.length - 1; i >= 0; i--){
            newTrips.push(trips[i]);
          }
          this.setState({
            trips : newTrips,
          });
          this.handleSuccessCallback();
        });
      }
    })
    .catch(error => {
      console.log(error);
      this.handleFailCallback("Oops! Something went wrong");
    });
  } 

  toggleRestartTripDialog(id) {
    let newRestartTripDialog = this.state.restartTripDialog;
    newRestartTripDialog[id] = !this.state.restartTripDialog[id];
    this.setState({ restartTripDialog: newRestartTripDialog });
  }

  handleSuccessCallback() {
    this.setState({successCallback: true});
  }

  handleSuccessCallbackClose() {
    this.setState({successCallback: false});
  }

  handleFailCallback() {
    this.setState({failCallback: true});
  }

  handleFailCallbackClose() {
    this.setState({failCallback: false});
  }

  render() {
      const { classes } = this.props;
      if (!this.state.loaded) { 
        return (
          <CircularProgress className={classes.loadingCircle} />
        );
      }
      let trips = this.state.trips;
      let displayInactive = trips.filter(trip => trip[0].ended === 1 || trip[0].in_trip === 0).map((trip) => {
          return(
              <Card className={classes.tripsContainer}>
                <CardContent>
                  <Box display="flex" className={classes.tripsTitleContainer}>
                    <Typography className={classes.tripsTitle}>
                      {trip[0].trip_name}
                    </Typography> 
                    <IconButton
                    className={classes.tripsMenu}
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(e) => this.handleMenuOpen(trip[0].trip_id, e)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={this.state.anchorEl[trip[0].trip_id]}
                    keepMounted
                    open={Boolean(this.state.anchorEl[trip[0].trip_id])}
                    onClick={() => this.handleMenuClose(trip[0].trip_id)}
                  >
                    {
                      (this.state.user_id === trip[0].owner)
                        ? <MenuItem id = {trip[0].trip_id} onClick={() => this.toggleRestartTripDialog(trip[0].trip_id)}>Restart Trip</MenuItem>
                        : null
                    }
                    <MenuItem id = {trip[0].trip_id} onClick={() => this.handleDeleteDialogOpen(trip[0].trip_id)}>Delete</MenuItem>
                    {
                      (this.state.user_id === trip[0].owner)
                        ? <MenuItem id = {trip[0].trip_id} onClick={() => this.handleDeleteAllDialogOpen(trip[0].trip_id)}>Delete All</MenuItem>
                        : null
                    }
                  </Menu>   
                  </Box>

                  <Button id = {trip[0].trip_id} className={classes.tripsButton} onClick = {() => this.viewLedger(trip[0].trip_id)} color="primary">View Ledger</Button>
                </CardContent>
                <Dialog
                  open={this.state.deleteDialog[trip[0].trip_id]}
                  onClose={() => this.handleDeleteDialogClose(trip[0].trip_id)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Delete this trip?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete this trip? Once this is done, you can no longer
                      view this trip's ledger or add new entry to it. To undo this, you need to ask
                      someone in the trip to add you back in.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.handleDeleteDialogClose(trip[0].trip_id)} color="primary">
                      No, cancel
                    </Button>
                    <Button onClick={() => this.deleteSelf(trip[0].trip_id)} color="primary" autoFocus>
                      Yes, delete trip
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={this.state.deleteAllDialog[trip[0].trip_id]}
                  onClose={() => this.handleDeleteAllDialogClose(trip[0].trip_id)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Delete this trip for all?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete this trip for all? Once this is done, everyone can no longer
                      view this trip's ledger or add new entry to it. This cannot be undone.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.handleDeleteAllDialogClose(trip[0].trip_id)} color="primary">
                      No, cancel
                    </Button>
                    <Button onClick={() => this.deleteAll(trip[0].trip_id)} color="primary" autoFocus>
                      Yes, delete for all
                    </Button>
                  </DialogActions>
                </Dialog>    
                <Dialog
                  open={this.state.restartTripDialog[trip[0].trip_id]}
                  onClose={() => this.toggleRestartTripDialog(trip[0].trip_id)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">Restart this trip?</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to restart this trip? Once this is done, it will be shifted to
                      the current trips section and additional transactions can be added.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.toggleRestartTripDialog(trip[0].trip_id)} color="primary">
                      No, cancel
                    </Button>
                    <Button onClick={() => this.restartTrip(trip[0].trip_id)} color="primary" autoFocus>
                      Yes, restart trip
                    </Button>
                  </DialogActions>
                </Dialog>  
              </Card>
          );
      });

      return(
          <Box className={classes.mainContainer}>
              {
                displayInactive.length === 0
                ? <Typography className={classes.noTripsText} variant="h5">No Past Trips</Typography>
                : displayInactive
              }
              <Snackbar open={this.state.successCallback} autoHideDuration={3000} onClose={this.handleSuccessCallbackClose}>
                  <Alert onClose={this.handleSuccessCallbackClose} severity="success">
                    Success!
                  </Alert>
                </Snackbar>
                <Snackbar open={this.state.failCallback} autoHideDuration={3000} onClose={this.handleFailCallbackClose}>
                  <Alert onClose={this.handleFailCallbackClose} severity="error">
                    Oops.. Something went wrong. Please try again.
                  </Alert>
                </Snackbar>
          </Box>

      );
  }

}

ViewPastTrips.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(ViewPastTrips));