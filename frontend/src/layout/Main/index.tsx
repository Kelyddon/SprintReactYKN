import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Home from '../../pages/Home';
import Connexion from '../../pages/Connexion';
import Inscription from '../../pages/Inscription';
import AddPostPage from '../../pages/AddPost';
import Modification from '../../pages/Modification';

function parseHash() {
  const h = window.location.hash.replace(/^#/, '') || '/';
  return h;
}

export default function Main() {
  const [route, setRoute] = useState(parseHash());
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    // Vérifie l'utilisateur connecté au chargement et lors du changement d'auth
    const checkUser = () => {
      try {
        const stored = localStorage.getItem('authUser');
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener('auth:changed', checkUser);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('auth:changed', checkUser);
    };
  }, []);

  let content: React.ReactNode = null;
  if (route === '/' || route === '') content = <Home />;
  else if (route.startsWith('/connexion')) content = <Connexion />;
  else if (route.startsWith('/inscription')) content = <Inscription />;
  else if (route.startsWith('/addpost')) content = <AddPostPage />;
  else if (route.startsWith('/modification')) {
    // Protection : accès uniquement si connecté
    if (!user) {
      content = <div style={{color:'red',margin:'2em'}}>Accès refusé : vous devez être connecté pour modifier un post.<br/> <a href="#/connexion">Se connecter</a></div>;
    } else {
      const parts = route.split('/');
      const id = parts[2] || '';
      content = <Modification id={id} />;
    }
  } else content = <Home />;

  return (
    <div>
      <Header />
      <main style={{ padding: 12 }}>{content}</main>
      <Footer />
    </div>
  );
}
