import { useEffect, useState } from 'react';
import { me, logout, deleteMe } from '../../services/api';
import DeleteAccountConfirm from '../../components/DeleteAccountConfirm';

export default function Header() {
  const [user, setUser] = useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // Lecture rapide depuis le localStorage
        const stored = localStorage.getItem('authUser');
        if (stored) {
          if (mounted) setUser(JSON.parse(stored));
        } else {
          const res = await me();
          if (mounted) setUser(res.user);
        }
      } catch (err) {
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
      localStorage.removeItem('authUser');
      window.dispatchEvent(new Event('auth:changed'));
      window.location.hash = '#/connexion';
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteAccount() {
    try {
      setShowDeleteConfirm(false); // 👈 ferme la popup immédiatement
      await deleteMe();
      localStorage.removeItem('authUser');
      window.dispatchEvent(new Event('auth:changed'));
      window.location.hash = '#/connexion';
    } catch (err) {
      setShowDeleteConfirm(false); // 👈 sécurité
      alert("Erreur lors de la suppression du compte");
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
            <span>Bonjour {user.username}</span>

            <button onClick={handleLogout}>
              Déconnexion
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{ color: 'red' }}
            >
              Supprimer mon compte
            </button>
          </>
        )}
      </nav>

      {showDeleteConfirm && (
        <DeleteAccountConfirm
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </header>
  );
}
