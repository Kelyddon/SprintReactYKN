/**
 * Options des cookies (JWT).
 * httpOnly: non accessible en JS côté navigateur
 * secure: à passer à true en prod derrière HTTPS
 */
function getCookieOptions(_req) {
  return {
    httpOnly: true,
    secure: false,
    path: '/',
  };
}

module.exports = { getCookieOptions };
