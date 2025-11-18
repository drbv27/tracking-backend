# 🚀 Solución Rápida - Tus 2 Problemas Identificados

## ❌ Problema 1: Script NO Instalado en WordPress

**Síntoma:** `window.MetricsLab` es `undefined`

### ✅ Solución:

1. **Ve a tu WordPress admin:**
   ```
   https://abogadodebancarrota.com/wp-admin/
   ```

2. **Instala Code Snippets:**
   - Ve a **Plugins → Añadir nuevo**
   - Busca **"Code Snippets"**
   - Instala y activa

3. **Crea un nuevo snippet:**
   - Ve a **Snippets → Add New**
   - **Título:** "Metrics Lab Tracking"
   - **Tipo:** JavaScript Snippet
   - **Ubicación:** Site Wide (Footer)

4. **Copia y pega este código:**

```javascript
// Metrics Lab Tracking Script - WordPress Safe Version v2.1.0
(function() {
  // CONFIGURACIÓN - REEMPLAZA CON TUS VALORES
  var API_KEY = 'TU_API_KEY_AQUI';  // ← Pon tu API key real aquí
  var TRACKING_ENDPOINT = 'https://tu-dominio.com/track';  // ← Pon tu URL real aquí (SIN /api/)
  var DEBUG_MODE = true; // ← Déjalo en true para ver logs

  // FUNCIONES INTERNAS - NO MODIFICAR
  function getUrlParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (search) {
      var pairs = search.split('&');
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        if (pair.length === 2) {
          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
      }
    }
    return {
      gclid: params.gclid || null,
      fbclid: params.fbclid || null,
      ttclid: params.ttclid || null,
      li_fat_id: params.li_fat_id || null,
      utm_source: params.utm_source || null,
      utm_medium: params.utm_medium || null,
      utm_campaign: params.utm_campaign || null,
      utm_term: params.utm_term || null,
      utm_content: params.utm_content || null
    };
  }

  function getReferrer() {
    return document.referrer || null;
  }

  function debugLog(message, data) {
    if (DEBUG_MODE && window.console && window.console.log) {
      window.console.log('[Metrics Lab]', message, data || '');
    }
  }

  function track(eventType, additionalData) {
    additionalData = additionalData || {};
    
    if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
      if (window.console && window.console.error) {
        window.console.error('[Metrics Lab] API key no configurada');
      }
      return;
    }

    var urlParams = getUrlParams();
    var data = {
      apiKey: API_KEY,
      event_type: eventType,
      page_url: window.location.href,
      referrer: getReferrer(),
      timestamp: new Date().toISOString()
    };
    
    for (var key in urlParams) {
      if (urlParams.hasOwnProperty(key) && urlParams[key] !== null) {
        data[key] = urlParams[key];
      }
    }
    
    for (var key in additionalData) {
      if (additionalData.hasOwnProperty(key) && additionalData[key] !== null) {
        data[key] = additionalData[key];
      }
    }

    debugLog('Enviando evento:', data);

    if (window.fetch) {
      fetch(TRACKING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        keepalive: true
      })
      .then(function(response) {
        if (response.ok) {
          debugLog('Evento enviado:', eventType);
        } else {
          debugLog('Error en respuesta:', response.status);
        }
      })
      .catch(function(err) {
        debugLog('Error:', err);
      });
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', TRACKING_ENDPOINT, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    }
  }

  function trackPageView() {
    track('page_view');
  }

  function trackClick(element) {
    var buttonText = null;
    if (element.textContent) {
      buttonText = element.textContent.trim();
      if (buttonText.length > 100) {
        buttonText = buttonText.substring(0, 100);
      }
    }
    
    track('click', {
      clicked_url: element.href || window.location.href,
      button_id: element.id || null,
      button_href: element.getAttribute('href') || null,
      button_text: buttonText,
      button_class: element.className || null
    });
  }

  function trackCallClick(element) {
    var phoneNumber = element.href.replace('tel:', '').trim();
    var buttonText = element.textContent ? element.textContent.trim() : null;
    
    track('call_click', {
      phone_number: phoneNumber,
      button_id: element.id || null,
      button_text: buttonText,
      button_class: element.className || null
    });
  }

  function trackFormSubmit(form) {
    track('form_submit', {
      form_id: form.id || null,
      form_name: form.name || null,
      form_action: form.action || null,
      form_method: form.method || 'get'
    });
  }

  function initialize() {
    debugLog('Inicializando Metrics Lab...');
    trackPageView();

    if (document.addEventListener) {
      document.addEventListener('click', function(event) {
        var element = event.target;
        while (element && element !== document) {
          if (element.tagName === 'A' || element.tagName === 'BUTTON') {
            if (element.tagName === 'A' && element.href && element.href.indexOf('tel:') === 0) {
              trackCallClick(element);
            } else {
              trackClick(element);
            }
            break;
          }
          element = element.parentNode;
        }
      }, true);

      document.addEventListener('submit', function(event) {
        var form = event.target;
        if (form && form.tagName === 'FORM') {
          trackFormSubmit(form);
        }
      }, true);
    }

    debugLog('Metrics Lab inicializado');
  }

  function safeInitialize() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initialize();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', initialize);
    } else if (document.attachEvent) {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'complete') {
          initialize();
        }
      });
    } else {
      window.onload = initialize;
    }
  }

  safeInitialize();

  if (typeof window !== 'undefined') {
    window.MetricsLab = {
      track: track,
      trackPageView: trackPageView,
      trackCallClick: trackCallClick,
      trackFormSubmit: trackFormSubmit,
      version: '2.1.0'
    };
  }

})();
```

5. **IMPORTANTE - Configura estas 2 líneas:**

```javascript
var API_KEY = 'key_tu_api_key_real';  // ← Pon tu API key del dashboard
var TRACKING_ENDPOINT = 'https://tu-vps-hostinger.com/track';  // ← Pon tu URL (SIN /api/)
```

**Ejemplo:**
```javascript
var API_KEY = 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4';
var TRACKING_ENDPOINT = 'https://api.abogadodebancarrota.com/track';  // ← NOTA: /track NO /api/track
```

6. **Activa el snippet** (toggle verde)

7. **Guarda**

8. **Purga el cache:**
   - Si usas LiteSpeed: **LiteSpeed Cache → Purge All**
   - Si usas WP Rocket: **WP Rocket → Clear Cache**

---

## ❌ Problema 2: Ruta del Backend Incorrecta

**Síntoma:** "Cannot GET /api/track"

### ✅ Solución:

La ruta correcta es `/track` NO `/api/track`

**Tu TRACKING_ENDPOINT debe ser:**
```
https://tu-dominio.com/track
```

**NO:**
```
https://tu-dominio.com/api/track  ← INCORRECTO
```

### Verificar tu Backend:

1. **Conéctate a tu VPS por SSH:**
   ```bash
   ssh usuario@tu-vps-hostinger.com
   ```

2. **Verifica los procesos PM2:**
   ```bash
   pm2 list
   ```

3. **Verifica los logs del backend:**
   ```bash
   pm2 logs saas-api
   ```

4. **Verifica que el endpoint /track exista:**
   
   Abre tu archivo `index.js` (o el archivo principal de tu backend) y busca:
   ```javascript
   app.post('/track', ...)
   ```

   **Debe ser `/track` NO `/api/track`**

5. **Si tu backend usa `/api/track`, tienes 2 opciones:**

   **Opción A (Recomendada):** Cambiar el backend para usar `/track`
   
   En tu `index.js`:
   ```javascript
   // Cambiar de:
   app.post('/api/track', ...)
   
   // A:
   app.post('/track', ...)
   ```

   **Opción B:** Cambiar el TRACKING_ENDPOINT en WordPress
   
   En tu snippet de Code Snippets:
   ```javascript
   var TRACKING_ENDPOINT = 'https://tu-dominio.com/api/track';
   ```

6. **Reinicia PM2:**
   ```bash
   pm2 restart saas-api
   ```

---

## ✅ Verificación Final

### Test 1: Verificar Script Instalado

1. Abre: https://abogadodebancarrota.com/
2. Presiona **F12**
3. En la consola, escribe:
   ```javascript
   window.MetricsLab
   ```
4. **Deberías ver:** `{track: function, trackPageView: function, version: "2.1.0"}`
5. **NO deberías ver:** `undefined`

### Test 2: Verificar Logs

En la misma consola, deberías ver:
```
[Metrics Lab] Inicializando Metrics Lab...
[Metrics Lab] Enviando evento: {apiKey: "key_...", event_type: "page_view", ...}
[Metrics Lab] Evento enviado: page_view
[Metrics Lab] Metrics Lab inicializado
```

### Test 3: Verificar Backend

1. Abre una nueva pestaña
2. Ve a: `https://tu-dominio.com/track`
3. **Deberías ver:** Un error como "Missing API key" o "Method not allowed" (esto es normal)
4. **NO deberías ver:** "Cannot GET /track"

### Test 4: Verificar Dashboard

1. Ve a tu dashboard: https://app.metricslab.io/
2. Selecciona tu proyecto
3. Ve a la pestaña "Overview" o "Direct"
4. **Deberías ver:** Tu evento de page_view
5. Puede tardar 10-30 segundos en aparecer

---

## 🚨 Si Aún No Funciona

### Checklist:

- [ ] Code Snippets está instalado y activado
- [ ] El snippet está creado y activado (toggle verde)
- [ ] API_KEY está configurado correctamente (empieza con `key_`)
- [ ] TRACKING_ENDPOINT está configurado correctamente (termina en `/track`)
- [ ] DEBUG_MODE está en `true`
- [ ] Cache está purgado
- [ ] Backend está corriendo (pm2 list muestra "online")
- [ ] La ruta es `/track` NO `/api/track`

### Dime:

1. **¿Qué ves cuando escribes `window.MetricsLab` en la consola?**
2. **¿Qué logs ves en la consola con DEBUG_MODE=true?**
3. **¿Cuál es tu TRACKING_ENDPOINT exacto?**
4. **¿Qué ves cuando vas a `https://tu-dominio.com/track` en el navegador?**

Con esta información podré ayudarte mejor.

---

## 📞 Necesitas Ayuda Inmediata?

**Toma screenshots de:**
1. La consola (F12) con DEBUG_MODE=true
2. Tu snippet en Code Snippets (mostrando las primeras líneas con API_KEY y TRACKING_ENDPOINT)
3. El resultado de `pm2 list` en tu VPS
4. El resultado de ir a `https://tu-dominio.com/track` en el navegador

Con eso podré darte la solución exacta.

---

## 🎯 Resumen

**Problema 1:** Script no instalado → **Solución:** Instalar en Code Snippets
**Problema 2:** Ruta incorrecta → **Solución:** Usar `/track` NO `/api/track`

**¡Vamos a hacer que funcione!** 💪
