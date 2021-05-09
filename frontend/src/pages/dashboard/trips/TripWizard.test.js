import React from 'react';
import { shallow } from 'enzyme';
import { messages } from '../../../common/utils';
import { createBrowserHistory as createHistory } from 'history';
import { findByTestAttr } from '../../../common/testUtils';
import { TripWizard } from './TripWizard';

const history = createHistory();

const setUp = (props = {}) => {
  return shallow(<TripWizard {...props} />);
};

const mockMessages = jest.fn((s) => s);
messages.t = mockMessages;

const match = { params: {} };
const user = { id: 1 };

describe('Trip Wizard Component', () => {
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

  it('Renders trip wizard form', () => {
    const tripWizardForm = findByTestAttr(component, 'tripWizard');
    expect(tripWizardForm.length).toBe(1);
  });
});
