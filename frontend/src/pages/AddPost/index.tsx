import React, { useEffect, useState } from 'react';
import AddPost from '../../components/AddPost';
import { me } from '../../services/api';

export default function AddPostPage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        // Quick check from localStorage to avoid redirect when already logged
        const stored = localStorage.getItem('authUser');
        if (stored) {
          if (mounted) setUser(JSON.parse(stored));
        }
        // Then validate with server in background
        const res = await me();
        if (mounted) setUser(res.user);
      } catch (_) {
        if (mounted) setUser(null);
      } finally {
        setLoading(false);
      }
    }
    check();
    // Optionally listen to auth changes
    const h = () => check();
    window.addEventListener('auth:changed', h);
    return () => {
      mounted = false;
      window.removeEventListener('auth:changed', h);
    };
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (!user) {
    window.location.hash = '#/connexion';
    return <div>Redirection...</div>;
  }

  return (
    <div>
      <h2>Ajouter un post</h2>
      <AddPost />
    </div>
  );
}
