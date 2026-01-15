import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

export default function Main() {
  return (
    <div>
      <Header />
      {/* Outlet = la page courante rendue par react-router-dom */}
      <main style={{ padding: 12 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
