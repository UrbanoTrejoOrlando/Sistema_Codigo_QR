const express = require('express');
const router = express.Router();
const db = require('../config/db'); // conexión a MySQL

// ✅ Registrar asistencia desde QR
router.post('/registrar', async (req, res) => {
  try {
    const { id_alumno, nombre_alumno, folio, id_grado } = req.body;

    if (!id_alumno) {
      return res
        .status(400)
        .json({ success: false, message: 'Falta el ID del alumno.' });
    }

    // Fecha y hora actual
    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toLocaleTimeString('es-MX', { hour12: false });

    // Verificar si ya tiene asistencia hoy
    const [existe] = await db.query(
      'SELECT * FROM registro WHERE id_alumno = ? AND fecha = ?',
      [id_alumno, fecha]
    );

    if (existe.length > 0) {
      return res.status(200).json({
        success: false,
        message: `⚠️ ${nombre_alumno || 'El alumno'} ya tiene asistencia registrada hoy.`,
      });
    }

    // Insertar nuevo registro
    await db.query(
      `INSERT INTO registro 
        (id_alumno, nombre_alumno, folio, id_grado, fecha, hora_entrada, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_alumno, nombre_alumno, folio || 'Sin folio', id_grado || '-', fecha, hora, 'PRESENTE']
    );

    return res.json({
      success: true,
      message: `✅ Asistencia registrada correctamente a ${nombre_alumno}.`,
    });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor.' });
  }
});

// ✅ Obtener lista de asistencia del día
router.get('/lista', async (req, res) => {
  try {
    const fecha = new Date().toISOString().split('T')[0];

    const [rows] = await db.query(
      `
      SELECT 
        r.id_alumno,
        r.nombre_alumno,
        r.folio,
        r.id_grado,
        r.fecha,
        r.hora_entrada,
        r.estado
      FROM registro r
      WHERE r.fecha = ?
      ORDER BY r.hora_entrada ASC
      `,
      [fecha]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener lista de asistencia:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error al obtener lista de asistencia.' });
  }
});

module.exports = router;
