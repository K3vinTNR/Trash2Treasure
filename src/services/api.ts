// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to make API calls
const apiCall = async (
  endpoint: string,
  method: string = 'GET',
  body?: any,
  requiresAuth: boolean = false
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiCall('/auth/login', 'POST', { email, password });
    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  register: async (userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
  }) => {
    return await apiCall('/auth/register', 'POST', userData);
  },

  logout: async () => {
    try {
      await apiCall('/auth/logout', 'POST', {}, true);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return await apiCall('/user/profile', 'GET', undefined, true);
  },

  updateProfile: async (userData: {
    full_name: string;
    phone?: string;
    address?: string;
  }) => {
    return await apiCall('/user/profile', 'PUT', userData, true);
  },

  getPointsHistory: async () => {
    return await apiCall('/user/points-history', 'GET', undefined, true);
  },

  addPoints: async (points: number, description: string, waste_kg?: number) => {
    return await apiCall('/user/add-points', 'POST', { points, description, waste_kg }, true);
  },

  getTransactions: async () => {
    return await apiCall('/user/transactions', 'GET', undefined, true);
  },
};

// Rewards API
export const rewardsAPI = {
  getAll: async () => {
    return await apiCall('/rewards', 'GET', undefined, true);
  },

  getById: async (id: number) => {
    return await apiCall(`/rewards/${id}`, 'GET', undefined, true);
  },

  redeem: async (reward_id: number, delivery_address: string, notes?: string) => {
    return await apiCall('/rewards/redeem', 'POST', { reward_id, delivery_address, notes }, true);
  },
};

// Reminders API
export const remindersAPI = {
  getAll: async () => {
    return await apiCall('/reminders', 'GET', undefined, true);
  },

  create: async (reminderData: {
    title: string;
    description?: string;
    reminder_time: string;
    reminder_days: string[];
  }) => {
    return await apiCall('/reminders', 'POST', reminderData, true);
  },

  update: async (id: number, reminderData: {
    title: string;
    description?: string;
    reminder_time: string;
    reminder_days: string[];
    is_active: boolean;
  }) => {
    return await apiCall(`/reminders/${id}`, 'PUT', reminderData, true);
  },

  delete: async (id: number) => {
    return await apiCall(`/reminders/${id}`, 'DELETE', undefined, true);
  },

  toggle: async (id: number) => {
    return await apiCall(`/reminders/${id}/toggle`, 'PATCH', {}, true);
  },
};

// QR Scan API
export const qrAPI = {
  scan: async (qrCode: string, location?: string) => {
    return await apiCall('/qr/scan', 'POST', { qr_code: qrCode, location }, true);
  },

  getMyRewards: async () => {
    return await apiCall('/qr/my-rewards', 'GET', undefined, true);
  },

  getScanHistory: async (limit = 50) => {
    return await apiCall(`/qr/scan-history?limit=${limit}`, 'GET', undefined, true);
  },

  redeemUserReward: async (rewardId: number) => {
    return await apiCall(`/qr/redeem/${rewardId}`, 'POST', {}, true);
  },
};

// Helper to check if user is logged in
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Helper to get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
