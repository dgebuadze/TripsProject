import React from 'react';
import { shallow } from 'enzyme';
import { messages } from '../../common/utils';
import { findByTestAttr } from '../../common/testUtils';
import { Register } from './Register';

const setUp = (props = {}) => {
  return shallow(<Register {...props} />);
};

const mockMessages = jest.fn((s) => s);
const mockRegisterUser = jest.fn();
messages.t = mockMessages;

describe('Register Component', () => {
  let component;
  beforeEach(() => {
    component = setUp({
      registerUser: mockRegisterUser
    });
  });

  it('Renders without errors', () => {
    expect(component.exists()).toBeTruthy();
  });

  it('Renders Logo Component', () => {
    const logo = component.find('Logo');
    expect(logo.length).toBe(1);
  });

  it('Renders Register Form', () => {
    const registerForm = findByTestAttr(component, 'registerForm');
    expect(registerForm.length).toBe(1);
  });

  it('Renders Form Submit Button', () => {
    const submitButton = findByTestAttr(component, 'registerSubmit');
    expect(submitButton.length).toBe(1);
  });

  it('Calls register function when submit button is pressed', () => {
    const registerForm = findByTestAttr(component, 'registerForm');
    registerForm.prop('onFinish')();
    expect(mockRegisterUser.mock.calls.length).toBe(1);
  });
});
