import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import { Provider } from 'react-redux';
import store from './state/store';

const setUp = (props = {}) => {
  return shallow(
    <Provider store={store}>
      <App {...props} />
    </Provider>
  );
};

describe('App Component', () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });
  it('Renders without errors', () => {
    expect(component.exists()).toBeTruthy();
  });
});
