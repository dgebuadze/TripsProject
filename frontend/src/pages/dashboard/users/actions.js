import { axiosMain as axios } from '../../../common/instances';
import {
  ENDPOINT_DELETE_USER,
  ENDPOINT_GET_USER,
  ENDPOINT_GET_USERS,
  ENDPOINT_SAVE_USER,
  ENDPOINT_UPDATE_USER
} from '../../../common/endpoints';
import { unexpectedErrorHandler } from '../../../common/utils';

export const getUsers = (params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(ENDPOINT_GET_USERS, { params })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};

export const getUser = (user_id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(ENDPOINT_GET_USER(user_id))
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};

export const saveUser = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(ENDPOINT_SAVE_USER, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject(-1);
      });
  });
};

export const updateUser = (id, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(ENDPOINT_UPDATE_USER(id), data)
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject(-1);
      });
  });
};

export const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(ENDPOINT_DELETE_USER(id))
      .then(() => {
        resolve(1);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};
