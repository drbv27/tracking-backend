const mongoose = require("mongoose");

// Este es el "molde" o "schema" de nuestros datos.
// Le decimos a MongoDB qué campos esperar.
const eventSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // 'page_visit' o 'button_click'
  gclid: { type: String, index: true }, // index: true para búsquedas rápidas
  pageUrl: { type: String },
  clickedUrl: { type: String },
  buttonId: { type: String },
  buttonHref: { type: String },
  timestamp: { type: Date, default: Date.now }, // MongoDB añadirá la fecha automáticamente
});

// Compilamos el molde en un "Modelo" que podemos usar
module.exports = mongoose.model("Event", eventSchema);
