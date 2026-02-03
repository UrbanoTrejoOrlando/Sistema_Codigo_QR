// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/rouets"); // Asegúrate de que la ruta sea correcta

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configurar CORS para tu frontend
app.use(
  cors({
    origin: "http://localhost:5173", // URL de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Permite enviar cookies y cabeceras de autenticación
  })
);

// Parsear JSON
app.use(express.json());

// Montar rutas
app.use("/api", routes);

// Puerto desde .env o valor por defecto
const PORT = process.env.PORT || 3002;

// Levantar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor de totales corriendo en el puerto ${PORT}`);
});
