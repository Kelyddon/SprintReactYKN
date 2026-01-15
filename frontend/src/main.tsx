import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { store } from './store/store'

// Point d'entrée React :
// - Provider = rend le store Redux disponible dans toute l'app
// - HashRouter = routage côté client via l'URL en #/... (pratique sans config serveur)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </StrictMode>,
)
