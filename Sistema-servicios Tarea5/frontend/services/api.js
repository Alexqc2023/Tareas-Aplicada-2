import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

async function request(path, options = {}) {
  const headers = {
    'Accept': 'application/json',
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.auth) {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      throw new Error('Sesión no iniciada');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401 && options.auth) {
    await AsyncStorage.multiRemove(['token', 'rol']);
    router.replace('/login');
    throw new Error('Tu sesion ha expirado. Inicia sesion nuevamente.');
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Error ${response.status}`);
  }

  return data;
}

export const api = {
  registro: (body) => request('/auth/registro', { method: 'POST', body }),

  login: (body) => request('/auth/login', { method: 'POST', body }),

  getServicios: () => request('/servicios', { method: 'GET', auth: true }),

  crearServicio: (body) => request('/servicios', { method: 'POST', body, auth: true }),

  eliminarServicio: (id) => request(`/servicios/${id}`, { method: 'DELETE', auth: true }),

  editarServicio: (id, body) => request(`/servicios/${id}`, { method: 'PUT', body, auth: true }),
};
