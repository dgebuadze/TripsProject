import { axiosMain, axiosAuth } from '../instances';

export const POST = axiosMain.post;
export const GET = axiosMain.get;
export const PUT = axiosMain.put;
export const PATCH = axiosMain.patch;

export const POST_AUTH = axiosAuth.post;
