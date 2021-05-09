import { dashboardLink } from '../../../common/utils';
import { Button, Space, Tag, Popconfirm } from 'antd';
import React from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TRIPS_PAGE_URI } from '../../../common/pages';

export const getColumns = (messages, deleteAction) => [
  {
    title: messages.t('trips.destination'),
    dataIndex: 'destination',
    sorter: true,
    render: (destination) => `${destination}`,
    width: '20%'
  },
  {
    title: messages.t('trips.comment'),
    dataIndex: 'comment',
    sorter: true,
    render: (comment) => `${comment}`,
    width: '20%'
  },
  {
    title: messages.t('trips.start_at'),
    dataIndex: 'start_at',
    sorter: true,
    render: (date) => {
      return <Tag color={'orange'}>{date}</Tag>;
    },
    width: '15%'
  },
  {
    title: messages.t('trips.end_at'),
    dataIndex: 'end_at',
    sorter:true,
    render: (date) => {
      return <Tag color={'orange'}>{date}</Tag>;
    },
    width: '15%'
  },
  {
    title: messages.t('trips.days_left'),
    dataIndex: 'start_day',
    render: (days) => {
      if(days > 0){
        return <Tag color={'green'}>{days}</Tag>;
      }else{
        return '';
      }

    },
    width: '15%'
  },
  {
    title: messages.t('general.actions'),
    dataIndex: 'id',
    render: (id) => {
      return (
        <Space>
          <Link to={dashboardLink(TRIPS_PAGE_URI + `/view/${id}`)}>
            <Button icon={<SearchOutlined />} />
          </Link>
          <Link
            to={{
              pathname: dashboardLink(TRIPS_PAGE_URI + `/edit/${id}`),
              referrer: window.location.pathname
            }}
          >
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title={messages.t('general.confirm')}
            onConfirm={() => deleteAction(id)}
            okText={messages.t('general.yes')}
            cancelText={messages.t('general.no')}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      );
    },
    width: '20%'
  }
];
