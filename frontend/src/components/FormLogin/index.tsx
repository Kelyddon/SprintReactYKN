import React, { useState } from 'react';
import { login } from '../../services/api';

export default function FormLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			const res = await login({ email, password });
			// Persist user locally for immediate UI updates
			try {
				localStorage.setItem('authUser', JSON.stringify(res.user));
			} catch (_) {}
			window.dispatchEvent(new Event('auth:changed'));
			window.location.hash = '#/';
		} catch (err: any) {
			setError(err?.message || 'Erreur de connexion');
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			   <div style={{ marginBottom: '1.3em' }}>
				<label>Email:   </label>
				   <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ border: '1px solid #888', borderRadius: 4, padding: '6px 10px', background: '#fafbfc' }} />
			</div>
			   <div style={{ marginBottom: '1.3em' }}>
				<label>Mot de passe:   </label>
				   <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ border: '1px solid #888', borderRadius: 4, padding: '6px 10px', background: '#fafbfc' }} />
			</div>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			<button type="submit">Se connecter</button>
		</form>
	);
}
