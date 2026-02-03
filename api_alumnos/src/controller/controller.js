const pool = require("../config/db");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const stream = require("stream");

// Carpeta para guardar QRs
const QR_DIR = path.join(__dirname, "../public/qrs");
if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR, { recursive: true });

// Obtener grados
const obtenerGrados = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL sp_mostrar_grados()");
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener grados:", error);
    res.status(500).json({ message: "Error al obtener grados" });
  }
};

// Agregar nuevo alumno (genera QR automáticamente)
const agregarAlumno = async (req, res) => {
  const { nombre, folio, nolista, grado, tutor, direccion, telefono } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Insertar tutor
    const [resultTutor] = await conn.query(
      "INSERT INTO tutores(nombre_tutor, direccion, telefono) VALUES (?, ?, ?)",
      [tutor, direccion, telefono]
    );
    const idTutor = resultTutor.insertId;

    // Insertar alumno
    const [resultAlumno] = await conn.query(
      "INSERT INTO alumnos(id_tutor, id_grado, nombre_alumno, folio, no_lista) VALUES (?, ?, ?, ?, ?)",
      [idTutor, grado, nombre, folio, nolista]
    );
    const idAlumno = resultAlumno.insertId;

    // Generar QR
    const qrData = { id: idAlumno, nombre, folio, grado, tutor, direccion, telefono, no_lista: nolista };
    const qrPath = path.join(QR_DIR, `alumno_${folio}.png`);
    await QRCode.toFile(qrPath, JSON.stringify(qrData), { width: 300, margin: 2 });

    await conn.commit();

    res.json({
      message: "Alumno agregado correctamente y QR generado",
      qrPath: `/alumnos/qr/image/${folio}`,
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error al agregar alumno:", error);
    res.status(500).json({ message: "Error al agregar alumno" });
  } finally {
    conn.release();
  }
};

// Obtener alumnos por grado
const obtenerAlumnosPorGrado = async (req, res) => {
  const { id_grado } = req.params;
  try {
    const [alumnos] = await pool.query(
      `SELECT 
          a.id_alumno, a.nombre_alumno, a.folio, a.no_lista,
          t.nombre_tutor AS tutor, t.direccion, t.telefono, a.id_grado
       FROM alumnos a
       JOIN tutores t ON a.id_tutor = t.id_tutor
       WHERE a.id_grado = ?`,
      [id_grado]
    );
    res.json(alumnos);
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    res.status(500).json({ message: "Error al obtener alumnos" });
  }
};

// Editar alumno (regenera QR)
const editarAlumno = async (req, res) => {
  const { id_alumno } = req.params;
  const { nombre, folio, nolista, grado, tutor, direccion, telefono } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [alumnoRows] = await conn.query("SELECT id_tutor FROM alumnos WHERE id_alumno = ?", [id_alumno]);
    if (!alumnoRows.length) return res.status(404).json({ message: "Alumno no encontrado" });

    const idTutor = alumnoRows[0].id_tutor;

    // Actualizar tutor
    await conn.query(
      "UPDATE tutores SET nombre_tutor = ?, direccion = ?, telefono = ? WHERE id_tutor = ?",
      [tutor, direccion, telefono, idTutor]
    );

    // Actualizar alumno
    await conn.query(
      "UPDATE alumnos SET nombre_alumno = ?, folio = ?, no_lista = ?, id_grado = ? WHERE id_alumno = ?",
      [nombre, folio, nolista, grado, id_alumno]
    );

    // Regenerar QR
    const qrData = { id: id_alumno, nombre, folio, grado, tutor, direccion, telefono, no_lista: nolista };
    const qrPath = path.join(QR_DIR, `alumno_${folio}.png`);
    await QRCode.toFile(qrPath, JSON.stringify(qrData), { width: 300, margin: 2 });

    await conn.commit();
    res.json({ message: "Alumno editado correctamente y QR actualizado" });
  } catch (error) {
    await conn.rollback();
    console.error("Error al editar alumno:", error);
    res.status(500).json({ message: "Error al editar alumno" });
  } finally {
    conn.release();
  }
};

// Obtener alumno por ID
const obtenerAlumnoPorId = async (req, res) => {
  const { id_alumno } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT a.id_alumno, a.nombre_alumno, a.folio, a.no_lista, a.id_grado,
              t.nombre_tutor, t.direccion, t.telefono
       FROM alumnos a
       JOIN tutores t ON a.id_tutor = t.id_tutor
       WHERE a.id_alumno = ?`,
      [id_alumno]
    );
    if (!rows.length) return res.status(404).json({ message: "Alumno no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener alumno:", error);
    res.status(500).json({ message: "Error al obtener alumno" });
  }
};

// Eliminar alumno y tutor (borra QR también)
const eliminarAlumno = async (req, res) => {
  const { id_alumno } = req.params;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [alumnoRows] = await conn.query("SELECT id_tutor, folio FROM alumnos WHERE id_alumno = ?", [id_alumno]);
    if (!alumnoRows.length) return res.status(404).json({ message: "Alumno no encontrado" });

    const { id_tutor, folio } = alumnoRows[0];

    await conn.query("DELETE FROM alumnos WHERE id_alumno = ?", [id_alumno]);
    await conn.query("DELETE FROM tutores WHERE id_tutor = ?", [id_tutor]);

    const qrPath = path.join(QR_DIR, `alumno_${folio}.png`);
    if (fs.existsSync(qrPath)) fs.unlinkSync(qrPath);

    await conn.commit();
    res.json({ message: "Alumno y tutor eliminados correctamente" });
  } catch (error) {
    await conn.rollback();
    console.error("Error al eliminar alumno:", error);
    res.status(500).json({ message: "Error al eliminar alumno" });
  } finally {
    conn.release();
  }
};

// Mostrar QR en navegador
const mostrarQR = async (req, res) => {
  const { folio } = req.params;
  const qrPath = path.join(QR_DIR, `alumno_${folio}.png`);

  if (!fs.existsSync(qrPath)) return res.status(404).json({ message: "QR no encontrado" });

  res.sendFile(qrPath);
};

// Descargar tarjetas PDF solo del grupo especificado
const downloadCardsByGroup = async (req, res) => {
  try {
    const { id_grado } = req.params; // 👈 recibe el identificador del grupo desde la URL

    // Validación básica
    if (!id_grado) {
      return res.status(400).json({ message: "Falta el parámetro id_grado" });
    }

    const [alumnos] = await pool.query(`
      SELECT a.id_alumno, a.nombre_alumno, a.folio, a.no_lista, a.id_grado, 
             t.nombre_tutor AS tutor, t.direccion, t.telefono
      FROM alumnos a
      JOIN tutores t ON a.id_tutor = t.id_tutor
      WHERE a.id_grado = ?
      ORDER BY a.no_lista ASC
    `, [id_grado]); // 👈 parámetro dinámico, seguro contra inyección SQL

    if (!alumnos.length)
      return res.status(404).json({ message: "No hay alumnos registrados en este grupo" });

    // Configuración del PDF
    const doc = new PDFDocument({ size: "A4", margin: 20 });
    const passthrough = new stream.PassThrough();

    res.setHeader("Content-Disposition", `attachment; filename=tarjetas_grupo_${id_grado}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(passthrough);

    // Constantes de posicionamiento
    const CARD_WIDTH = 250;
    const CARD_HEIGHT = 200;
    const SPACING_X = 20;
    const SPACING_Y = 20;
    const MARGIN_X = 30;
    const MARGIN_Y = 30;
    const CARDS_PER_ROW = 2;

    let x = MARGIN_X;
    let y = MARGIN_Y;
    let cardCount = 0;

    for (const alumno of alumnos) {
      doc.rect(x, y, CARD_WIDTH, CARD_HEIGHT).stroke();

      const centerX = x + CARD_WIDTH / 2;

      // Nombre
      doc.fontSize(12).text(alumno.nombre_alumno, centerX - 79, y + 15, {
        align: "center",
        width: 0
      });

      // Info
      doc.fontSize(10).text(`Grado: ${alumno.id_grado}`, centerX - 100, y + 40, { width: 200, align: "center" });
      doc.text(`Folio: ${alumno.folio}`, centerX - 100, y + 55, { width: 200, align: "center" });
      doc.text(`Tutor: ${alumno.tutor}`, centerX - 100, y + 70, { width: 200, align: "center" });

      // QR
      const qrPath = path.join(QR_DIR, `alumno_${alumno.folio}.png`);
      if (fs.existsSync(qrPath)) {
        doc.image(qrPath, centerX - 50, y + 90, { width: 100, height: 100 });
      }

      // Mover posición
      cardCount++;
      if (cardCount % CARDS_PER_ROW === 0) {
        x = MARGIN_X;
        y += CARD_HEIGHT + SPACING_Y;
      } else {
        x += CARD_WIDTH + SPACING_X;
      }

      // Nueva página
      if (y + CARD_HEIGHT + MARGIN_Y > doc.page.height) {
        doc.addPage();
        x = MARGIN_X;
        y = MARGIN_Y;
      }
    }

    doc.end();
    passthrough.pipe(res);

  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).json({ message: "Error generando PDF", error: error.message });
  }
};


// 📄 Generar PDF con lista de alumnos por grupo
const downloadListaByGroup = async (req, res) => {
  try {
    const { id_grado } = req.params;

    if (!id_grado) {
      return res.status(400).json({ message: "Falta el parámetro id_grado" });
    }

    // 🔹 Consulta los alumnos del grupo
    const [alumnos] = await pool.query(`
      SELECT a.no_lista, a.nombre_alumno, a.folio, a.id_grado, 
             t.nombre_tutor AS tutor, t.telefono
      FROM alumnos a
      JOIN tutores t ON a.id_tutor = t.id_tutor
      WHERE a.id_grado = ?
      ORDER BY a.no_lista ASC
    `, [id_grado]);

    if (!alumnos.length) {
      return res.status(404).json({ message: "No hay alumnos registrados en este grupo" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const passthrough = new stream.PassThrough();

    res.setHeader("Content-Disposition", `attachment; filename=lista_grupo_${id_grado}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(passthrough);

    // 🏫 Encabezado principal
    doc.fontSize(18).text(`Lista de alumnos - Grupo ${id_grado}`, { align: "center" });
    doc.moveDown(1);

    // Coordenadas iniciales
    let startY = doc.y;
    const startX = 50;
    const colWidths = [40, 180, 80, 150, 80]; // columnas
    const rowHeight = 20;

    // 🧱 Encabezados de la tabla
    const headers = ["No.", "Nombre del Alumno", "Folio", "Tutor", "Teléfono"];
    let x = startX;

    doc.fontSize(12).font("Helvetica-Bold");
    headers.forEach((header, i) => {
      doc.text(header, x, startY, { width: colWidths[i], align: "left" });
      x += colWidths[i];
    });

    // Línea divisoria
    doc.moveTo(startX, startY + 15).lineTo(560, startY + 15).stroke();
    doc.moveDown(0.5);

    // 📋 Filas
    doc.font("Helvetica").fontSize(10);
    let y = startY + 25;

    alumnos.forEach((a) => {
      x = startX;

      // Si la página se llena, agregar nueva
      if (y > 750) {
        doc.addPage();
        y = 60;
      }

      // Escribir cada celda
      const row = [
        a.no_lista,
        a.nombre_alumno,
        a.folio,
        a.tutor,
        a.telefono || "—",
      ];

      row.forEach((text, i) => {
        doc.text(String(text), x, y, { width: colWidths[i], align: "left" });
        x += colWidths[i];
      });

      // Avanzar fila
      y += rowHeight;

      // Línea divisoria entre filas
      doc.moveTo(startX, y - 5).lineTo(560, y - 5).strokeColor("#ccc").stroke();
    });

    doc.end();
    passthrough.pipe(res);

  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).json({ message: "Error generando PDF", error: error.message });
  }
};


module.exports = {
  obtenerGrados,
  agregarAlumno,
  obtenerAlumnosPorGrado,
  editarAlumno,
  obtenerAlumnoPorId,
  eliminarAlumno,
  mostrarQR,
  downloadCardsByGroup,
  downloadListaByGroup
};
