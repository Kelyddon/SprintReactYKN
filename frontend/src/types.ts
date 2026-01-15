// Types partagés front :
// - évite les `any` et documente la structure attendue (User/Post)
// - volontairement permissif (beaucoup de champs optionnels) car l'API peut varier
export type IdLike = string | { _id?: string; id?: string };

export type User = {
  _id?: string;
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type Post = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  image?: string;
  user?: User | string;
  author?: IdLike;
  owner?: IdLike;
  createdBy?: IdLike;
  userId?: IdLike;
};
