# 🔍 Verificar Eventos en MongoDB

## ✅ Buenas Noticias

Según los logs, **los eventos SÍ se están guardando** en MongoDB:

```
Evento (con apiKey) guardado en la base de datos.
```

Tu API Key es: `key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4`

---

## 🎯 El Problema

Los eventos se guardan pero no aparecen en el dashboard. Posibles causas:

1. **Estás viendo el proyecto incorrecto** en el dashboard
2. **El API Key del proyecto no coincide** con el del script
3. **El dashboard no está consultando correctamente** la base de datos

---

## 🧪 Verificación Directa en MongoDB

Vamos a verificar directamente en la base de datos.

### Opción 1: Desde el Servidor (SSH)

Conéctate por SSH y ejecuta:

```bash
# Conectarse a MongoDB
mongosh "tu_mongodb_uri"

# Listar bases de datos
show dbs

# Usar la base de datos correcta
use tracking_db  # O el nombre de tu base de datos

# Ver las colecciones
show collections

# Contar eventos
db.events.countDocuments()

# Ver los últimos 5 eventos
db.events.find().sort({createdAt: -1}).limit(5).pretty()

# Ver eventos con tu API Key
db.events.find({apiKey: "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4"}).count()

# Ver los últimos eventos con tu API Key
db.events.find({apiKey: "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4"}).sort({createdAt: -1}).limit(5).pretty()
```

### Opción 2: Desde MongoDB Atlas (Web)

1. Ve a: https://cloud.mongodb.com/
2. Inicia sesión
3. Ve a tu cluster
4. Haz clic en "Browse Collections"
5. Busca la colección "events"
6. Filtra por: `apiKey: "key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4"`

---

## 🔧 Verificar el Dashboard

### Paso 1: Verificar el Proyecto

1. Ve a: https://app.metricslab.io/
2. Verifica que estés en el proyecto correcto
3. Copia el API Key del proyecto actual

### Paso 2: Comparar API Keys

**API Key en los logs del backend:**
```
key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4
```

**API Key en el dashboard:**
```
[Copia el API Key que ves en el dashboard]
```

**¿Son iguales?**
- ✅ **SÍ** → El problema está en el dashboard
- ❌ **NO** → Necesitas usar el API Key correcto

### Paso 3: Verificar la Ruta de Analytics

El dashboard consulta los eventos desde:
```
/api/projects/:projectId/analytics
```

Vamos a verificar que esta ruta funcione correctamente.

---

## 🐛 Debug del Dashboard

Vamos a verificar que el dashboard esté consultando correctamente.

### Verificar la Ruta de Analytics

Abre la consola del navegador en el dashboard (F12) y busca requests a:
```
/api/projects/[projectId]/analytics
```

**¿Qué ves?**
- ✅ **200 OK** → La ruta funciona
- ❌ **404 Not Found** → La ruta no existe
- ❌ **500 Error** → Hay un error en el servidor

---

## 🔍 Verificar el Código del Dashboard

Vamos a revisar el código que consulta los eventos.
