const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiError {
  err: string;
}

interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

async function request<T>(endpoint: string, options: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.err || 'An unknown API error occurred');
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

const register = (
  username: string,
  password: string
): Promise<AuthResponse> => {
  return request('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
};

const login = (username: string, password: string): Promise<AuthResponse> => {
  return request('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
};

export interface PublicProfileResponse {
  username: string;
  links: { title: string; url: string }[];
}

const getUserByUsername = async (
  username: string
): Promise<PublicProfileResponse> => {
  return request<PublicProfileResponse>(
    `/users/${encodeURIComponent(username)}`,
    {
      method: 'GET',
    }
  );
};

const apiService = {
  register,
  login,
  getUserByUsername,
};

export default apiService;
