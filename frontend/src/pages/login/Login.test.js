import React from 'react';
import { shallow } from 'enzyme';
import { Login } from './Login';
import { messages } from '../../common/utils';
import { findByTestAttr } from '../../common/testUtils';

const setUp = (props = {}) => {
  return shallow(<Login {...props} />);
};

const mockMessages = jest.fn((s) => s);
const mockLoginUser = jest.fn();
messages.t = mockMessages;

describe('Login Component', () => {
  let component;
  beforeEach(() => {
    component = setUp({
      loginUser: mockLoginUser
    });
  });

  it('Renders without errors', () => {
    expect(component.exists()).toBeTruthy();
  });

  it('Renders Logo Component', () => {
    const logo = component.find('Logo');
    expect(logo.length).toBe(1);
  });

  it('Renders Login Form', () => {
    const loginForm = findByTestAttr(component, 'loginForm');
    expect(loginForm.length).toBe(1);
  });

  it('Renders Form Submit Button', () => {
    const submitButton = findByTestAttr(component, 'loginSubmit');
    expect(submitButton.length).toBe(1);
  });

  it('Calls login function when submit button is pressed', () => {
    const loginForm = findByTestAttr(component, 'loginForm');
    loginForm.prop('onFinish')();
    expect(mockLoginUser.mock.calls.length).toBe(1);
  });
});
