import { useEffect, useMemo, useState } from 'react';
import { listPosts, me } from '../../services/api';
import PostCard from '../../components/PostCard';
import type { Post, User } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPosts } from '../../store/postsSlice';

function normalizeId(v: unknown): string | null {
  // Helper : certains objets peuvent être { _id } ou { id } selon la source.
  if (!v) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'object') {
    const maybe = v as { _id?: unknown; id?: unknown };
    return (typeof maybe._id === 'string' && maybe._id) || (typeof maybe.id === 'string' && maybe.id) || null;
  }
  return null;
}

function getPostOwnerId(p: Post): string | null {
  // selon ton backend, l'auteur peut être dans plusieurs champs
  return (
    normalizeId(p.author) ||
    normalizeId(p.user) ||
    normalizeId(p.owner) ||
    normalizeId(p.createdBy) ||
    normalizeId(p.userId) ||
    null
  );
}

export default function Home() {
  const dispatch = useAppDispatch();
  // On lit les posts depuis Redux (state global)
  const posts = useAppSelector((s) => s.posts.items);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

	const [flash, setFlash] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ✅ filtre : afficher uniquement les posts de l'utilisateur connecté
  const [onlyMine, setOnlyMine] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      // 1) user connecté (localStorage ou /me)
      try {
        const stored = localStorage.getItem('authUser');
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          const u = await me();
          setCurrentUser((u && (u.user ?? u)) || null);
        }
      } catch {
        setCurrentUser(null);
      }

      // 2) posts (fetch /posts puis stockage dans Redux)
      const res = await listPosts();
      dispatch(setPosts((res.posts || []) as Post[]));
    } catch (err: any) {
      setError(err?.message || 'Erreur chargement posts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Chargement initial + écoute d'évènements custom pour recharger (après create/update/delete)
    load();
    // Message "flash" (ex: après création / modification)
    try {
      const msg = sessionStorage.getItem('flash');
      if (msg) {
        sessionStorage.removeItem('flash');
        setFlash(msg);
        window.setTimeout(() => setFlash(null), 2500);
      }
    } catch {
      // ignore
    }
    const h = () => load();
    window.addEventListener('posts:changed', h);
    window.addEventListener('auth:changed', h);
    return () => {
      window.removeEventListener('posts:changed', h);
      window.removeEventListener('auth:changed', h);
    };
  }, []);

  const currentUserId = useMemo(() => {
    return normalizeId(currentUser) || null;
  }, [currentUser]);

  const filteredPosts = useMemo(() => {
    // Filtre optionnel : afficher uniquement mes posts
    if (!onlyMine) return posts;
    if (!currentUserId) return []; // si pas connecté, rien à afficher en "mes posts"
    return posts.filter((p) => String(getPostOwnerId(p)) === String(currentUserId));
  }, [posts, onlyMine, currentUserId]);

  return (
    <div>
    <h2 className="mb-3 text-2xl font-semibold text-brand-dark">Fil des posts</h2>
    {flash && (
      <div className="mb-3 rounded-lg border border-brand-teal/30 bg-brand-teal/10 px-3 py-2 text-sm text-brand-dark">
        {flash}
      </div>
    )}

      {/* ✅ MENU / FILTRE */}
      <div className="mb-3 flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-brand-dark">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
            disabled={!currentUserId}
          />
          Mes posts uniquement
        </label>

        {!currentUserId && (
          <span className="text-xs text-brand-dark/60">
            (Connecte-toi pour activer ce filtre)
          </span>
        )}
      </div>

      {loading && <div>Chargement...</div>}
    {error && (
      <div className="rounded-lg border border-brand-coral/40 bg-brand-coral/10 px-3 py-2 text-sm text-brand-dark">
        {error}
      </div>
    )}

      {!loading && filteredPosts.length === 0 && (
        <div>{onlyMine ? "Tu n'as pas encore publié de post" : 'Aucun post'}</div>
      )}

      {filteredPosts.map((p) => (
        <PostCard key={p._id || p.id} post={p} currentUser={currentUser} />
      ))}
    </div>
  );
}
