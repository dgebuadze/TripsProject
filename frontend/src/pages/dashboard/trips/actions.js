import { axiosMain as axios } from '../../../common/instances';
import {
  ENDPOINT_NEXT_MONTH_TRIPS,
  ENDPOINT_DELETE_TRIP,
  ENDPOINT_GET_TRIP,
  ENDPOINT_GET_TRIPS,
  ENDPOINT_GET_TRIPS_USER,
  ENDPOINT_SAVE_TRIP,
  ENDPOINT_UPDATE_TRIP
} from '../../../common/endpoints';
import { unexpectedErrorHandler } from '../../../common/utils';

export const gettrips = (user_id, params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(ENDPOINT_GET_TRIPS_USER(user_id), { params })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};

export const getAlltrips = (params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(ENDPOINT_GET_TRIPS, { params })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};

export const getTrip = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(ENDPOINT_GET_TRIP(id))
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};

export const getTripsForNextMonth = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(ENDPOINT_NEXT_MONTH_TRIPS)
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};

export const saveTrip = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(ENDPOINT_SAVE_TRIP, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject(-1);
      });
  });
};

export const updateTrip = (id, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(ENDPOINT_UPDATE_TRIP(id), data)
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject(-1);
      });
  });
};

export const deleteTrip = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(ENDPOINT_DELETE_TRIP(id))
      .then(() => {
        resolve(1);
      })
      .catch(() => {
        reject(-1);
      });
  });
};
