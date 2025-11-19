# 🔬 Debug Profesional - Diagnóstico Sistemático

## 🎯 Objetivo

Identificar exactamente dónde está fallando el flujo de tracking mediante tests escalares desde el servidor hasta WordPress.

---

## 📊 Flujo Completo del Tracking

```
WordPress (Script) → Backend (/track) → MongoDB → Dashboard
     ↓                    ↓                ↓           ↓
  Test 1            Test 2           Test 3      Test 4
```

Vamos a probar cada punto del flujo.

---

## 🧪 Test 1: Backend - Endpoint /track (Postman/cURL)

### Objetivo
Verificar que el endpoint `/track` funcione correctamente y guarde en MongoDB.

### Desde el Servidor (SSH)

```bash
# Conéctate por SSH
ssh root@srv1092754.hstgr.cloud

# Test con curl
curl -X POST http://localhost:3000/track \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4",
    "event_type": "page_view",
    "page_url": "https://test-debug.com/",
    "gclid": "debug_test_001",
    "utm_source": "debug",
    "utm_medium": "test",
    "utm_campaign": "debug_profesional",
    "referrer": null,
    "timestamp": "2025-01-18T20:00:00.000Z"
  }'
```

**Resultado Esperado:**
```json
{
  "message": "Evento recibido y guardado"
}
```

### Verificar en MongoDB Inmediatamente

```bash
# En la misma sesión SSH
mongosh "mongodb+srv://diegobarreto:Diegob1234@cluster0.mongodb.net/tracking_db"

# Buscar el evento que acabamos de enviar
db.events.findOne({
  gclid: "debug_test_001",
  utm_campaign: "debug_profesional"
})
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
    medium: "test"
  },
  gclid: "debug_test_001",
  utm_campaign: "debug_profesional",
  pageUrl: "https://test-debug.com/",
  timestamp: ISODate("2025-01-18T20:00:00.000Z"),
  createdAt: ISODate("..."),
  __v: 0
}
```

### ✅ Resultado del Test 1

- [ ] **cURL devuelve:** `{"message": "Evento recibido y guardado"}`
- [ ] **Evento aparece en MongoDB** con el campo `trafficSource`
- [ ] **trafficSource.type** es "paid"
- [ ] **trafficSource.platform** es "google"

**Si este test FALLA:**
- El problema está en el backend o MongoDB
- Necesitamos revisar los logs del servidor

**Si este test PASA:**
- El backend funciona correctamente
- El problema está en el script de WordPress o CORS

---

## 🧪 Test 2: Backend - Endpoint /track desde Fuera (CORS)

### Objetivo
Verificar que el endpoint funcione desde un dominio externo (simular WordPress).

### Desde tu Computadora Local

Crea un archivo `test-cors.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test CORS - Metrics Lab</title>
</head>
<body>
    <h1>Test CORS</h1>
    <button onclick="testTracking()">Enviar Evento de Prueba</button>
    <pre id="result"></pre>

    <script>
        function testTracking() {
            const resultEl = document.getElementById('result');
            resultEl.textContent = 'Enviando...';

            fetch('https://app.metricslab.io/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey: 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4',
                    event_type: 'page_view',
                    page_url: 'https://test-cors.com/',
                    gclid: 'cors_test_002',
                    utm_source: 'cors',
                    utm_medium: 'test',
                    utm_campaign: 'test_cors',
                    referrer: null,
                    timestamp: new Date().toISOString()
                })
            })
            .then(response => response.json())
            .then(data => {
                resultEl.textContent = '✅ ÉXITO:\n' + JSON.stringify(data, null, 2);
            })
            .catch(error => {
                resultEl.textContent = '❌ ERROR:\n' + error.toString();
            });
        }
    </script>
</body>
</html>
```

**Cómo usar:**
1. Guarda el archivo como `test-cors.html`
2. Ábrelo en tu navegador (doble clic)
3. Haz clic en "Enviar Evento de Prueba"
4. Presiona F12 → Console para ver errores

### ✅ Resultado del Test 2

- [ ] **Botón devuelve:** `✅ ÉXITO: {"message": "Evento recibido y guardado"}`
- [ ] **NO hay errores de CORS** en la consola
- [ ] **Evento aparece en MongoDB** con gclid="cors_test_002"

**Si este test FALLA con error de CORS:**
- El problema es CORS en el backend
- Necesitamos actualizar la configuración de CORS

**Si este test PASA:**
- CORS funciona correctamente
- El problema está específicamente en WordPress

---

## 🧪 Test 3: WordPress - Verificar que el Script se Cargue

### Objetivo
Verificar que el script esté instalado y se ejecute en WordPress.

### Paso 1: Ver el Código Fuente de la Página

1. **Abre:** https://abogadodebancarrota.com/
2. **Clic derecho → Ver código fuente** (o Ctrl+U)
3. **Busca:** "Metrics Lab" (Ctrl+F)

**¿Qué deberías ver?**
```javascript
// Metrics Lab Tracking Script - WordPress Safe Version v2.1.0
(function() {
  var API_KEY = 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4';
  var TRACKING_ENDPOINT = 'https://app.metricslab.io/track';
  ...
})();
```

### ✅ Resultado del Test 3.1

- [ ] **El script aparece** en el código fuente
- [ ] **API_KEY es correcto:** `key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4`
- [ ] **TRACKING_ENDPOINT es correcto:** `https://app.metricslab.io/track`
- [ ] **Versión es 2.1.0**

**Si el script NO aparece:**
- El snippet no está activado en WordPress
- O el cache no se purgó

**Si el script SÍ aparece:**
- Continúa con Test 3.2

### Paso 2: Verificar que el Script se Ejecute

1. **Abre:** https://abogadodebancarrota.com/
2. **Presiona F12 → Console**
3. **Escribe:** `window.MetricsLab`
4. **Presiona Enter**

**¿Qué deberías ver?**
```javascript
{
  track: ƒ track(eventType, additionalData),
  trackPageView: ƒ trackPageView(),
  trackCallClick: ƒ trackCallClick(element),
  trackFormSubmit: ƒ trackFormSubmit(form),
  version: "2.1.0"
}
```

### ✅ Resultado del Test 3.2

- [ ] **`window.MetricsLab` existe**
- [ ] **`version` es "2.1.0"**

**Si `window.MetricsLab` es undefined:**
- El script no se está ejecutando
- Hay un error de JavaScript que lo detiene

**Si `window.MetricsLab` existe:**
- El script se cargó correctamente
- Continúa con Test 3.3

### Paso 3: Verificar Errores de JavaScript

1. **Presiona F12 → Console**
2. **Busca mensajes en ROJO** (errores)

**¿Hay errores?**
- [ ] **NO hay errores** → Continúa con Test 4
- [ ] **SÍ hay errores** → Copia el error completo

---

## 🧪 Test 4: WordPress - Verificar que el Script Envíe Eventos

### Objetivo
Verificar que el script envíe eventos al backend.

### Paso 1: Activar Debug Mode

1. **Ve a:** WordPress → Snippets → All Snippets
2. **Abre tu snippet**
3. **Cambia:** `var DEBUG_MODE = false;` a `var DEBUG_MODE = true;`
4. **Guarda**
5. **Purga el cache**

### Paso 2: Ver los Logs

1. **Abre modo incógnito:** https://abogadodebancarrota.com/?gclid=wp_test_003&utm_campaign=test_wordpress
2. **Presiona F12 → Console**

**¿Qué deberías ver?**
```
[Metrics Lab] Inicializando Metrics Lab...
[Metrics Lab] Enviando evento: {
  apiKey: "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4",
  event_type: "page_view",
  page_url: "https://abogadodebancarrota.com/?gclid=wp_test_003&utm_campaign=test_wordpress",
  gclid: "wp_test_003",
  utm_campaign: "test_wordpress",
  ...
}
[Metrics Lab] Evento enviado: page_view
```

### ✅ Resultado del Test 4.1

- [ ] **Ves:** `[Metrics Lab] Inicializando...`
- [ ] **Ves:** `[Metrics Lab] Enviando evento:`
- [ ] **Ves:** `[Metrics Lab] Evento enviado:`
- [ ] **NO hay errores en rojo**

**Si NO ves estos mensajes:**
- DEBUG_MODE no está activado
- O el cache no se purgó

**Si SÍ ves estos mensajes:**
- Continúa con Test 4.2

### Paso 3: Verificar el Request en Network

1. **Presiona F12 → Network**
2. **Filtra por:** "track"
3. **Refresca la página** (F5)

**¿Ves un request a `track`?**
- [ ] **SÍ** → Haz clic en él
- [ ] **NO** → El script no está enviando el request

### Si ves el request:

1. **Haz clic en el request "track"**
2. **Ve a la pestaña "Headers"**
3. **Verifica:**
   - Request URL: `https://app.metricslab.io/track`
   - Request Method: `POST`
   - Status Code: `200 OK` (o el código que sea)

4. **Ve a la pestaña "Payload"**
5. **Verifica que el JSON tenga:**
   ```json
   {
     "apiKey": "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4",
     "event_type": "page_view",
     "gclid": "wp_test_003",
     ...
   }
   ```

6. **Ve a la pestaña "Response"**
7. **¿Qué dice?**

### ✅ Resultado del Test 4.2

- [ ] **Request aparece** en Network
- [ ] **Status Code:** _____ (anota el código)
- [ ] **Response:** _____ (anota la respuesta)

**Posibles Status Codes:**
- **200 OK** → El evento se envió correctamente
- **401 Unauthorized** → API Key incorrecto
- **404 Not Found** → Endpoint incorrecto
- **500 Server Error** → Error en el backend
- **CORS Error** → Problema de CORS

---

## 🧪 Test 5: MongoDB - Verificar que el Evento se Guardó

### Objetivo
Verificar que el evento de WordPress llegó a MongoDB.

```bash
# Conéctate por SSH
ssh root@srv1092754.hstgr.cloud

# Conéctate a MongoDB
mongosh "mongodb+srv://diegobarreto:Diegob1234@cluster0.mongodb.net/tracking_db"

# Buscar el evento de WordPress
db.events.findOne({
  gclid: "wp_test_003",
  utm_campaign: "test_wordpress"
})
```

### ✅ Resultado del Test 5

- [ ] **Evento existe** en MongoDB
- [ ] **Tiene campo `trafficSource`**
- [ ] **timestamp es reciente** (últimos 5 minutos)

---

## 📊 Matriz de Diagnóstico

| Test | Resultado | Problema Identificado |
|------|-----------|----------------------|
| Test 1 (cURL) | ❌ FALLA | Backend o MongoDB no funciona |
| Test 1 (cURL) | ✅ PASA | Backend funciona, problema en WordPress |
| Test 2 (CORS) | ❌ FALLA | Problema de CORS |
| Test 2 (CORS) | ✅ PASA | CORS funciona, problema en WordPress |
| Test 3.1 (Código fuente) | ❌ NO aparece | Script no instalado o cache |
| Test 3.2 (window.MetricsLab) | ❌ undefined | Script no se ejecuta |
| Test 3.3 (Errores JS) | ❌ HAY errores | Error de JavaScript |
| Test 4.1 (Debug logs) | ❌ NO aparecen | Script no se ejecuta |
| Test 4.2 (Network) | ❌ NO aparece | Script no envía request |
| Test 4.2 (Network) | ✅ 200 OK | Request exitoso |
| Test 4.2 (Network) | ❌ 401 | API Key incorrecto |
| Test 4.2 (Network) | ❌ CORS | Problema de CORS |
| Test 5 (MongoDB) | ❌ NO existe | Evento no se guardó |
| Test 5 (MongoDB) | ✅ Existe | Todo funciona |

---

## 🎯 Instrucciones

**Ejecuta los tests EN ORDEN:**

1. **Test 1** - cURL desde el servidor
2. **Test 2** - CORS desde archivo HTML local
3. **Test 3** - Verificar script en WordPress
4. **Test 4** - Verificar envío de eventos
5. **Test 5** - Verificar en MongoDB

**Para cada test, anota:**
- ✅ PASA o ❌ FALLA
- Si falla, copia el error completo
- Si pasa, continúa con el siguiente

**Dime los resultados de cada test y identificaremos exactamente dónde está el problema.** 🔬
