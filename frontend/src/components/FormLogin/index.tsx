import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/userSlice';

export default function FormLogin() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	// Champs contrôlés : la valeur de l'input = state React.
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			// Appel API + sauvegarde user dans Redux (et localStorage via userSlice)
			const res = await login({ email, password });
			dispatch(setUser(res.user));
			window.dispatchEvent(new Event('auth:changed'));
			// Navigation vers la Home après connexion
			navigate('/');
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
