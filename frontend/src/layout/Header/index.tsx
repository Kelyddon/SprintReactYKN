import React, { useEffect, useState } from 'react';
import { me, logout } from '../../services/api';

export default function Header() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Try quick read from localStorage for immediate UX
        const stored = localStorage.getItem('authUser');
        if (stored) {
          if (mounted) setUser(JSON.parse(stored));
        } else {
          const res = await me();
          if (mounted) setUser(res.user);
        }
      } catch (_) {
        if (mounted) setUser(null);
      }
    }

    load();
    const h = () => load();
    window.addEventListener('auth:changed', h);
    return () => {
      mounted = false;
      window.removeEventListener('auth:changed', h);
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
      try { localStorage.removeItem('authUser'); } catch(_) {}
      window.dispatchEvent(new Event('auth:changed'));
      window.location.hash = '#/connexion';
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <header style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <a href="#/">Accueil</a>
        {user && <a href="#/addpost">Ajouter</a>}
        {!user && <a href="#/connexion">Se connecter</a>}
        {!user && <a href="#/inscription">S'inscrire</a>}
        {user && (
          <>
            <span>Bonjour {user.firstName}</span>
            <button onClick={handleLogout}>Déconnexion</button>
          </>
        )}
      </nav>
    </header>
  );
}
