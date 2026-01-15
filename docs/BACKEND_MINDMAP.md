# Backend — Carte mentale

```text
Backend (Express + Mongo/Mongoose)
│
├─ Boot / Entrypoints
│  ├─ server.js
│  │  ├─ charge .env (dotenv)
│  │  ├─ vérifie JWT_SECRET
│  │  ├─ connecte Mongo (connectDb)
│  │  └─ démarre l’API (createApp + listen)
│  └─ app.js
│     ├─ middlewares globaux
│     │  ├─ helmet (headers sécurité)
│     │  ├─ morgan (logs HTTP)
│     │  ├─ cookieParser → req.cookies
│     │  ├─ express.json → req.body
│     │  └─ cors(credentials:true) (cookies cross-origin)
│     ├─ /uploads (statique) → images uploadées
│     ├─ /api (routes)
│     │  ├─ auth.routes
│     │  ├─ user.routes
│     │  └─ post.routes
│     └─ erreurs
│        ├─ notFound (404)
│        └─ errorHandler (JSON)
│
├─ Auth (cookie JWT httpOnly)
│  ├─ POST /api/signup → validateSignup → signup
│  ├─ POST /api/login  → validateLogin  → login
│  ├─ POST /api/logout → logout
│  └─ GET  /api/me     → requireAuth → me
│
├─ Posts (CRUD + image)
│  ├─ GET    /api/posts      → listPosts (public)
│  ├─ GET    /api/posts/me   → requireAuth → listMyPosts
│  ├─ GET    /api/posts/:id  → validatePostId → getPostById
│  ├─ POST   /api/posts      → requireAuth → uploadSingleImage → validateCreatePost → createPost
│  ├─ PUT    /api/posts/:id  → requireAuth → uploadSingleImage → validateUpdatePost → updatePost
│  └─ DELETE /api/posts/:id  → requireAuth → validatePostId → deletePost
│
├─ Users
│  └─ DELETE /api/me → requireAuth → deleteMyAccount
│
├─ Middlewares/Helpers importants
│  ├─ requireAuth
│  │  ├─ lit token depuis cookie
│  │  ├─ jwt.verify
│  │  ├─ charge User
│  │  └─ met req.user (sinon 401)
│  ├─ uploadSingleImage (multer)
│  │  ├─ attend multipart/form-data
│  │  ├─ champ fichier: image
│  │  └─ met req.file
│  ├─ validate* (express-validator) → 400 si invalide
│  └─ asyncHandler → next(err) → errorHandler
│
└─ Data layer (Mongoose)
   ├─ User
   │  ├─ passwordHash + verifyPassword(bcrypt)
   │  └─ hook suppression → deleteMany Posts
   └─ Post
      ├─ user: ObjectId(ref User)
      ├─ author.id: champ imbriqué
      ├─ imageUrl
      └─ title + description
```

## Liens rapides

- Démarrage: [backend/src/server.js](../backend/src/server.js)
- App Express: [backend/src/app.js](../backend/src/app.js)
- DB: [backend/src/config/db.js](../backend/src/config/db.js)
- Routes: [backend/src/routes/auth.routes.js](../backend/src/routes/auth.routes.js), [backend/src/routes/post.routes.js](../backend/src/routes/post.routes.js), [backend/src/routes/user.routes.js](../backend/src/routes/user.routes.js)
- Controllers: [backend/src/controllers/auth.controller.js](../backend/src/controllers/auth.controller.js), [backend/src/controllers/post.controller.js](../backend/src/controllers/post.controller.js), [backend/src/controllers/user.controller.js](../backend/src/controllers/user.controller.js)
- Middlewares: [backend/src/middleware/auth.js](../backend/src/middleware/auth.js), [backend/src/middleware/upload.js](../backend/src/middleware/upload.js), [backend/src/middleware/errorHandler.js](../backend/src/middleware/errorHandler.js)
- Validators: [backend/src/validators/auth.validators.js](../backend/src/validators/auth.validators.js), [backend/src/validators/post.validators.js](../backend/src/validators/post.validators.js)
- Models: [backend/src/models/User.js](../backend/src/models/User.js), [backend/src/models/Post.js](../backend/src/models/Post.js)
