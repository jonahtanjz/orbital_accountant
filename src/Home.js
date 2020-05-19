import React from 'react';
import { getUser, removeUserSession } from './Utils/Common';
import { withRouter } from 'react-router-dom';
import ViewTrip from './ViewTrips';
 
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
        return (
            <div>
                Welcome {this.state.username}!<br /><br />
                <ViewTrip/>
                <input type="button" onClick={this.gotoAddTrip} value="Add trip"/><br/>
                <input type="button" onClick={this.handleLogout} value="Logout" />
            </div>
          );
    }
}
 
export default withRouter(Home);