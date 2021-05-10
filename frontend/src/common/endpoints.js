export const ENDPOINT_AUTH_TOKEN = 'token';
export const ENDPOINT_GET_USER_INFO = 'auth/me';
export const ENDPOINT_REGISTER = 'auth/register';

export const ENDPOINT_GET_TRIPS = 'trips/all';
export const ENDPOINT_SAVE_TRIP = 'trips';
export const ENDPOINT_UPDATE_TRIP = (id) => `trips/${id}`;
export const ENDPOINT_DELETE_TRIP = (id) => `trips/${id}`;
export const ENDPOINT_GET_TRIPS_USER = (user_id) => `users/${user_id}/trips`;
export const ENDPOINT_GET_TRIP = (id) => `trips/${id}`;
export const ENDPOINT_NEXT_MONTH_TRIPS = 'trips/next-month';

export const ENDPOINT_GET_USERS = 'users';
export const ENDPOINT_SAVE_USER = 'users';
export const ENDPOINT_UPDATE_USER = (id) => `users/${id}`;
export const ENDPOINT_DELETE_USER = (id) => `users/${id}`;
export const ENDPOINT_GET_USER = (id) => `users/${id}`;
