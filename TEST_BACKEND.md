# 🧪 Test del Backend - Guía Rápida

## ✅ Cambios Realizados

He actualizado el archivo `index.js` para:
- ✅ Permitir requests desde `https://abogadodebancarrota.com`
- ✅ Permitir requests desde `https://www.abogadodebancarrota.com`
- ✅ Configurar CORS correctamente

---

## 🚀 Pasos para Aplicar los Cambios

### Paso 1: Commit y Push

```bash
git add index.js
git commit -m "Fix: Actualizar CORS para permitir requests desde abogadodebancarrota.com"
git push origin main
```

### Paso 2: Redesplegar en Hostinger

Dependiendo de cómo tengas configurado el despliegue:

**Opción A: Si tienes auto-deploy desde GitHub**
- Los cambios se desplegarán automáticamente

**Opción B: Si despliegas manualmente por SSH**
```bash
ssh tu_usuario@tu_servidor.hostinger.com
cd /ruta/a/tu/app
git pull origin main
npm install
pm2 restart metrics-lab
```

**Opción C: Si usas FTP**
- Sube el archivo `index.js` actualizado
- Reinicia la aplicación desde el panel de Hostinger

### Paso 3: Verificar que el Servidor se Reinició

Espera 30-60 segundos y luego ve a:
```
https://app.metricslab.io/
```

Deberías ver: **"Tracker está vivo y saludable."**

---

## 🧪 Tests de Verificación

### Test 1: Verificar CORS desde tu Sitio

1. **Abre tu sitio:** https://abogadodebancarrota.com/
2. **Presiona F12** (consola)
3. **Pega este código:**

```javascript
fetch('https://app.metricslab.io/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    apiKey: 'test',
    event_type: 'test',
    page_url: window.location.href
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ ÉXITO! Respuesta del servidor:', data);
  console.log('✅ CORS funciona correctamente');
})
.catch(error => {
  console.error('❌ ERROR:', error);
  console.error('❌ Verifica que el backend esté corriendo');
});
```

**¿Qué deberías ver?**
- ✅ **`ÉXITO! Respuesta del servidor: {message: "..."}`**
- ✅ **`CORS funciona correctamente`**

**Si ves un error de CORS:**
- El backend no se reinició correctamente
- Espera 1-2 minutos y prueba de nuevo

---

### Test 2: Verificar con tu API Key Real

1. **Ve a tu dashboard:** https://app.metricslab.io/
2. **Copia tu API Key** (algo como `key_abc123...`)
3. **Abre tu sitio:** https://abogadodebancarrota.com/
4. **Presiona F12** (consola)
5. **Pega este código (reemplaza TU_API_KEY):**

```javascript
fetch('https://app.metricslab.io/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    apiKey: 'TU_API_KEY_AQUI',  // ← Reemplaza con tu API key real
    event_type: 'page_view',
    page_url: window.location.href,
    gclid: 'test_manual_123',
    utm_source: 'test_manual',
    utm_medium: 'test',
    utm_campaign: 'test_backend',
    referrer: document.referrer || null,
    timestamp: new Date().toISOString()
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ ÉXITO! Evento enviado:', data);
  console.log('✅ Ve a tu dashboard y verifica que aparezca el evento');
})
.catch(error => {
  console.error('❌ ERROR:', error);
});
```

**¿Qué deberías ver?**
- ✅ **`ÉXITO! Evento enviado: {message: "Evento recibido y guardado"}`**

**Luego:**
1. Ve a tu dashboard: https://app.metricslab.io/
2. Refresca la página (Ctrl+F5)
3. Ve a la pestaña "Paid Campaigns"
4. Deberías ver un evento con `utm_source: test_manual`

---

### Test 3: Verificar el Script de WordPress

Si los tests 1 y 2 funcionan, entonces el problema está en el script de WordPress.

1. **Abre tu sitio:** https://abogadodebancarrota.com/
2. **Presiona F12** (consola)
3. **Busca estos mensajes:**

```
[Metrics Lab] Inicializando Metrics Lab...
[Metrics Lab] Enviando evento: {...}
[Metrics Lab] Evento enviado: page_view
```

**Si NO ves estos mensajes:**
- El script no está instalado correctamente
- Ve a WordPress → Snippets → All Snippets
- Verifica que el snippet esté ACTIVADO
- Purga el cache (LiteSpeed Cache → Purge All)

**Si SÍ ves estos mensajes pero hay un error:**
- Copia el error completo
- Dímelo para ayudarte

---

## 🎯 Checklist de Verificación

Después de redesplegar, verifica:

- [ ] **Backend corriendo:** https://app.metricslab.io/ muestra "Tracker está vivo"
- [ ] **Test 1 funciona:** CORS permite requests desde tu sitio
- [ ] **Test 2 funciona:** Eventos se guardan en la base de datos
- [ ] **Test 3 funciona:** Script de WordPress envía eventos
- [ ] **Dashboard muestra eventos:** Los eventos aparecen en el dashboard

---

## 🚨 Si Algo No Funciona

### Error: "Cannot GET /track"
**Esto es NORMAL.** La ruta `/track` solo acepta POST, no GET.

### Error: "CORS policy"
**Solución:**
1. Verifica que el backend se haya reiniciado
2. Espera 1-2 minutos
3. Purga el cache del navegador (Ctrl+Shift+Delete)
4. Prueba de nuevo

### Error: "Failed to fetch"
**Solución:**
1. Verifica que el backend esté corriendo: https://app.metricslab.io/
2. Verifica que no haya errores en los logs del servidor
3. Verifica que MongoDB esté conectado

### Error: "No autorizado: apiKey requerida"
**Solución:**
1. Verifica que tu API key sea correcta
2. Copia el API key del dashboard
3. Pégalo en tu snippet de WordPress
4. Guarda y purga el cache

---

## 📊 Logs del Servidor

Si tienes acceso a los logs del servidor, busca:

```
✅ Conectado a MongoDB Atlas
✅ CORS configurado para: [...]
🚀 Servidor de tracking escuchando en el puerto 3000
```

Si ves estos mensajes, el servidor está corriendo correctamente.

Cuando llegue un evento, verás:
```
--- Evento Recibido --- { apiKey: '...', event_type: 'page_view', ... }
Evento (con apiKey) guardado en la base de datos.
```

---

## 🎉 Siguiente Paso

1. **Commit y push** los cambios
2. **Redesplegar** el backend
3. **Ejecutar Test 1** para verificar CORS
4. **Ejecutar Test 2** para verificar que los eventos se guarden
5. **Ejecutar Test 3** para verificar el script de WordPress

**Dime cuando hayas redesplegado y ejecutaremos los tests juntos.** 💪
