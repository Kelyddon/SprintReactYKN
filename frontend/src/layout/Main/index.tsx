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

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  let content: React.ReactNode = null;
  if (route === '/' || route === '') content = <Home />;
  else if (route.startsWith('/connexion')) content = <Connexion />;
  else if (route.startsWith('/inscription')) content = <Inscription />;
  else if (route.startsWith('/addpost')) content = <AddPostPage />;
  else if (route.startsWith('/modification')) {
    const parts = route.split('/');
    const id = parts[2] || '';
    content = <Modification id={id} />;
  } else content = <Home />;

  return (
    <div>
      <Header />
      <main style={{ padding: 12 }}>{content}</main>
      <Footer />
    </div>
  );
}
