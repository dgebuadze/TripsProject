import React from 'react';
import PropTypes from 'prop-types';
import styles from './MainLayout.module.css';
import { connect } from 'react-redux';
import { Spin } from 'antd';

const MainLayout = (props) => {
  const {
    UI: { loading }
  } = props;
  return (
    <Spin size="large" spinning={loading}>
      <div className={styles.mainContainer}>{props.children}</div>
    </Spin>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI
});

export default connect(mapStateToProps)(MainLayout);
