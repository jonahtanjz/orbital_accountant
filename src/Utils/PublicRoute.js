import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Common';
 
// handle the public routes
function PublicRoute({ component: Component, updatePageName: updatePageNameFunction, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => !getToken() ? <Component {...props} updatePageName = {updatePageNameFunction} /> : <Redirect to={{ pathname: '/home' }} />}
    />
  )
}
 
export default PublicRoute;