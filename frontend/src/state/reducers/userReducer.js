import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  SET_REFRESHING,
  STOP_REFRESHING,
  STOP_LOADING_USER
} from '../types';

const initialState = {
  authenticated: false,
  refreshing: false,
  loading: !!localStorage.getItem('access_token'),
  credentials: {},
  likes: [],
  notifications: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_REFRESHING:
      return {
        ...state,
        refreshing: true
      };
    case STOP_REFRESHING:
      return {
        ...state,
        refreshing: false
      };
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return {
        ...initialState,
        loading: false
      };
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload
      };
    case STOP_LOADING_USER:
      return {
        ...state,
        loading: false
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((not) => (not.read = true));
      return {
        ...state
      };
    default:
      return state;
  }
}
