import { notification } from 'antd';
import { axiosMain as axios } from './instances';
import { LOADING_UI } from '../state/types';
import jwtDecode from 'jwt-decode';
import {
  getUserData,
  logoutUser,
  refreshToken as refreshTokenAction
} from '../state/actions/userActions';
import { ROOT_PAGE_URI } from './pages';
import { PAGE_OPTIONS, PAGE_SIZE } from './constants';


export const messages = {
  t: {}
};


export const showInfo = (title, description = null) => {
  return notification['info']({
    message: title,
    description: description
  });
};


export const showSuccess = (title, description = null) => {
  return notification['success']({
    message: title,
    description: description
  });
};


export const showError = (title, description = null) => {
  return notification['error']({
    message: title,
    description: description
  });
};


export const unexpectedErrorHandler = () => {
  return notification['error']({
    message: messages.t('general.try_later')
  });
};


export const authCheck = (store, loadUserData = false) => {
  const storeState = store.getState();
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  if (accessToken) {
    //store.dispatch({ type: SET_AUTHENTICATED });
    const decodedToken = jwtDecode(accessToken);
    if (decodedToken.exp * 1000 < Date.now() + 300000) {
      if (refreshToken) {
        if (!storeState.user.refreshing) {
          store.dispatch(refreshTokenAction(loadUserData));
        }
      } else {
        showInfo(
          messages.t('login.session_expired_title'),
          messages.t('login.session_expired_description')
        );
        store.dispatch(logoutUser());
      }
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      if (loadUserData) {
        store.dispatch({ type: LOADING_UI });
        store.dispatch(getUserData());
      }
    }
  }
};


export const dashboardLink = (key) => `${ROOT_PAGE_URI}${key}`;


export const convertPagination = (data) => {
  data.page = data.pagination.current;
  data.per_page = data.pagination.pageSize;
  delete data.pagination;
  return data;
};


export const updateAntdTableFiltersUrl = (params, history) => {
  let search = '?';
  if (
    params.pagination &&
    params.pagination.current &&
    params.pagination.current !== 1
  ) {
    search += `page=${params.pagination.current}`;
  }
  for (let key in params) {
    if (key !== 'pagination') {
      // noinspection JSUnfilteredForInLoop
      if (params[key]) {
        if (search.length > 1) search += '&';
        // noinspection JSUnfilteredForInLoop
        search += `${key}=${params[key]}`;
      }
    }
  }
  if (!(!history.location.search && search === '?')) {
    history.push({
      search: search
    });
  }
};



export const stripLeadingSlash = (s) => {
  return s.replace(/^\/+/g, '');
};

/**
 *
 * check if given user is of role "user"
 *
 * @param user
 * @returns {boolean}
 */
export const isUser = (user) => {
  return user.role === 'user';
};

/**
 *
 * check if given user is of role "manager"
 *
 * @param user
 * @returns {boolean}
 */
export const isManager = (user) => {
  return user.role === 'manager';
};

/**
 *
 * check if given user is of role "admin"
 *
 * @param user
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user.role === 'admin';
};

/**
 *
 * check if given user is of role "admin" or "manager"
 *
 * @param user
 * @returns {boolean}
 */
export const isManagerOrAdmin = (user) => {
  return user.role === 'admin' || user.role === 'manager';
};

/**
 *
 * Get initial pagination params for tables
 *
 * @returns {{current: number, pageSizeOptions: number[], pageSize: number}}
 */
export const getInitialTablePagination = () => {
  return { current: 1, pageSize: PAGE_SIZE, pageSizeOptions: PAGE_OPTIONS };
};

/**
 *
 * Remove empty keys from object
 *
 * @param obj
 */
export const cleanObject = (obj) => {
  for (let propName in obj) {
    // noinspection JSUnfilteredForInLoop
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ''
    ) {
      // noinspection JSUnfilteredForInLoop
      delete obj[propName];
    }
  }
};

/**
 *
 * Check if authenticated user can edit target user
 *
 * @param user
 * @param target
 * @returns {boolean}
 */
export const checkValidUserEdit = (user, target) => {
  if (isAdmin(user)) {
    return isUser(target) || isManager(target);
  } else if (isManager(user)) {
    return isUser(target);
  }
  return false;
};

/**
 *
 * Check if password is strong enough. Password should contain at least 1 uppercase letter,
 * at least one lowercase letter and at least 1 number.
 *
 * @param password
 * @returns {boolean}
 */
export const testStrongPassword = (password) => {
  return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])').test(password);
};
