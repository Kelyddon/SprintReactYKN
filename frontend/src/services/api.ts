const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

type Credentials = { email: string; password: string };

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { ...(opts.headers || {} as Record<string, string>) },
    ...opts,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) throw data || { message: res.statusText };
  return data;
}

export async function signup(payload: Record<string, any>) {
  return request('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function login(creds: Credentials) {
  return request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  });
}

export async function logout() {
  return request('/logout', { method: 'POST' });
}

export async function me() {
  return request('/me');
}

export async function deleteMe() {
  return request('/me', { method: 'DELETE' });
}

export async function listPosts() {
  return request('/posts');
}

export async function getPost(id: string) {
  return request(`/posts/${id}`);
}

export async function createPost(formData: FormData) {
  return fetch(`${BASE}/posts`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  }).then(async (res) => {
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  });
}

export async function updatePost(id: string, formData: FormData) {
  return fetch(`${BASE}/posts/${id}`, {
    method: 'PUT',
    body: formData,
    credentials: 'include',
  }).then(async (res) => {
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  });
}

export async function deletePost(id: string) {
  return request(`/posts/${id}`, { method: 'DELETE' });
}

export default {
  signup,
  login,
  logout,
  me,
  deleteMe,
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
