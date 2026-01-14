import React, { useState } from 'react';
import { updatePost } from '../../services/api';

export default function UpdatePost({ id, initial }: { id: string; initial?: { title?: string; content?: string } }) {
	const [title, setTitle] = useState(initial?.title || '');
	const [content, setContent] = useState(initial?.content || '');
	const [image, setImage] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	function handleCancel() {
		// Annule la modification: pas de sauvegarde, retour à l'accueil
		window.location.hash = '#/';
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		try {
			const fd = new FormData();
			fd.append('title', title);
			// Backend expects 'description'
			fd.append('description', content);
			if (image) fd.append('image', image);
			await updatePost(id, fd);
			window.dispatchEvent(new Event('posts:changed'));

			// Message + redirection (message affiché sur l'accueil)
			setSuccess('Modification appliquée !');
			try {
				sessionStorage.setItem('flash', 'Modification appliquée !');
			} catch (_) {}
			window.location.hash = '#/';
		} catch (err: any) {
			setError(err?.message || 'Erreur mise à jour');
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				border: '1px solid #ccc',
				padding: 16,
				borderRadius: 10,
				maxWidth: 520,
				margin: '0 auto',
			}}
		>
			<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
				<label style={{ width: 90, textAlign: 'right' }}>Titre :</label>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
					style={{ flex: 1, minWidth: 0, boxSizing: 'border-box' }}
				/>
			</div>
			<div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
				<label style={{ width: 90, textAlign: 'right', paddingTop: 6 }}>Contenu :</label>
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					required
					rows={5}
					style={{ flex: 1, minWidth: 0, boxSizing: 'border-box' }}
				/>
			</div>
			<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
				<label style={{ width: 90, textAlign: 'right' }}>Image :</label>
				<input
					type="file"
					accept="image/*"
					onChange={(e) => setImage(e.target.files?.[0] || null)}
					style={{ flex: 1, minWidth: 0, boxSizing: 'border-box' }}
				/>
			</div>
			{success && <div style={{ color: 'green' }}>{success}</div>}
			{error && <div style={{ color: 'red' }}>{error}</div>}
			<div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 4 }}>
				<button type="submit">Mettre à jour</button>
				<button type="button" onClick={handleCancel}>
					Annuler
				</button>
			</div>
		</form>
	);
}
