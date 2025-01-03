import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AxiosClient = axios.create({
  baseURL: 'https://sponge-climbing-adder.ngrok-free.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

AxiosClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

export default AxiosClient;
