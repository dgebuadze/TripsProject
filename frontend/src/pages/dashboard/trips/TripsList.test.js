import React from 'react';
import { shallow } from 'enzyme';
import { messages } from '../../../common/utils';
import { createBrowserHistory as createHistory } from 'history';
import { axiosMain } from '../../../common/instances';
import MockAdapter from 'axios-mock-adapter';
import { tripsList } from './tripsList';

const history = createHistory();

const setUp = (props = {}) => {
  return shallow(<tripsList {...props} />);
};

const mockMessages = jest.fn((s) => s);
messages.t = mockMessages;

const match = { params: {} };
const user = { id: 1 };

describe('trips List Component', () => {
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
});
