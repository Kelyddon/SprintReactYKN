import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { me, logout, deleteMe } from '../../services/api';
import DeleteAccountConfirm from '../../components/DeleteAccountConfirm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearUser, setUser } from '../../store/userSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const reduxUser = useAppSelector((s) => s.user.user);

  const [user, setUserState] = useState<any | null>(reduxUser);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // Lecture rapide depuis le localStorage
        const stored = localStorage.getItem('authUser');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (mounted) setUserState(parsed);
          dispatch(setUser(parsed));
        } else {
          const res = await me();
          if (mounted) setUserState(res.user);
          dispatch(setUser(res.user));
        }
      } catch (err) {
        if (mounted) setUserState(null);
        dispatch(clearUser());
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

  useEffect(() => {
    setUserState(reduxUser);
  }, [reduxUser]);

  async function handleLogout() {
    try {
      await logout();
      dispatch(clearUser());
      window.dispatchEvent(new Event('auth:changed'));
      navigate('/connexion');
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteAccount() {
    try {
      setShowDeleteConfirm(false); // 👈 ferme la popup immédiatement
      await deleteMe();
      dispatch(clearUser());
      window.dispatchEvent(new Event('auth:changed'));
      navigate('/connexion');
    } catch (err) {
      setShowDeleteConfirm(false); // 👈 sécurité
      alert("Erreur lors de la suppression du compte");
      console.error(err);
    }
  }


  return (
    <header className="border-b border-brand-dark bg-brand-dark px-4 py-3 text-white">
      <nav className="flex flex-wrap items-center gap-3">
        <Link to="/" className="font-semibold text-brand-sand hover:text-white">Accueil</Link>

        {user && <Link to="/addpost" className="hover:text-brand-sand">Ajouter</Link>}
        {!user && <Link to="/connexion" className="hover:text-brand-sand">Se connecter</Link>}
        {!user && <Link to="/inscription" className="hover:text-brand-sand">S'inscrire</Link>}

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
