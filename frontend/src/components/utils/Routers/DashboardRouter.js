import React from 'react';
import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import {
  PROFILE_PAGE_URI,
  ROOT_PAGE_URI,
  TRIPS_PAGE_URI,
  USERS_PAGE_URI
} from '../../../common/pages';
import TripsList from '../../../pages/dashboard/trips/TripsList';
import TripsNextMonthView from '../../../pages/dashboard/trips/TripsNextMonthView';
import TripWizard from '../../../pages/dashboard/trips/TripWizard';
import { dashboardLink } from '../../../common/utils';
import TripsView from '../../../pages/dashboard/trips/TripsView';
import UsersList from '../../../pages/dashboard/users/UsersList';
import UserWizard from '../../../pages/dashboard/users/UserWizard';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const DashboardRouter = ({ history, user }) => {
  return (
    <DashboardLayout history={history}>
      <Switch>
        <Route exact path={ROOT_PAGE_URI}>
          <Redirect to={`${ROOT_PAGE_URI}${TRIPS_PAGE_URI}`} />
        </Route>
        <ProtectedRoute
          exact
          key="my-trips"
          path={dashboardLink(TRIPS_PAGE_URI)}
          component={TripsList}
        />
        <ProtectedRoute
          exact
          key="add-trip"
          path={dashboardLink(TRIPS_PAGE_URI + '/add')}
          component={TripWizard}
          action={'add'}
        />
        <ProtectedRoute
          exact
          key="view-trip"
          path={dashboardLink(TRIPS_PAGE_URI + '/view/:tripId')}
          component={TripsView}
        />
        <ProtectedRoute
          exact
          key="next-month"
          path={dashboardLink(TRIPS_PAGE_URI + '/next-month')}
          component={TripsNextMonthView}
        />
        <ProtectedRoute
          exact
          key="edit-trip"
          path={dashboardLink(TRIPS_PAGE_URI + '/edit/:tripId')}
          component={TripWizard}
          action={'edit'}
        />
        <ProtectedRoute
          exact
          key="user-trips"
          path={dashboardLink(USERS_PAGE_URI + `/:userId` + TRIPS_PAGE_URI)}
          component={TripsList}
        />
        <ProtectedRoute
          exact
          key="user-trips-add"
          path={dashboardLink(
            USERS_PAGE_URI + `/:userId` + TRIPS_PAGE_URI + '/add'
          )}
          action={'add'}
          component={TripWizard}
        />
        <ProtectedRoute
          exact
          key="all-trips"
          path={dashboardLink(TRIPS_PAGE_URI + '/all')}
          component={TripsList}
          action={'all'}
        />
        <ProtectedRoute
          exact
          key="users-list"
          path={dashboardLink(USERS_PAGE_URI)}
          component={UsersList}
        />
        <ProtectedRoute
          exact
          key="add-user"
          path={dashboardLink(USERS_PAGE_URI + '/add')}
          component={UserWizard}
          action={'add'}
        />
        <ProtectedRoute
          exact
          key="edit-user"
          path={dashboardLink(USERS_PAGE_URI + '/edit/:userId')}
          component={UserWizard}
          action={'edit'}
        />
        <ProtectedRoute
          exact
          key="profile"
          path={dashboardLink(PROFILE_PAGE_URI)}
          profileUserId={user.id}
          component={UserWizard}
          action={'edit'}
        />
      </Switch>
    </DashboardLayout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
});

DashboardRouter.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(DashboardRouter);
