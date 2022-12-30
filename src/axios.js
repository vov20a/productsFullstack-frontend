import axios from 'axios';

const instance = axios.create({
  //baseURL: 'http://localhost:4444',
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  // console.log(config.headers.Authirization);
  return config;
});

export default instance;
