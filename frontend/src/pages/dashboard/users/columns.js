import { dashboardLink, isAdmin } from '../../../common/utils';
import { Button, Space, Tag, Popconfirm } from 'antd';
import React from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  InsertRowAboveOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TRIPS_PAGE_URI, USERS_PAGE_URI } from '../../../common/pages';

export const getColumns = (messages, deleteAction, user) => [
  {
    title: messages.t('users.name'),
    dataIndex: 'name',
    sorter: true,
    render: (name) => `${name}`,
    width: '20%'
  },
  {
    title: messages.t('forms.email'),
    dataIndex: 'email',
    sorter: true,
    render: (email) => `${email}`,
    width: '20%'
  },
  {
    title: messages.t('users.registered_at'),
    dataIndex: 'created_at',
    sorter: true,
    render: (created_at) => `${created_at}`,
    width: '15%'
  },
  {
    title: messages.t('users.role'),
    dataIndex: 'role',
    render: (role) => {
      let color = 'blue';
      if (role === 'manager') color = 'orange';
      if (role === 'admin') color = 'red';
      return (
        <Tag color={color} style={{ width: '80px', textAlign: 'center' }}>
          {role.toUpperCase()}
        </Tag>
      );
    },
    filters: [
      { text: messages.t('users.role_admin'), value: 'admin' },
      { text: messages.t('users.role_manager'), value: 'manager' },
      { text: messages.t('users.role_user'), value: 'user' }
    ],
    width: '15%'
  },
  {
    title: messages.t('general.actions'),
    dataIndex: 'id',
    render: (id, obj) => {
      return (
        <Space>
          {isAdmin(user) ? (
            <Link
              to={dashboardLink(USERS_PAGE_URI + `/${id}` + TRIPS_PAGE_URI)}
            >
              <Button icon={<InsertRowAboveOutlined /> } />
            </Link>
          ) : (
            ''
          )}
          {obj.role === 'user' || (isAdmin(user) && obj.role === 'manager') ? (
            <>
              <Link to={dashboardLink(USERS_PAGE_URI + `/edit/${id}`)}>
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
            </>
          ) : (
            ''
          )}
        </Space>
      );
    },
    width: '20%'
  }
];
