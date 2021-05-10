import {
  LOADING_UI,
  SET_REFRESHING,
  SET_UNAUTHENTICATED,
  SET_USER,
  STOP_LOADING_UI,
  STOP_REFRESHING
} from '../types';
import { GET, POST, POST_AUTH } from '../../common/network';
import { axiosMain as axios } from '../../common/instances';
import {
  messages,
  showError,
  showInfo,
  showSuccess,
  unexpectedErrorHandler
} from '../../common/utils';
import { LOGIN_PAGE_URI } from '../../common/pages';
import {
  ENDPOINT_AUTH_TOKEN,
  ENDPOINT_GET_USER_INFO,
  ENDPOINT_REGISTER
} from '../../common/endpoints';

export const loginUser = (userData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  userData['grant_type'] = 'password';
  userData['client_id'] = process.env.REACT_APP_OAUTH_CLIENT_ID;
  POST_AUTH(ENDPOINT_AUTH_TOKEN, userData)
    .then((response) => {
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      setAuthorizationHeader(accessToken);
      dispatch(getUserData(accessToken, refreshToken));
    })
    .catch((e) => {
      dispatch({ type: STOP_LOADING_UI });
      if (
        e.response &&
        e.response.status === 403 &&
        e.response.data &&
        e.response.data.error
      ) {
        showError(messages.t(e.response.data.error));
      }
      if (e.response && e.response.status === 400) {
        return showError(
          messages.t('login.invalid_data_title'),
          messages.t('login.invalid_data_description')
        );
      }
      return unexpectedErrorHandler();
    });
};

export const registerUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  POST(ENDPOINT_REGISTER, userData)
    .then((res) => {
      if (res && res.status === 201) {
        dispatch({ type: STOP_LOADING_UI });
        showSuccess(messages.t('register.register_success'));
        history.push(LOGIN_PAGE_URI);
      }
    })
    .catch(() => {
      dispatch({ type: STOP_LOADING_UI });
      return unexpectedErrorHandler();
    });
};

export const refreshToken = (showLoading = false) => (dispatch) => {
  dispatch({ type: SET_REFRESHING });
  if (showLoading) {
    dispatch({ type: LOADING_UI });
  }
  POST_AUTH(ENDPOINT_AUTH_TOKEN, {
    grant_type: 'refresh_token',
    refresh_token: localStorage.getItem('refresh_token'),
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID
  })
    .then((response) => {
      setAuthorizationHeader(response.data.access_token);
      dispatch(
        getUserData(response.data.access_token, response.data.refresh_token)
      );
      dispatch({ type: STOP_REFRESHING });
      // if(showLoading) {
      //     dispatch({type: STOP_LOADING_UI});
      // }
    })
    .catch((e) => {
      if (showLoading) {
        dispatch({ type: STOP_LOADING_UI });
      }
      if (e.response && e.response.status === 401) {
        showInfo(
          messages.t('login.session_expired_title'),
          messages.t('login.session_expired_description')
        );
      } else {
        unexpectedErrorHandler();
      }
      dispatch(logoutUser());
    });
};

export const getUserData = (accessToken = null, refreshToken = null) => (
  dispatch
) => {
  GET(ENDPOINT_GET_USER_INFO)
    .then((res) => {
      if (res && res.status === 200) {
        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }
        dispatch({
          type: SET_USER,
          payload: res.data.data
        });
        dispatch({ type: STOP_LOADING_UI });
      }
    })
    .catch((e) => {
      if (
        e.response &&
        e.response.status === 403 &&
        e.response.data &&
        e.response.data.error
      ) {
        showError(messages.t(e.response.data.error));
      } else {
        showError(
          messages.t('login.error_user_data'),
          messages.t('general.try_later')
        );
      }
      dispatch(logoutUser());
      dispatch({ type: STOP_LOADING_UI });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
};

const setAuthorizationHeader = (accessToken) => {
  //localStorage.setItem('access_token', accessToken);
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};
