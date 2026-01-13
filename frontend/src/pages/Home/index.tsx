import React, { useEffect, useState } from 'react';
import { listPosts } from '../../services/api';
import PostCard from '../../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
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
    const h = () => load();
    window.addEventListener('posts:changed', h);
    return () => window.removeEventListener('posts:changed', h);
  }, []);

  return (
    <div>
      <h2>Fil des posts</h2>
      {loading && <div>Chargement...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && posts.length === 0 && <div>Aucun post</div>}
      {posts.map((p) => (
        <PostCard key={p._id || p.id} post={p} />
      ))}
    </div>
  );
}
