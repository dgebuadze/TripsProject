import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './DashboardLayout.module.css';
import 'antd/dist/antd.css';
import { Layout, Spin } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Logo from '../../components/ui/Logo/Logo';
import DashboardMenu from '../../components/ui/DashboardMenu/DashboardMenu';
import { MENU_BREAK_POINT } from '../../common/constants';
import { connect } from 'react-redux';

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children, history, UI }) => {
  const [collapsed, setCollapsed] = useState(
    window.innerWidth < MENU_BREAK_POINT
  );
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    window.addEventListener('resize', () => {
      setCollapsed(window.innerWidth < MENU_BREAK_POINT);
    });
  }, []);
  return (
    <Layout className={styles.mainContainer}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Logo width={collapsed ? 70 : 150} align={'center'} />
        <DashboardMenu history={history} collapsed={collapsed} />
      </Sider>
      <Layout className={styles.siteLayout}>
        <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: styles.trigger,
              onClick: toggle
            }
          )}
        </Header>
        <Content
          className={styles.siteLayoutBackground}
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280
          }}
        >
          <Spin spinning={UI.dashboardLoading}>{children}</Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  UI: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI
});

export default connect(mapStateToProps)(DashboardLayout);
