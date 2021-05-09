import React from 'react';
import { shallow } from 'enzyme';
import { messages } from '../../../common/utils';
import { createBrowserHistory as createHistory } from 'history';
import { TripsView } from './TripsView';
import { findByTestAttr } from '../../../common/testUtils';

const history = createHistory();

const setUp = (props = {}) => {
  return shallow(<TripsView {...props} />);
};

const mockMessages = jest.fn((s) => s);
messages.t = mockMessages;

const match = { params: {} };
const user = { id: 1 };

describe('Trip View Component', () => {
  let component;
  beforeEach(() => {
    component = setUp({
      history: history,
      match: match,
      user: user,
      startDashboardLoading: jest.fn(),
      stopDashboardLoading: jest.fn()
    });
  });

  it('Renders without errors', () => {
    expect(component.exists()).toBeTruthy();
  });

  it('Renders trip view card', () => {
    const TripsViewCard = findByTestAttr(component, 'TripsViewCard');
    expect(TripsViewCard.length).toBe(1);
  });
});
