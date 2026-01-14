import { useEffect, useMemo, useState } from 'react';
import { listPosts, me } from '../../services/api';
import PostCard from '../../components/PostCard';

function normalizeId(v: any): string | null {
  if (!v) return null;
  if (typeof v === 'string') return v;
  return v._id || v.id || null;
}

function getPostOwnerId(p: any): string | null {
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
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

	const [flash, setFlash] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<any | null>(null);

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
          setCurrentUser(u?.user || null);
        }
      } catch {
        setCurrentUser(null);
      }

      // 2) posts
      const res = await listPosts();
      setPosts(res.posts || []);
    } catch (err: any) {
      setError(err?.message || 'Erreur chargement posts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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
    return normalizeId(currentUser) || normalizeId(currentUser?.user) || null;
  }, [currentUser]);

  const filteredPosts = useMemo(() => {
    if (!onlyMine) return posts;
    if (!currentUserId) return []; // si pas connecté, rien à afficher en "mes posts"
    return posts.filter((p) => String(getPostOwnerId(p)) === String(currentUserId));
  }, [posts, onlyMine, currentUserId]);

  return (
    <div>
      <h2>Fil des posts</h2>
		{flash && <div style={{ color: 'green', marginBottom: 12 }}>{flash}</div>}

      {/* ✅ MENU / FILTRE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
            disabled={!currentUserId}
          />
          Mes posts uniquement
        </label>

        {!currentUserId && (
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            (Connecte-toi pour activer ce filtre)
          </span>
        )}
      </div>

      {loading && <div>Chargement...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && filteredPosts.length === 0 && (
        <div>{onlyMine ? "Tu n'as pas encore publié de post" : 'Aucun post'}</div>
      )}

      {filteredPosts.map((p) => (
        <PostCard key={p._id || p.id} post={p} currentUser={currentUser} />
      ))}
    </div>
  );
}
