const { Router } = require("express");
const {
  obtenerGrados,
  agregarAlumno,
  obtenerAlumnosPorGrado,
  editarAlumno,
  obtenerAlumnoPorId,
  eliminarAlumno,
  downloadCardsByGroup,
  downloadListaByGroup,
} = require("../controller/controller");

const router = Router();

// Grados
router.get("/grados", obtenerGrados);

// Nuevo alumno
router.post("/nuevoalumno", agregarAlumno);

// Alumnos por grado
router.get("/alumnosgrado/:id_grado", obtenerAlumnosPorGrado);

// Editar alumno
router.put("/editalumno/:id_alumno", editarAlumno);

// Alumno por id
router.get("/alumnoporid/:id_alumno", obtenerAlumnoPorId);

// Eliminar alumno
router.delete('/delete/:id_alumno', eliminarAlumno);

// Descargar todas las tarjetas
router.get("/card/download-all/:id_grado", downloadCardsByGroup);

// Descargar lista por grupo
router.get("/lista/:id_grado", downloadListaByGroup);

module.exports = router;
