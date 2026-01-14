import React, { useState } from 'react';
import { signup } from '../../services/api';

export default function FormSignup() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			const res = await signup({ firstName, lastName, username, email, password });
			// Persist user locally for immediate UI updates
			try { localStorage.setItem('authUser', JSON.stringify(res.user)); } catch(_) {}
			window.dispatchEvent(new Event('auth:changed'));
			window.location.hash = '#/';
		} catch (err: any) {
			setError(err?.message || 'Erreur inscription');
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Prénom</label>
				<input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
			</div>
			<div>
				<label>Nom</label>
				<input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
			</div>
			<div>
				<label>Nom d'utilisateur</label>
				<input value={username} onChange={(e) => setUsername(e.target.value)} required />
			</div>
			<div>
				<label>Email</label>
				<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
			</div>
			<div>
				<label>Mot de passe</label>
				<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
			</div>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			<button type="submit">S'inscrire</button>
		</form>
	);
}
