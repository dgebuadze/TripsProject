import axios from 'axios';
import store from '../../state/store';
import { messages, showError } from '../utils';
import { STOP_LOADING_UI } from '../../state/types';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use((config) => {
  //authCheck(store);
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 422) {
      //Process validation errors
      store.dispatch({ type: STOP_LOADING_UI });
      const errors = error.response.data.error;
      if (typeof errors === 'string') {
        showError(errors);
      } else if (typeof errors === 'object' && errors !== null) {
        for (let key in errors) {
          // noinspection JSUnfilteredForInLoop
          for (let errorMessage of errors[key]) {
            // noinspection JSUnfilteredForInLoop
            showError(
              messages.t(
                key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')
              ),
              messages.t(errorMessage)
            );
          }
        }
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default instance;
