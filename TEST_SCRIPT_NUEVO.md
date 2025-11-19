# 🧪 Test del Script Nuevo - En Vivo

## 🎯 Objetivo

Verificar que el script nuevo (v2.1.0) esté capturando eventos HOY con el campo `trafficSource` correctamente.

---

## 📋 Test 1: Verificar que el Script Nuevo Esté Instalado

### Paso 1: Abrir tu Sitio

1. **Abre:** https://abogadodebancarrota.com/
2. **Presiona F12**
3. **Ve a Console**
4. **Escribe:** `window.MetricsLab`
5. **Presiona Enter**

**¿Qué deberías ver?**
```javascript
{
  track: function,
  trackPageView: function,
  trackCallClick: function,
  trackFormSubmit: function,
  version: "2.1.0"  // ← IMPORTANTE: Debe ser 2.1.0
}
```

**Si ves version: "2.0.0":**
- El script viejo sigue cargado
- Necesitas purgar el cache

**Si ves version: "2.1.0":**
- ✅ Script nuevo instalado correctamente

---

## 📋 Test 2: Activar Debug Mode

### Paso 1: Activar Debug en WordPress

1. **Ve a:** https://abogadodebancarrota.com/wp-admin/
2. **Ve a:** Snippets → All Snippets
3. **Abre tu snippet de Metrics Lab**
4. **Busca la línea:**
   ```javascript
   var DEBUG_MODE = false;
   ```
5. **Cámbiala a:**
   ```javascript
   var DEBUG_MODE = true;
   ```
6. **Guarda**
7. **Purga el cache:** LiteSpeed Cache → Purge All

### Paso 2: Ver los Logs

1. **Abre tu sitio en modo incógnito:** https://abogadodebancarrota.com/
2. **Presiona F12 → Console**

**Deberías ver:**
```
[Metrics Lab] Inicializando Metrics Lab...
[Metrics Lab] Enviando evento: {
  apiKey: "key_...",
  event_type: "page_view",
  page_url: "https://abogadodebancarrota.com/",
  referrer: null,
  timestamp: "2025-01-18T..."
  gclid: null,
  fbclid: null,
  ...
}
[Metrics Lab] Evento enviado: page_view
[Metrics Lab] Metrics Lab inicializado
```

**IMPORTANTE:** Copia todo el objeto que dice "Enviando evento" y pégalo aquí.

---

## 📋 Test 3: Enviar un Evento de Prueba con Campaña

### Paso 1: Visitar con Parámetros de Campaña

1. **Abre modo incógnito**
2. **Ve a esta URL:**
   ```
   https://abogadodebancarrota.com/?gclid=test_nuevo_script_2025&utm_source=google&utm_medium=cpc&utm_campaign=test_script_nuevo&utm_content=verificacion_hoy
   ```
3. **Presiona F12 → Console**

**Deberías ver:**
```
[Metrics Lab] Enviando evento: {
  apiKey: "key_...",
  event_type: "page_view",
  page_url: "https://abogadodebancarrota.com/?gclid=test_nuevo_script_2025&utm_source=google...",
  gclid: "test_nuevo_script_2025",
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "test_script_nuevo",
  utm_content: "verificacion_hoy",
  timestamp: "2025-01-18T..."
}
```

**Copia ese objeto completo.**

---

## 📋 Test 4: Verificar en MongoDB que el Evento se Guardó

### Opción A: Desde SSH

```bash
# Conéctate por SSH
ssh root@srv1092754.hstgr.cloud

# Conéctate a MongoDB
mongosh "tu_mongodb_uri"

# Usa la base de datos
use tracking_db

# Buscar el evento de prueba (últimos 5 minutos)
db.events.find({
  gclid: "test_nuevo_script_2025",
  utm_campaign: "test_script_nuevo"
}).sort({timestamp: -1}).limit(1).pretty()
```

**¿Qué deberías ver?**
```javascript
{
  _id: ObjectId("..."),
  apiKey: "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4",
  eventType: "page_view",
  trafficSource: {
    type: "paid",
    platform: "google",
    medium: "cpc"
  },
  gclid: "test_nuevo_script_2025",
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "test_script_nuevo",
  utm_content: "verificacion_hoy",
  pageUrl: "https://abogadodebancarrota.com/?gclid=...",
  timestamp: ISODate("2025-01-18T..."),
  createdAt: ISODate("2025-01-18T..."),
  __v: 0
}
```

**IMPORTANTE:** Verifica que tenga el campo `trafficSource` con `type`, `platform` y `medium`.

### Opción B: Desde MongoDB Atlas (Web)

1. **Ve a:** https://cloud.mongodb.com/
2. **Inicia sesión**
3. **Ve a tu cluster**
4. **Browse Collections**
5. **Selecciona:** tracking_db → events
6. **Filtra por:**
   ```json
   {
     "gclid": "test_nuevo_script_2025"
   }
   ```

**Deberías ver el evento con el campo `trafficSource`.**

---

## 📋 Test 5: Verificar en el Dashboard

### Paso 1: Refrescar el Dashboard

1. **Ve a:** https://app.metricslab.io/
2. **Abre tu proyecto**
3. **Presiona Ctrl+F5** (refresh completo)
4. **Ve a la pestaña "Paid Campaigns"**

**Deberías ver:**
- Una campaña llamada "test_script_nuevo"
- Con 1 visita
- Platform: Google
- Medium: CPC

### Paso 2: Verificar los Detalles

1. **Haz clic en la campaña "test_script_nuevo"**
2. **Deberías ver:**
   - URL: https://abogadodebancarrota.com/?gclid=...
   - gclid: test_nuevo_script_2025
   - utm_content: verificacion_hoy

---

## 📋 Test 6: Verificar Tráfico Orgánico

### Paso 1: Simular Tráfico Orgánico

1. **Abre modo incógnito**
2. **Ve a:** https://www.google.com/
3. **Busca:** "abogado de bancarrota"
4. **NO hagas clic en tu resultado** (solo simularemos)
5. **En su lugar, ve directamente a:**
   ```
   https://abogadodebancarrota.com/
   ```
   **Pero ANTES, abre esta URL en una nueva pestaña:**
   ```
   https://www.google.com/search?q=abogado+de+bancarrota
   ```
6. **Desde esa pestaña de Google, abre tu sitio**

**O más fácil:**

1. **Abre modo incógnito**
2. **Pega esta URL en la barra de direcciones:**
   ```
   https://abogadodebancarrota.com/
   ```
3. **ANTES de presionar Enter, edita la URL para agregar un header de referrer**

**Forma más fácil (usando la consola):**

1. **Abre:** https://abogadodebancarrota.com/
2. **Presiona F12 → Console**
3. **Pega esto:**
   ```javascript
   fetch('https://app.metricslab.io/track', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       apiKey: 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4',
       event_type: 'page_view',
       page_url: 'https://abogadodebancarrota.com/',
       referrer: 'https://www.google.com/search?q=abogado+de+bancarrota',
       timestamp: new Date().toISOString()
     })
   })
   .then(r => r.json())
   .then(d => console.log('✅ Evento orgánico enviado:', d))
   .catch(e => console.error('❌ Error:', e));
   ```

### Paso 2: Verificar en MongoDB

```bash
# Buscar eventos orgánicos de hoy
db.events.find({
  "trafficSource.type": "organic",
  timestamp: {
    $gte: new Date(new Date().setHours(0,0,0,0))
  }
}).sort({timestamp: -1}).limit(5).pretty()
```

**Deberías ver eventos con:**
```javascript
trafficSource: {
  type: "organic",
  platform: "google",
  medium: "organic"
}
```

---

## 📋 Test 7: Verificar Tráfico Directo

### Paso 1: Visita Directa

1. **Cierra todas las pestañas**
2. **Abre modo incógnito**
3. **Escribe directamente en la barra:**
   ```
   abogadodebancarrota.com
   ```
4. **Presiona Enter**
5. **Presiona F12 → Console**

**Deberías ver:**
```
[Metrics Lab] Enviando evento: {
  ...
  referrer: null,
  gclid: null,
  utm_source: null,
  ...
}
```

### Paso 2: Verificar en MongoDB

```bash
# Buscar eventos directos de hoy
db.events.find({
  "trafficSource.type": "direct",
  timestamp: {
    $gte: new Date(new Date().setHours(0,0,0,0))
  }
}).sort({timestamp: -1}).limit(5).pretty()
```

**Deberías ver eventos con:**
```javascript
trafficSource: {
  type: "direct",
  platform: null,
  medium: null
}
```

---

## ✅ Checklist de Verificación

Después de hacer todos los tests:

- [ ] **Script v2.1.0 instalado** (`window.MetricsLab.version === "2.1.0"`)
- [ ] **Debug mode muestra logs** en la consola
- [ ] **Evento de prueba enviado** con gclid=test_nuevo_script_2025
- [ ] **Evento guardado en MongoDB** con campo `trafficSource`
- [ ] **Evento aparece en dashboard** en "Paid Campaigns"
- [ ] **Tráfico orgánico detectado** correctamente
- [ ] **Tráfico directo detectado** correctamente

---

## 🎯 Resultado Esperado

Si todos los tests pasan:
- ✅ El script nuevo está funcionando
- ✅ Los eventos tienen el campo `trafficSource`
- ✅ El dashboard puede clasificar el tráfico correctamente
- ✅ Todo está listo para producción

---

## 📊 Dime los Resultados

Por favor, ejecuta los tests y dime:

1. **¿Qué versión muestra `window.MetricsLab.version`?**
2. **¿Ves los logs en la consola con DEBUG_MODE?**
3. **¿El evento de prueba se guardó en MongoDB?**
4. **¿El evento tiene el campo `trafficSource`?**
5. **¿El evento aparece en el dashboard?**

Con esa información confirmaré que todo está funcionando correctamente. 💪
