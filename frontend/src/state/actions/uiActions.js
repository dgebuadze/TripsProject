import { LOADING_DASHBOARD_UI, STOP_LOADING_DASHBOARD_UI } from '../types';

export const startDashboardLoading = () => {
  return {
    type: LOADING_DASHBOARD_UI
  };
};

export const stopDashboardLoading = () => {
  return {
    type: STOP_LOADING_DASHBOARD_UI
  };
};
