const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

type Credentials = { email: string; password: string };

async function request(path: string, opts: RequestInit = {}) {
  // Helper HTTP :
  // - credentials: 'include' => envoie les cookies (JWT httpOnly) au backend
  // - parse JSON même si le backend renvoie du texte
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
  // Inscription (JSON)
  return request('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function login(creds: Credentials) {
  // Connexion (JSON)
  return request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  });
}

export async function logout() {
  // Déconnexion (cookie supprimé côté serveur)
  return request('/logout', { method: 'POST' });
}

export async function me() {
  // Récupère l'utilisateur courant si le cookie JWT est valide
  return request('/me');
}

export async function deleteMe() {
  // Suppression de compte
  return request('/me', { method: 'DELETE' });
}

export async function listPosts() {
  // Liste des posts
  return request('/posts');
}

export async function getPost(id: string) {
  // Détail d'un post
  return request(`/posts/${id}`);
}

export async function createPost(formData: FormData) {
  // Création d'un post : FormData (upload image)
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
  // Mise à jour d'un post : FormData (upload image)
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
  // Suppression d'un post
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
