import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Divider, Input, Space, Table } from 'antd';
import { PAGE_OPTIONS, PAGE_SIZE } from '../../../common/constants';
import { deleteUser, getUsers } from './actions';
import PropTypes from 'prop-types';
import {
  convertPagination,
  dashboardLink,
  getInitialTablePagination,
  showSuccess,
  updateAntdTableFiltersUrl
} from '../../../common/utils';
import { messages } from '../../../common/utils';
import { getColumns } from './columns';
import qs from 'qs';
import { Button } from 'antd';
import {
  ClearOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { USERS_PAGE_URI } from '../../../common/pages';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

let prevParams = null;

export const UsersList = ({ history, user }) => {
  const processDelete = (id) => {
    setLoading(true);
    deleteUser(id)
      .then(() => {
        showSuccess(messages.t('general.operation_success'));
        fetchData(prevParams);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const resetPagination = getInitialTablePagination();
  let canceled = false;
  const initialColumns = getColumns(messages, processDelete, user);
  const [columns, setColumns] = useState([...initialColumns]);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState(resetPagination);
  const [loading, setLoading] = useState(true);
  const [prevSorter, setSorter] = useState(null);
  const [search, setSearch] = useState(undefined);
  const [filtersReset, setFiltersReset] = useState(false);
  const [sorterReset, setSorterReset] = useState(false);

  useEffect(() => {
    const uriParams = qs.parse(history.location.search, {
      ignoreQueryPrefix: true
    });
    const currentPage = uriParams.page ? parseInt(uriParams.page) : 1;
    const initialPagination = {
      current: currentPage,
      pageSize: PAGE_SIZE,
      pageSizeOptions: PAGE_OPTIONS
    };
    const sortby = uriParams.sortby || undefined;
    const order = uriParams.order || undefined;
    const search = uriParams.search || undefined;
    const role = uriParams.role || undefined;
    if ((order && sortby) || role) {
      const tempColumns = [...columns];
      if (order && sortby) {
        const sortColumn = tempColumns.filter((x) => x.dataIndex === sortby)[0];
        sortColumn.sortOrder = order === 'asc' ? 'ascend' : 'descend';
      }
      if (role) {
        const roleColumn = tempColumns.filter((x) => x.dataIndex === 'role')[0];
        roleColumn.filtered = true;
        roleColumn.filteredValue = role.split(',');
      }
      setColumns(tempColumns);
    }

    fetchData({ pagination: initialPagination, sortby, order, search, role });

    return () => {
      canceled = true;
    };
  }, []);

  const processSearch = () => {
    const options = { ...prevParams, search };
    options.pagination = { ...resetPagination };
    fetchData(options);
  };

  const resetSearch = () => {
    setSearch(undefined);
    if (prevParams.search) {
      fetchData({ ...prevParams, search: undefined });
    }
  };

  const fetchData = (params = {}) => {
    setLoading(true);
    const data = convertPagination({ ...params });
    getUsers(data)
      .then((response) => {
        if (canceled) return;
        setLoading(false);
        setTableData(response.data);
        setPagination({
          ...params.pagination,
          total: response.meta ? response.meta.total : 0
        });
        setSorter({ sortby: params.sortby, order: params.order });
        prevParams = params;
        updateAntdTableFiltersUrl(params, history);
      })
      .catch(() => {
        if (!canceled) {
          setLoading(false);
        }
      });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const options = {
      pagination: pagination,
      sortby: sorter.order ? sorter.field : undefined,
      order: sorter.order
        ? sorter.order === 'ascend'
          ? 'asc'
          : 'desc'
        : undefined
    };

    //semi-controled table filter
    if (!filtersReset) {
      const tempColumns = [...columns];
      const roleColumn = tempColumns.filter((x) => x.dataIndex === 'role')[0];
      if (!roleColumn.filteredValue) {
        setFiltersReset(true);
      }
      if (
        roleColumn.filteredValue &&
        (!filters.role ||
          roleColumn.filteredValue.toString() !== filters.role.toString())
      ) {
        delete roleColumn.filtered;
        delete roleColumn.filteredValue;
        setColumns(tempColumns);
        setFiltersReset(true);
      }
    }

    if (filters.role) {
      let roles = '';
      for (let role of filters.role) {
        roles += `${role},`;
      }
      roles = roles.substring(0, roles.length - 1);
      options.role = roles;
    }
    if (
      options.order !== prevSorter.order ||
      options.sortby !== prevSorter.sortby
    ) {
      if (!sorterReset) {
        const tempColumns = [...columns];
        const sortColumn = tempColumns.filter(
          (x) => x.dataIndex === prevSorter.sortby
        )[0];
        if (sortColumn && sortColumn.sortOrder) {
          delete sortColumn.sortOrder;
          setColumns(tempColumns);
        }
        setSorterReset(true);
      }
      options.pagination = { ...resetPagination };
    }
    if (search) {
      options.search = search;
    }
    fetchData(options);
  };

  return (
    <>
      <Helmet>
        <title>{messages.t('users.title_page_list')}</title>
      </Helmet>
      <div className={'scrollable-space'}>
        <Space className={'table-filters-container'}>
          <Space>
            <Input
              disabled={loading}
              placeholder={messages.t('users.search_title')}
              value={search}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  processSearch();
                }
              }}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <Button
              icon={<ClearOutlined />}
              disabled={loading}
              onClick={resetSearch}
            />
            <Button disabled={loading} onClick={processSearch}>
              {messages.t('general.search')}
            </Button>
          </Space>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              disabled={loading}
              onClick={() => fetchData(prevParams)}
            >
              {messages.t('general.reload')}
            </Button>
            <Link to={dashboardLink(USERS_PAGE_URI + '/add')}>
              <Button
                icon={<PlusOutlined />}
                disabled={loading}
                type={'primary'}
              >
                {messages.t('general.add_new')}
              </Button>
            </Link>
          </Space>
        </Space>
      </div>
      <Divider />
      <Table
        data-test={'usersTable'}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={tableData}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        fetchData={fetchData}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
});

UsersList.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object
};

export default connect(mapStateToProps)(UsersList);
