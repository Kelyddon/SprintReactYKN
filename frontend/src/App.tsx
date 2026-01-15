import { Route, Routes } from 'react-router-dom';
import Main from './layout/Main';
import Home from './pages/Home';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import AddPostPage from './pages/AddPost';
import Modification from './pages/Modification';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route element={<Main />}>
        <Route path="/" element={<Home />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/addpost" element={<AddPostPage />} />
        <Route path="/modification" element={<Modification />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
