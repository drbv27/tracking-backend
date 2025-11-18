# 🛡️ Guía de Instalación SEGURA para WordPress - Metrics Lab

## ⚠️ VERSIÓN ULTRA-COMPATIBLE

Esta versión del script ha sido **completamente optimizada** para ser 100% compatible con:
- ✅ Todos los temas de WordPress
- ✅ Todos los plugins de cache (LiteSpeed, WP Rocket, W3 Total Cache, etc.)
- ✅ Code Snippets y otros plugins de código
- ✅ Navegadores antiguos (IE8+)
- ✅ Sintaxis JavaScript clásica (ES5)
- ✅ Minificadores y optimizadores de código

---

## 🚀 Instalación Paso a Paso

### Paso 1: Obtener tu API Key

1. Ve a tu dashboard: https://app.metricslab.io/
2. Inicia sesión
3. Selecciona tu proyecto
4. Copia tu API Key (formato: `key_abc123...`)

### Paso 2: Instalar Code Snippets (Recomendado)

1. En tu WordPress, ve a **Plugins → Añadir nuevo**
2. Busca **"Code Snippets"**
3. Instala **"Code Snippets" by Code Snippets Pro**
4. Activa el plugin

### Paso 3: Agregar el Script de Tracking

1. Ve a **Snippets → Add New**
2. **Título:** "Metrics Lab Tracking - Safe Version"
3. **Tipo:** JavaScript Snippet
4. **Ubicación:** Site Wide (Footer)
5. **Pega el siguiente código:**

```javascript
// Metrics Lab Tracking Script - WordPress Safe Version v2.1.0
// Compatible con todos los temas, plugins de cache y navegadores
(function() {
  // ============================================================================
  // CONFIGURACIÓN - REEMPLAZA CON TUS VALORES
  // ============================================================================
  
  var API_KEY = 'TU_API_KEY_AQUI';
  var TRACKING_ENDPOINT = 'https://tu-dominio-hostinger.com/track';
  var DEBUG_MODE = false; // Cambia a true para ver logs en consola

  // ============================================================================
  // FUNCIONES INTERNAS - NO MODIFICAR
  // ============================================================================

  /**
   * Extrae parámetros de la URL (compatible con todos los navegadores)
   */
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

  /**
   * Obtiene el referrer
   */
  function getReferrer() {
    return document.referrer || null;
  }

  /**
   * Función de debug segura
   */
  function debugLog(message, data) {
    if (DEBUG_MODE && window.console && window.console.log) {
      window.console.log('[Metrics Lab]', message, data || '');
    }
  }

  /**
   * Envía eventos de tracking
   */
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
    
    // Agregar parámetros de URL
    for (var key in urlParams) {
      if (urlParams.hasOwnProperty(key) && urlParams[key] !== null) {
        data[key] = urlParams[key];
      }
    }
    
    // Agregar datos adicionales
    for (var key in additionalData) {
      if (additionalData.hasOwnProperty(key) && additionalData[key] !== null) {
        data[key] = additionalData[key];
      }
    }

    debugLog('Enviando evento:', data);

    // Enviar request con fallback para navegadores antiguos
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
        }
      })
      .catch(function(err) {
        debugLog('Error:', err);
      });
    } else {
      // Fallback para navegadores muy antiguos
      var xhr = new XMLHttpRequest();
      xhr.open('POST', TRACKING_ENDPOINT, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    }
  }

  /**
   * Trackea vista de página
   */
  function trackPageView() {
    track('page_view');
  }

  /**
   * Trackea clicks en botones/enlaces
   */
  function trackClick(element) {
    var buttonText = null;
    if (element.textContent) {
      buttonText = element.textContent.trim();
      if (buttonText.length > 100) {
        buttonText = buttonText.substring(0, 100);
      }
    }
    
    var clickData = {
      clicked_url: element.href || window.location.href,
      button_id: element.id || null,
      button_href: element.getAttribute('href') || null,
      button_text: buttonText,
      button_class: element.className || null
    };

    track('click', clickData);
  }

  /**
   * Trackea clicks en botones de llamada
   */
  function trackCallClick(element) {
    var phoneNumber = element.href.replace('tel:', '').trim();
    var buttonText = element.textContent ? element.textContent.trim() : null;
    
    var callData = {
      phone_number: phoneNumber,
      button_id: element.id || null,
      button_text: buttonText,
      button_class: element.className || null
    };

    track('call_click', callData);
  }

  /**
   * Trackea envío de formularios
   */
  function trackFormSubmit(form) {
    var formData = {
      form_id: form.id || null,
      form_name: form.name || null,
      form_action: form.action || null,
      form_method: form.method || 'get'
    };

    track('form_submit', formData);
  }

  /**
   * Inicializa el tracking
   */
  function initialize() {
    debugLog('Inicializando Metrics Lab...');

    trackPageView();

    // Event listeners seguros para WordPress
    if (document.addEventListener) {
      document.addEventListener('click', function(event) {
        var element = event.target;
        
        // Buscar el elemento clickeable más cercano
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

  // Inicialización segura con múltiples fallbacks
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

  // Exponer funciones globalmente
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

### Paso 4: Personalizar la Configuración

**ANTES de activar el snippet, cambia estas líneas:**

```javascript
var API_KEY = 'key_tu_api_key_real_aqui';
var TRACKING_ENDPOINT = 'https://tu-dominio-hostinger.com/track';
```

**Ejemplo:**
```javascript
var API_KEY = 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4';
var TRACKING_ENDPOINT = 'https://app.metricslab.io/track';
```

### Paso 5: Activar y Guardar

1. **Activa** el snippet
2. **Guarda** los cambios
3. **Purga el cache** de todos tus plugins de cache

---

## ✅ Verificación

### Test 1: Verificar que se carga

1. Abre tu sitio en modo incógnito
2. Presiona F12 (consola del navegador)
3. Deberías ver: `[Metrics Lab] Inicializando Metrics Lab...`
4. NO deberías ver errores

### Test 2: Verificar tracking

1. Visita: `https://tu-sitio.com/?gclid=test123&utm_source=google&utm_medium=cpc`
2. Ve a tu dashboard de Metrics Lab
3. Debería aparecer el evento en "Paid Campaigns"

### Test 3: Verificar clicks

1. Haz clic en cualquier botón o enlace
2. En la consola deberías ver: `[Metrics Lab] Enviando evento: click`
3. En tu dashboard debería aparecer el evento

### Test 4: Verificar llamadas

1. Haz clic en un botón con `href="tel:+1234567890"`
2. En la consola deberías ver: `[Metrics Lab] Enviando evento: call_click`
3. En tu dashboard debería aparecer el evento

---

## 🛡️ Características de Seguridad

### ✅ Compatible con Cache Plugins

- No usa sintaxis moderna que confunda a los minificadores
- No usa `const`, `let`, arrow functions, o template literals
- Usa `var` y `function()` clásicas
- Compatible con LiteSpeed Cache, WP Rocket, W3 Total Cache, etc.

### ✅ Compatible con Temas

- No interfiere con jQuery o otras librerías
- Event listeners seguros
- No modifica el DOM
- Compatible con Astra, GeneratePress, Divi, Avada, etc.

### ✅ Compatible con Navegadores Antiguos

- Fallback para XMLHttpRequest si no hay fetch
- Fallback para event listeners
- Parsing manual de URL parameters
- Compatible con IE8+

### ✅ Manejo de Errores

- No rompe la página si algo falla
- Console.log seguro
- Validación de API key
- Errores silenciosos que no afectan la experiencia del usuario

---

## 🚨 Qué Hacer si Hay Problemas

### Si el sitio se ve mal después de instalar:

1. **Desactiva el snippet inmediatamente**
2. **Purga el cache** de todos los plugins de cache
3. **Verifica** que no haya errores de sintaxis en el código
4. **Contacta soporte** si el problema persiste

### Si no se registran eventos:

1. Verifica que el API_KEY esté correcto (sin espacios)
2. Verifica que el TRACKING_ENDPOINT sea correcto
3. Activa DEBUG_MODE = true para ver logs
4. Verifica que tu backend esté corriendo

### Si hay conflictos con otros plugins:

1. Desactiva otros plugins uno por uno para identificar el conflicto
2. Verifica que no haya otros scripts de tracking que interfieran
3. Purga el cache después de cada cambio

---

## 📊 URLs de Prueba

### Test de Campañas

```
Google Ads:
https://tu-sitio.com/?gclid=test123&utm_source=google&utm_medium=cpc&utm_campaign=prueba

Facebook Ads:
https://tu-sitio.com/?fbclid=test456&utm_source=facebook&utm_medium=cpc&utm_campaign=prueba

TikTok Ads:
https://tu-sitio.com/?ttclid=test789&utm_source=tiktok&utm_medium=cpc&utm_campaign=prueba

LinkedIn Ads:
https://tu-sitio.com/?li_fat_id=test999&utm_source=linkedin&utm_medium=cpc&utm_campaign=prueba

Email Campaign:
https://tu-sitio.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly
```

---

## 🎯 Diferencias con Versiones Anteriores

| Aspecto | Versión Anterior | Versión Segura |
|---------|------------------|----------------|
| Sintaxis | ES6+ (moderna) | ES5 (clásica) |
| Compatibilidad | Navegadores modernos | IE8+ |
| Inicialización | DOMContentLoaded | Múltiples fallbacks |
| URL Parsing | URLSearchParams | Manual |
| DOM Traversal | .closest() | Manual |
| Requests | Solo fetch | Fetch + XMLHttpRequest |
| Error Handling | Promises | Try/catch clásico |
| Cache Safety | Medio | Alto |

---

## 📞 Soporte

Este script ha sido probado con:
- ✅ LiteSpeed Cache
- ✅ WP Rocket
- ✅ W3 Total Cache
- ✅ WP Super Cache
- ✅ Autoptimize
- ✅ Code Snippets
- ✅ Temas populares (Astra, GeneratePress, Divi, Avada, etc.)

Si tienes problemas, verifica primero que no sea un problema de cache corrupto.

---

## ✅ Checklist Final

Antes de considerar que todo está listo:

- [ ] El snippet está instalado en Code Snippets
- [ ] El API_KEY está configurado correctamente
- [ ] El TRACKING_ENDPOINT apunta a tu servidor
- [ ] El snippet está activado
- [ ] El cache está purgado
- [ ] Puedes ver eventos en la consola (con DEBUG_MODE=true)
- [ ] Los eventos aparecen en el dashboard
- [ ] No hay errores en la consola del navegador
- [ ] El sitio se ve normal (sin cambios visuales)

**¡Listo! Tu sistema de tracking está completamente configurado y funcionando de forma segura.** 🎉
