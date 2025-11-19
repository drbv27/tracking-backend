# 🔍 Plan de Debug Profesional - Tracking No Funciona en WordPress

## 📋 Objetivo
Identificar por qué el script de tracking instalado en WordPress no está enviando eventos al backend.

## 🎯 Metodología
Debugging de abajo hacia arriba (Bottom-Up):
1. **Capa 1**: Backend - ¿Recibe y procesa requests?
2. **Capa 2**: Red - ¿Hay problemas de CORS/conectividad?
3. **Capa 3**: Frontend - ¿El script se ejecuta correctamente?
4. **Capa 4**: WordPress - ¿Code Snippets carga el script?

---

## 🔧 FASE 1: Verificar Backend (Producción)

### Test 1.1: Endpoint `/track` Responde
**Objetivo**: Confirmar que el endpoint está activo y accesible

**Método**: Postman
- **URL**: `https://app.metricslab.io/track`
- **Method**: POST
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "apiKey": "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4",
    "event_type": "page_view",
    "page_url": "https://test-postman.com/",
    "referrer": null,
    "timestamp": "2025-11-19T00:00:00.000Z"
  }
  ```

**Resultado Esperado**:
- Status: `200 OK`
- Response: `{"message": "Evento recibido y guardado"}`

**Si falla**: Verificar logs del backend en servidor

---

### Test 1.2: Endpoint con Parámetros de Campaña
**Objetivo**: Verificar que el backend procesa correctamente parámetros UTM y gclid

**Método**: Postman
- **URL**: `https://app.metricslab.io/track`
- **Method**: POST
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "apiKey": "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4",
    "event_type": "page_view",
    "page_url": "https://test-postman.com/?gclid=test_postman_001&utm_source=postman&utm_medium=test&utm_campaign=debug_backend",
    "gclid": "test_postman_001",
    "utm_source": "postman",
    "utm_medium": "test",
    "utm_campaign": "debug_backend",
    "referrer": "https://www.google.com/search?q=test",
    "timestamp": "2025-11-19T00:00:00.000Z"
  }
  ```

**Resultado Esperado**:
- Status: `200 OK`
- Evento guardado en MongoDB con `trafficSource.type = "paid"`

**Verificación en MongoDB**:
```javascript
// Buscar el evento en MongoDB
db.events.findOne({ gclid: "test_postman_001" })
```

---

### Test 1.3: Endpoint con API Key Inválido
**Objetivo**: Verificar que el backend rechaza requests sin API key válido

**Método**: Postman
- **URL**: `https://app.metricslab.io/track`
- **Method**: POST
- **Body**:
  ```json
  {
    "apiKey": "invalid_key_12345",
    "event_type": "page_view",
    "page_url": "https://test-postman.com/"
  }
  ```

**Resultado Esperado**:
- Status: `401 Unauthorized`
- Response: `{"message": "No autorizado: apiKey requerida"}`

---

### Test 1.4: Verificar Logs del Backend en Tiempo Real
**Objetivo**: Ver qué está recibiendo el backend en tiempo real

**Método**: SSH al servidor
```bash
# Conectar al servidor
ssh root@167.88.43.166

# Ver logs del backend en tiempo real
pm2 logs 1 --lines 50

# Hacer un request desde Postman mientras ves los logs
# Deberías ver: "--- Evento Recibido ---"
```

**Resultado Esperado**:
```
--- Evento Recibido --- {
  apiKey: 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4',
  event_type: 'page_view',
  page_url: 'https://test-postman.com/',
  ...
}
Evento (con apiKey) guardado en la base de datos.
```

---

## 🌐 FASE 2: Verificar CORS y Conectividad

### Test 2.1: Verificar Headers CORS
**Objetivo**: Confirmar que el backend permite requests desde cualquier origen

**Método**: Postman
- **URL**: `https://app.metricslab.io/track`
- **Method**: OPTIONS (preflight request)
- **Headers**:
  ```
  Origin: https://abogadodebancarrota.com
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: Content-Type
  ```

**Resultado Esperado**:
- Status: `204 No Content` o `200 OK`
- Headers de respuesta deben incluir:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  ```

---

### Test 2.2: Request desde Navegador (Consola)
**Objetivo**: Simular el request exacto que haría el script de WordPress

**Método**: Abrir https://abogadodebancarrota.com en el navegador
- Abrir DevTools (F12) → Console
- Ejecutar:
  ```javascript
  fetch('https://app.metricslab.io/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4',
      event_type: 'page_view',
      page_url: window.location.href,
      referrer: document.referrer || null,
      timestamp: new Date().toISOString()
    })
  })
  .then(r => r.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err));
  ```

**Resultado Esperado**:
- Console muestra: `✅ Success: {message: "Evento recibido y guardado"}`
- Network tab muestra: Status 200, sin errores CORS

**Si falla con CORS**: Verificar configuración de Nginx

---

## 📝 FASE 3: Verificar Script en WordPress

### Test 3.1: Verificar que el Script se Carga
**Objetivo**: Confirmar que Code Snippets está inyectando el script

**Método**: Abrir https://abogadodebancarrota.com
- Abrir DevTools (F12) → Sources
- Buscar el script en el HTML
- Verificar que aparece antes de `</body>`

**Resultado Esperado**:
- El script completo está presente en el HTML
- No hay errores de sintaxis

---

### Test 3.2: Verificar Ejecución del Script
**Objetivo**: Confirmar que el script se ejecuta sin errores

**Método**: Abrir https://abogadodebancarrota.com
- Abrir DevTools (F12) → Console
- Buscar mensajes de Metrics Lab

**Resultado Esperado** (con DEBUG_MODE = true):
```
[Metrics Lab] Initializing...
[Metrics Lab] Tracking: {apiKey: "key_...", event_type: "page_view", ...}
[Metrics Lab] Success: page_view
[Metrics Lab] Initialized
```

**Si NO aparece nada**: El script no se está ejecutando

---

### Test 3.3: Verificar Errores JavaScript
**Objetivo**: Identificar errores que impidan la ejecución

**Método**: DevTools → Console
- Buscar errores en rojo
- Verificar warnings

**Errores Comunes**:
- `Uncaught SyntaxError`: Error de sintaxis en el script
- `CORS error`: Problema de CORS
- `Failed to fetch`: Problema de red/conectividad
- `undefined is not a function`: Incompatibilidad de navegador

---

### Test 3.4: Verificar Network Requests
**Objetivo**: Ver si el script está intentando enviar requests

**Método**: DevTools → Network tab
- Filtrar por "track"
- Recargar la página
- Buscar requests a `app.metricslab.io/track`

**Resultado Esperado**:
- Request POST a `/track`
- Status: 200
- Response: `{"message": "Evento recibido y guardado"}`

**Si NO hay requests**: El script no está ejecutando `fetch()`

---

## 🔧 FASE 4: Verificar Code Snippets

### Test 4.1: Verificar Configuración del Snippet
**Objetivo**: Confirmar que Code Snippets está configurado correctamente

**Checklist**:
- [ ] Snippet está **Activado**
- [ ] Location: **Site Wide Footer** (o similar)
- [ ] Type: **JavaScript**
- [ ] No hay errores de guardado

---

### Test 4.2: Verificar Orden de Carga
**Objetivo**: Asegurar que el script se carga después del DOM

**Método**: Ver el HTML source
- Click derecho → Ver código fuente
- Buscar "Metrics Lab"
- Verificar que está antes de `</body>`

---

### Test 4.3: Probar con Script Inline Simple
**Objetivo**: Descartar problemas con Code Snippets

**Método**: Crear un snippet de prueba
```javascript
console.log('✅ Code Snippets funciona correctamente');
alert('Code Snippets está activo');
```

**Resultado Esperado**:
- Alert aparece al cargar la página
- Console muestra el mensaje

**Si NO aparece**: Problema con Code Snippets o caché

---

## 🧪 FASE 5: Tests de Integración

### Test 5.1: Flujo Completo - Page View
**Objetivo**: Verificar el flujo completo desde WordPress hasta MongoDB

**Pasos**:
1. Limpiar caché de WordPress
2. Abrir página en modo incógnito
3. Verificar console (debe mostrar logs de Metrics Lab)
4. Verificar Network tab (debe mostrar request a /track)
5. Verificar MongoDB (debe aparecer nuevo evento)

---

### Test 5.2: Flujo Completo - Click Tracking
**Objetivo**: Verificar que los clicks se trackean

**Pasos**:
1. Abrir página con DevTools
2. Hacer click en un botón/enlace
3. Verificar console: `[Metrics Lab] Tracking: {event_type: "click", ...}`
4. Verificar Network: Request POST a /track
5. Verificar MongoDB: Evento con `eventType: "click"`

---

### Test 5.3: Flujo Completo - Call Click
**Objetivo**: Verificar tracking de clicks en teléfono

**Pasos**:
1. Buscar enlace `<a href="tel:+1234567890">`
2. Hacer click
3. Verificar console: `[Metrics Lab] Tracking: {event_type: "call_click", ...}`
4. Verificar MongoDB: Evento con `eventType: "call_click"`

---

## 📊 FASE 6: Análisis de Resultados

### Matriz de Diagnóstico

| Test | Resultado | Problema Identificado | Solución |
|------|-----------|----------------------|----------|
| 1.1 Backend responde | ✅/❌ | Backend caído | Reiniciar PM2 |
| 1.2 Procesa parámetros | ✅/❌ | Lógica de detección | Revisar TrafficSourceDetector |
| 1.3 Valida API key | ✅/❌ | Seguridad | Revisar middleware |
| 2.1 CORS configurado | ✅/❌ | CORS bloqueando | Revisar Nginx/Backend |
| 2.2 Request desde navegador | ✅/❌ | Conectividad | Revisar firewall/DNS |
| 3.1 Script se carga | ✅/❌ | Code Snippets | Revisar configuración |
| 3.2 Script se ejecuta | ✅/❌ | Error JavaScript | Revisar console |
| 3.3 Sin errores JS | ✅/❌ | Sintaxis/compatibilidad | Revisar código |
| 3.4 Requests enviados | ✅/❌ | Fetch no ejecuta | Revisar lógica |

---

## 🎯 Checklist de Ejecución

### Preparación
- [ ] Postman instalado y configurado
- [ ] Acceso SSH al servidor
- [ ] Acceso a WordPress admin
- [ ] Acceso a MongoDB (para verificación)
- [ ] Navegador con DevTools abierto

### Ejecución
- [ ] **FASE 1**: Tests de Backend (4 tests)
- [ ] **FASE 2**: Tests de CORS (2 tests)
- [ ] **FASE 3**: Tests de Script (4 tests)
- [ ] **FASE 4**: Tests de Code Snippets (3 tests)
- [ ] **FASE 5**: Tests de Integración (3 tests)
- [ ] **FASE 6**: Análisis y documentación

### Documentación
- [ ] Captura de pantalla de cada test
- [ ] Logs del backend guardados
- [ ] Errores de console documentados
- [ ] Solución implementada y verificada

---

## 🚀 Siguiente Paso

**EMPEZAR CON FASE 1 - TEST 1.1**

Abre Postman y ejecuta el primer test. Pégame:
1. Screenshot del request en Postman
2. Screenshot de la response
3. Status code recibido

Una vez confirmemos que el backend funciona, avanzaremos a la siguiente fase.

---

**Tiempo estimado**: 30-45 minutos para completar todos los tests
**Prioridad**: Alta - Funcionalidad crítica del sistema
