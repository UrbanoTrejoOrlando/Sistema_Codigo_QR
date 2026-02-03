const QRCode = require("qrcode");
const pool = require("../config/db");
const PDFDocument = require("pdfkit");
const stream = require("stream");
const fs = require("fs");
const path = require("path");

// === 📂 Carpeta donde se guardarán los QR ===
const QR_DIR = path.join(__dirname, "..", "public", "qrs");
if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR, { recursive: true });

// === 1️⃣ GENERAR QR SIMPLE (solo folio en base64) ===
exports.getQrByFolio = async (req, res) => {
  try {
    const { folio } = req.params;

    const dataUrl = await QRCode.toDataURL(folio, {
      type: "image/png",
      errorCorrectionLevel: "H",
      width: 300,
    });

    res.json({ dataUrl });
  } catch (err) {
    console.error("❌ Error generando QR base64:", err);
    res.status(500).json({ message: "Error generando QR" });
  }
};

// === 2️⃣ GENERAR / OBTENER QR PNG CON DATOS COMPLETOS EN FORMATO PLANO ===
exports.getQrImageByFolio = async (req, res) => {
  try {
    const { folio } = req.params;
    const filename = `alumno_${folio}.png`;
    const filePath = path.join(QR_DIR, filename);

    // Buscar si ya hay QR guardado
    const [rows] = await pool.query(
      "SELECT qr_path FROM alumnos WHERE folio = ? LIMIT 1",
      [folio]
    );

    if (rows.length && rows[0].qr_path) {
      const dbPath = path.join(__dirname, "..", rows[0].qr_path);
      if (fs.existsSync(dbPath)) return res.sendFile(dbPath);
    }

    // Obtener datos completos del alumno
    const [alumnoRows] = await pool.query(
      `SELECT a.id_alumno, a.nombre_alumno, a.folio, a.no_lista,
              g.grado, a.id_grado,
              t.nombre_tutor, t.direccion, t.telefono
       FROM alumnos a
       LEFT JOIN grado g ON a.id_grado = g.id_grado
       LEFT JOIN tutores t ON a.id_tutor = t.id_tutor
       WHERE a.folio = ? LIMIT 1`,
      [folio]
    );

    let qrText;
    if (alumnoRows.length) {
      const a = alumnoRows[0];
      qrText = `ID=${a.id_alumno}|FOLIO=${a.folio}|NOMBRE=${a.nombre_alumno}|LISTA=${a.no_lista}|GRADO=${a.id_grado}|TUTOR=${a.nombre_tutor || ""}|DIRECCION=${a.direccion || ""}|TELEFONO=${a.telefono || ""}`;
    } else {
      qrText = `FOLIO=${folio}|ERROR=AlumnoNoEncontrado`;
    }

    // Generar QR limpio (UTF-8)
    await QRCode.toFile(filePath, qrText, {
      width: 350,
      margin: 1,
      errorCorrectionLevel: "H",
    });

    // Guardar ruta en BD
    if (alumnoRows.length) {
      const relPath = path.join("public", "qrs", filename).replace(/\\/g, "/");
      await pool.query("UPDATE alumnos SET qr_path = ? WHERE folio = ?", [
        relPath,
        folio,
      ]);
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error("❌ Error en getQrImageByFolio:", err);
    res.status(500).send("Error generando o entregando QR");
  }
};

// === 3️⃣ DESCARGAR TARJETA PDF INDIVIDUAL ===
exports.downloadCardPdf = async (req, res) => {
  try {
    const { id_alumno } = req.params;

    const [rows] = await pool.query(
      `SELECT a.id_alumno, a.nombre_alumno, a.folio, g.grado, a.no_lista,
              t.nombre_tutor, t.direccion, t.telefono, a.qr_path
       FROM alumnos a
       LEFT JOIN grado g ON a.id_grado = g.id_grado
       LEFT JOIN tutores t ON a.id_tutor = t.id_tutor
       WHERE a.id_alumno = ?`,
      [id_alumno]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Alumno no encontrado" });
    const alumno = rows[0];

    const doc = new PDFDocument({ size: "A6", margin: 20 });
    const passthrough = new stream.PassThrough();

    res.setHeader(
      "Content-disposition",
      `attachment; filename=tarjeta_${alumno.folio}.pdf`
    );
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(passthrough);

    // === Datos del alumno ===
    doc.fontSize(14).text(alumno.nombre_alumno, { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(12).text(alumno.grado, { align: "center" });
    doc.moveDown(0.7);
    doc.fontSize(10).text(`Folio: ${alumno.folio}`, { align: "center" });
    doc.moveDown(0.5);

    const qrText = `ID=${alumno.id_alumno}|FOLIO=${alumno.folio}|NOMBRE=${alumno.nombre_alumno}|LISTA=${alumno.no_lista}|GRADO=${alumno.id_grado || alumno.grado}|TUTOR=${alumno.nombre_tutor || ""}|DIRECCION=${alumno.direccion || ""}|TELEFONO=${alumno.telefono || ""}`;

    // Inserta QR existente o genera uno temporal
    if (alumno.qr_path && fs.existsSync(path.join(__dirname, "..", alumno.qr_path))) {
      doc.image(path.join(__dirname, "..", alumno.qr_path), (doc.page.width - 150) / 2, doc.y, { width: 150 });
    } else {
      const qrBuffer = await QRCode.toBuffer(qrText, { width: 150 });
      doc.image(qrBuffer, (doc.page.width - 150) / 2, doc.y, { width: 150 });
    }

    doc.end();
    passthrough.pipe(res);
  } catch (err) {
    console.error("❌ Error generando tarjeta individual:", err);
    res.status(500).json({ message: "Error generando PDF" });
  }
};

// === 4️⃣ DESCARGAR TODAS LAS TARJETAS PDF ===
exports.downloadAllCardsPdf = async (req, res) => {
  try {
    const [alumnos] = await pool.query(
      `SELECT a.id_alumno, a.nombre_alumno, a.folio, g.grado, a.no_lista, a.id_grado, a.qr_path, t.nombre_tutor, t.direccion, t.telefono
       FROM alumnos a 
       JOIN grado g ON a.id_grado = g.id_grado
       LEFT JOIN tutores t ON a.id_tutor = t.id_tutor
       ORDER BY g.id_grado, a.no_lista`
    );

    if (!alumnos.length)
      return res.status(404).json({ message: "No hay alumnos registrados" });

    const doc = new PDFDocument({ autoFirstPage: false });
    const passthrough = new stream.PassThrough();

    res.setHeader("Content-disposition", "attachment; filename=tarjetas_todos.pdf");
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(passthrough);

    for (const alumno of alumnos) {
      doc.addPage({ size: "A6", margin: 20 });
      doc.fontSize(12).text(alumno.nombre_alumno, { align: "center" });
      doc.moveDown(0.2);
      doc.fontSize(10).text(alumno.grado, { align: "center" });
      doc.moveDown(0.4);
      doc.fontSize(9).text(`Folio: ${alumno.folio}`, { align: "center" });
      doc.moveDown(0.4);

      const qrText = `ID=${alumno.id_alumno}|FOLIO=${alumno.folio}|NOMBRE=${alumno.nombre_alumno}|LISTA=${alumno.no_lista}|GRADO=${alumno.id_grado || alumno.grado}|TUTOR=${alumno.nombre_tutor || ""}|DIRECCION=${alumno.direccion || ""}|TELEFONO=${alumno.telefono || ""}`;

      if (alumno.qr_path && fs.existsSync(path.join(__dirname, "..", alumno.qr_path))) {
        doc.image(path.join(__dirname, "..", alumno.qr_path), (doc.page.width - 120) / 2, doc.y, { width: 120 });
      } else {
        const qrBuffer = await QRCode.toBuffer(qrText, { width: 150 });
        doc.image(qrBuffer, (doc.page.width - 120) / 2, doc.y, { width: 120 });
      }
    }

    doc.end();
    passthrough.pipe(res);
  } catch (err) {
    console.error("❌ Error generando PDF general:", err);
    res.status(500).json({ message: "Error generando PDF de todos los alumnos" });
  }
};
