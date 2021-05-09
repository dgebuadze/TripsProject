import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  LOADING_DASHBOARD_UI,
  STOP_LOADING_DASHBOARD_UI
} from '../types';

const initialState = {
  loading: false,
  dashboardLoading: false,
  errors: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false
      };
    case LOADING_DASHBOARD_UI:
      return {
        ...state,
        dashboardLoading: true
      };
    case STOP_LOADING_DASHBOARD_UI:
      return {
        ...state,
        dashboardLoading: false
      };
    default:
      return state;
  }
}
