import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import {
  LOGIN_PAGE_URI,
  REGISTER_PAGE_URI,
  ROOT_PAGE_URI,
  TRIPS_PAGE_URI
} from '../../../common/pages';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import MainDashboard from './DashboardRouter';
import AuthRoute from '../AuthRoute/AuthRoute';
import Login from '../../../pages/login/Login';
import Register from '../../../pages/register/Register';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { messages } from '../../../common/utils';

const MainRouter = ({ user }) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user.authenticated ? (
            <Redirect to={ROOT_PAGE_URI + TRIPS_PAGE_URI} />
          ) : (
            <Redirect to={LOGIN_PAGE_URI} />
          )}
        </Route>
        <ProtectedRoute path={ROOT_PAGE_URI} component={MainDashboard} />
        <AuthRoute exact path={LOGIN_PAGE_URI} component={Login} />
        <AuthRoute exact path={REGISTER_PAGE_URI} component={Register} />
        <Route
          render={() => (
            <div style={{ padding: '30px', fontSize: '24px' }}>
              {messages.t('general.page_not_found')}
            </div>
          )}
        />
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
});

MainRouter.propTypes = {
  user: PropTypes.object
};

export default connect(mapStateToProps)(MainRouter);
