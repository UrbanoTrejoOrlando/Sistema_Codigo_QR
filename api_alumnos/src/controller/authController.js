const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hola';
const JWT_EXPIRES = '8h';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE nombre_usuario = ?',
      [username]
    );
    if (!rows.length) return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id_usuario: user.id_usuario, rol: user.rol, username: user.nombre_usuario },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      token,
      user: { id: user.id_usuario, username: user.nombre_usuario, rol: user.rol }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en login' });
  }
};
