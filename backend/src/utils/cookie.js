function getCookieOptions(_req) {
  return {
    httpOnly: true,
    secure: false,
    path: '/',
  };
}

module.exports = { getCookieOptions };
