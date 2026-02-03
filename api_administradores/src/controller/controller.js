const pool = require("../config/db");

// Obtener todos los administradores
const getAdmins = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener administradores:", error);
    res.status(500).json({ message: "Error al obtener administradores" });
  }
};

// Obtener un administrador por ID
const getAdminById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id_usuario = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Administrador no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener administrador" });
  }
};

// Crear un nuevo usuario (admin o user)
const createAdmin = async (req, res) => {
  try {
    const { nombre_usuario, password, rol } = req.body;

    // Validar campos obligatorios
    if (!nombre_usuario || !password) {
      return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos" });
    }

    // Validar valor de rol
    const rolValido = rol === "admin" || rol === "user" ? rol : "user";

    // Insertar usuario
    await pool.query(
      "INSERT INTO usuarios (nombre_usuario, password, rol) VALUES (?, ?, ?)",
      [nombre_usuario, password, rolValido]
    );

    res.json({ message: "Usuario creado correctamente", rol: rolValido });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
    }
    res.status(500).json({ message: "Error al crear usuario" });
  }
};


// Actualizar administrador (solo los campos enviados)
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;

    if (!id) {
      return res.status(400).json({ message: "Falta el ID del administrador" });
    }

    // Si no hay campos a actualizar
    if (!campos || Object.keys(campos).length === 0) {
      return res.status(400).json({ message: "No se enviaron campos para actualizar" });
    }

    // Construir dinámicamente la consulta SQL
    const columnas = [];
    const valores = [];

    for (const [campo, valor] of Object.entries(campos)) {
      columnas.push(`${campo} = ?`);
      valores.push(valor);
    }

    valores.push(id);

    const sql = `
      UPDATE usuarios 
      SET ${columnas.join(', ')} 
      WHERE id_usuario = ?
    `;

    const [result] = await pool.query(sql, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }

    res.json({ message: "Administrador actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar administrador:", error);
    res.status(500).json({ message: "Error al actualizar administrador" });
  }
};

// Eliminar administrador
const deleteAdmin = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id_usuario = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Administrador no encontrado" });
    res.json({ message: "Administrador eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar administrador" });
  }
};

module.exports = {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin
}
