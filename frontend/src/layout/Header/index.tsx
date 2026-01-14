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
    <header className="border-b border-brand-dark bg-brand-dark px-4 py-3 text-white">
      <nav className="flex flex-wrap items-center gap-3">
        <a href="#/" className="font-semibold text-brand-sand hover:text-white">Accueil</a>

        {user && <a href="#/addpost" className="hover:text-brand-sand">Ajouter</a>}
        {!user && <a href="#/connexion" className="hover:text-brand-sand">Se connecter</a>}
        {!user && <a href="#/inscription" className="hover:text-brand-sand">S'inscrire</a>}

        {user && (
          <>
            <span className="ml-auto">Bonjour {user.username}</span>

            <button
					onClick={handleLogout}
					className="rounded-lg bg-brand-teal px-3 py-2 text-sm font-medium text-white hover:bg-brand-sand hover:text-brand-dark"
				>
              Déconnexion
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
					className="rounded-lg bg-brand-coral px-3 py-2 text-sm font-medium text-white hover:bg-brand-orange"
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
