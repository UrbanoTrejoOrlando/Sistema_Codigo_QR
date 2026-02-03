const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/routes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", routes);

// Puerto desde .env o valor por defecto
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto: ${PORT}`);
});
