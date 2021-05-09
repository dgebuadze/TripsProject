import React from 'react';
import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import Logo from '../../components/ui/Logo/Logo';
import { messages, testStrongPassword } from '../../common/utils';
import { Link } from 'react-router-dom';
import { LOGIN_PAGE_URI } from '../../common/pages';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { registerUser } from '../../state/actions/userActions';
import { connect } from 'react-redux';
import { PasswordInput } from 'antd-password-input-strength';

export const Register = (props) => {
  const onFinish = (values) => {
    props.registerUser(values, props.history);
  };

  return (
    <>
      <Helmet>
        <title>{messages.t('register.title')}</title>
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
              data-test={'registerForm'}
              name="registerForm"
              layout={'vertical'}
              onFinish={onFinish}
            >
              <Form.Item
                label={messages.t('register.fullname')}
                name="name"
                rules={[
                  {
                    required: true,
                    message: messages.t('register.fullname_required')
                  },
                  {
                    min: 4,
                    message: messages.t('register.min_fullname')
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={messages.t('forms.email')}
                name="email"
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
                  },
                  {
                    min: 6,
                    message: messages.t('register.min_password')
                  },
                  () => ({
                    validator(rule, value) {
                      if (testStrongPassword(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        messages.t('register.password_too_weak')
                      );
                    }
                  })
                ]}
              >
                <PasswordInput />
              </Form.Item>
              <Form.Item
                label={messages.t('register.confirm_password')}
                name="password_confirmation"
                rules={[
                  {
                    required: true,
                    message: messages.t('register.confirm_password_required')
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        messages.t('register.passwords_do_not_match')
                      );
                    }
                  })
                ]}
              >
                <Input.Password autoComplete="on" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  data-test={'registerSubmit'}
                >
                  {messages.t('general.submit')}
                </Button>
              </Form.Item>
            </Form>
            <Space size={15}>
              <Link to={LOGIN_PAGE_URI}>{messages.t('login.title')}</Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
};

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  history: PropTypes.object
};

const mapActionsToProps = {
  registerUser
};

export default connect(null, mapActionsToProps)(Register);
