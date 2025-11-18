# 🔍 Diagnóstico Paso a Paso - Metrics Lab

## ❌ Problema: No se registran eventos en el dashboard

Vamos a diagnosticar el problema sistemáticamente.

---

## 📋 Paso 1: Verificar que el Script Esté Instalado

### 1.1 Abrir tu sitio
1. Ve a: https://abogadodebancarrota.com/
2. Presiona **F12** (o clic derecho → Inspeccionar)
3. Ve a la pestaña **Console**

### 1.2 Buscar el script
En la consola, escribe:
```javascript
window.MetricsLab
```

**¿Qué deberías ver?**
- ✅ **SI FUNCIONA:** Un objeto con `{track: function, trackPageView: function, version: "2.1.0"}`
- ❌ **SI NO FUNCIONA:** `undefined`

**Si ves `undefined`:**
- El script NO está instalado correctamente
- Ve al **Paso 2**

**Si ves el objeto:**
- El script SÍ está instalado
- Ve al **Paso 3**

---

## 📋 Paso 2: Verificar Instalación en WordPress

### 2.1 Verificar Code Snippets

1. Ve a tu WordPress admin: https://abogadodebancarrota.com/wp-admin/
2. Ve a **Snippets → All Snippets**
3. Busca el snippet "Metrics Lab Tracking"

**Verifica:**
- [ ] El snippet existe
- [ ] El snippet está **ACTIVADO** (toggle verde)
- [ ] El snippet es tipo **JavaScript**
- [ ] La ubicación es **Site Wide (Footer)**

### 2.2 Verificar el Código

Abre el snippet y verifica:

**Línea 1:** Debe empezar con:
```javascript
// Metrics Lab Tracking Script - WordPress Safe Version v2.1.0
```

**Líneas de configuración:** Busca estas líneas:
```javascript
var API_KEY = 'TU_API_KEY_AQUI';
var TRACKING_ENDPOINT = 'https://tu-dominio-hostinger.com/track';
```

**IMPORTANTE:** Verifica que:
- [ ] `API_KEY` NO sea `'TU_API_KEY_AQUI'` (debe ser tu API key real)
- [ ] `TRACKING_ENDPOINT` NO sea `'https://tu-dominio-hostinger.com/track'` (debe ser tu URL real)

### 2.3 Purgar el Cache

**Si usas LiteSpeed Cache:**
1. Ve a **LiteSpeed Cache → Toolbox**
2. Haz clic en **Purge All**

**Si usas WP Rocket:**
1. Ve a **WP Rocket → Clear Cache**
2. Haz clic en **Clear Cache**

**Si usas otro plugin:**
- Busca la opción "Clear Cache" o "Purge Cache"

### 2.4 Verificar de Nuevo

1. Abre tu sitio en **modo incógnito** (Ctrl+Shift+N)
2. Presiona **F12**
3. Escribe en consola: `window.MetricsLab`
4. ¿Ahora sí aparece?

---

## 📋 Paso 3: Verificar que el Script se Ejecute

### 3.1 Activar Debug Mode

1. Ve a **Snippets → All Snippets**
2. Abre tu snippet de Metrics Lab
3. Busca la línea:
```javascript
var DEBUG_MODE = false;
```
4. Cámbiala a:
```javascript
var DEBUG_MODE = true;
```
5. **Guarda** el snippet
6. **Purga el cache** (LiteSpeed Cache → Purge All)

### 3.2 Verificar Logs en Consola

1. Abre tu sitio en **modo incógnito**
2. Presiona **F12**
3. Ve a la pestaña **Console**

**¿Qué deberías ver?**
```
[Metrics Lab] Inicializando Metrics Lab...
[Metrics Lab] Enviando evento: Object {apiKey: "...", event_type: "page_view", ...}
[Metrics Lab] Evento enviado: page_view
[Metrics Lab] Metrics Lab inicializado
```

**Si NO ves estos mensajes:**
- El script no se está ejecutando
- Ve al **Paso 4**

**Si SÍ ves estos mensajes:**
- El script SÍ se está ejecutando
- Ve al **Paso 5**

---

## 📋 Paso 4: Verificar Errores en Consola

### 4.1 Buscar Errores

En la consola (F12), busca mensajes en **ROJO**.

**Errores comunes:**

#### Error 1: "API key no configurada"
```
[Metrics Lab] API key no configurada
```
**Solución:**
- Tu API_KEY está mal configurado
- Verifica que sea tu API key real (empieza con `key_`)

#### Error 2: "Failed to fetch"
```
Failed to fetch
```
**Solución:**
- Tu TRACKING_ENDPOINT está mal configurado
- O tu backend no está corriendo
- Ve al **Paso 6**

#### Error 3: "CORS error"
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**Solución:**
- Tu backend no permite requests desde tu dominio
- Ve al **Paso 7**

#### Error 4: Otros errores de JavaScript
**Solución:**
- Puede haber un conflicto con otro plugin
- Desactiva otros plugins uno por uno para identificar el conflicto

---

## 📋 Paso 5: Verificar la Configuración del Script

### 5.1 Verificar API Key

En la consola (F12), escribe:
```javascript
// Esto mostrará el evento que se está enviando
// Busca en los logs el objeto que dice "Enviando evento:"
```

**Busca en los logs:**
```
[Metrics Lab] Enviando evento: {
  apiKey: "key_abc123...",
  event_type: "page_view",
  page_url: "https://abogadodebancarrota.com/",
  ...
}
```

**Verifica:**
- [ ] `apiKey` empieza con `key_`
- [ ] `apiKey` tiene al menos 20 caracteres
- [ ] `event_type` es `"page_view"`
- [ ] `page_url` es tu URL correcta

### 5.2 Copiar el API Key

**Copia el valor de `apiKey` que ves en los logs.**

Ejemplo: `key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4`

**Guárdalo, lo necesitaremos en el Paso 6.**

---

## 📋 Paso 6: Verificar el Backend

### 6.1 Verificar que el Backend Esté Corriendo

Abre una nueva pestaña y ve a:
```
https://tu-dominio-backend.com/
```

**Reemplaza `tu-dominio-backend.com` con tu dominio real.**

**¿Qué deberías ver?**
- ✅ **SI FUNCIONA:** Un mensaje como "Tracker está vivo y saludable" o similar
- ❌ **SI NO FUNCIONA:** Error 404, Error 500, o "Cannot GET /"

**Si NO funciona:**
- Tu backend no está corriendo
- Necesitas desplegarlo en Hostinger
- Ve a `GUIA_INSTALACION_WORDPRESS.md` → Parte 3

### 6.2 Verificar el Endpoint de Tracking

Abre una nueva pestaña y ve a:
```
https://tu-dominio-backend.com/track
```

**¿Qué deberías ver?**
- ✅ **SI FUNCIONA:** Un mensaje de error como "Missing API key" o similar (esto es normal)
- ❌ **SI NO FUNCIONA:** Error 404

**Si ves Error 404:**
- El endpoint `/track` no existe
- Verifica tu código del backend

### 6.3 Probar el Endpoint Manualmente

Abre la consola (F12) en cualquier página y ejecuta:

```javascript
fetch('https://tu-dominio-backend.com/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    apiKey: 'TU_API_KEY_AQUI',
    event_type: 'test',
    page_url: 'https://test.com'
  })
})
.then(response => response.json())
.then(data => console.log('Respuesta:', data))
.catch(error => console.error('Error:', error));
```

**Reemplaza:**
- `https://tu-dominio-backend.com/track` con tu URL real
- `TU_API_KEY_AQUI` con tu API key real (del Paso 5.2)

**¿Qué deberías ver?**
- ✅ **SI FUNCIONA:** `Respuesta: {success: true, ...}` o similar
- ❌ **SI NO FUNCIONA:** `Error: ...`

---

## 📋 Paso 7: Verificar CORS

### 7.1 ¿Qué es CORS?

CORS (Cross-Origin Resource Sharing) es una medida de seguridad que impide que un sitio web haga requests a otro dominio.

**Ejemplo:**
- Tu sitio: `https://abogadodebancarrota.com`
- Tu backend: `https://api.metricslab.com`
- CORS debe permitir que `abogadodebancarrota.com` haga requests a `api.metricslab.com`

### 7.2 Verificar Configuración de CORS

En tu backend (archivo `index.js` o similar), busca:

```javascript
app.use(cors({
  origin: ['https://abogadodebancarrota.com', 'http://localhost:3000'],
  credentials: true
}));
```

**Verifica:**
- [ ] `https://abogadodebancarrota.com` está en la lista de `origin`
- [ ] NO hay typos en la URL
- [ ] Incluye `https://` (no solo `abogadodebancarrota.com`)

### 7.3 Solución Temporal (Solo para Testing)

**SOLO PARA TESTING, NO PARA PRODUCCIÓN:**

Cambia temporalmente a:
```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

Esto permite requests desde cualquier dominio. **NO uses esto en producción.**

---

## 📋 Paso 8: Verificar el Dashboard

### 8.1 Verificar que Estés en el Proyecto Correcto

1. Ve a tu dashboard: https://app.metricslab.io/
2. Verifica que estés en el proyecto correcto
3. Copia el **API Key** del proyecto

### 8.2 Comparar API Keys

**Compara:**
- API Key en el dashboard: `key_abc123...`
- API Key en tu snippet de WordPress: `key_abc123...`

**¿Son EXACTAMENTE iguales?**
- [ ] Sí → Ve al Paso 8.3
- [ ] No → **ESTE ES EL PROBLEMA**

**Si son diferentes:**
1. Copia el API Key del dashboard
2. Pégalo en tu snippet de WordPress
3. Guarda el snippet
4. Purga el cache
5. Prueba de nuevo

### 8.3 Verificar el Rango de Fechas

En el dashboard:
1. Busca el selector de fechas (arriba a la derecha)
2. Verifica que incluya **HOY**
3. Cambia a "Last 7 days" o "Last 30 days"

### 8.4 Refrescar el Dashboard

1. Presiona **Ctrl+F5** (Windows) o **Cmd+Shift+R** (Mac)
2. Esto fuerza un refresh completo
3. Espera unos segundos

---

## 📋 Paso 9: Test Completo

### 9.1 Preparación

1. **Activa DEBUG_MODE** (Paso 3.1)
2. **Purga el cache** (Paso 2.3)
3. **Abre modo incógnito** (Ctrl+Shift+N)

### 9.2 Ejecutar Test

1. Ve a: https://abogadodebancarrota.com/?gclid=test123&utm_source=google
2. Presiona **F12**
3. Ve a la pestaña **Console**

### 9.3 Verificar Logs

**Deberías ver:**
```
[Metrics Lab] Inicializando Metrics Lab...
[Metrics Lab] Enviando evento: {
  apiKey: "key_...",
  event_type: "page_view",
  page_url: "https://abogadodebancarrota.com/?gclid=test123&utm_source=google",
  gclid: "test123",
  utm_source: "google",
  ...
}
[Metrics Lab] Evento enviado: page_view
```

### 9.4 Verificar Network

1. En F12, ve a la pestaña **Network**
2. Busca un request a tu backend (algo como `track`)
3. Haz clic en él
4. Ve a la pestaña **Response**

**¿Qué deberías ver?**
- ✅ **SI FUNCIONA:** `{success: true, ...}` o similar
- ❌ **SI NO FUNCIONA:** Error message

### 9.5 Verificar Dashboard

1. Ve a tu dashboard
2. Refresca (Ctrl+F5)
3. Ve a la pestaña "Paid Campaigns"
4. **Espera 10-30 segundos**
5. Refresca de nuevo

**¿Aparece el evento?**
- ✅ **SI APARECE:** ¡Funciona! 🎉
- ❌ **SI NO APARECE:** Ve al Paso 10

---

## 📋 Paso 10: Verificar la Base de Datos

### 10.1 Verificar MongoDB

Si tu backend usa MongoDB, verifica:

1. **MongoDB está corriendo**
2. **La conexión funciona**
3. **La colección existe**

### 10.2 Verificar Logs del Backend

Si tienes acceso a los logs del backend:

1. Ve a Hostinger
2. Busca los logs de tu aplicación
3. Busca errores relacionados con `/track`

---

## 📋 Resumen de Verificación

### ✅ Checklist Completo

- [ ] **Paso 1:** `window.MetricsLab` existe
- [ ] **Paso 2:** Snippet está instalado y activado
- [ ] **Paso 3:** DEBUG_MODE muestra logs
- [ ] **Paso 4:** No hay errores en consola
- [ ] **Paso 5:** API Key es correcto
- [ ] **Paso 6:** Backend está corriendo
- [ ] **Paso 7:** CORS está configurado
- [ ] **Paso 8:** API Keys coinciden
- [ ] **Paso 9:** Test completo funciona
- [ ] **Paso 10:** Base de datos funciona

---

## 🚨 Problemas Comunes y Soluciones

### Problema 1: "window.MetricsLab is undefined"
**Causa:** Script no está instalado
**Solución:** Verifica Paso 2

### Problema 2: "API key no configurada"
**Causa:** API_KEY está mal en el snippet
**Solución:** Verifica Paso 5

### Problema 3: "Failed to fetch"
**Causa:** Backend no está corriendo o URL incorrecta
**Solución:** Verifica Paso 6

### Problema 4: "CORS error"
**Causa:** Backend no permite requests desde tu dominio
**Solución:** Verifica Paso 7

### Problema 5: "Eventos se envían pero no aparecen en dashboard"
**Causa:** API Keys no coinciden
**Solución:** Verifica Paso 8

---

## 📞 Necesitas Ayuda?

Si después de seguir todos los pasos aún no funciona, proporciona:

1. **Screenshot de la consola** (F12 → Console) con DEBUG_MODE activado
2. **Screenshot del Network tab** (F12 → Network) mostrando el request a `/track`
3. **Tu API Key** (del dashboard)
4. **Tu TRACKING_ENDPOINT** (del snippet)
5. **URL de tu backend**

Con esta información podré ayudarte mejor.

---

## 🎯 Siguiente Paso

**Empieza por el Paso 1** y ve avanzando. Cuando encuentres el problema, avísame y te ayudo a solucionarlo.

¡Vamos a hacer que funcione! 💪
