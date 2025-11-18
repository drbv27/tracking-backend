# 📦 Metrics Lab - Guía de Instalación Completa

## 🎯 Versión Actual: 2.1.0 (WordPress Safe)

Esta es la guía maestra para instalar Metrics Lab en tu sitio web. La versión 2.1.0 ha sido completamente optimizada para WordPress y es compatible con todos los plugins de cache.

---

## 📚 Documentación Disponible

### 🚀 Guías de Instalación

1. **`GUIA_INSTALACION_WORDPRESS_SEGURA.md`** ⭐ **RECOMENDADO**
   - Guía completa para WordPress
   - Código listo para copiar y pegar
   - Compatible con Code Snippets
   - Tests de verificación incluidos

2. **`GUIA_INSTALACION_WORDPRESS.md`**
   - Guía general de WordPress
   - Referencia a la guía segura
   - Información de despliegue en Hostinger

3. **`CONFIGURACION_RAPIDA.md`**
   - Setup rápido en 5 minutos
   - Para usuarios avanzados

### 🔧 Documentación Técnica

4. **`VERIFICACION_COMPATIBILIDAD.md`**
   - Lista completa de cambios técnicos
   - Compatibilidad probada
   - Características de seguridad

5. **`CAMBIOS_V2.1.0.md`**
   - Changelog detallado
   - Comparación de versiones
   - Guía de migración

6. **`public/tracking-script.js`**
   - Script de tracking completo
   - Comentarios detallados
   - Ejemplos de uso

---

## 🚀 Instalación Rápida (5 minutos)

### Paso 1: Obtener API Key

1. Ve a https://app.metricslab.io/
2. Inicia sesión
3. Selecciona tu proyecto
4. Copia tu API Key

### Paso 2: Instalar en WordPress

1. Instala el plugin **Code Snippets**
2. Ve a **Snippets → Add New**
3. Copia el código de `GUIA_INSTALACION_WORDPRESS_SEGURA.md`
4. Reemplaza `API_KEY` y `TRACKING_ENDPOINT`
5. Activa el snippet
6. Purga el cache

### Paso 3: Verificar

1. Abre tu sitio en modo incógnito
2. Presiona F12 (consola)
3. Deberías ver: `[Metrics Lab] Inicializando...`
4. Visita: `?gclid=test123&utm_source=google`
5. Verifica en el dashboard que aparezca el evento

---

## ✅ Características de la Versión 2.1.0

### 🛡️ Seguridad y Compatibilidad

- ✅ **100% compatible con WordPress**
- ✅ **Compatible con todos los plugins de cache**
  - LiteSpeed Cache
  - WP Rocket
  - W3 Total Cache
  - WP Super Cache
  - Autoptimize
  - Y más...

- ✅ **Compatible con navegadores antiguos**
  - Internet Explorer 8+
  - Todos los navegadores modernos

- ✅ **Compatible con minificadores**
  - Terser
  - UglifyJS
  - Google Closure Compiler
  - Minificadores de plugins de cache

- ✅ **No interfiere con otros scripts**
  - jQuery
  - React
  - Vue
  - Angular
  - Otras librerías

### 📊 Funcionalidades de Tracking

- ✅ **Page views** - Vistas de página automáticas
- ✅ **Click tracking** - Clicks en botones y enlaces
- ✅ **Call tracking** - Clicks en botones de llamada (tel:)
- ✅ **Form tracking** - Envíos de formularios
- ✅ **Campaign tracking** - Detección automática de campañas
  - Google Ads (gclid)
  - Facebook Ads (fbclid)
  - TikTok Ads (ttclid)
  - LinkedIn Ads (li_fat_id)
  - UTM parameters

- ✅ **Traffic source detection** - Clasificación automática
  - Organic (búsquedas)
  - Paid (campañas)
  - Referral (otros sitios)
  - Direct (directo)
  - Social (redes sociales)

---

## 🎯 Casos de Uso

### 1. E-commerce
Trackea conversiones de campañas publicitarias y asocia ventas con la fuente de tráfico.

### 2. Lead Generation
Identifica qué campañas generan más llamadas y formularios.

### 3. Content Marketing
Analiza qué contenido atrae más tráfico orgánico.

### 4. Paid Advertising
Optimiza campañas de Google Ads, Facebook Ads, etc.

### 5. SEO
Monitorea el tráfico orgánico y las keywords que funcionan.

---

## 🧪 URLs de Prueba

### Google Ads
```
https://tu-sitio.com/?gclid=test123&utm_source=google&utm_medium=cpc&utm_campaign=prueba
```

### Facebook Ads
```
https://tu-sitio.com/?fbclid=test456&utm_source=facebook&utm_medium=cpc&utm_campaign=prueba
```

### TikTok Ads
```
https://tu-sitio.com/?ttclid=test789&utm_source=tiktok&utm_medium=cpc&utm_campaign=prueba
```

### LinkedIn Ads
```
https://tu-sitio.com/?li_fat_id=test999&utm_source=linkedin&utm_medium=cpc&utm_campaign=prueba
```

### Email Campaign
```
https://tu-sitio.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly
```

---

## 🚨 Troubleshooting

### Problema: No se registran eventos

**Solución:**
1. Verifica que el API_KEY esté correcto
2. Verifica que el TRACKING_ENDPOINT sea correcto
3. Activa DEBUG_MODE = true
4. Verifica la consola del navegador
5. Verifica que tu backend esté corriendo

### Problema: El sitio se ve mal

**Solución:**
1. Desactiva el snippet inmediatamente
2. Purga el cache de todos los plugins
3. Verifica que no haya errores de sintaxis
4. Contacta soporte

### Problema: Conflictos con otros plugins

**Solución:**
1. Desactiva otros plugins uno por uno
2. Identifica el plugin conflictivo
3. Verifica que no haya otros scripts de tracking
4. Contacta soporte con detalles

---

## 📊 Dashboard

El dashboard de Metrics Lab te permite:

- 📈 **Overview** - Resumen de todo el tráfico
- 🌱 **Organic** - Tráfico de búsquedas
- 💰 **Paid Campaigns** - Campañas publicitarias
- 🔗 **Referrals** - Tráfico de otros sitios
- 🎯 **Direct** - Tráfico directo

Cada pestaña muestra:
- Total de eventos
- Eventos únicos
- Detalles de cada evento
- Filtros por fecha

---

## 🔧 Configuración Avanzada

### Debug Mode

Para ver logs detallados en la consola:

```javascript
var DEBUG_MODE = true;
```

### Custom Events

Para trackear eventos personalizados:

```javascript
window.MetricsLab.track('custom_event', {
  custom_field: 'valor',
  otro_campo: 'otro_valor'
});
```

### Manual Page View

Para trackear page views manualmente (SPAs):

```javascript
window.MetricsLab.trackPageView();
```

---

## 📞 Soporte

### Documentación
- Lee las guías en este repositorio
- Revisa los ejemplos en `public/tracking-script.js`

### Problemas Técnicos
1. Verifica la consola del navegador (F12)
2. Activa DEBUG_MODE
3. Revisa los logs del servidor
4. Contacta soporte con detalles específicos

### Preguntas Frecuentes

**¿Es compatible con mi tema de WordPress?**
Sí, la versión 2.1.0 es compatible con todos los temas.

**¿Afecta la velocidad de mi sitio?**
No, el script es muy ligero y se carga de forma asíncrona.

**¿Funciona con plugins de cache?**
Sí, está específicamente diseñado para funcionar con todos los plugins de cache.

**¿Necesito saber programar?**
No, solo necesitas copiar y pegar el código.

**¿Puedo usar esto en múltiples sitios?**
Sí, cada sitio necesita su propio API Key.

---

## ✅ Checklist de Instalación

- [ ] Leí `GUIA_INSTALACION_WORDPRESS_SEGURA.md`
- [ ] Instalé Code Snippets
- [ ] Copié el código del script
- [ ] Configuré API_KEY
- [ ] Configuré TRACKING_ENDPOINT
- [ ] Activé el snippet
- [ ] Purgué el cache
- [ ] Verifiqué que no haya errores en consola
- [ ] Probé con URLs de campaña
- [ ] Verifiqué eventos en el dashboard

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu sistema de tracking está funcionando correctamente.

**Próximos pasos:**
1. Monitorea tu dashboard diariamente
2. Analiza qué campañas funcionan mejor
3. Optimiza tu presupuesto publicitario
4. Mejora tus páginas de aterrizaje

**¡Disfruta de Metrics Lab!** 🚀
