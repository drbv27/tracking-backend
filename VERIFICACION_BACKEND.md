# 🔍 Verificación del Backend - Metrics Lab

## ✅ Buenas Noticias

Tu backend **SÍ tiene la ruta `/track` configurada** correctamente en el archivo `index.js` (línea 56).

---

## ❌ El Problema

Cuando visitas `https://app.metricslab.io/track` en el navegador, obtienes **"Cannot GET /track"** porque:

1. **El navegador hace un request GET**
2. **La ruta `/track` solo acepta POST**
3. Por eso ves el error "Cannot GET /track"

**Esto es NORMAL y CORRECTO.** ✅

---

## 🧪 Cómo Verificar que el Backend Funciona

### Test 1: Verificar que el Servidor Está Corriendo

Abre tu navegador y ve a:
```
https://app.metricslab.io/
```

**¿Qué deberías ver?**
- ✅ **"Tracker está vivo y saludable."**

Si ves esto, tu backend **SÍ está corriendo** correctamente.

---

### Test 2: Probar la Ruta `/track` con POST

Abre la consola de tu navegador (F12) en **cualquier página** y ejecuta:

```javascript
fetch('https://app.metricslab.io/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    apiKey: 'test',
    event_type: 'test',
    page_url: 'https://test.com'
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ Respuesta del servidor:', data);
})
.catch(error => {
  console.error('❌ Error:', error);
});
```

**¿Qué deberías ver?**
- ✅ **`Respuesta del servidor: {message: "Evento recibido y guardado"}`**
- O: **`{message: "No autorizado: apiKey requerida"}`** (esto también es correcto)

Si ves cualquiera de estos mensajes, tu ruta `/track` **SÍ funciona**.

---

### Test 3: Probar con tu API Key Real

Ahora prueba con tu API key real. En la consola (F12):

```javascript
fetch('https://app.metricslab.io/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    apiKey: 'TU_API_KEY_AQUI',  // ← Reemplaza con tu API key real
    event_type: 'page_view',
    page_url: 'https://abogadodebancarrota.com/',
    gclid: 'test123',
    utm_source: 'google',
    utm_medium: 'cpc'
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ Respuesta:', data);
})
.catch(error => {
  console.error('❌ Error:', error);
});
```

**Reemplaza `TU_API_KEY_AQUI` con tu API key real del dashboard.**

**¿Qué deberías ver?**
- ✅ **`Respuesta: {message: "Evento recibido y guardado"}`**

Si ves esto, tu backend **funciona perfectamente** y el evento debería aparecer en tu dashboard.

---

## 🔧 Verificar CORS

El problema más probable es **CORS**. Tu backend actual solo permite requests desde `http://localhost:3001` en desarrollo.

### Solución: Actualizar CORS para Producción

Necesitamos actualizar el archivo `index.js` para permitir requests desde tu sitio de WordPress.

**Líneas 33-42 actuales:**
```javascript
if (process.env.NODE_ENV !== 'production') {
  console.warn('Ejecutando en modo desarrollo: CORS habilitado para localhost:3001');
  const corsOptions = {
    origin: 'http://localhost:3001', 
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'], 
  };
  app.use(cors(corsOptions));
}
```

**Necesitamos cambiar a:**
```javascript
// Configuración de CORS
const corsOptions = {
  origin: [
    'http://localhost:3001',  // Para desarrollo
    'https://abogadodebancarrota.com',  // Tu sitio de WordPress
    'https://www.abogadodebancarrota.com'  // Con www
  ],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
```

---

## 🎯 Pasos para Arreglar

### Paso 1: Actualizar CORS en index.js

Voy a actualizar el archivo `index.js` para permitir requests desde tu sitio.

### Paso 2: Redesplegar el Backend

Después de actualizar el código:

1. **Commit los cambios:**
   ```bash
   git add index.js
   git commit -m "Actualizar CORS para permitir requests desde abogadodebancarrota.com"
   git push origin main
   ```

2. **Redesplegar en Hostinger** (según tu método de despliegue)

### Paso 3: Verificar

Después de redesplegar, ejecuta el Test 3 de arriba desde la consola de tu sitio de WordPress.

---

## 🚨 Verificación Rápida AHORA

Antes de hacer cambios, verifica:

### 1. ¿El servidor está corriendo?
```
https://app.metricslab.io/
```
Deberías ver: "Tracker está vivo y saludable."

### 2. ¿La ruta /track responde?
Ejecuta el Test 2 de arriba en la consola.

### 3. ¿Hay error de CORS?
Abre tu sitio https://abogadodebancarrota.com/, presiona F12, ve a Console, y busca errores que digan "CORS" o "blocked by CORS policy".

---

## 📊 Dime los Resultados

Por favor, ejecuta estos tests y dime:

1. **¿Qué ves en `https://app.metricslab.io/`?**
2. **¿Qué ves cuando ejecutas el Test 2?**
3. **¿Hay errores de CORS en la consola de tu sitio?**

Con esta información sabré exactamente qué necesitamos arreglar.

---

## 🎯 Siguiente Paso

Voy a actualizar el archivo `index.js` para arreglar el CORS. Después de eso, necesitarás redesplegar el backend.

¿Quieres que actualice el código ahora?
