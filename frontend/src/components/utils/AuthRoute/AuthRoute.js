import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROOT_PAGE_URI, TRIPS_PAGE_URI } from '../../../common/pages';

const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authenticated === true ? (
        <Redirect to={ROOT_PAGE_URI + TRIPS_PAGE_URI} />
      ) : (
        <Component {...props} />
      )
    }
  />
);

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated
});

AuthRoute.propTypes = {
  user: PropTypes.object,
  component: PropTypes.object,
  authenticated: PropTypes.bool
};

export default connect(mapStateToProps)(AuthRoute);
