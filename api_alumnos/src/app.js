const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Importar rutas
const gradosRoutes = require("./routes/routes");
const authRoutes = require("./routes/auth");
const qrRoutes = require("./routes/qr");
const asistenciaRoutes = require("./routes/asistencia");

// Configurar CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use("/public", express.static(path.join(__dirname, "public")));

// Montar rutas
app.use("/auth", authRoutes);
app.use("/alumnos", gradosRoutes);
app.use("/alumnos", qrRoutes);
app.use("/asistencia", asistenciaRoutes);

module.exports = app;
