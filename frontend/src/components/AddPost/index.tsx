import React, { useState } from 'react';
import { createPost } from '../../services/api';

export default function AddPost() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			const fd = new FormData();
			fd.append('title', title);
			// Backend expects 'description'
			fd.append('description', content);
			if (image) fd.append('image', image);
			const res = await createPost(fd);
			window.dispatchEvent(new Event('posts:changed'));
			setTitle('');
			setContent('');
			setImage(null);
		} catch (err: any) {
			setError(err?.message || 'Erreur création post');
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Titre</label>
				<input value={title} onChange={(e) => setTitle(e.target.value)} required />
			</div>
			<div>
				<label>Contenu</label>
				<textarea value={content} onChange={(e) => setContent(e.target.value)} required />
			</div>
			<div>
				<label>Image</label>
				<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
			</div>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			<button type="submit">Ajouter</button>
		</form>
	);
}
