# ⚡ Solución Inmediata - Metrics Lab

## 🎯 Problema Identificado

Tu backend **SÍ tiene la ruta `/track`**, pero:
1. ❌ Solo acepta **POST** (por eso ves "Cannot GET /track" en el navegador)
2. ❌ CORS no permite requests desde tu sitio de WordPress

## ✅ Solución Aplicada

He actualizado el archivo `index.js` para permitir requests desde:
- ✅ `https://abogadodebancarrota.com`
- ✅ `https://www.abogadodebancarrota.com`

---

## 🚀 Pasos para Arreglar (5 minutos)

### Paso 1: Commit y Push (1 min)

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
git add index.js
git commit -m "Fix CORS: Permitir requests desde abogadodebancarrota.com"
git push origin main
```

### Paso 2: Redesplegar en Hostinger (2 min)

**Si tienes auto-deploy:**
- Espera 1-2 minutos, se desplegará automáticamente

**Si despliegas manualmente:**
```bash
# Conéctate por SSH
ssh tu_usuario@tu_servidor.hostinger.com

# Ve a tu carpeta
cd /ruta/a/tu/app

# Pull los cambios
git pull origin main

# Reinicia la app
pm2 restart metrics-lab
# O si no usas PM2:
# pkill -f "node index.js"
# npm start
```

### Paso 3: Verificar (2 min)

1. **Abre:** https://app.metricslab.io/
2. **Deberías ver:** "Tracker está vivo y saludable."

Si ves esto, el servidor está corriendo. ✅

---

## 🧪 Test Rápido (Hazlo AHORA)

### Test 1: Verificar CORS

1. **Abre tu sitio:** https://abogadodebancarrota.com/
2. **Presiona F12**
3. **Ve a la pestaña Console**
4. **Pega esto y presiona Enter:**

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

**¿Qué deberías ver?**
- ✅ **`FUNCIONA! {message: "..."}`** → Todo bien, ve al Test 2
- ❌ **`ERROR: ... CORS ...`** → El backend no se reinició, espera 1 min y prueba de nuevo
- ❌ **`ERROR: Failed to fetch`** → El backend no está corriendo

---

### Test 2: Enviar Evento Real

Si el Test 1 funcionó, ahora envía un evento real:

1. **Ve a tu dashboard:** https://app.metricslab.io/
2. **Copia tu API Key** (empieza con `key_`)
3. **Vuelve a tu sitio:** https://abogadodebancarrota.com/
4. **Presiona F12 → Console**
5. **Pega esto (REEMPLAZA tu API key):**

```javascript
fetch('https://app.metricslab.io/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'key_TU_API_KEY_AQUI',  // ← REEMPLAZA ESTO
    event_type: 'page_view',
    page_url: window.location.href,
    gclid: 'test_manual_001',
    utm_source: 'test',
    utm_medium: 'manual',
    utm_campaign: 'verificacion',
    timestamp: new Date().toISOString()
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ EVENTO ENVIADO!', d);
  console.log('✅ Ve a tu dashboard y verifica');
})
.catch(e => console.error('❌ ERROR:', e));
```

**¿Qué deberías ver?**
- ✅ **`EVENTO ENVIADO! {message: "Evento recibido y guardado"}`**

**Luego:**
1. Ve a tu dashboard
2. Refresca (Ctrl+F5)
3. Ve a "Paid Campaigns"
4. Deberías ver el evento con `utm_source: test`

---

### Test 3: Verificar Script de WordPress

Si el Test 2 funcionó, el backend está bien. Ahora verifica el script:

1. **Abre tu sitio:** https://abogadodebancarrota.com/
2. **Presiona F12 → Console**
3. **Escribe:** `window.MetricsLab`

**¿Qué ves?**
- ✅ **Un objeto con `{track: function, ...}`** → Script instalado, ve al Test 3.1
- ❌ **`undefined`** → Script NO instalado, ve al Test 3.2

#### Test 3.1: Script Instalado - Verificar Logs

Si `window.MetricsLab` existe:

1. **Ve a WordPress:** https://abogadodebancarrota.com/wp-admin/
2. **Ve a:** Snippets → All Snippets
3. **Abre tu snippet de Metrics Lab**
4. **Busca la línea:** `var DEBUG_MODE = false;`
5. **Cámbiala a:** `var DEBUG_MODE = true;`
6. **Guarda**
7. **Purga el cache:** LiteSpeed Cache → Purge All
8. **Abre tu sitio en modo incógnito**
9. **Presiona F12 → Console**

**Deberías ver:**
```
[Metrics Lab] Inicializando Metrics Lab...
[Metrics Lab] Enviando evento: {...}
[Metrics Lab] Evento enviado: page_view
```

**Si ves estos mensajes:**
- ✅ Todo funciona! Los eventos deberían aparecer en el dashboard

**Si ves un error:**
- Copia el error completo y dímelo

#### Test 3.2: Script NO Instalado

Si `window.MetricsLab` es `undefined`:

1. **Ve a WordPress:** https://abogadodebancarrota.com/wp-admin/
2. **Ve a:** Plugins → Installed Plugins
3. **Verifica que Code Snippets esté ACTIVADO**
4. **Ve a:** Snippets → All Snippets
5. **Verifica que tu snippet esté ACTIVADO** (toggle verde)
6. **Purga el cache:** LiteSpeed Cache → Purge All
7. **Abre tu sitio en modo incógnito**
8. **Presiona F12 y escribe:** `window.MetricsLab`

**Si sigue siendo `undefined`:**
- El snippet no se está cargando
- Verifica que el snippet sea tipo "JavaScript"
- Verifica que la ubicación sea "Site Wide (Footer)"

---

## 📊 Resumen de Estados

### ✅ Estado 1: Backend Funciona
- Test 1 pasa ✅
- Test 2 pasa ✅
- **Problema:** Script de WordPress

### ✅ Estado 2: Script Instalado
- `window.MetricsLab` existe ✅
- **Problema:** Configuración del script

### ✅ Estado 3: Todo Funciona
- Test 1 pasa ✅
- Test 2 pasa ✅
- Test 3 pasa ✅
- **Resultado:** Eventos aparecen en dashboard 🎉

---

## 🎯 Siguiente Paso

**AHORA MISMO:**

1. **Commit y push** los cambios del `index.js`
2. **Redesplegar** el backend
3. **Ejecutar Test 1** para verificar CORS
4. **Dime qué resultado obtienes**

Con esa información sabré exactamente qué más necesitamos arreglar.

**¿Listo para empezar?** 💪
