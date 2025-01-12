import axios from 'axios';
import { SERVER_URL } from '../customValue';

export default axios.create({
    baseURL: SERVER_URL
});

export const axiosPrivate = axios.create({
    baseURL: SERVER_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});