import React, { useState } from 'react';
import { updatePost } from '../../services/api';

export default function UpdatePost({ id, initial }: { id: string; initial?: { title?: string; content?: string } }) {
	const [title, setTitle] = useState(initial?.title || '');
	const [content, setContent] = useState(initial?.content || '');
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
			const res = await updatePost(id, fd);
			window.dispatchEvent(new Event('posts:changed'));
		} catch (err: any) {
			setError(err?.message || 'Erreur mise à jour');
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
			<button type="submit">Mettre à jour</button>
		</form>
	);
}
