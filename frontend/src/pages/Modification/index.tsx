import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import UpdatePost from '../../components/UpdatePost';
import { getPost } from '../../services/api';

// Page "Modification" :
// - récupère l'id du post via query string (?id=...)
// - charge le post via API (getPost)
// - affiche le formulaire UpdatePost pré-rempli
export default function Modification() {
  const [search] = useSearchParams();
  const id = search.get('id') || undefined;

  const isLoggedIn = useMemo(() => {
    // Check minimal : présence d'un utilisateur en local (on pourrait aussi valider via /me)
    try {
      return Boolean(localStorage.getItem('authUser'));
    } catch {
      return false;
    }
  }, []);

  const [initial, setInitial] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
		const postId = id;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Charge le post existant pour pré-remplir le formulaire
        const res = await getPost(postId);
        if (mounted) setInitial(res.post || null);
      } catch (err: any) {
        setError(err?.message || 'Erreur récupération post');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!isLoggedIn) return <div>Accès refusé : connecte-toi d'abord.</div>;
  if (!id) return <div>ID manquant</div>;
  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!initial) return <div>Aucun post trouvé</div>;

  return (
    <div>
      <h2>Modifier le post</h2>
      <UpdatePost id={id} initial={{ title: initial.title, content: initial.description }} />
    </div>
  );
}
