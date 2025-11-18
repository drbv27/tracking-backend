# Guía Completa de Instalación y Despliegue - Metrics Lab

## 📋 Resumen

Esta guía te ayudará a:
1. Configurar el script de tracking en tu sitio WordPress
2. Desplegar tu aplicación en Hostinger
3. Verificar que todo funcione correctamente

---

## 🎯 Parte 1: Preparar el Script de Tracking

### Paso 1.1: Obtener tu API Key

1. Inicia sesión en tu dashboard de Metrics Lab
2. Ve a tu proyecto
3. Copia tu API Key (se ve algo así: `key_abc123xyz...`)

### Paso 1.2: Configurar el Script

1. Abre el archivo `public/tracking-script.js`
2. Reemplaza estas dos líneas:

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
const TRACKING_ENDPOINT = 'https://your-domain.com/track';
```

Por tus valores reales:

```javascript
const API_KEY = 'tu_api_key_real_aqui';
const TRACKING_ENDPOINT = 'https://tu-dominio-hostinger.com/track';
```

**Ejemplo:**
```javascript
const API_KEY = 'key_abc123xyz789';
const TRACKING_ENDPOINT = 'https://metricslab.tudominio.com/track';
```


---

## 🌐 Parte 2: Instalar el Script en WordPress

### ⚠️ IMPORTANTE: Usa la Versión Segura

**ANTES DE CONTINUAR:** Este script ha sido actualizado para ser 100% compatible con WordPress y plugins de cache. 

**👉 USA LA GUÍA SEGURA:** `GUIA_INSTALACION_WORDPRESS_SEGURA.md`

### Opción A: Code Snippets (Recomendado y Seguro)

#### Paso 2A.1: Instalar Code Snippets

1. En tu WordPress, ve a **Plugins → Añadir nuevo**
2. Busca **"Code Snippets"**
3. Instala **"Code Snippets" by Code Snippets Pro**
4. Activa el plugin

#### Paso 2A.2: Agregar el Script Seguro

1. Ve a **Snippets → Add New**
2. **Título:** "Metrics Lab Tracking - Safe Version"
3. **Tipo:** JavaScript Snippet
4. **Ubicación:** Site Wide (Footer)
5. Pega el código de `GUIA_INSTALACION_WORDPRESS_SEGURA.md`

**⚠️ NOTA:** El código completo y actualizado está en `GUIA_INSTALACION_WORDPRESS_SEGURA.md`

**Características del script seguro:**
- ✅ Compatible con todos los plugins de cache
- ✅ Sintaxis ES5 (no usa const, let, arrow functions)
- ✅ Funciona en navegadores antiguos (IE8+)
- ✅ No rompe minificadores ni optimizadores
- ✅ Múltiples fallbacks para máxima compatibilidad

3. **Activa el snippet**
4. **Guarda los cambios**
5. **Purga el cache** de todos tus plugins de cache



### Opción B: Editando el Tema Directamente

#### Paso 2B.1: Acceder al Editor de Temas

1. Ve a **Apariencia → Editor de archivos del tema**
2. Busca el archivo **footer.php**
3. Haz clic para editarlo

#### Paso 2B.2: Agregar el Script

1. Busca la etiqueta `</body>` (casi al final del archivo)
2. **JUSTO ANTES** de `</body>`, pega el mismo código del script de arriba
3. Guarda los cambios

**⚠️ IMPORTANTE:** Haz un backup de tu tema antes de editar archivos directamente.

---

## 🚀 Parte 3: Desplegar en Hostinger

### Paso 3.1: Preparar el Código para Producción

1. Abre tu archivo `.env` y asegúrate de tener:

```env
NODE_ENV=production
MONGODB_URI=tu_mongodb_uri
PORT=3000
JWT_SECRET=tu_jwt_secret
```

2. Verifica que tu `package.json` tenga el script de inicio:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

### Paso 3.2: Subir a GitHub

1. Asegúrate de que todos tus cambios estén guardados
2. Abre tu terminal y ejecuta:

```bash
git add .
git commit -m "Actualizar tracking script con call clicks y form submits"
git push origin main
```



### Paso 3.3: Desplegar en Hostinger

Hostinger tiene varias opciones de despliegue. Aquí están las más comunes:

#### Opción A: Despliegue Automático desde GitHub (Recomendado)

Si Hostinger tiene integración con GitHub:

1. **Accede a tu panel de Hostinger**
2. Ve a la sección de **Node.js** o **Aplicaciones**
3. Busca la opción **"Conectar con GitHub"** o **"Deploy from Git"**
4. Selecciona tu repositorio
5. Configura:
   - **Branch:** main
   - **Build command:** (déjalo vacío o `npm install`)
   - **Start command:** `npm start`
6. Agrega las variables de entorno:
   - `NODE_ENV=production`
   - `MONGODB_URI=tu_mongodb_uri`
   - `JWT_SECRET=tu_jwt_secret`
   - `PORT=3000`
7. Haz clic en **Deploy**

**✅ Con esta opción, cada vez que hagas `git push`, Hostinger actualizará automáticamente tu aplicación.**

#### Opción B: Despliegue Manual via SSH

Si necesitas desplegar manualmente:

1. **Conéctate por SSH a tu servidor Hostinger:**

```bash
ssh tu_usuario@tu_servidor.hostinger.com
```

2. **Navega a tu directorio de aplicación:**

```bash
cd /home/tu_usuario/public_html/tu_app
```

3. **Actualiza el código desde GitHub:**

```bash
git pull origin main
```

4. **Instala las dependencias:**

```bash
npm install --production
```

5. **Reinicia la aplicación:**

```bash
pm2 restart tu_app
# O si no usas PM2:
pkill -f "node index.js"
npm start
```



#### Opción C: Usando FTP (Menos Recomendado)

Si solo tienes acceso FTP:

1. **Conecta via FTP** a tu servidor Hostinger
2. **Sube todos los archivos** de tu proyecto (excepto `node_modules`)
3. **Conéctate por SSH** (si está disponible)
4. Ejecuta:

```bash
cd /ruta/a/tu/app
npm install --production
npm start
```

### Paso 3.4: Configurar PM2 (Recomendado para Producción)

PM2 mantiene tu aplicación corriendo incluso si se reinicia el servidor:

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar tu aplicación con PM2
pm2 start index.js --name "metrics-lab"

# Guardar la configuración para que se inicie automáticamente
pm2 save
pm2 startup
```

### Paso 3.5: Configurar el Dominio

1. En tu panel de Hostinger, ve a **Dominios**
2. Configura tu dominio o subdominio para apuntar a tu aplicación Node.js
3. Asegúrate de que el puerto esté correctamente configurado (usualmente 3000)

---

## ✅ Parte 4: Verificar que Todo Funcione

### Paso 4.1: Probar el Tracking

1. **Abre tu sitio WordPress en modo incógnito**
2. **Abre la consola del navegador** (F12)
3. Deberías ver: `[Metrics Lab] Inicializando Metrics Lab...`

### Paso 4.2: Probar Diferentes Tipos de Tráfico

#### Test 1: Visita Orgánica (URL Limpia)
```
https://tu-sitio-wordpress.com/
```
✅ Debería registrarse como tráfico "direct" o "organic" (si vienes de Google)



#### Test 2: Campaña de Google Ads
```
https://tu-sitio-wordpress.com/?gclid=test123&utm_source=google&utm_medium=cpc&utm_campaign=prueba
```
✅ Debería registrarse como tráfico "paid" de "google"

#### Test 3: Campaña de Facebook
```
https://tu-sitio-wordpress.com/?fbclid=test456&utm_source=facebook&utm_medium=cpc&utm_campaign=prueba
```
✅ Debería registrarse como tráfico "paid" de "facebook"

#### Test 4: Click en Botón de Llamada

1. Haz clic en cualquier botón con `href="tel:+1234567890"`
2. En la consola deberías ver: `[Metrics Lab] Enviando evento: call_click`
3. En tu dashboard debería aparecer un evento de tipo "call_click"

#### Test 5: Envío de Formulario

1. Llena cualquier formulario en tu sitio
2. Haz clic en "Enviar"
3. En la consola deberías ver: `[Metrics Lab] Enviando evento: form_submit`
4. En tu dashboard debería aparecer un evento de tipo "form_submit"

### Paso 4.3: Verificar en el Dashboard

1. **Inicia sesión en tu dashboard de Metrics Lab**
2. Ve a tu proyecto
3. Haz clic en la pestaña **"Analytics"**
4. Deberías ver:
   - **Overview:** Resumen de todo el tráfico
   - **Organic:** Visitas sin parámetros de campaña
   - **Paid Campaigns:** Visitas con gclid, fbclid, o UTM parameters
   - **Referrals:** Visitas desde otros sitios
   - **Direct:** Visitas directas

### Paso 4.4: Verificar Conversiones de Llamadas

Para asociar las llamadas con las campañas:

1. Ve a la pestaña **"Paid Campaigns"**
2. Busca tu campaña (por ejemplo, la que tiene gclid)
3. Haz clic para expandir los detalles
4. Deberías ver los eventos de "call_click" asociados a esa campaña

**Esto te permite saber qué campaña generó la llamada** 📞



---

## 🔧 Parte 5: Solución de Problemas

### Problema 1: No se registran eventos

**Posibles causas:**

1. **API Key incorrecta**
   - Verifica que copiaste correctamente tu API key
   - No debe tener espacios al inicio o final

2. **Endpoint incorrecto**
   - Verifica que la URL termine en `/track`
   - Ejemplo correcto: `https://tudominio.com/track`

3. **CORS bloqueado**
   - Abre la consola del navegador (F12)
   - Busca errores de CORS
   - Si ves errores, verifica la configuración de CORS en tu backend

4. **Backend no está corriendo**
   - Verifica que tu aplicación esté corriendo en Hostinger
   - Prueba acceder a: `https://tudominio.com/` (debería decir "Tracker está vivo y saludable")

### Problema 2: Los eventos se registran pero no aparecen en el dashboard

**Posibles causas:**

1. **API Key diferente**
   - Verifica que el API key del script sea el mismo que el del proyecto en el dashboard

2. **Filtro de fechas**
   - En el dashboard, asegúrate de que el rango de fechas incluya hoy

3. **Cache del navegador**
   - Refresca el dashboard con Ctrl+F5 (Windows) o Cmd+Shift+R (Mac)

### Problema 3: No se detectan las campañas correctamente

**Verifica que:**

1. Los parámetros UTM estén en la URL
2. El formato sea correcto: `?gclid=abc123&utm_source=google&utm_medium=cpc`
3. No haya redirecciones que eliminen los parámetros

### Problema 4: Los clicks de llamada no se registran

**Verifica que:**

1. Tus botones de llamada usen el formato: `<a href="tel:+1234567890">Llamar</a>`
2. El script esté cargado antes de que el usuario haga clic
3. En la consola (con DEBUG_MODE=true) veas el evento "call_click"



---

## 📊 Parte 6: Entender tus Datos

### Tipos de Tráfico que se Trackean

#### 1. **Organic (Orgánico)**
- Visitas desde motores de búsqueda (Google, Bing, Yahoo, etc.)
- **Ejemplo:** Usuario busca en Google y hace clic en tu resultado
- **Identificación:** Referrer contiene google.com, bing.com, etc.

#### 2. **Paid (Pagado)**
- Visitas desde campañas publicitarias
- **Plataformas soportadas:**
  - Google Ads (gclid)
  - Facebook Ads (fbclid)
  - TikTok Ads (ttclid)
  - LinkedIn Ads (li_fat_id)
  - Cualquier campaña con UTM parameters
- **Ejemplo:** Usuario hace clic en tu anuncio de Google Ads

#### 3. **Referral (Referido)**
- Visitas desde otros sitios web (que no sean motores de búsqueda)
- **Ejemplo:** Alguien hace clic en un enlace a tu sitio desde otro blog

#### 4. **Direct (Directo)**
- Visitas sin referrer ni parámetros
- **Ejemplo:** Usuario escribe tu URL directamente en el navegador

#### 5. **Social (Social)**
- Visitas desde redes sociales
- **Plataformas:** Facebook, Instagram, Twitter, LinkedIn, YouTube, TikTok, etc.

### Eventos que se Trackean

#### 1. **page_view**
- Se registra automáticamente cuando alguien visita una página
- Incluye toda la información de la campaña (UTMs, gclid, etc.)

#### 2. **click**
- Se registra cuando alguien hace clic en un botón o enlace
- Incluye: URL del botón, ID, texto, clase CSS

#### 3. **call_click**
- Se registra cuando alguien hace clic en un botón de llamada
- Incluye: Número de teléfono, información del botón
- **MUY IMPORTANTE:** Este evento mantiene la información de la campaña original

#### 4. **form_submit**
- Se registra cuando alguien envía un formulario
- Incluye: ID del formulario, nombre, acción, método



### Cómo Asociar Conversiones con Campañas

**Escenario:** Un usuario hace clic en tu anuncio de Google Ads y luego llama

1. **Primera visita (page_view):**
   - URL: `https://tu-sitio.com/?gclid=abc123&utm_source=google&utm_medium=cpc`
   - Se registra como: Paid → Google → CPC
   - Se guarda el gclid: `abc123`

2. **Usuario hace clic en botón de llamar (call_click):**
   - El script captura el gclid de la URL actual
   - Se registra el evento con: gclid=abc123
   - En el dashboard puedes ver que esta llamada vino de la campaña de Google

3. **En Google Ads:**
   - Puedes importar estas conversiones usando el gclid
   - Google sabrá exactamente qué anuncio generó la llamada

---

## 🎯 Parte 7: Próximos Pasos

### Optimización

1. **Monitorea tu dashboard diariamente** para ver qué campañas funcionan mejor
2. **Compara el tráfico orgánico vs pagado** para optimizar tu presupuesto
3. **Identifica las páginas de aterrizaje más efectivas**

### Integraciones Avanzadas

Si quieres trackear eventos personalizados, puedes usar:

```javascript
// Trackear un evento personalizado
window.MetricsLab.track('custom_event', {
  custom_field: 'valor',
  otro_campo: 'otro_valor'
});
```

### Reportes

Usa los datos del dashboard para:
- Calcular el ROI de cada campaña
- Identificar las fuentes de tráfico más valiosas
- Optimizar tu presupuesto publicitario
- Mejorar tus páginas de aterrizaje

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa la consola del navegador** (F12) para ver errores
2. **Activa DEBUG_MODE** en el script para ver logs detallados
3. **Verifica que tu backend esté corriendo** accediendo a tu URL
4. **Revisa los logs de tu servidor** en Hostinger

---

## ✅ Checklist Final

Antes de considerar que todo está listo, verifica:

- [ ] El script está instalado en WordPress
- [ ] El API_KEY está configurado correctamente
- [ ] El TRACKING_ENDPOINT apunta a tu servidor de Hostinger
- [ ] El backend está desplegado y corriendo en Hostinger
- [ ] Puedes ver eventos en el dashboard
- [ ] Los eventos de page_view se registran correctamente
- [ ] Los clicks en botones se registran
- [ ] Los clicks en botones de llamada se registran como "call_click"
- [ ] Los envíos de formularios se registran como "form_submit"
- [ ] Las campañas de Google Ads se detectan (con gclid)
- [ ] Las campañas de Facebook se detectan (con fbclid)
- [ ] El tráfico orgánico se clasifica correctamente
- [ ] Puedes ver los datos en las diferentes pestañas del dashboard

---

**¡Listo! Tu sistema de tracking está completamente configurado y funcionando.** 🎉

