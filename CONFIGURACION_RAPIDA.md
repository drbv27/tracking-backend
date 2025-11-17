# ⚡ Configuración Rápida - 5 Pasos

## Paso 1: Obtén tu API Key (2 min)

1. Ve a tu dashboard: http://localhost:3001 (o tu URL de producción)
2. Inicia sesión
3. Selecciona tu proyecto
4. Copia el API Key

**Tu API Key se ve así:** `key_abc123xyz789...`

---

## Paso 2: Configura el Script (2 min)

Abre `public/tracking-script.js` y cambia estas líneas:

**ANTES:**
```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
const TRACKING_ENDPOINT = 'https://your-domain.com/track';
```

**DESPUÉS:**
```javascript
const API_KEY = 'pega_tu_api_key_aqui';
const TRACKING_ENDPOINT = 'https://tu-dominio-hostinger.com/track';
```

**Ejemplo real:**
```javascript
const API_KEY = 'key_abc123xyz789';
const TRACKING_ENDPOINT = 'https://metricslab.midominio.com/track';
```

---

## Paso 3: Instala en WordPress (5 min)

### Método 1: Con Plugin (Recomendado)

1. En WordPress: **Plugins → Añadir nuevo**
2. Busca: **"Insert Headers and Footers"**
3. Instala y activa
4. Ve a: **Configuración → Insert Headers and Footers**
5. En **"Scripts in Footer"**, pega el contenido COMPLETO de `public/tracking-script.js`
6. Envuelve el código en etiquetas `<script>`:

```html
<script>
// Pega aquí TODO el contenido de tracking-script.js
</script>
```

7. Guarda

### Método 2: Editar Tema Directamente

1. **Apariencia → Editor de Temas**
2. Abre **footer.php**
3. Busca `</body>`
4. ANTES de `</body>`, pega:

```html
<script>
// Pega aquí TODO el contenido de tracking-script.js
</script>
```

5. Guarda

---

## Paso 4: Despliega en Hostinger (10 min)

### Opción A: GitHub Auto-Deploy (Recomendado)

```bash
# En tu terminal local
git add .
git commit -m "Configurar tracking script"
git push origin main
```

Luego en Hostinger:
1. Panel de Hostinger → Aplicaciones Node.js
2. Conecta con GitHub
3. Selecciona tu repositorio
4. Branch: `main`
5. Start command: `npm start`
6. Variables de entorno:
   - `NODE_ENV=production`
   - `MONGODB_URI=tu_mongodb_uri`
   - `JWT_SECRET=tu_jwt_secret`
   - `PORT=3000`
7. Deploy

### Opción B: SSH Manual

```bash
# Conecta a Hostinger
ssh tu_usuario@tu_servidor.hostinger.com

# Ve a tu directorio
cd /home/tu_usuario/public_html/tu_app

# Actualiza el código
git pull origin main

# Instala dependencias
npm install --production

# Reinicia con PM2
pm2 restart metrics-lab

# O si no usas PM2
npm start
```

---

## Paso 5: Verifica que Funcione (5 min)

### Test 1: Backend está vivo

Abre en tu navegador:
```
https://tu-dominio-hostinger.com/
```

Deberías ver:
```
Tracker está vivo y saludable.
```

✅ Si ves esto, tu backend está funcionando

### Test 2: Script está instalado

1. Abre tu sitio WordPress
2. Presiona F12 (abrir consola)
3. Busca en la consola:

```
[Metrics Lab] Inicializando Metrics Lab...
[Metrics Lab] Metrics Lab inicializado
```

✅ Si ves esto, el script está instalado correctamente

### Test 3: Eventos se registran

1. Con la consola abierta (F12)
2. Cambia `DEBUG_MODE = true` en el script (temporalmente)
3. Recarga la página
4. Deberías ver:

```
[Metrics Lab] Enviando evento: {
  apiKey: "key_...",
  event_type: "page_view",
  page_url: "https://...",
  ...
}
[Metrics Lab] Evento enviado: page_view
```

✅ Si ves esto, los eventos se están enviando

### Test 4: Datos en el Dashboard

1. Ve a tu dashboard de Metrics Lab
2. Selecciona tu proyecto
3. Ve a la pestaña "Analytics"
4. Deberías ver eventos en "Overview"

✅ Si ves eventos, ¡todo está funcionando!

---

## 🎯 URLs de Prueba

Prueba tu tracking con estas URLs:

### Google Ads
```
https://tu-sitio-wordpress.com/?gclid=test123&utm_source=google&utm_medium=cpc&utm_campaign=prueba
```
Debería aparecer en: **Paid Campaigns → Google**

### Facebook Ads
```
https://tu-sitio-wordpress.com/?fbclid=test456&utm_source=facebook&utm_medium=cpc&utm_campaign=prueba
```
Debería aparecer en: **Paid Campaigns → Facebook**

### Email Campaign
```
https://tu-sitio-wordpress.com/?utm_source=newsletter&utm_medium=email&utm_campaign=boletin_semanal
```
Debería aparecer en: **Paid Campaigns** (o Referrals según configuración)

### Orgánico
```
https://tu-sitio-wordpress.com/
```
(Visitando desde una búsqueda de Google)
Debería aparecer en: **Organic → Google**

### Directo
```
https://tu-sitio-wordpress.com/
```
(Escribiendo la URL directamente)
Debería aparecer en: **Direct**

---

## 🔧 Solución Rápida de Problemas

### ❌ No veo eventos en el dashboard

**Causa más común:** API Key incorrecta

**Solución:**
1. Ve al dashboard y copia el API Key de nuevo
2. Verifica que no tenga espacios al inicio o final
3. Reemplaza en el script
4. Guarda y prueba de nuevo

### ❌ Error de CORS en la consola

**Causa:** El backend no permite requests desde tu dominio de WordPress

**Solución:**
1. Abre `index.js` en tu backend
2. Verifica la configuración de CORS:

```javascript
const corsOptions = {
  origin: 'https://tu-sitio-wordpress.com',
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
};
app.use(cors(corsOptions));
```

3. Guarda y redespliega

### ❌ El script no se carga en WordPress

**Causa:** Error de sintaxis o ubicación incorrecta

**Solución:**
1. Verifica que el script esté dentro de `<script>` tags
2. Verifica que esté antes de `</body>`
3. Revisa la consola del navegador para ver errores de JavaScript

### ❌ Los call_click no se registran

**Causa:** Tus botones de llamada no usan el formato correcto

**Solución:**
Asegúrate de que tus botones de llamada sean así:

```html
<a href="tel:+1234567890">Llamar</a>
```

NO así:
```html
<button onclick="call()">Llamar</button>
```

---

## 📋 Checklist Final

Marca cada item cuando lo completes:

- [ ] Obtuve mi API Key del dashboard
- [ ] Configuré API_KEY en tracking-script.js
- [ ] Configuré TRACKING_ENDPOINT en tracking-script.js
- [ ] Instalé el script en WordPress
- [ ] Hice commit y push a GitHub
- [ ] Desplegué en Hostinger
- [ ] Verifiqué que el backend esté vivo
- [ ] Verifiqué que el script se cargue en WordPress
- [ ] Probé con una URL de campaña
- [ ] Vi eventos en el dashboard
- [ ] Probé un click en botón de llamada
- [ ] Probé enviar un formulario

---

## 🎉 ¡Listo!

Si completaste todos los pasos del checklist, tu sistema está **100% operativo**.

**Tiempo total:** ~25 minutos

**Próximo paso:** Monitorea tu dashboard diariamente para ver qué campañas funcionan mejor.

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:

1. **Revisa la consola del navegador** (F12) para ver errores
2. **Activa DEBUG_MODE** en el script para ver logs detallados
3. **Verifica que el backend esté corriendo** accediendo a tu URL
4. **Lee la guía completa** en `GUIA_INSTALACION_WORDPRESS.md`

