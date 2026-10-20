const API_URL = 'https://aplicada2-iterables-alexis-queza-production.up.railway.app';

export type Tarea = {
  id?: number;

  titulo?: string;

  descripcion?: string;
  
  completada?: boolean;
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method || 'GET';
  
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };


  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `Error ${response.status}: No se pudo procesar la solicitud`;
      throw new Error(errorMsg);
    }

    return data as T;
  } catch (error: any) {
    if (error.message === 'Network request failed') {
      throw new Error('Error de conexion con el servidor. Verifica tu acceso a internet.');
    }
    throw error;
  }
}

export const api = {
  registro: (datos: { nombre: string; email: string; password: string; rol?: string }) =>
    request<any>('/auth/registro', { method: 'POST', body: datos }),

  login: (credenciales: { email: string; password: string }) =>
    request<{ token: string }>('/auth/login', { method: 'POST', body: credenciales }),

  getTareas: (token: string) =>
    request<Tarea[]>('/v2/tareas', { method: 'GET', token }),
};