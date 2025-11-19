# 📋 Resumen de Sesión de Debug - Metrics Lab

## 🎯 Problema Principal
El script de tracking de Metrics Lab instalado en WordPress (https://abogadodebancarrota.com/) NO está ejecutándose y NO está enviando eventos al backend.

---

## ✅ Lo que SÍ Funciona

### Backend (Producción)
- ✅ Backend en https://app.metricslab.io/ funciona perfectamente
- ✅ Endpoint `/track` recibe y procesa eventos correctamente
- ✅ MongoDB guarda eventos sin problemas
- ✅ Fix de fechas (UTC) aplicado y funcionando
- ✅ Dashboard muestra eventos correctamente (hasta el 18 de noviembre)

### Tests Realizados con Postman
- ✅ Test 1.1: Page view básico → 200 OK
- ✅ Test 1.2: Page view con parámetros de campaña (gclid, UTM) → 200 OK, clasificado como "paid"
- ✅ Test 1.5: Call click con gclid → 200 OK, mantiene asociación con campaña

### Script en Entorno Controlado
- ✅ Script funciona en archivo HTML local (WORDPRESS_DEBUG_SCRIPT.html)
- ✅ Envía eventos al backend (aunque con error CORS por file://)
- ✅ Eventos llegan a MongoDB correctamente

---

## ❌ El Problema

### Script en WordPress NO se ejecuta
- ❌ Script está en el código fuente HTML pero NO se ejecuta
- ❌ NO aparecen logs `[Metrics Lab]` en la consola del navegador
- ❌ NO se envían requests al backend
- ❌ NO se registran eventos en MongoDB

### Causa Identificada: LiteSpeed Cache

**El script está siendo bloqueado/retrasado por LiteSpeed Cache:**

1. **Script sin tipo correcto**: El script aparece como `<script>` sin `type="text/javascript"`
2. **LiteSpeed lo convierte**: A `type="litespeed/javascript"` 
3. **Ejecución retrasada**: LiteSpeed retrasa la ejecución hasta interacción del usuario
4. **Comentario HTML rompe el script**: La línea `<!-- Metrics Lab Enhanced Tracking Script -->` está causando error de sintaxis

### Evidencia en el Código Fuente:
```html
<script>Metrics Lab Enhanced Tracking Script - WordPress Safe v2.1.0 -->(function() {
  // Configuration
  var API_KEY = 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4';
  ...
})();</script>
```

**Problemas:**
- Falta `type="text/javascript"`
- Comentario HTML `<!-- -->` está rompiendo el código
- LiteSpeed lo está procesando y retrasando

---

## 🔧 Solución en Progreso

### Paso Actual: Excluir Script de LiteSpeed

**Ubicación**: WordPress → LiteSpeed Cache → [8] Tuning → JS Excludes

**Acción**: Agregar `Metrics Lab` en el campo "JS Excludes" para que LiteSpeed NO procese el script.

**Estado**: Usuario está en la pantalla correcta, listo para agregar la exclusión.

---

## 📁 Archivos Creados Durante el Debug

1. **DEBUG_PLAN_PROFESIONAL.md** - Plan completo de debugging (6 fases)
2. **POSTMAN_TESTS.json** - Colección de tests para Postman
3. **WORDPRESS_DEBUG_SCRIPT.html** - Página de prueba con el script
4. **FIX_FECHA_DASHBOARD.md** - Documentación del fix de zona horaria UTC
5. **test-date-range.js** - Script para verificar fechas en MongoDB
6. **test-date-range-fixed.js** - Script para verificar el fix

---

## 🎯 Próximos Pasos

1. **Agregar exclusión en LiteSpeed**:
   - En "JS Excludes", agregar: `Metrics Lab`
   - Save Changes
   - Purgar cache

2. **Verificar**:
   - Abrir https://abogadodebancarrota.com/ en incógnito
   - Abrir consola (F12)
   - Buscar logs `[Metrics Lab]`
   - Verificar request a `/track` en Network tab

3. **Si no funciona**:
   - Opción alternativa: Agregar script directamente en `footer.php` del tema
   - Esto bypasea completamente Code Snippets y LiteSpeed

---

## 📊 Configuración del Proyecto

### Backend
- **URL**: https://app.metricslab.io/
- **Puerto**: 3000
- **Procesos PM2**: 
  - Proceso 1: Backend (saas-api)
  - Proceso 2: Dashboard (saas-dashboard)
- **MongoDB**: Conectado y funcionando
- **Nginx**: Configurado correctamente

### Frontend (Dashboard)
- **URL**: https://app.metricslab.io/
- **Puerto**: 3001
- **Framework**: Next.js 14

### WordPress
- **URL**: https://abogadodebancarrota.com/
- **API Key**: `key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4`
- **Plugin usado**: Code Snippets
- **Cache**: LiteSpeed Cache (causando el problema)

---

## 🔑 Información Importante

- **Tracking Endpoint**: `https://app.metricslab.io/track`
- **Debug Mode**: `true` (activado en el script)
- **Script Version**: 2.1.0
- **Última modificación**: Se eliminó comentario HTML pero LiteSpeed sigue procesándolo

---

## 💡 Lecciones Aprendidas

1. **LiteSpeed Cache es agresivo**: Convierte scripts inline a `litespeed/javascript` y los retrasa
2. **Code Snippets + LiteSpeed = Problemas**: La combinación puede causar conflictos
3. **Comentarios HTML en scripts**: Pueden romper la ejecución en ciertos contextos
4. **Zona horaria UTC**: Era crítico para el filtrado de fechas en el dashboard
5. **Testing sistemático**: El plan de debug profesional fue efectivo para identificar el problema

---

**Fecha**: 19 de Noviembre 2025
**Estado**: En progreso - Aplicando solución de exclusión en LiteSpeed
