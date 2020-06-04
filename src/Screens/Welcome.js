import React from 'react';
 
class Welcome extends React.Component {
    componentDidMount() {
        this.props.functionProps["updatePageName"]("The Accountant");
    }
    render() {
        return (
            <div>
                Welcome to the Accountant!
            </div>
        );
    }
}
 
export default Welcome;