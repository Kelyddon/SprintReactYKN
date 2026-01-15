import { useEffect, useMemo, useState } from 'react';
import { deletePost } from '../../services/api';
import type { Post, User } from '../../types';

function normalizeId(v: unknown): string | null {
  if (!v) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'object') {
    const maybe = v as { _id?: unknown; id?: unknown };
    return (typeof maybe._id === 'string' && maybe._id) || (typeof maybe.id === 'string' && maybe.id) || null;
  }
  return null;
}

export default function PostCard({ post, currentUser }: { post: Post; currentUser: User | null }) {
  const id = post._id || post.id;

  const [imgSrc, setImgSrc] = useState<string | null>(post.imageUrl || post.image || null);

  // id du user connecté (supporte plusieurs formes)
  const currentUserId = useMemo(() => {
    return normalizeId(currentUser) || null;
  }, [currentUser]);

  // id du propriétaire du post (supporte plusieurs structures possibles)
  const postOwnerId = useMemo(() => {
    return (
      normalizeId(post.author) ||
      normalizeId(post.user) ||
      normalizeId(post.owner) ||
      normalizeId(post.createdBy) ||
      normalizeId(post.userId) ||
      null
    );
  }, [post]);

  const isOwner = useMemo(() => {
    if (!currentUserId || !postOwnerId) return false;
    return String(currentUserId) === String(postOwnerId);
  }, [currentUserId, postOwnerId]);

  const authorLabel = useMemo(() => {
    const u = post.user;
    if (!u || typeof u === 'string') return null;
    return (
      u.username ||
      [u.firstName, u.lastName].filter(Boolean).join(' ') ||
      null
    );
  }, [post]);

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm('Supprimer ce post ?')) return;

    try {
      await deletePost(String(id));
      window.dispatchEvent(new Event('posts:changed'));
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Erreur suppression');
    }
  }

  function handleEdit() {
    if (!id) return;
    // Évite une route dynamique :id (objectif routage 1/3)
    window.location.hash = `#/modification?id=${encodeURIComponent(String(id))}`;
  }

  useEffect(() => {
    let mounted = true;
    let objectUrl: string | null = null;
    const controller = new AbortController();

    async function loadImage() {
      if (!post.imageUrl) {
        if (post.image && mounted) setImgSrc(post.image);
        return;
      }

      try {
        const url = post.imageUrl;
        const sameOrigin = new URL(url).origin === window.location.origin;
        if (sameOrigin) {
          if (mounted) setImgSrc(url);
          return;
        }

        const res = await fetch(url, { credentials: 'include', signal: controller.signal });
        if (!res.ok) return;

        const blob = await res.blob();
        if (!mounted) return;

        objectUrl = URL.createObjectURL(blob);
        setImgSrc(objectUrl);
      } catch {}
    }

    loadImage();

    return () => {
      mounted = false;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [post.imageUrl, post.image]);

  return (
    <div className="mb-3 rounded-xl border border-brand-dark/20 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-brand-dark">{post.title || 'Post'}</h3>
      <p className="mt-1 text-brand-dark/80">{post.description || post.content}</p>

      {imgSrc && (
      <img
        src={imgSrc}
        alt={post.title || 'post image'}
        className="mx-auto my-3 max-h-64 max-w-[200px] rounded-lg border border-brand-dark/10 object-cover"
      />
    )}


      {isOwner && (
        <div className="mt-3 flex justify-center gap-2">
          <button
				onClick={handleEdit}
				className="rounded-lg bg-brand-teal px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
			>
            Modifier
          </button>
          <button
				onClick={handleDelete}
				className="rounded-lg bg-brand-coral px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange"
			>
            Supprimer
          </button>
        </div>
      )}

      {authorLabel && (
			<div className="mt-2 flex justify-end text-xs text-brand-dark/60">
				{authorLabel}
			</div>
		)}
    </div>
  );
}
