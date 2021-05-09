import React, { useEffect, useState } from 'react';
import { getTripsForNextMonth } from './actions';
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

export const TripsView = (props) => {
  const { startDashboardLoading, stopDashboardLoading } = props;
  const [data, setData] = useState({});

  useEffect(() => {
    startDashboardLoading();
    let mounted = true;

    getTripsForNextMonth().then((res) => {
      if (!mounted) return;
      setData(res.data);
      stopDashboardLoading();
    });
    return () => {
      mounted = false;
      stopDashboardLoading();
    };

  }, [startDashboardLoading,stopDashboardLoading]);




  return (
    <>
      <Helmet>
        <title>{messages.t('trips.view_monthly_trip')}</title>
      </Helmet>
      <Row type={'flex'} justify={'left'} aling={'left'}>
        <Col xs={24} md={10}>
          <Card
            bordered={false}
            title={messages.t('trips.view_monthly_trip')}
            data-test={'TripsViewCard'}
          >
            <div className={styles.tripItem}>
              {data.length > 0 ? (
                <table style={{ width: '100%' }}>
                  <thead>
                  <tr>
                    <td>Destination</td>
                    <td>Start Date</td>
                    <td>End Date</td>
                    <td>Comment</td>
                  </tr>
                  </thead>
                  <tbody>
                  {data.map((itm, index) => {
                    return (
                      <tr key={index}>
                        <td>{itm.destination}</td>
                        <td>{itm.start_at}</td>
                        <td>{itm.end_at}</td>
                        <td>{itm.comment}</td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              ):(
                <p>No Trips for next month!</p>
              )}

            </div>

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
