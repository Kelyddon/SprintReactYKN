import { useEffect, useState } from 'react';
import AddPost from '../../components/AddPost';
import { me } from '../../services/api';

// Page "Ajouter un post" :
// - vérifie rapidement si l'utilisateur est connecté
// - si non connecté => redirige vers /connexion
// - si connecté => affiche le composant formulaire AddPost
export default function AddPostPage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        // 1) Check rapide depuis le localStorage (évite une redirection inutile)
        const stored = localStorage.getItem('authUser');
        if (stored) {
          if (mounted) setUser(JSON.parse(stored));
        }
        // 2) Validation côté serveur en arrière-plan (/me)
        const res = await me();
        if (mounted) setUser(res.user);
      } catch (_) {
        if (mounted) setUser(null);
      } finally {
        setLoading(false);
      }
    }
    check();
    // Écoute un évènement custom pour rafraîchir l'état auth si besoin
    const h = () => check();
    window.addEventListener('auth:changed', h);
    return () => {
      mounted = false;
      window.removeEventListener('auth:changed', h);
    };
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (!user) {
    // Redirection simple en HashRouter
    window.location.hash = '#/connexion';
    return <div>Redirection...</div>;
  }

  return (
    <div>
      <h2>Ajouter un post</h2>
      <AddPost />
    </div>
  );
}
