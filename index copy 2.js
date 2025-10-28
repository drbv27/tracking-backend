const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // <-- NUEVO
require("dotenv").config(); // <-- NUEVO (para leer el archivo .env)

// Importamos nuestro "molde" de la base de datos
const Event = require("./models/Event"); // <-- NUEVO

const app = express();
const PORT = 3000;

// --- Conexión a la Base de Datos --- (NUEVO)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1); // Detiene la app si no se puede conectar
  });

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Ruta de Tracking (MODIFICADA) ---
app.post("/track", async (req, res) => {
  // <-- Se añade 'async'
  const data = req.body;

  // 1. Imprimimos en consola (como antes)
  console.log("--- Evento Recibido ---");
  console.log(data);

  // 2. Preparamos los datos para la BD
  const newEventData = {
    eventType: data.event_type,
    gclid: data.gclid,
    pageUrl: data.page_url,
    clickedUrl: data.clicked_url,
    buttonId: data.button_id,
    buttonHref: data.button_href,
  };

  // 3. Guardamos en MongoDB (NUEVO)
  try {
    const event = new Event(newEventData);
    await event.save(); // 'await' espera a que se guarde
    console.log("Evento guardado en la base de datos.");

    // 4. Respondemos al navegador
    res.status(200).json({ message: "Evento recibido y guardado" });
  } catch (dbError) {
    console.error("Error al guardar en MongoDB:", dbError.message);
    // Responde OK al navegador para no bloquear al usuario,
    // pero registra el error en el servidor.
    res.status(200).json({ message: "Evento recibido, error al guardar" });
  }
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor de tracking escuchando en http://localhost:${PORT}`);
});
