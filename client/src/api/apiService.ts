// Set the base URL for all API requests using the environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// Define user type
interface User {
  id: number;
  username: string;
  theme_preference?: {
    theme: "light" | "dark" | "calm"
  }
}

// Define authentication response type
export interface AuthResponse {
  token: string;
  user: User;
}

// Define public profile response type
export interface PublicProfileResponse {
  username: string;
  links: { title: string; url: string }[];
}

// Define link type
export interface Link {
  id: number;
  title: string;
  url: string;
}

// Helper function for all fetch requests (handles errors, JSON parsing, etc.)
async function request<T>(endpoint: string, options: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, options);

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const message = isJson ? (await res.json())?.err : await res.text();
    throw new Error(message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null as T;
  return isJson ? res.json() : ((await res.text()) as unknown as T);
}

// Register a new user
const register = (
  username: string,
  password: string
): Promise<AuthResponse> => {
  return request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
};

// Log in an existing user
const login = (username: string, password: string): Promise<AuthResponse> => {
  return request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
};

// Fetch a user's public profile by username
const getUserByUsername = (
  username: string
): Promise<PublicProfileResponse> => {
  return request(`/users/${encodeURIComponent(username)}`, { method: "GET" });
};

// Helper to attach Authorization header using saved token
function getAuthHeaders(): HeadersInit {
  const storedAuth = localStorage.getItem("auth");
  let token: string | null = null;

  try {
    token = storedAuth ? JSON.parse(storedAuth)?.token : null;
  } catch {
    token = null;
  }

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// Fetch all saved links for the logged-in user
const getLinks = (): Promise<Link[]> => {
  return request("/links", {
    method: "GET",
    headers: getAuthHeaders(),
  });
};

// Create a new link
const createLink = (title: string, url: string): Promise<Link> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };
  return request("/links", {
    method: "POST",
    headers,
    body: JSON.stringify({ title, url }),
  });
};

// Update an existing link
const updateLink = (
  id: number,
  updates: Partial<{ title: string; url: string }>
): Promise<Link> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };
  return request(`/links/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updates),
  });
};

// Delete a link by ID
const deleteLink = (id: number): Promise<void> => {
  return request(`/links/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

async function updateTheme(themeName: string) {
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  const res = await fetch("http://localhost:8080/api/users/theme", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ theme: themeName }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  console.log("✅ Theme updated:", data);
  return data;
}
// Export all API functions
const apiService = {
  register,
  login,
  getUserByUsername,
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  updateTheme,
};

export default apiService;
