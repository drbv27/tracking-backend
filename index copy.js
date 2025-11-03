const express = require("express");
const cors = require("cors"); // <--- Importamos CORS
const mongoose = require("mongoose");
require("dotenv").config();

const Event = require("./models/Event");

const app = express();
const PORT = process.env.PORT || 3000; // <--- Render usará process.env.PORT

// --- Conexión a la Base de Datos ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1);
  });

// --- Middleware de Seguridad CORS (¡IMPORTANTE!) ---
// Lista de dominios permitidos
const whitelist = ["https://abogadodebancarrota.com"];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite peticiones si el 'origin' está en nuestra lista blanca
    // o si la petición no tiene 'origin' (como las de Postman o de servidor a servidor)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions)); // <--- APLICAMOS LAS OPCIONES DE CORS
app.use(express.json());

// --- Ruta de Tracking ---
app.post("/track", async (req, res) => {
  const data = req.body;

  console.log("--- Evento Recibido ---");
  console.log(data);

  const newEventData = {
    eventType: data.event_type,
    gclid: data.gclid,
    pageUrl: data.page_url,
    clickedUrl: data.clicked_url,
    buttonId: data.button_id,
    buttonHref: data.button_href,
  };

  try {
    const event = new Event(newEventData);
    await event.save();
    console.log("Evento guardado en la base de datos.");
    res.status(200).json({ message: "Evento recibido y guardado" });
  } catch (dbError) {
    console.error("Error al guardar en MongoDB:", dbError.message);
    res.status(200).json({ message: "Evento recibido, error al guardar" });
  }
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  // Usamos '0.0.0.0' para que Render pueda "escuchar" correctamente
  console.log(`🚀 Servidor de tracking escuchando en el puerto ${PORT}`);
});
