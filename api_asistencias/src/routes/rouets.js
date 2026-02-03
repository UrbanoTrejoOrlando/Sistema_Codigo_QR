const express = require("express");
const router = express.Router();
const { obtenerTotalesPorGrado, obtenerAlumnosPorGrado, obtenerInfoAlumno, obtenerAsistenciasPorAlumno, registrarAsistencia, deleteRegistro } = require("../controller/controller");

router.get("/totales-grado", obtenerTotalesPorGrado);
router.get("/alumnos/:id_grado", obtenerAlumnosPorGrado);
router.get('/alumnos/info/:id', obtenerInfoAlumno);
router.get("/asistencias/:id_alumno", obtenerAsistenciasPorAlumno);
router.post("/asistencias", registrarAsistencia);
router.delete("/deleteregister", deleteRegistro);

module.exports = router;
