import React, { useEffect, useState } from 'react';
import { deletePost } from '../../services/api';

type Post = {
	id?: string;
	_id?: string;
	title?: string;
	content?: string;
	image?: string;
	author?: any;
};

export default function PostCard({ post }: { post: Post }) {
	const id = post._id || post.id;

	const [imgSrc, setImgSrc] = useState<string | null>(post.imageUrl || post.image || null);
	async function handleDelete() {
		if (!id) return;
		if (!confirm('Supprimer ce post ?')) return;
		try {
			await deletePost(id as string);
			window.dispatchEvent(new Event('posts:changed'));
		} catch (err: any) {
			console.error(err);
			alert(err?.message || 'Erreur suppression');
		}
	}

	useEffect(() => {
		let mounted = true;
		let objectUrl: string | null = null;
		const controller = new AbortController();

		async function load() {
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
			} catch (_err) {
				// ignore and keep no image
			}
		}

		load();
		return () => {
			mounted = false;
			controller.abort();
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [post.imageUrl, post.image]);

	return (
		<div style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
			<h3>{post.title}</h3>
			<p>{post.description || post.content}</p>
			{imgSrc && <img src={imgSrc} alt={post.title} style={{ maxWidth: '200px' }} />}
			<div>
				<button onClick={handleDelete}>Supprimer</button>
			</div>
		</div>
	);
}
