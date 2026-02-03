const { Router } = require('express');
const { login } = require('../controller/authController');
const { protect } = require('../middleware/auth');
const router = Router();

router.post('/login', login);

// ejemplo de ruta protegida
router.get('/alumnos', protect, (req, res) => {
  res.json({ message: `Hola ${req.user.username}` });
});

module.exports = router;
