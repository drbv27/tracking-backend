const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // <-- ¡Lo re-introducimos!
require("dotenv").config();

const Event = require("./models/Event");

const app = express();
const PORT = process.env.PORT || 3000;

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

// Middleware para parsear JSON
app.use(express.json());

// --- NUEVO: Configuración de CORS para Desarrollo ---
// En producción (cuando NODE_ENV es 'production'), Nginx maneja esto.
// En local, necesitamos permitir que nuestro frontend (en puerto 3001) hable con nosotros.
if (process.env.NODE_ENV !== 'production') {
  console.warn('Ejecutando en modo desarrollo: CORS habilitado para localhost:3001');
  const corsOptions = {
    // Permitimos solo el origen de nuestro frontend
    origin: 'http://localhost:3001', 
    // Necesario para que el frontend pueda enviar el header 'x-auth-token'
    allowedHeaders: ['Content-Type', 'x-auth-token'], 
  };
  app.use(cors(corsOptions));
}

// --- Ruta de Salud ---
app.get("/", (req, res) => {
  res.status(200).send("Tracker está vivo y saludable.");
});

// --- RUTAS DE API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// --- Ruta de Tracking ---
app.post("/track", async (req, res) => {
  const data = req.body;
  console.log("--- Evento Recibido ---", data);

  if (!data.apiKey) {
    console.warn("Rechazado: No se proporcionó apiKey.");
    return res.status(401).json({ message: "No autorizado: apiKey requerida" });
  }

  // (Toda tu lógica de guardado de eventos... queda igual)
  const newEventData = {
    apiKey: data.apiKey,
    eventType: data.event_type,
    gclid: data.gclid,
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    utm_term: data.utm_term,
    utm_content: data.utm_content,
    pageUrl: data.page_url,
    clickedUrl: data.clicked_url,
    buttonId: data.button_id,
    buttonHref: data.button_href,
  };

  try {
    const event = new Event(newEventData);
    await event.save();
    console.log("Evento (con apiKey) guardado en la base de datos.");
    res.status(200).json({ message: "Evento recibido y guardado" });
  } catch (dbError) {
    console.error("Error al guardar en MongoDB:", dbError.message);
    res.status(200).json({ message: "Evento recibido, error al guardar" });
  }
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor de tracking escuchando en el puerto ${PORT}`);
});