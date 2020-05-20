import React from 'react';
import {withRouter} from 'react-router-dom';
import {getUser} from '../Utils/Common';

class ViewTrips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id : -1,
      trips : []
    }
    this.viewLedger = this.viewLedger.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  async componentDidMount() {
    const user =  getUser().user_id;
    fetch("https://accountant.tubalt.com/api/gettrips?userid="+ user)
    .then(response => response.json())
    .then(response => this.setState({
      trips : response.trips,
      user_id : user
    }));
  }

  viewLedger(e) {
      this.props.history.push("/viewledger",{trip_id : e.target.id});
  }

  addEntry(e) {
      this.props.history.push("/addentry",{trip_id : e.target.id});
  }

  onSelect(arr) {
    alert("No Ledger Yet");
  }

  render() {
      let trips = this.state.trips;
      let displayActive = trips.filter((trip) => trip[0].ended === 0).map((trip) => {
          return(
              <div>
                  <p>{trip[0].trip_name}</p>
                  <button id = {trip[0].trip_id} onClick = {this.viewLedger}>View Ledger</button>
                  <button id = {trip[0].trip_id} onClick = {this.addEntry}>Add Entry</button>
              </div>
          );
      });
      let displayInactive = trips.filter(trip => trip[0].ended === 1).map((trip) => {
          return(
           <option value = {trip[0].trip_id}>{trip[0].trip_name}</option>
          );
      });
      return(
          <div>
              {displayActive}
              <select>
                  {displayInactive}
              </select>
          </div>

      );
  }

}

export default withRouter(ViewTrips);