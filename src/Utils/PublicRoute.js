import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Common';
 
// handle the public routes
function PublicRoute({ component: Component, functionProps: functionPropsObject, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => !getToken() ? <Component {...props} functionProps = {functionPropsObject} /> : <Redirect to={{ pathname: '/home' }} />}
    />
  )
}
 
export default PublicRoute;