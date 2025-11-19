# 🔍 Debug del Dashboard - Nivel Bajo

## 🎯 Problema Identificado

1. ✅ **Backend funciona** - Los eventos se guardan en MongoDB
2. ✅ **Eventos tienen `trafficSource`** - El campo está correcto
3. ❌ **Dashboard no muestra eventos** - Aquí está el problema
4. ❌ **Script no instalado en WordPress** - `window.MetricsLab` es undefined

---

## 🔍 Debug Paso 1: Verificar el API Key del Proyecto

El dashboard consulta eventos usando `project.apiKey`. Necesitamos verificar que el proyecto tenga el API Key correcto.

### En MongoDB:

```bash
# Conéctate a MongoDB
mongosh "tu_mongodb_uri"

# Usa la base de datos
use tracking_db

# Ver TODOS los proyectos
db.projects.find().pretty()

# Buscar proyecto con tu API Key
db.projects.findOne({apiKey: "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4"})
```

**¿Qué deberías ver?**

**Caso A: El proyecto existe**
```javascript
{
  _id: ObjectId("..."),
  name: "Abogado de Bancarrota",
  apiKey: "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4",
  user: ObjectId("..."),
  createdAt: ISODate("..."),
  __v: 0
}
```

**Caso B: El proyecto NO existe**
```
null
```

---

## 🔍 Debug Paso 2: Verificar el ProjectId en el Dashboard

### En el Dashboard:

1. **Ve a:** https://app.metricslab.io/
2. **Abre tu proyecto**
3. **Mira la URL**, debería ser algo como:
   ```
   https://app.metricslab.io/project/[ESTE_ES_EL_PROJECT_ID]
   ```
4. **Copia ese PROJECT_ID**

### En MongoDB:

```bash
# Buscar proyecto por ID
db.projects.findOne({_id: ObjectId("PROJECT_ID_AQUI")})
```

**Reemplaza `PROJECT_ID_AQUI` con el ID que copiaste de la URL.**

**¿Qué deberías ver?**
```javascript
{
  _id: ObjectId("PROJECT_ID_AQUI"),
  name: "...",
  apiKey: "key_...",  // ← Este es el API Key del proyecto
  user: ObjectId("..."),
  ...
}
```

**IMPORTANTE:** Copia el `apiKey` que ves aquí.

---

## 🔍 Debug Paso 3: Comparar API Keys

**API Key en MongoDB (eventos):**
```
key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4
```

**API Key en MongoDB (proyecto):**
```
[El que copiaste en el Paso 2]
```

**¿Son iguales?**

### Caso A: Son IGUALES ✅
Si son iguales, el problema está en el código del dashboard. Ve al **Debug Paso 4**.

### Caso B: Son DIFERENTES ❌
Si son diferentes, este es el problema. Tienes dos opciones:

**Opción 1:** Actualizar el proyecto con el API Key correcto
```bash
db.projects.updateOne(
  {_id: ObjectId("PROJECT_ID_AQUI")},
  {$set: {apiKey: "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4"}}
)
```

**Opción 2:** Actualizar WordPress con el API Key del proyecto
- Ve a WordPress → Snippets
- Cambia el API Key en el script
- Guarda y purga el cache

---

## 🔍 Debug Paso 4: Verificar la Query del Dashboard

Si los API Keys son iguales, vamos a verificar que el dashboard esté consultando correctamente.

### En el Dashboard:

1. **Abre el dashboard:** https://app.metricslab.io/project/[PROJECT_ID]
2. **Presiona F12**
3. **Ve a la pestaña "Network"**
4. **Refresca la página** (F5)
5. **Busca requests a:** `/api/projects/[PROJECT_ID]/analytics`

**¿Qué ves?**

### Caso A: Request 200 OK
Si ves un request con status 200:
1. **Haz clic en el request**
2. **Ve a la pestaña "Response"**
3. **Copia la respuesta completa**
4. **Pégala aquí**

### Caso B: Request 404 Not Found
Si ves 404, la ruta no existe. Necesitamos verificar el backend.

### Caso C: Request 500 Error
Si ves 500, hay un error en el servidor. Necesitamos ver los logs.

### Caso D: No hay requests
Si no ves ningún request, el dashboard no está consultando. Hay un problema con el código del frontend.

---

## 🔍 Debug Paso 5: Probar la Ruta Manualmente

Vamos a probar la ruta de analytics manualmente para ver qué responde.

### Obtener el Token de Autenticación:

1. **En el dashboard (F12 → Console):**
   ```javascript
   localStorage.getItem('token')
   ```
2. **Copia el token** (algo como `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Probar la Ruta:

En la consola del dashboard:

```javascript
fetch('/api/projects/PROJECT_ID_AQUI/analytics/counts', {
  headers: {
    'x-auth-token': 'TU_TOKEN_AQUI'
  }
})
.then(r => r.json())
.then(d => console.log('Respuesta:', d))
.catch(e => console.error('Error:', e));
```

**Reemplaza:**
- `PROJECT_ID_AQUI` con tu project ID
- `TU_TOKEN_AQUI` con el token que copiaste

**¿Qué ves?**

### Respuesta Esperada:
```javascript
{
  total: 150,
  organic: 50,
  paid: 80,
  referral: 10,
  direct: 10,
  social: 0
}
```

### Si ves `{total: 0, organic: 0, paid: 0, ...}`:
Los eventos no se están encontrando. El problema está en la query.

### Si ves un error:
Hay un problema con el backend o la autenticación.

---

## 🔍 Debug Paso 6: Verificar la Query en el Backend

Si la respuesta es `{total: 0, ...}`, vamos a verificar la query directamente en MongoDB.

### Query Manual:

```bash
# Esta es la query que hace el dashboard
db.events.countDocuments({
  apiKey: "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4",
  timestamp: {
    $gte: new Date("2025-01-18T00:00:00Z"),
    $lte: new Date("2025-01-19T00:00:00Z")
  }
})
```

**¿Qué número ves?**

### Si ves 0:
Los eventos no están en el rango de fechas. Prueba sin el filtro de fecha:

```bash
db.events.countDocuments({
  apiKey: "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4"
})
```

### Si ves un número > 0:
Los eventos existen pero el dashboard no los está encontrando. El problema está en el rango de fechas.

---

## 🔍 Debug Paso 7: Verificar el Rango de Fechas

El dashboard usa un rango de fechas por defecto (últimos 30 días). Vamos a verificar que los eventos estén en ese rango.

### Ver la fecha del evento de prueba:

```bash
db.events.findOne({
  gclid: "debug_test_001"
})
```

**Mira el campo `timestamp`:**
```javascript
timestamp: ISODate("2025-11-18T18:29:52.646Z")
```

**IMPORTANTE:** La fecha es **2025-11-18** (noviembre), pero estamos en **enero 2025**.

**Este es el problema:** El evento tiene una fecha futura (noviembre 2025) y el dashboard está buscando eventos de los últimos 30 días (enero 2025).

---

## 🎯 Solución

### Opción 1: Cambiar el Rango de Fechas en el Dashboard

En el dashboard, busca un selector de fechas y cambia a:
- **Start Date:** 2025-11-01
- **End Date:** 2025-11-30

### Opción 2: Crear un Evento con la Fecha Correcta

Envía un nuevo evento con la fecha de HOY:

```javascript
fetch('https://app.metricslab.io/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4',
    event_type: 'page_view',
    page_url: 'https://test-hoy.com/',
    gclid: 'test_hoy_enero_2025',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'test_enero_2025',
    timestamp: new Date().toISOString()  // ← Fecha de HOY
  })
})
.then(r => r.json())
.then(d => console.log('✅', d));
```

Luego verifica en el dashboard.

---

## 📊 Resumen de Debugging

Ejecuta los pasos en orden:

1. **Paso 1:** Verificar que el proyecto existe en MongoDB
2. **Paso 2:** Obtener el PROJECT_ID del dashboard
3. **Paso 3:** Comparar API Keys (proyecto vs eventos)
4. **Paso 4:** Ver requests en Network tab
5. **Paso 5:** Probar la ruta manualmente
6. **Paso 6:** Verificar la query en MongoDB
7. **Paso 7:** Verificar el rango de fechas

**Dime los resultados de cada paso y te diré exactamente qué hacer.** 💪
