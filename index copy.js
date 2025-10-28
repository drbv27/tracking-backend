const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
// 1. Habilitamos CORS para permitir peticiones desde cualquier origen (para pruebas locales)
app.use(cors());
// 2. Habilitamos que Express pueda entender JSON
app.use(express.json());

// La ruta que recibirá los datos desde WordPress
app.post("/track", (req, res) => {
  const eventData = req.body;

  console.log("--- Evento Recibido ---");
  console.log(eventData);

  // Respondemos al navegador que todo está OK
  res.status(200).json({ message: "Evento recibido con éxito" });
});

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de tracking escuchando en http://localhost:${PORT}`);
});
