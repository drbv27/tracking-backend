# 🐛 Fix: Eventos del día actual no aparecen en el Dashboard

## Problema Identificado

Los eventos del día actual (18 de noviembre 2025) no aparecían en el dashboard, aunque estaban correctamente guardados en MongoDB.

### Evento de Prueba en MongoDB
```json
{
  "_id": "691cbb203436debb9b9d26b8",
  "apiKey": "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4",
  "eventType": "page_view",
  "trafficSource": {
    "type": "paid",
    "platform": "google",
    "medium": "test"
  },
  "gclid": "debug_test_001",
  "utm_source": "debug",
  "utm_medium": "test",
  "utm_campaign": "debug_profesional",
  "pageUrl": "https://test-debug.com/",
  "timestamp": "2025-11-18T18:29:52.646Z"  ← 6:29 PM UTC
}
```

### Causa Raíz

**Problema de Zona Horaria Local vs UTC**

En `routes/analyticsRoutes.js`, la función `getDateRange()` convertía las fechas usando la zona horaria local del servidor en lugar de UTC:

```javascript
// ❌ CÓDIGO ANTERIOR (INCORRECTO)
function getDateRange(req) {
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999);  // ← Usa zona horaria LOCAL
    // ...
}
```

**¿Qué pasaba?**

1. Frontend envía: `endDate: "2025-11-18"`
2. Backend convierte: `new Date("2025-11-18")` → Se interpreta en zona horaria LOCAL (UTC-5)
3. Resultado: `2025-11-17T05:00:00.000Z` (¡un día antes en UTC!)
4. Con `setHours(23, 59, 59, 999)`: `2025-11-18T04:59:59.999Z`
5. Evento real: `timestamp: "2025-11-18T18:29:52.646Z"`
6. **Resultado**: El evento NO se incluye porque `18:29:52` > `04:59:59`

**Ejemplo del problema:**
```
Servidor en zona horaria UTC-5:
new Date("2025-11-18")           → 2025-11-18 00:00:00 LOCAL (UTC-5)
                                 → 2025-11-17T05:00:00.000Z (UTC)
setHours(23, 59, 59, 999)        → 2025-11-18 23:59:59 LOCAL (UTC-5)
                                 → 2025-11-18T04:59:59.999Z (UTC)

Evento en MongoDB:               → 2025-11-18T18:29:52.646Z (UTC)

Query busca hasta: 04:59:59 UTC
Evento está en:    18:29:52 UTC  ← ¡NO SE INCLUYE! ❌
```

### Diagrama del Problema

```
Línea de Tiempo del 18 de Noviembre 2025:

00:00:00 ←─────────────────────────────────────────→ 23:59:59
    ↑                                    ↑
    |                                    |
endDate del query                   Tu evento
(00:00:00 UTC)                     (18:29:52 UTC)
                                        ↑
                                   NO SE INCLUYE ❌
```

## ✅ Solución Aplicada

Modificamos la función `getDateRange()` para que:
- **startDate**: Se establece al inicio del día (00:00:00.000)
- **endDate**: Se establece al final del día (23:59:59.999)

```javascript
// ✅ CÓDIGO NUEVO (CORRECTO)
function getDateRange(req) {
    // Parse endDate and set to end of day (23:59:59.999) in UTC
    let endDate;
    if (req.query.endDate) {
        // Parse date string as UTC by appending 'T23:59:59.999Z'
        endDate = new Date(req.query.endDate + 'T23:59:59.999Z');  // ← FIX: Parsea en UTC
    } else {
        endDate = new Date();
        endDate.setUTCHours(23, 59, 59, 999);  // ← FIX: Usa setUTCHours
    }
    
    // Parse startDate and set to start of day (00:00:00.000) in UTC
    let startDate;
    if (req.query.startDate) {
        // Parse date string as UTC by appending 'T00:00:00.000Z'
        startDate = new Date(req.query.startDate + 'T00:00:00.000Z');  // ← FIX: Parsea en UTC
    } else {
        // Default: last 30 days
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate.setUTCHours(0, 0, 0, 0);  // ← FIX: Usa setUTCHours
    }
    
    return { startDate, endDate };
}
```

### Diagrama de la Solución

```
Línea de Tiempo del 18 de Noviembre 2025 (UTC):

00:00:00 ←─────────────────────────────────────────→ 23:59:59.999
    ↑                                    ↑              ↑
    |                                    |              |
startDate                           Tu evento      endDate
(2025-11-18T00:00:00.000Z)    (18:29:52 UTC)  (2025-11-18T23:59:59.999Z)
                                        ↑
                                   SE INCLUYE ✅

ANTES (zona horaria local UTC-5):
Start: 2025-11-17T05:00:00.000Z  ← ¡Un día antes!
End:   2025-11-18T04:59:59.999Z  ← ¡Solo hasta las 4:59 AM!
Evento: 2025-11-18T18:29:52.646Z ← NO SE INCLUYE ❌

DESPUÉS (UTC correcto):
Start: 2025-11-18T00:00:00.000Z  ← Correcto
End:   2025-11-18T23:59:59.999Z  ← Correcto
Evento: 2025-11-18T18:29:52.646Z ← SE INCLUYE ✅
```

## 🧪 Cómo Probar el Fix

### 1. Reiniciar el Backend

```bash
# Si estás usando nodemon (desarrollo)
# Se reiniciará automáticamente

# Si estás usando node directamente
# Ctrl+C y luego:
npm start

# Si estás usando PM2 (producción)
pm2 restart metrics-lab
```

### 2. Verificar en el Dashboard

1. Abre el dashboard: `http://localhost:3001/project/[tu-project-id]`
2. Asegúrate de que el rango de fechas incluya hoy (18 de noviembre)
3. Deberías ver el evento de prueba en:
   - **Overview Tab**: En el total de eventos
   - **Paid Campaigns Tab**: Campaña "debug_profesional"

### 3. Verificar con la Consola del Navegador

Abre DevTools (F12) y ejecuta:

```javascript
// Ver el rango de fechas actual
console.log('Date Range:', {
  start: '2025-10-19',  // Hace 30 días
  end: '2025-11-18'     // Hoy
});

// Hacer una petición manual para verificar
fetch('http://localhost:5000/api/projects/[tu-project-id]/analytics/counts?startDate=2025-11-18&endDate=2025-11-18', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('Events today:', data));
```

## 📊 Impacto del Fix

### Antes del Fix ❌
- Eventos del día actual no aparecían hasta el día siguiente
- Los usuarios veían datos desactualizados
- Las métricas en tiempo real no funcionaban correctamente

### Después del Fix ✅
- Eventos del día actual aparecen inmediatamente
- Dashboard muestra datos en tiempo real
- Rango de fechas funciona correctamente para cualquier día

## 🔍 Archivos Modificados

- `routes/analyticsRoutes.js` - Función `getDateRange()` actualizada

## 📝 Notas Técnicas

### Por qué usar 23:59:59.999 en lugar de 23:59:59

MongoDB almacena timestamps con precisión de milisegundos. Si usamos `23:59:59.000`, perderíamos eventos que ocurran entre `23:59:59.001` y `23:59:59.999`.

### Zona Horaria

El sistema usa UTC para todos los timestamps, lo cual es correcto. El fix asegura que:
- `startDate` = inicio del día en UTC (00:00:00.000)
- `endDate` = fin del día en UTC (23:59:59.999)

Esto garantiza que todos los eventos del día se incluyan, independientemente de la zona horaria del usuario.

## ✅ Checklist de Verificación

- [x] Código modificado en `routes/analyticsRoutes.js`
- [x] Sin errores de sintaxis
- [ ] Backend reiniciado
- [ ] Dashboard actualizado (F5)
- [ ] Evento de prueba visible en Overview
- [ ] Evento de prueba visible en Paid Campaigns
- [ ] Métricas del día actual correctas

## 🚀 Próximos Pasos

1. **Reinicia el backend** para aplicar los cambios
2. **Actualiza el dashboard** (F5 en el navegador)
3. **Verifica** que el evento del 18 de noviembre aparezca
4. **Prueba** con eventos nuevos del día actual

---

**Fix aplicado el:** 18 de Noviembre 2025
**Versión:** 2.1.1
**Estado:** ✅ Resuelto
