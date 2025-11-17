# ✅ Checklist de Despliegue - Metrics Lab

## 📦 Preparación (Antes de Empezar)

- [ ] Tengo acceso a mi panel de Hostinger
- [ ] Tengo acceso a mi WordPress
- [ ] Tengo mi repositorio de GitHub actualizado
- [ ] Tengo mi conexión de MongoDB Atlas lista
- [ ] Tengo un editor de texto abierto para copiar/pegar

---

## 🔧 Parte 1: Configuración del Backend

### 1.1 Variables de Entorno

- [ ] Tengo mi `MONGODB_URI` de MongoDB Atlas
- [ ] Tengo mi `JWT_SECRET` generado
- [ ] He verificado que `.env` NO esté en GitHub (debe estar en `.gitignore`)

### 1.2 Verificación Local (Opcional pero Recomendado)

- [ ] Ejecuté `npm install` sin errores
- [ ] Ejecuté `npm start` y el servidor inicia correctamente
- [ ] Puedo acceder a `http://localhost:3000/` y veo "Tracker está vivo"
- [ ] Puedo iniciar sesión en el dashboard local

---

## 🌐 Parte 2: Configuración del Script de Tracking

### 2.1 Obtener API Key

- [ ] Inicié sesión en mi dashboard de Metrics Lab
- [ ] Seleccioné mi proyecto
- [ ] Copié el API Key (se ve como: `key_abc123xyz...`)

### 2.2 Configurar tracking-script.js

- [ ] Abrí `public/tracking-script.js`
- [ ] Reemplacé `YOUR_API_KEY_HERE` con mi API Key real
- [ ] Reemplacé `https://your-domain.com/track` con mi URL de Hostinger
- [ ] Guardé el archivo

**Ejemplo de cómo debe quedar:**
```javascript
const API_KEY = 'key_abc123xyz789';  // ✅ Tu API Key real
const TRACKING_ENDPOINT = 'https://metricslab.tudominio.com/track';  // ✅ Tu URL de Hostinger
const DEBUG_MODE = false;  // ✅ false para producción
```

---

## 📝 Parte 3: Instalación en WordPress

### 3.1 Método con Plugin (Recomendado)

- [ ] Instalé el plugin "Insert Headers and Footers"
- [ ] Activé el plugin
- [ ] Fui a Configuración → Insert Headers and Footers
- [ ] Copié TODO el contenido de `public/tracking-script.js`
- [ ] Lo pegué en "Scripts in Footer" dentro de tags `<script></script>`
- [ ] Guardé los cambios
- [ ] Verifiqué que no haya errores en WordPress

### 3.2 Método Manual (Alternativo)

- [ ] Hice backup de mi tema de WordPress
- [ ] Fui a Apariencia → Editor de Temas
- [ ] Abrí el archivo `footer.php`
- [ ] Busqué la etiqueta `</body>`
- [ ] Pegué el script ANTES de `</body>`
- [ ] Guardé los cambios

---

## 🚀 Parte 4: Despliegue en Hostinger

### 4.1 Preparar el Código

- [ ] Todos mis cambios están guardados
- [ ] Ejecuté `git status` para ver los cambios
- [ ] Ejecuté `git add .`
- [ ] Ejecuté `git commit -m "Configurar tracking para producción"`
- [ ] Ejecuté `git push origin main`
- [ ] Verifiqué en GitHub que los cambios estén subidos

### 4.2 Opción A: Deploy Automático desde GitHub

- [ ] Accedí a mi panel de Hostinger
- [ ] Fui a la sección de Node.js o Aplicaciones
- [ ] Conecté mi repositorio de GitHub
- [ ] Configuré el branch: `main`
- [ ] Configuré el start command: `npm start`
- [ ] Agregué las variables de entorno:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=mi_mongodb_uri`
  - [ ] `JWT_SECRET=mi_jwt_secret`
  - [ ] `PORT=3000`
- [ ] Hice clic en Deploy
- [ ] Esperé a que termine el despliegue
- [ ] Verifiqué que el status sea "Running"

### 4.3 Opción B: Deploy Manual via SSH

- [ ] Me conecté por SSH: `ssh usuario@servidor.hostinger.com`
- [ ] Navegué a mi directorio: `cd /ruta/a/mi/app`
- [ ] Actualicé el código: `git pull origin main`
- [ ] Instalé dependencias: `npm install --production`
- [ ] Configuré PM2 (si no está configurado):
  - [ ] `npm install -g pm2`
  - [ ] `pm2 start index.js --name metrics-lab`
  - [ ] `pm2 save`
  - [ ] `pm2 startup`
- [ ] Reinicié la app: `pm2 restart metrics-lab`
- [ ] Verifiqué el status: `pm2 status`

### 4.4 Configurar Dominio

- [ ] En Hostinger, configuré mi dominio/subdominio
- [ ] Apunté el dominio a mi aplicación Node.js
- [ ] Verifiqué que el puerto esté correctamente configurado
- [ ] Esperé a que se propague el DNS (puede tomar hasta 24 horas)

---

## ✅ Parte 5: Verificación y Pruebas

### 5.1 Verificar Backend

- [ ] Abrí `https://mi-dominio-hostinger.com/` en el navegador
- [ ] Vi el mensaje: "Tracker está vivo y saludable"
- [ ] Probé iniciar sesión en el dashboard
- [ ] Pude acceder a mi proyecto

### 5.2 Verificar Script en WordPress

- [ ] Abrí mi sitio WordPress en modo incógnito
- [ ] Abrí la consola del navegador (F12)
- [ ] Vi el mensaje: `[Metrics Lab] Inicializando Metrics Lab...`
- [ ] Vi el mensaje: `[Metrics Lab] Metrics Lab inicializado`
- [ ] No vi errores en la consola

### 5.3 Activar Debug Mode (Temporal)

- [ ] Cambié `DEBUG_MODE = false` a `DEBUG_MODE = true` en el script
- [ ] Guardé y actualicé en WordPress
- [ ] Recargué mi sitio WordPress
- [ ] Vi logs detallados en la consola
- [ ] Vi: `[Metrics Lab] Enviando evento: {...}`
- [ ] Vi: `[Metrics Lab] Evento enviado: page_view`

### 5.4 Probar Diferentes Tipos de Tráfico

#### Test 1: Visita Directa
- [ ] Visité: `https://mi-sitio-wordpress.com/`
- [ ] Vi el evento en la consola
- [ ] Esperé 1 minuto
- [ ] Verifiqué en el dashboard → pestaña "Direct"
- [ ] Vi el evento registrado

#### Test 2: Campaña de Google Ads
- [ ] Visité: `https://mi-sitio-wordpress.com/?gclid=test123&utm_source=google&utm_medium=cpc&utm_campaign=prueba`
- [ ] Vi el evento en la consola con gclid
- [ ] Esperé 1 minuto
- [ ] Verifiqué en el dashboard → pestaña "Paid Campaigns"
- [ ] Vi la campaña "prueba" de Google

#### Test 3: Campaña de Facebook
- [ ] Visité: `https://mi-sitio-wordpress.com/?fbclid=test456&utm_source=facebook&utm_medium=cpc&utm_campaign=prueba_fb`
- [ ] Vi el evento en la consola con fbclid
- [ ] Esperé 1 minuto
- [ ] Verifiqué en el dashboard → pestaña "Paid Campaigns"
- [ ] Vi la campaña "prueba_fb" de Facebook

#### Test 4: Click en Botón de Llamada
- [ ] Hice clic en un botón con `href="tel:+1234567890"`
- [ ] Vi en la consola: `[Metrics Lab] Enviando evento: call_click`
- [ ] Esperé 1 minuto
- [ ] Verifiqué en el dashboard que el evento se registró
- [ ] Verifiqué que el evento tenga el gclid/fbclid si vengo de una campaña

#### Test 5: Envío de Formulario
- [ ] Llené un formulario en mi sitio
- [ ] Hice clic en "Enviar"
- [ ] Vi en la consola: `[Metrics Lab] Enviando evento: form_submit`
- [ ] Esperé 1 minuto
- [ ] Verifiqué en el dashboard que el evento se registró

### 5.5 Desactivar Debug Mode

- [ ] Cambié `DEBUG_MODE = true` a `DEBUG_MODE = false`
- [ ] Guardé y actualicé en WordPress
- [ ] Verifiqué que ya no aparezcan logs en la consola (solo el mensaje de inicialización)

---

## 📊 Parte 6: Verificación del Dashboard

### 6.1 Pestaña Overview

- [ ] Veo el total de eventos
- [ ] Veo el desglose por tipo de tráfico (orgánico, pagado, etc.)
- [ ] Veo las top fuentes de tráfico
- [ ] Los números tienen sentido

### 6.2 Pestaña Organic

- [ ] Veo tráfico orgánico (si tengo)
- [ ] Veo los motores de búsqueda
- [ ] Veo las páginas de aterrizaje

### 6.3 Pestaña Paid Campaigns

- [ ] Veo mis campañas de prueba
- [ ] Veo las plataformas (Google, Facebook)
- [ ] Puedo expandir una campaña para ver detalles
- [ ] Veo los eventos de call_click asociados a las campañas

### 6.4 Pestaña Referrals

- [ ] Veo tráfico de referidos (si tengo)
- [ ] Veo los dominios que me envían tráfico

### 6.5 Pestaña Direct

- [ ] Veo tráfico directo
- [ ] Veo las páginas de aterrizaje

---

## 🎯 Parte 7: Configuración de Campañas Reales

### 7.1 Google Ads

- [ ] Configuré mis campañas de Google Ads con UTMs
- [ ] Formato: `?utm_source=google&utm_medium=cpc&utm_campaign=nombre_campaña`
- [ ] Google Ads automáticamente agrega el gclid
- [ ] Probé con una campaña real
- [ ] Vi los datos en el dashboard

### 7.2 Facebook Ads

- [ ] Configuré mis campañas de Facebook con UTMs
- [ ] Formato: `?utm_source=facebook&utm_medium=cpc&utm_campaign=nombre_campaña`
- [ ] Facebook automáticamente agrega el fbclid
- [ ] Probé con una campaña real
- [ ] Vi los datos en el dashboard

### 7.3 Otras Plataformas

- [ ] Configuré UTMs para email marketing
- [ ] Configuré UTMs para redes sociales orgánicas
- [ ] Configuré UTMs para otras fuentes de tráfico

---

## 🔒 Parte 8: Seguridad y Mantenimiento

### 8.1 Seguridad

- [ ] Verifiqué que `.env` NO esté en GitHub
- [ ] Verifiqué que mi JWT_SECRET sea fuerte
- [ ] Verifiqué que mi MongoDB tenga contraseña segura
- [ ] Configuré las reglas de firewall en MongoDB Atlas
- [ ] Solo permito conexiones desde la IP de Hostinger

### 8.2 Backup

- [ ] Hice backup de mi base de datos MongoDB
- [ ] Hice backup de mi código en GitHub
- [ ] Documenté mis variables de entorno en un lugar seguro

### 8.3 Monitoreo

- [ ] Configuré PM2 para reiniciar automáticamente si falla
- [ ] Configuré alertas en Hostinger (si está disponible)
- [ ] Agregué el dashboard a mis favoritos para revisarlo diariamente

---

## 📈 Parte 9: Optimización (Opcional)

### 9.1 Performance

- [ ] Verifiqué que el script se cargue rápido
- [ ] Verifiqué que no haya errores 404 en la consola
- [ ] Verifiqué que el backend responda rápido

### 9.2 Analytics

- [ ] Configuré un rango de fechas por defecto útil
- [ ] Exploré todas las pestañas del dashboard
- [ ] Entendí qué significa cada métrica

---

## 🎉 ¡Completado!

### Resumen Final

- [ ] Backend desplegado en Hostinger ✅
- [ ] Script instalado en WordPress ✅
- [ ] Tracking funcionando correctamente ✅
- [ ] Dashboard mostrando datos ✅
- [ ] Campañas configuradas ✅
- [ ] Todo probado y verificado ✅

### Próximos Pasos

- [ ] Monitorear el dashboard diariamente
- [ ] Analizar qué campañas funcionan mejor
- [ ] Optimizar presupuesto publicitario según datos
- [ ] Mejorar páginas de aterrizaje con más conversiones

---

## 📞 Si Algo Falla

### Recursos de Ayuda

- [ ] Leí `CONFIGURACION_RAPIDA.md`
- [ ] Leí `GUIA_INSTALACION_WORDPRESS.md`
- [ ] Leí `RESUMEN_EJECUTIVO.md`
- [ ] Revisé la consola del navegador para errores
- [ ] Revisé los logs del servidor en Hostinger
- [ ] Activé DEBUG_MODE para ver logs detallados

### Problemas Comunes

- [ ] Si no veo eventos: Verifiqué API Key y endpoint
- [ ] Si hay error de CORS: Verifiqué configuración de CORS en backend
- [ ] Si el script no carga: Verifiqué sintaxis y ubicación en WordPress
- [ ] Si las campañas no se detectan: Verifiqué formato de URLs

---

**Fecha de Completado:** _______________

**Tiempo Total:** _______________

**Notas Adicionales:**

_______________________________________________________

_______________________________________________________

_______________________________________________________

