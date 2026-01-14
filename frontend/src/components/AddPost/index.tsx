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
		<form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
			<div className="space-y-4">
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-800">Titre</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-800">Contenu</label>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						required
						rows={5}
						className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-800">Image</label>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setImage(e.target.files?.[0] || null)}
						className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-800 hover:file:bg-gray-200"
					/>
				</div>
				{success && (
					<div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
						{success}
					</div>
				)}
				{error && (
					<div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
						{error}
					</div>
				)}
				<div className="flex justify-center">
					<button
						type="submit"
						className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
					>
						Ajouter
					</button>
				</div>
			</div>
		</form>
	);
}
