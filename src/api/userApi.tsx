import { User } from '../types';

const API_BASE_URL = 'http://localhost:8000/users';

const makeRequest = async (endpoint: string, method: string = 'GET', body?: any) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Request failed');
  }

  return response.json();
};

// Вспомогательная функция
const getCurrentUserId = (): number => {
  const id = localStorage.getItem('userId');
  if (!id) throw new Error('User ID not found in localStorage');
  return parseInt(id, 10);
};

export const userApi = {
  getCurrentUser: async (): Promise<any> => {
    const userId = getCurrentUserId();
    return await makeRequest(`/${userId}`);
  },

  getUserById: async (id: number): Promise<any> => {
    return await makeRequest(`/${id}`);
  },

  updateCurrentUser: async (data: any): Promise<any> => {
    const userId = getCurrentUserId();
    return await makeRequest(`/${userId}`, 'PUT', data);
  },

  getAllUsers: async (): Promise<User[]> => {
    return await makeRequest('');
  },
  
  searchUsers: async (query: string): Promise<User[]> => {
    return await makeRequest(`/search?query=${encodeURIComponent(query)}`);
  }
};
