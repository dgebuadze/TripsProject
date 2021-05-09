import React, { useEffect, useState } from 'react';
import  { Button, Col, Form, Input, Row, Select, DatePicker } from 'antd';
import moment from 'moment';
import {
  dashboardLink,
  isAdmin,
  messages,
  showSuccess,
  unexpectedErrorHandler
} from '../../../common/utils';
import {
  getTrip,
  saveTrip,
  updateTrip
} from './actions';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { TRIPS_PAGE_URI } from '../../../common/pages';
import {
  startDashboardLoading,
  stopDashboardLoading
} from '../../../state/actions/uiActions';
import { connect } from 'react-redux';
import { getUser, getUsers } from '../users/actions';
import { SELECT_PAGE_SIZE } from '../../../common/constants';

const { TextArea } = Input;

export const TripWizard = (props) => {
  const [loading, setLoading] = useState(props.action === 'edit');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState({});
  const { tripId, userId } = props.match.params;
  const { startDashboardLoading, stopDashboardLoading } = props;
  let abort = false;

  useEffect(() => {

    if (props.action === 'edit') {
      startDashboardLoading();
      getTrip(tripId).then((res) => {
        if (abort) return;
        setLoading(false);
        stopDashboardLoading();
        setData(res.data);
      });
    }
    if (isAdmin(props.user)) {
      loadUsers();
      if (userId) {
        startDashboardLoading();
        loadUser(userId);
      }
    }

    return () => {
      abort = true;
      stopDashboardLoading();
    };
  }, [
    stopDashboardLoading,
    startDashboardLoading,
    props.action,
    props.user,
    tripId
  ]);

  const loadUsers = (search = '') => {
    getUsers({ search, per_page: SELECT_PAGE_SIZE }).then((res) => {
      if (abort) return;
      setUsers(res.data);
    });
  };

  const loadUser = (id) => {
    getUser(id).then((res) => {
      if (abort) return;
      setCurrentUser(res.data);
      stopDashboardLoading();
    });
  };

  const onFinish = (values) => {
    startDashboardLoading();
    if (values.user_id) {
      values.user_id = parseInt(values.user_id.key);
    }

    values.start_end_date[0] = moment(values.start_end_date[0]).format('YYYY/MM/DD');
    values.start_end_date[1] = moment(values.start_end_date[1]).format('YYYY/MM/DD');

    if (props.action === 'add') {
      saveTrip(values)
        .then((response) => {
          handleResponse(response);
        })
        .catch(() => stopDashboardLoading());
    } else {
      updateTrip(tripId, values)
        .then((response) => {
          handleResponse(response);
        })
        .catch(() => stopDashboardLoading());
    }
  };


  const { RangePicker } = DatePicker;

  const handleResponse = (response) => {
    if (response.success) {
      stopDashboardLoading();
      showSuccess(messages.t('general.operation_success'));
      if (
        props.location &&
        props.location.referrer &&
        props.location.referrer !== props.history.location.pathname
      ) {
        props.history.push(props.location.referrer);
      } else {
        props.history.push(dashboardLink(TRIPS_PAGE_URI));
      }
    } else {
      unexpectedErrorHandler();
      stopDashboardLoading();
    }
  };

  const handleSearch = (value) => {
    loadUsers(value);
  };

  let initialValues = null;
  if (props.action === 'edit') {
    if (data && data.destination) {
      initialValues = {
        destination: data.destination,
        comment: data.comment,
        start_end_date:[moment(data.start_at), moment(data.end_at)],
        start_at: data.start_at,
        end_at:data.end_at
      };
    }
    if (isAdmin(props.user) && initialValues) {
      initialValues.user_id = {
        key: data.user.id,
        value: data.user.name
      };
    }
  } else if (isAdmin(props.user) && userId && currentUser) {
    initialValues = {
      user_id: {
        key: userId,
        value: currentUser.name
      }
    };
  } else if (isAdmin(props.user) && !userId) {
    initialValues = {
      user_id: {
        key: props.user.id,
        value: props.user.name
      }
    };
  }

  let showForm = props.action === 'add' || (!loading && data.destination);
  if (userId) {
    showForm = !!currentUser;
  }

  return (
    <>
      <Helmet>
        <title>
          {props.action === 'add'
            ? messages.t('trips.title_page_add')
            : messages.t('trips.title_page_edit')}
        </title>
      </Helmet>
      <Row type={'flex'} justify={'left'} aling={'left'}>
        <Col xs={24} md={10}>
          {showForm ? (
            <Form
              name="tripForm"
              layout={'vertical'}
              onFinish={onFinish}
              initialValues={initialValues}
              data-test={'tripWizard'}
            >
              <Form.Item
                label={messages.t('trips.destination')}
                name="destination"
                rules={[
                  {
                    required: true,
                    message: messages.t('trips.destionation_required')
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={messages.t('trips.comment')}
                name="comment"
                rules={[
                  {
                    required: true,
                    message: messages.t('trips.comment_required')
                  }
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label={messages.t('trips.start_end_date')}
                name="start_end_date"
                rules={[
                  {
                    required: true,
                    message: messages.t('trips.start_end_date_required')
                  }
                ]}>
                <RangePicker />
              </Form.Item>


              {isAdmin(props.user) ? (
                <Form.Item label={messages.t('users.user_id')} name="user_id">
                  <Select
                    key={232323}
                    showSearch
                    filterOption={false}
                    defaultActiveFirstOption={true}
                    labelInValue={true}
                    showArrow={false}
                    notFoundContent={null}
                    placeholder={messages.t('users.user_id')}
                  >
                    {users.map((x) => {
                      return (
                        <Select.Option key={x.id}>{x.name}</Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              ) : (
                ''
              )}
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {messages.t('general.submit')}
                </Button>
              </Form.Item>
            </Form>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

TripWizard.propTypes = {
  match: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  location: PropTypes.object,
  history: PropTypes.object,
  startDashboardLoading: PropTypes.func,
  stopDashboardLoading: PropTypes.func,
  user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  startDashboardLoading,
  stopDashboardLoading
};

export default connect(mapStateToProps, mapActionsToProps)(TripWizard);
