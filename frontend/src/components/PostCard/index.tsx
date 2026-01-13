import React from 'react';
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

	return (
		<div style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
			<h3>{post.title}</h3>
			<p>{post.description || post.content}</p>
						{(post.imageUrl || post.image) && (
							<img src={post.imageUrl || post.image} alt={post.title} style={{ maxWidth: '200px' }} />
						)}
			<div>
				<button onClick={handleDelete}>Supprimer</button>
			</div>
		</div>
	);
}
