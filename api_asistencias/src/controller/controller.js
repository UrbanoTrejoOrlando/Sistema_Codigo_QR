const pool = require("../config/db");

// Obtener totales de alumnos por grado y total general
const obtenerTotalesPorGrado = async (req, res) => {
  try {
    // Totales por grado desde la tabla alumnos
    const [totalesPorGrado] = await pool.query(`
      SELECT 
        a.id_grado,
        CASE 
          WHEN a.id_grado = 1 THEN 'Primero'
          WHEN a.id_grado = 2 THEN 'Segundo'
          WHEN a.id_grado = 3 THEN 'Tercero'
          ELSE CONCAT('Grado ', a.id_grado)
        END AS grado,
        COUNT(a.id_alumno) AS total_alumnos
      FROM alumnos a
      GROUP BY a.id_grado
      ORDER BY a.id_grado;
    `);

    // Total general
    const [totalGeneral] = await pool.query(`
      SELECT COUNT(id_alumno) AS total_general FROM alumnos;
    `);

    res.json({
      total_general: totalGeneral[0].total_general,
      totales_por_grado: totalesPorGrado
    });

  } catch (error) {
    console.error("Error al obtener totales por grado:", error);
    res.status(500).json({ message: "Error al obtener totales por grado" });
  }
};

// Obtener alumnos por grado
const obtenerAlumnosPorGrado = async (req, res) => {
  const { id_grado } = req.params;

  try {
    const [alumnos] = await pool.query(
      `
      SELECT 
        id_alumno,
        nombre_alumno,
        folio,
        no_lista,
        id_grado
      FROM alumnos
      WHERE id_grado = ?
      ORDER BY no_lista ASC;
      `,
      [id_grado]
    );

    if (alumnos.length === 0) {
      return res.status(404).json({ message: "No hay alumnos en este grado" });
    }

    res.json(alumnos);
  } catch (error) {
    console.error("Error al obtener alumnos por grado:", error);
    res.status(500).json({ message: "Error al obtener alumnos por grado" });
  }
};

// Obtener información de un alumno por ID
const obtenerInfoAlumno = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscamos el alumno por ID y unimos la tabla de tutores
    const [rows] = await pool.query(`
      SELECT 
        a.id_alumno,
        a.nombre_alumno,
        a.folio,
        a.no_lista,
        a.id_grado,
        t.nombre_tutor,
        t.telefono,
        t.direccion
      FROM alumnos a
      LEFT JOIN tutores t ON a.id_tutor = t.id_tutor
      WHERE a.id_alumno = ?;
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    // Retornamos la información del alumno con su tutor
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la información del alumno:', error);
    res.status(500).json({ message: 'Error al obtener la información del alumno' });
  }
};

// Obtener las fechas y horas de registro (asistencias) de un alumno
const obtenerAsistenciasPorAlumno = async (req, res) => {
  try {
    const { id_alumno } = req.params;

    const [asistencias] = await pool.query(
      `
      SELECT 
        fecha,
        hora_entrada
      FROM registro
      WHERE id_alumno = ?
      ORDER BY fecha DESC, hora_entrada DESC;
      `,
      [id_alumno]
    );

    if (asistencias.length === 0) {
      return res.status(404).json({ message: "No hay registros de asistencia para este alumno" });
    }

    res.json(asistencias);
  } catch (error) {
    console.error("Error al obtener asistencias del alumno:", error);
    res.status(500).json({ message: "Error al obtener asistencias del alumno" });
  }
};

// Registrar asistencia (pase de lista)
const registrarAsistencia = async (req, res) => {
  try {
    const { folio, hora_entrada } = req.body;

    if (!folio || !hora_entrada) {
      return res.status(400).json({ message: "Folio y hora de entrada son requeridos" });
    }

    // Buscar al alumno por folio
    const [alumno] = await pool.query(
      "SELECT id_alumno FROM alumnos WHERE folio = ?",
      [folio]
    );

    if (alumno.length === 0) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    const id_alumno = alumno[0].id_alumno;

    // Obtener la fecha local real (no UTC)
    const fecha = new Date();
    const offset = fecha.getTimezoneOffset();
    const fechaLocal = new Date(fecha.getTime() - offset * 60 * 1000);
    const fechaSQL = fechaLocal.toISOString().split("T")[0];

    // Insertar el registro en la tabla "registro"
    await pool.query(
      "INSERT INTO registro (id_alumno, fecha, hora_entrada) VALUES (?, ?, ?)",
      [id_alumno, fechaSQL, hora_entrada]
    );

    res.json({
      message: "Asistencia registrada correctamente",
      id_alumno,
      fecha: fechaSQL,
      hora_entrada
    });
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    res.status(500).json({ message: "Error al registrar asistencia" });
  }
};

// DELETE: eliminar todos los registros
const deleteRegistro = async (req, res) => {
  try {
    // Ejecutar query
    const [result] = await pool.query("DELETE FROM registro");

    res.json({
      message: "Todos los registros fueron eliminados correctamente",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al eliminar los registros",
      error: error.message,
    });
  }
};

module.exports = { 
  obtenerTotalesPorGrado,
  obtenerAlumnosPorGrado,
  obtenerInfoAlumno,
  obtenerAsistenciasPorAlumno,
  registrarAsistencia,
  deleteRegistro
};
