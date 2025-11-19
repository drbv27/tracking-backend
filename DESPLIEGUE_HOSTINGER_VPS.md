# 🚀 Despliegue en Hostinger VPS - Guía Completa

## 📋 Información del Servidor

- **Servidor:** VPS Hostinger
- **Acceso:** SSH
- **Ruta del proyecto:** `/root/tracking-backend`
- **Servicios PM2:**
  - `saas-api` (Backend - Puerto 3000 o 5000)
  - `saas-dashboard` (Frontend - Puerto 3001)

---

## 🔧 Paso 1: Conectar por SSH y Actualizar Código

### 1.1 Conectar al VPS

```bash
ssh root@tu-servidor-hostinger.com
```

### 1.2 Ir a la carpeta del proyecto

```bash
cd /root/tracking-backend
```

### 1.3 Ver el estado actual de Git

```bash
git status
```

### 1.4 Pull los cambios más recientes

```bash
git pull origin main
```

**Si hay conflictos:**
```bash
git stash
git pull origin main
git stash pop
```

---

## 🔍 Paso 2: Verificar los Servicios PM2

### 2.1 Ver todos los servicios

```bash
pm2 list
```

**Deberías ver algo como:**
```
┌─────┬──────────────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ status  │ restart │ uptime   │
├─────┼──────────────────┼─────────┼─────────┼──────────┤
│ 0   │ saas-api         │ online  │ 5       │ 2h       │
│ 1   │ saas-dashboard   │ online  │ 2       │ 2h       │
└─────┴──────────────────┴─────────┴─────────┴──────────┘
```

### 2.2 Ver logs del backend (saas-api)

```bash
pm2 logs saas-api --lines 50
```

**Busca estos mensajes:**
- ✅ `✅ Conectado a MongoDB Atlas`
- ✅ `✅ CORS configurado: Permitiendo requests desde cualquier dominio`
- ✅ `🚀 Servidor de tracking escuchando en el puerto XXXX`

**Si NO ves estos mensajes, el backend no está corriendo correctamente.**

### 2.3 Ver información detallada del backend

```bash
pm2 info saas-api
```

**Anota:**
- **Puerto:** ¿En qué puerto está corriendo? (3000, 5000, etc.)
- **Status:** ¿Está "online"?
- **Restarts:** ¿Cuántos restarts tiene? (Si tiene muchos, hay un problema)

---

## 🔄 Paso 3: Reiniciar el Backend con los Cambios

### 3.1 Reiniciar saas-api

```bash
pm2 restart saas-api
```

### 3.2 Ver los logs en tiempo real

```bash
pm2 logs saas-api
```

**Deberías ver:**
```
✅ Conectado a MongoDB Atlas
✅ CORS configurado: Permitiendo requests desde cualquier dominio
🚀 Servidor de tracking escuchando en el puerto 5000
```

**Si ves errores:**
- Copia el error completo
- Dímelo para ayudarte

### 3.3 Verificar que no haya errores

```bash
pm2 logs saas-api --err --lines 20
```

Esto muestra solo los errores. **Debería estar vacío o sin errores recientes.**

---

## 🧪 Paso 4: Probar el Backend desde el Servidor

### 4.1 Probar la ruta principal

```bash
curl http://localhost:5000/
```

**Deberías ver:**
```
Tracker está vivo y saludable.
```

**Si ves un error:**
- El backend no está corriendo
- O está en otro puerto

### 4.2 Probar la ruta /track con POST

```bash
curl -X POST http://localhost:5000/track \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "test",
    "event_type": "test",
    "page_url": "https://test.com"
  }'
```

**Deberías ver:**
```json
{"message":"No autorizado: apiKey requerida"}
```

O si usas un API key válido:
```json
{"message":"Evento recibido y guardado"}
```

**Esto confirma que la ruta /track funciona.**

---

## 🌐 Paso 5: Verificar el Dominio Público

### 5.1 Verificar desde fuera del servidor

Desde tu computadora local, abre el navegador y ve a:

```
https://app.metricslab.io/
```

**Deberías ver:**
```
Tracker está vivo y saludable.
```

### 5.2 Probar CORS desde tu sitio

1. **Abre:** https://abogadodebancarrota.com/
2. **Presiona F12** (consola)
3. **Escribe:** `allow pasting` y presiona Enter
4. **Pega esto:**

```javascript
fetch('https://app.metricslab.io/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'test',
    event_type: 'test',
    page_url: window.location.href
  })
})
.then(r => r.json())
.then(d => console.log('✅ FUNCIONA!', d))
.catch(e => console.error('❌ ERROR:', e));
```

**Si ves `✅ FUNCIONA!`:**
- CORS está arreglado ✅
- El backend funciona ✅

**Si ves `❌ ERROR: CORS`:**
- Hay un problema con Nginx
- Ve al Paso 6

---

## 🔧 Paso 6: Verificar Configuración de Nginx (Si hay error de CORS)

### 6.1 Buscar archivos de configuración de Nginx

```bash
ls -la /etc/nginx/sites-available/
```

### 6.2 Ver la configuración de tu sitio

```bash
cat /etc/nginx/sites-available/default
```

O si tienes un archivo específico:

```bash
cat /etc/nginx/sites-available/app.metricslab.io
```

### 6.3 Buscar headers de CORS en Nginx

```bash
grep -r "Access-Control" /etc/nginx/
```

**Si encuentras algo como:**
```nginx
add_header 'Access-Control-Allow-Origin' 'https://abogadodebancarrota.com';
```

**Esto está causando el conflicto.** Necesitas comentar o eliminar esas líneas.

### 6.4 Editar la configuración de Nginx

```bash
nano /etc/nginx/sites-available/default
```

**Busca y comenta (agrega #) cualquier línea que diga:**
```nginx
# add_header 'Access-Control-Allow-Origin' ...
# add_header 'Access-Control-Allow-Methods' ...
# add_header 'Access-Control-Allow-Headers' ...
```

**Guarda:** Ctrl+O, Enter, Ctrl+X

### 6.5 Probar la configuración de Nginx

```bash
nginx -t
```

**Deberías ver:**
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 6.6 Recargar Nginx

```bash
systemctl reload nginx
```

---

## 🧪 Paso 7: Test Final

### 7.1 Desde el servidor

```bash
curl -X POST http://localhost:5000/track \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "test",
    "event_type": "test",
    "page_url": "https://test.com"
  }'
```

### 7.2 Desde tu sitio de WordPress

1. **Abre:** https://abogadodebancarrota.com/
2. **F12 → Console**
3. **Ejecuta el test del Paso 5.2**

**Si funciona:**
- ✅ CORS arreglado
- ✅ Backend funcionando
- ✅ Listo para probar el script de WordPress

---

## 📊 Paso 8: Verificar el Script de WordPress

### 8.1 Verificar que el script esté instalado

En tu sitio (F12 → Console):

```javascript
window.MetricsLab
```

**Deberías ver:**
```javascript
{track: ƒ, trackPageView: ƒ, trackCallClick: ƒ, trackFormSubmit: ƒ, version: "2.1.0"}
```

### 8.2 Activar DEBUG_MODE

1. **Ve a WordPress:** https://abogadodebancarrota.com/wp-admin/
2. **Snippets → All Snippets**
3. **Abre tu snippet de Metrics Lab**
4. **Cambia:** `var DEBUG_MODE = false;` a `var DEBUG_MODE = true;`
5. **Guarda**
6. **Purga el cache:** LiteSpeed Cache → Purge All

### 8.3 Ver los logs

1. **Abre tu sitio en modo incógnito**
2. **F12 → Console**

**Deberías ver:**
```
[Metrics Lab] Inicializando Metrics Lab...
[Metrics Lab] Enviando evento: {...}
[Metrics Lab] Evento enviado: page_view
```

**Si ves estos mensajes:**
- ✅ Script funciona
- ✅ Eventos se están enviando

### 8.4 Verificar en el dashboard

1. **Ve a:** https://app.metricslab.io/
2. **Refresca** (Ctrl+F5)
3. **Ve a la pestaña que corresponda**
4. **Deberías ver los eventos**

---

## 🚨 Troubleshooting

### Problema 1: Backend no inicia

```bash
pm2 logs saas-api --err
```

**Errores comunes:**
- `EADDRINUSE`: El puerto ya está en uso
  - Solución: `pm2 restart saas-api`
- `MongoDB connection failed`: MongoDB no está conectado
  - Solución: Verifica tu MONGODB_URI en `.env`

### Problema 2: CORS sigue fallando

```bash
# Ver headers que está enviando el servidor
curl -I https://app.metricslab.io/track
```

**Si ves múltiples `Access-Control-Allow-Origin`:**
- Nginx está agregando headers
- Ve al Paso 6

### Problema 3: Script no se carga en WordPress

1. Verifica que Code Snippets esté activado
2. Verifica que el snippet esté activado
3. Purga el cache
4. Abre en modo incógnito

---

## 📋 Checklist Completo

- [ ] Conectado por SSH al VPS
- [ ] Pull de los cambios más recientes
- [ ] PM2 list muestra servicios online
- [ ] Reiniciado saas-api
- [ ] Logs muestran "CORS configurado"
- [ ] curl localhost:5000 funciona
- [ ] curl POST localhost:5000/track funciona
- [ ] https://app.metricslab.io/ funciona
- [ ] Test de CORS desde WordPress funciona
- [ ] window.MetricsLab existe
- [ ] DEBUG_MODE activado
- [ ] Logs muestran eventos enviándose
- [ ] Dashboard muestra eventos

---

## 🎯 Comandos Rápidos (Copia y Pega)

```bash
# Conectar y actualizar
ssh root@tu-servidor-hostinger.com
cd /root/tracking-backend
git pull origin main

# Reiniciar backend
pm2 restart saas-api

# Ver logs
pm2 logs saas-api --lines 50

# Probar backend
curl http://localhost:5000/
curl -X POST http://localhost:5000/track -H "Content-Type: application/json" -d '{"apiKey":"test","event_type":"test","page_url":"https://test.com"}'

# Ver estado
pm2 list
pm2 info saas-api
```

---

## 📞 Siguiente Paso

**Ejecuta estos comandos en orden y dime:**

1. ¿Qué ves en `pm2 logs saas-api`?
2. ¿Qué ves en `curl http://localhost:5000/`?
3. ¿Qué ves en el test de CORS desde WordPress?

Con esa información sabré exactamente qué está pasando y cómo arreglarlo. 💪
