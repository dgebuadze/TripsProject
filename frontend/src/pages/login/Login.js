import React from 'react';
import { Form, Input, Button, Col, Row, Card, Space } from 'antd';
import PropTypes from 'prop-types';
import Logo from '../../components/ui/Logo/Logo';
import { loginUser } from '../../state/actions/userActions';
import { connect } from 'react-redux';
import { messages } from '../../common/utils';
import { Link } from 'react-router-dom';
import { REGISTER_PAGE_URI } from '../../common/pages';
import { Helmet } from 'react-helmet';

export const Login = (props) => {
  const onFinish = (values) => {
    props.loginUser(values, props.history);
  };

  return (
    <>
      <Helmet>
        <title>{messages.t('login.title')}</title>
      </Helmet>
      <Row
        type={'flex'}
        justify={'center'}
        aling={'middle'}
        style={{ marginTop: '20px' }}
      >
        <Col xs={24} md={10}>
          <Card>
            <Logo width={300} align={'center'} />
            <Form
              name="loginForm"
              layout={'vertical'}
              data-test={'loginForm'}
              onFinish={onFinish}
            >
              <Form.Item
                label={messages.t('forms.email')}
                name="username"
                rules={[
                  {
                    required: true,
                    message: messages.t('login.email_required')
                  },
                  {
                    type: 'email',
                    message: messages.t('login.email_invalid')
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={messages.t('forms.password')}
                name="password"
                rules={[
                  {
                    required: true,
                    message: messages.t('login.password_required')
                  }
                ]}
              >
                <Input.Password autoComplete="on" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  data-test={'loginSubmit'}
                >
                  {messages.t('general.submit')}
                </Button>
              </Form.Item>
            </Form>
            <Space size={15}>
              <Link to={REGISTER_PAGE_URI}>{messages.t('register.title')}</Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  history: PropTypes.object
};

const mapActionsToProps = {
  loginUser
};

export default connect(null, mapActionsToProps)(Login);
