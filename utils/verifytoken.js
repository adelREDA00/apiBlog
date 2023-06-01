const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json("Vous n'êtes pas authentifié(e) !");
  }

  const tokenValue = token.split(" ")[1]; // Extraire la valeur du jeton après "Bearer "

  jwt.verify(tokenValue, process.env.JWT, (err, user) => {
    if (err) {
      return res.status(401).json("invalide token!");
    }
    req.user = user;
    next();
  });
};


const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(400).json("Vous ne pouvez mettre à jour que votre compte ");
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(400).json("Vous n'êtes pas un administrateur !");
    }
  });
};

module.exports = {
  verifyToken,
  verifyUser,
  verifyAdmin
};
