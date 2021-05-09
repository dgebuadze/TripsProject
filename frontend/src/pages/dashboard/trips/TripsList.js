import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Divider, Input, Space, Table } from 'antd';
import { PAGE_OPTIONS, PAGE_SIZE } from '../../../common/constants';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  convertPagination,
  dashboardLink,
  getInitialTablePagination,
  showSuccess,
  updateAntdTableFiltersUrl
} from '../../../common/utils';
import { deleteTrip, getAlltrips, gettrips } from './actions';
import { messages } from '../../../common/utils';
import { getColumns } from './columns';
import qs from 'qs';
import { Button } from 'antd';
import {DatePicker} from 'antd'
import {
  ClearOutlined,
  PlusOutlined,
  ReloadOutlined,
  FileSearchOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TRIPS_PAGE_URI, USERS_PAGE_URI } from '../../../common/pages';
import { Helmet } from 'react-helmet';

let prevParams = null;

const { RangePicker } = DatePicker;

export const TripsList = ({ user, history, match, action }) => {
  const processDelete = (id) => {
    setLoading(true);
    deleteTrip(id)
      .then(() => {
        showSuccess(messages.t('general.operation_success'));
        fetchData(prevParams);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const resetPagination = getInitialTablePagination();
  let abort = false;
  const initialColumns = getColumns(messages, processDelete);
  const [columns, setColumns] = useState([...initialColumns]);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState(resetPagination);
  const [loading, setLoading] = useState(true);
  const [prevSorter, setSorter] = useState(null);
  const [search, setSearch] = useState(undefined);
  const [dateFilter, setDateFilter] = useState(undefined);

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
    const date_from = uriParams.date_from || undefined;
    const date_to = uriParams.date_to || undefined;
    const search = uriParams.search || undefined;
    if (order && sortby) {
      const tempColumns = [...columns];
      const filteredColumn = tempColumns.filter(
        (x) => x.dataIndex === sortby
      )[0];
      filteredColumn.sortOrder = order === 'asc' ? 'ascend' : 'descend';
      setColumns(tempColumns);
    }

    fetchData({ pagination: initialPagination, sortby, order, search, date_from, date_to });

    return () => {
      abort = true;
    };
  }, []);

  const processSearch = () => {
    const options = { ...prevParams, search };
    options.pagination = { ...resetPagination };
    fetchData(options);
  };


  const resetSearch = () => {
    setSearch(undefined);
    setDateFilter(undefined);

    fetchData({ ...prevParams, search: undefined, date_from: undefined, date_to: undefined });

  };

  const fetchData = (params = {}) => {
    setLoading(true);
    const data = convertPagination({ ...params });
    let id = user.id;
    if (match.params.userId) {
      id = match.params.userId;
    }

    let fetchMethod = () => gettrips(id, data);
    if (action && action === 'all') {
      fetchMethod = () => getAlltrips(data);
    }

    fetchMethod()
      .then((response) => {
        if (abort) return;
        setTableData(response.data);
        setLoading(false);
        setPagination({
          ...params.pagination,
          total: response.meta ? response.meta.total : 0
        });
        setSorter({ sortby: params.sortby, order: params.order });
        prevParams = params;
        updateAntdTableFiltersUrl(params, history);
      })
      .catch(() => {
        if (!abort) {
          setLoading(false);
        }
      });
  };

  const processDateFilter = (dates, dateStrings) => {
    let dateFilter = {
      'date_from': dateStrings[0],
      'date_to': dateStrings[1]
    };
    const options = { ...prevParams, ...dateFilter };
    options.pagination = { ...resetPagination };


    setDateFilter(dates);

    fetchData(options);
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
    if (
      options.order !== prevSorter.order ||
      options.sortby !== prevSorter.sortby
    ) {
      setColumns(initialColumns);
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
        <title>{messages.t('trips.title_page_list')}</title>
      </Helmet>
      <div className={'scrollable-space'}>
        <Space className={'table-filters-container'}>
          <Space>
            <Input
              disabled={loading}
              placeholder={messages.t('trips.search_title')}
              value={search}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  processSearch();
                }
              }}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<SearchOutlined/>}
            />
            <RangePicker  allowClear={true} value={dateFilter !== "" ? dateFilter : ""} onChange={processDateFilter} />
            <Button
              icon={<ClearOutlined/>}
              disabled={loading}
              onClick={resetSearch}
            />
            <Button disabled={loading} onClick={processSearch}>
              {messages.t('general.search')}
            </Button>
          </Space>
          <Space>
            <Button
              icon={<ReloadOutlined/>}
              disabled={loading}
              onClick={() => fetchData(prevParams)}
            >
              {messages.t('general.reload')}
            </Button>
            <Link
              to={
                !match.params.userId
                  ? dashboardLink(TRIPS_PAGE_URI + '/add')
                  : dashboardLink(
                  USERS_PAGE_URI +
                  `/${match.params.userId}` +
                  TRIPS_PAGE_URI +
                  '/add'
                  )
              }
            >
              <Button
                icon={<PlusOutlined/>}
                disabled={loading}
                type={'primary'}
              >
                {messages.t('general.add_new')}
              </Button>
            </Link>
          </Space>

          {history.location.pathname === '/dashboard/trips' ? (
            <Space>
              <Link
                to={
                  !match.params.userId
                    ? dashboardLink(TRIPS_PAGE_URI + '/next-month')
                    : dashboardLink(
                    USERS_PAGE_URI +
                    `/${match.params.userId}` +
                    TRIPS_PAGE_URI +
                    '/add'
                    )
                }
              >
                <Button
                  icon={<FileSearchOutlined/>}
                  disabled={loading}
                  type={'primary'}
                >
                  {messages.t('trips.view_monthly_trip')}
                </Button>
              </Link>
            </Space>
          ):''}
        </Space>

      </div>
      <Divider/>
      <Table
        data-test={'tripsTable'}
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

TripsList.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object,
  match: PropTypes.object,
  user_id: PropTypes.number,
  action: PropTypes.string
};

export default connect(mapStateToProps)(TripsList);
