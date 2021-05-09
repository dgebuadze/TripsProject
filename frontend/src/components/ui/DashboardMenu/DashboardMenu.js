import React from 'react';
import {
  PROFILE_PAGE_URI,
  TRIPS_PAGE_URI,
  USERS_PAGE_URI
} from '../../../common/pages';
import {
  FieldTimeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  dashboardLink,
  isAdmin,
  isManagerOrAdmin,
  messages,
  stripLeadingSlash
} from '../../../common/utils';
import { Button, Menu, Popconfirm } from 'antd';
import { MENU_BREAK_POINT } from '../../../common/constants';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../../state/actions/userActions';
import styles from './DashboardMenu.module.css';
import { withRouter } from 'react-router-dom';

const { SubMenu } = Menu;

const DashboardMenu = ({ history, user, logoutUser, collapsed, location }) => {
  const navigate = (item) => {
    history.push(item.key);
  };

  //determine which menu items should be open/selected
  let defaultOpenKeys = [];
  if (window.innerWidth >= MENU_BREAK_POINT) {
    defaultOpenKeys = [history.location.pathname.split('/')[2]];
  }

  let defaultSelectedKeys = [history.location.pathname];

  return (
    <>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={defaultSelectedKeys}
        selectedKeys={[location.pathname]}
        defaultOpenKeys={defaultOpenKeys}
        onClick={navigate}
      >
        <SubMenu
          key={stripLeadingSlash(TRIPS_PAGE_URI)}
          icon={<FieldTimeOutlined />}
          title={messages.t('trips.title')}
        >
          <Menu.Item key={dashboardLink(TRIPS_PAGE_URI)}>
            {messages.t('general.title_list')}
          </Menu.Item>
          <Menu.Item key={dashboardLink(TRIPS_PAGE_URI + '/add')}>
            {messages.t('general.add_new')}
          </Menu.Item>
          {isAdmin(user) ? (
            <Menu.Item key={dashboardLink(TRIPS_PAGE_URI + '/all')}>
              {messages.t('trips.title_all')}
            </Menu.Item>
          ) : (
            ''
          )}
        </SubMenu>
        {isManagerOrAdmin(user) ? (
          <SubMenu
            key={stripLeadingSlash(USERS_PAGE_URI)}
            icon={<UserOutlined />}
            title={messages.t('users.title')}
          >
            <Menu.Item key={dashboardLink(USERS_PAGE_URI)}>
              {messages.t('general.title_list')}
            </Menu.Item>
            <Menu.Item key={dashboardLink(USERS_PAGE_URI + '/add')}>
              {messages.t('general.add_new')}
            </Menu.Item>
          </SubMenu>
        ) : (
          ''
        )}
        <Menu.Item
          key={dashboardLink(PROFILE_PAGE_URI)}
          icon={<SettingOutlined />}
        >
          {messages.t('users.profile')}
        </Menu.Item>
      </Menu>
      <div className={styles.logoutButton}>
        <Popconfirm
          title={messages.t('general.confirm')}
          onConfirm={() => logoutUser()}
          okText={messages.t('general.yes')}
          cancelText={messages.t('general.no')}
        >
          <Button danger icon={<LogoutOutlined />}>
            {!collapsed ? messages.t('users.log_out') : ''}
          </Button>
        </Popconfirm>
      </div>
    </>
  );
};

DashboardMenu.propTypes = {
  history: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  collapsed: PropTypes.bool,
  user: PropTypes.object,
  location: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  logoutUser
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withRouter(DashboardMenu));
