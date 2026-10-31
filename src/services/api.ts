import axios from 'axios';

const BASE_URL = 'https://api-teste.ateliedepropaganda.com.br'; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  config.headers['X-Candidato'] = 'FE-WN2PDD'; 
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);