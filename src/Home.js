import React from 'react';
import { getUser, removeUserSession } from './Utils/Common';
import { withRouter } from 'react-router-dom';
 
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

    handleLogout = () => {    
        removeUserSession();
        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                Welcome {this.state.username}!<br /><br />
                <input type="button" onClick={this.handleLogout} value="Logout" />
            </div>
          );
    }
}
 
export default withRouter(Home);