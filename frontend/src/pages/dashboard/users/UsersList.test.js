import React from 'react';
import { shallow } from 'enzyme';
import { messages } from '../../../common/utils';
import { findByTestAttr } from '../../../common/testUtils';
import { createBrowserHistory as createHistory } from 'history';
import { axiosMain } from '../../../common/instances';
import MockAdapter from 'axios-mock-adapter';
import { UsersList } from './UsersList';

const history = createHistory();

const setUp = (props = {}) => {
  return shallow(<UsersList {...props} />);
};

const mockMessages = jest.fn((s) => s);
messages.t = mockMessages;

const match = { params: {} };
const user = { id: 1 };

describe('Users List Component', () => {
  let component, mock;
  beforeEach(() => {
    component = setUp({
      history: history,
      match: match,
      user: user
    });
    mock = new MockAdapter(axiosMain);
  });

  it('Renders without errors', () => {
    expect(component.exists()).toBeTruthy();
  });

  it('Renders users table', () => {
    const usersTable = findByTestAttr(component, 'usersTable');
    expect(usersTable.length).toBe(1);
  });
});
