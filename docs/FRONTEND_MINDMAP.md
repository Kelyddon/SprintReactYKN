# Frontend — Carte mentale

```text
Frontend (Vite + React)
│
├─ Boot / Entrypoints
│  ├─ main.tsx
│  │  └─ mount React (createRoot) → <App />
│  └─ App.tsx
│     └─ rend <Main /> (layout)
│
├─ Navigation (router “maison” via hash)
│  └─ layout/Main
│     ├─ parseHash(): lit window.location.hash
│     ├─ state route + écoute hashchange
│     ├─ “auth state” local:
│     │  ├─ lit localStorage.authUser
│     │  └─ écoute event window 'auth:changed'
│     └─ pages
│        ├─ /            → Home
│        ├─ /connexion   → Connexion
│        ├─ /inscription → Inscription
│        ├─ /addpost     → AddPostPage (protégé)
│        └─ /modification/:id → Modification (protégé)
│
├─ API Client (frontend ↔ backend)
│  └─ services/api.ts
│     ├─ BASE = VITE_API_BASE || http://localhost:4000/api
│     ├─ request(): fetch + credentials:'include'
│     ├─ auth
│     │  ├─ signup/login → JSON
│     │  ├─ logout → POST
│     │  └─ me → GET
│     ├─ user
│     │  └─ deleteMe → DELETE /me
│     └─ posts
│        ├─ listPosts/getPost → JSON
│        ├─ createPost/updatePost → FormData (image upload)
│        └─ deletePost → DELETE
│
├─ Pages (écran)
│  ├─ Home
│  │  ├─ charge posts via listPosts()
│  │  ├─ tente de récupérer le user (localStorage ou /me)
│  │  └─ filtre “Mes posts uniquement” (côté front)
│  ├─ Connexion → FormLogin
│  ├─ Inscription → FormSignup
│  ├─ AddPostPage
│  │  ├─ check user (localStorage + /me)
│  │  └─ sinon redirige #/connexion
│  └─ Modification
│     ├─ charge le post via getPost(id)
│     └─ rend UpdatePost(id, initial)
│
└─ Components (logique UI)
   ├─ FormLogin
   │  ├─ appelle login()
   │  ├─ stocke res.user dans localStorage.authUser
   │  └─ dispatch 'auth:changed' + redirect '#/'
   ├─ FormSignup (idem)
   ├─ AddPost
   │  ├─ construit FormData
   │  │  ├─ title
   │  │  ├─ description (depuis content)
   │  │  └─ image (File)
   │  └─ dispatch 'posts:changed' + redirect '#/'
   ├─ UpdatePost (idem create, mais PUT)
   └─ PostCard
      ├─ calcule isOwner (compare user ids)
      ├─ deletePost() puis dispatch 'posts:changed'
      └─ edit → change le hash '#/modification/:id'
```

## Liens rapides

- App root: [frontend/src/main.tsx](../frontend/src/main.tsx), [frontend/src/App.tsx](../frontend/src/App.tsx)
- Router layout: [frontend/src/layout/Main/index.tsx](../frontend/src/layout/Main/index.tsx)
- API client: [frontend/src/services/api.ts](../frontend/src/services/api.ts)
- Pages: [frontend/src/pages/Home/index.tsx](../frontend/src/pages/Home/index.tsx), [frontend/src/pages/Connexion/index.tsx](../frontend/src/pages/Connexion/index.tsx), [frontend/src/pages/Inscription/index.tsx](../frontend/src/pages/Inscription/index.tsx), [frontend/src/pages/AddPost/index.tsx](../frontend/src/pages/AddPost/index.tsx), [frontend/src/pages/Modification/index.tsx](../frontend/src/pages/Modification/index.tsx)
- Components: [frontend/src/components/FormLogin/index.tsx](../frontend/src/components/FormLogin/index.tsx), [frontend/src/components/FormSignup/index.tsx](../frontend/src/components/FormSignup/index.tsx), [frontend/src/components/AddPost/index.tsx](../frontend/src/components/AddPost/index.tsx), [frontend/src/components/UpdatePost/index.tsx](../frontend/src/components/UpdatePost/index.tsx), [frontend/src/components/PostCard/index.tsx](../frontend/src/components/PostCard/index.tsx)

## “Chemin type” d’une action (ex: créer un post)

1) UI: [frontend/src/components/AddPost/index.tsx](../frontend/src/components/AddPost/index.tsx) construit un `FormData` (title/description/image)
2) API: [frontend/src/services/api.ts](../frontend/src/services/api.ts) fait `fetch(BASE + '/posts', { credentials:'include', body: formData })`
3) Backend: route `POST /api/posts` → `requireAuth → uploadSingleImage → validateCreatePost → createPost`
4) DB: `Post.save()` (Mongoose)
5) UI: dispatch event `posts:changed` + redirect `#/`
