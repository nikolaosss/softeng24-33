import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/admin', // Backend URL and port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
