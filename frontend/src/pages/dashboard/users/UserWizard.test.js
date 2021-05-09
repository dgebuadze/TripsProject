import React from 'react';
import { shallow } from 'enzyme';
import { messages } from '../../../common/utils';
import { createBrowserHistory as createHistory } from 'history';
import { findByTestAttr } from '../../../common/testUtils';
import { UserWizard } from './UserWizard';

const history = createHistory();

const setUp = (props = {}) => {
  return shallow(<UserWizard {...props} />);
};

const mockMessages = jest.fn((s) => s);
messages.t = mockMessages;

const match = { params: {} };
const user = { id: 1 };

describe('User Wizard Component', () => {
  let component;
  beforeEach(() => {
    component = setUp({
      history: history,
      match: match,
      user: user,
      startDashboardLoading: jest.fn(),
      stopDashboardLoading: jest.fn(),
      action: 'add'
    });
  });

  it('Renders without errors', () => {
    expect(component.exists()).toBeTruthy();
  });

  it('Renders user wizard form', () => {
    const userWizardForm = findByTestAttr(component, 'userWizard');
    expect(userWizardForm.length).toBe(1);
  });
});
