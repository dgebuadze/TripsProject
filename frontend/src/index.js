import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './state/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { setDefaultLanguage, setDefaultTranslations } from 'react-multi-lang';
import en from './translations/en.json';

import moment from 'moment-timezone';

setDefaultTranslations({ en });
setDefaultLanguage('en');

moment.tz.setDefault("Asia/Tbilisi");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
