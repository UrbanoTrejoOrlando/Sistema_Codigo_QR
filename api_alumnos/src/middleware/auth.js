const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'hola';

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // id_usuario, rol, username
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para autorizar roles específicos
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    next();
  };
};
