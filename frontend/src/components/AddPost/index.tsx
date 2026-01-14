import React, { useState } from 'react';
import { createPost } from '../../services/api';

export default function AddPost() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

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
			await createPost(fd);

			// Notification simple
			setSuccess('Post créé avec succès !');

			// Demande à l'accueil de recharger les posts
			window.dispatchEvent(new Event('posts:changed'));

			// Nettoyage formulaire
			setTitle('');
			setContent('');
			setImage(null);

			// Redirection vers l'accueil pour voir le post
			window.location.hash = '#/';
		} catch (err: any) {
			setError(err?.message || 'Erreur création post');
		}
	}

	return (
		<form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl rounded-xl border border-brand-dark/20 bg-white p-4 shadow-sm">
			<div className="space-y-4">
				<div>
					<label className="mb-1 block text-sm font-medium text-brand-dark">Titre</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						className="w-full rounded-lg border border-brand-dark/20 px-3 py-2 text-brand-dark outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-sand/40"
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-brand-dark">Contenu</label>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						required
						rows={5}
						className="w-full resize-y rounded-lg border border-brand-dark/20 px-3 py-2 text-brand-dark outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-sand/40"
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-brand-dark">Image</label>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setImage(e.target.files?.[0] || null)}
						className="block w-full cursor-pointer rounded-lg border border-brand-dark/20 bg-white px-3 py-2 text-sm text-brand-dark/80 file:mr-3 file:rounded-md file:border-0 file:bg-brand-sand/40 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-dark hover:file:bg-brand-sand/60"
					/>
				</div>
				{success && (
					<div className="rounded-lg border border-brand-teal/30 bg-brand-teal/10 px-3 py-2 text-sm text-brand-dark">
						{success}
					</div>
				)}
				{error && (
					<div className="rounded-lg border border-brand-coral/40 bg-brand-coral/10 px-3 py-2 text-sm text-brand-dark">
						{error}
					</div>
				)}
				<div className="flex justify-center">
					<button
						type="submit"
						className="rounded-lg bg-brand-teal px-5 py-2 font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-sand/60"
					>
						Ajouter
					</button>
				</div>
			</div>
		</form>
	);
}
