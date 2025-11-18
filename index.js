const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // <-- ¡Lo re-introducimos!
require("dotenv").config();

const Event = require("./models/Event");
const TrafficSourceDetector = require("./services/trafficSourceDetector");

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

// Serve static files from public directory
app.use(express.static('public'));

// --- Configuración de CORS Simple ---
// Permitir requests desde CUALQUIER dominio
// La seguridad está en el API key, no en el dominio
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
}));
console.log('✅ CORS configurado: Permitiendo requests desde cualquier dominio');

// --- Ruta de Salud ---
app.get("/", (req, res) => {
  res.status(200).send("Tracker está vivo y saludable.");
});

// --- RUTAS DE API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/projects/:projectId/analytics', require('./routes/analyticsRoutes'));

// --- Ruta de Tracking ---
app.post("/track", async (req, res) => {
  const data = req.body;
  console.log("--- Evento Recibido ---", data);

  if (!data.apiKey) {
    console.warn("Rechazado: No se proporcionó apiKey.");
    return res.status(401).json({ message: "No autorizado: apiKey requerida" });
  }

  // Detect traffic source using TrafficSourceDetector
  const trafficSource = TrafficSourceDetector.detectSource(data);
  
  // Extract referrer domain if referrer is provided
  const referrerDomain = data.referrer 
    ? TrafficSourceDetector.extractDomain(data.referrer)
    : null;

  // Build enhanced event data with traffic source classification
  const newEventData = {
    apiKey: data.apiKey,
    eventType: data.event_type,
    
    // Traffic source classification
    trafficSource: trafficSource,
    
    // Platform-specific tracking IDs (existing + new)
    gclid: data.gclid,
    fbclid: data.fbclid,
    ttclid: data.ttclid,
    li_fat_id: data.li_fat_id,
    
    // UTM parameters (existing)
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    utm_term: data.utm_term,
    utm_content: data.utm_content,
    
    // Referrer information
    referrer: data.referrer,
    referrerDomain: referrerDomain,
    
    // Page information (existing)
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