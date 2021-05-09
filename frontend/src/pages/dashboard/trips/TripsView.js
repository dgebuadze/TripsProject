import React, { useEffect, useState } from 'react';
import { getTrip } from './actions';
import { connect } from 'react-redux';
import {
  startDashboardLoading,
  stopDashboardLoading
} from '../../../state/actions/uiActions';
import { Card, Col, Row } from 'antd';
import styles from './Trip.module.css';
import PropTypes from 'prop-types';
import {
  messages
} from '../../../common/utils';
import { Helmet } from 'react-helmet';
import { Tag } from 'antd';

export const TripsView = (props) => {
  const { match, startDashboardLoading, stopDashboardLoading } = props;
  const [data, setData] = useState({});

  useEffect(() => {
    startDashboardLoading();
    let mounted = true;

    getTrip(match.params.tripId).then((res) => {
      if (!mounted) return;
      setData(res.data);
      stopDashboardLoading();
    });
    return () => {
      mounted = false;
      stopDashboardLoading();
    };
  }, [match.params.tripId,startDashboardLoading,stopDashboardLoading]);



  return (
    <>
      <Helmet>
        <title>{messages.t('trips.title_page_view')}</title>
      </Helmet>
      <Row type={'flex'} justify={'left'} aling={'left'}>
        <Col xs={24} md={10}>
          <Card
            bordered={false}
            title={"Trip To " + data.destination}
            hidden={!data.destination}
            data-test={'TripsViewCard'}
          >
            <div className={styles.tripItem}>
              {messages.t('trips.comment')}:
              <br />
              <p style={{color:'#000'}}>
                {data.comment}
              </p>
            </div>
            <div className={styles.tripItem}>
              {messages.t('trips.start_at')}: <Tag>{data.start_at}</Tag>
            </div>
            <div className={styles.tripItem}>
              {messages.t('trips.end_at')}: <Tag>{data.end_at}</Tag>
            </div>
            {data.start_day > 0 ? (
              <div className={styles.tripItem}>
                {messages.t('trips.days_left')}: <tag>{data.start_day}</tag>

              </div>
            ):''}

          </Card>
        </Col>
      </Row>
    </>
  );
};

TripsView.propTypes = {
  match: PropTypes.object,
  startDashboardLoading: PropTypes.func,
  stopDashboardLoading: PropTypes.func
};

const mapActionsToProps = {
  startDashboardLoading,
  stopDashboardLoading
};

export default connect(null, mapActionsToProps)(TripsView);
