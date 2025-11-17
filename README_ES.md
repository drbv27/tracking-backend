# 📊 Metrics Lab - Sistema de Tracking y Analytics

## 🎯 ¿Qué es Metrics Lab?

Metrics Lab es un sistema completo de tracking y analytics que te permite:

- ✅ **Trackear TODO tu tráfico web** (orgánico, pagado, directo, referidos)
- ✅ **Detectar automáticamente** campañas de Google Ads, Facebook Ads, TikTok, LinkedIn, etc.
- ✅ **Asociar conversiones** (llamadas, formularios) con campañas específicas
- ✅ **Visualizar datos** en un dashboard intuitivo con pestañas organizadas
- ✅ **Analizar rendimiento** de cada fuente de tráfico y campaña

---

## 🚀 Inicio Rápido

### 1. Configuración (5 minutos)

```bash
# Clonar el repositorio
git clone tu-repositorio.git
cd tracking-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores reales

# Iniciar el servidor
npm start
```

### 2. Instalar en WordPress (10 minutos)

Lee la guía completa: **[CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)**

### 3. Desplegar en Hostinger (15 minutos)

Lee la guía completa: **[GUIA_INSTALACION_WORDPRESS.md](GUIA_INSTALACION_WORDPRESS.md)**

---

## 📚 Documentación

### Guías Principales

| Documento | Descripción | Tiempo |
|-----------|-------------|--------|
| **[CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)** | Guía rápida de 5 pasos | 5 min |
| **[GUIA_INSTALACION_WORDPRESS.md](GUIA_INSTALACION_WORDPRESS.md)** | Guía completa paso a paso | 30 min |
| **[RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md)** | Resumen del sistema y funcionalidades | 10 min |
| **[CHECKLIST_DESPLIEGUE.md](CHECKLIST_DESPLIEGUE.md)** | Checklist completo para despliegue | - |
| **[URLS_DE_PRUEBA.md](URLS_DE_PRUEBA.md)** | URLs para probar el tracking | - |

### Documentación Técnica

| Documento | Descripción |
|-----------|-------------|
| `.kiro/specs/enhanced-tracking-analytics/requirements.md` | Requerimientos del sistema |
| `.kiro/specs/enhanced-tracking-analytics/design.md` | Diseño técnico |
| `.kiro/specs/enhanced-tracking-analytics/tasks.md` | Plan de implementación |

---

## 🎯 Características Principales

### 1. Tracking Automático de Tráfico

| Tipo de Tráfico | Cómo se Detecta |
|-----------------|-----------------|
| **Orgánico** | Referrer de buscadores (Google, Bing, Yahoo, etc.) |
| **Pagado** | gclid, fbclid, ttclid, li_fat_id, UTM parameters |
| **Referido** | Referrer de sitios externos |
| **Directo** | Sin referrer ni parámetros |
| **Social** | Facebook, Instagram, Twitter, LinkedIn, etc. |

### 2. Plataformas Soportadas

- ✅ Google Ads (gclid)
- ✅ Facebook Ads (fbclid)
- ✅ Instagram Ads
- ✅ TikTok Ads (ttclid)
- ✅ LinkedIn Ads (li_fat_id)
- ✅ YouTube Ads
- ✅ Email Marketing (UTM)
- ✅ Cualquier plataforma con UTM parameters

### 3. Eventos Trackeados

| Evento | Descripción |
|--------|-------------|
| `page_view` | Visita a una página |
| `click` | Click en botones/enlaces |
| `call_click` | Click en botón de llamada (tel:) |
| `form_submit` | Envío de formulario |

### 4. Dashboard Analítico

- **Overview:** Resumen general con métricas clave
- **Organic:** Tráfico orgánico por buscador
- **Paid Campaigns:** Campañas publicitarias con métricas detalladas
- **Referrals:** Tráfico desde otros sitios
- **Direct:** Tráfico directo

---

## 🔧 Tecnologías

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación

### Frontend (Dashboard)
- Next.js 14
- React
- Tailwind CSS
- Recharts (gráficos)

### Tracking Script
- JavaScript Vanilla
- Fetch API
- Event Listeners

---

## 📦 Estructura del Proyecto

```
tracking-backend/
├── index.js                    # Servidor principal
├── models/
│   └── Event.js               # Modelo de eventos
├── services/
│   └── trafficSourceDetector.js  # Detector de fuentes de tráfico
├── routes/
│   ├── authRoutes.js          # Rutas de autenticación
│   ├── projectRoutes.js       # Rutas de proyectos
│   └── analyticsRoutes.js     # Rutas de analytics
├── middleware/
│   └── auth.js                # Middleware de autenticación
├── public/
│   ├── tracking-script.js     # Script de tracking para WordPress
│   └── tracking-installation-guide.md
├── dashboard/                  # Frontend Next.js
│   ├── app/
│   ├── components/
│   └── utils/
├── .env.example               # Template de variables de entorno
├── CONFIGURACION_RAPIDA.md    # Guía rápida
├── GUIA_INSTALACION_WORDPRESS.md  # Guía completa
├── RESUMEN_EJECUTIVO.md       # Resumen ejecutivo
├── CHECKLIST_DESPLIEGUE.md    # Checklist de despliegue
└── URLS_DE_PRUEBA.md          # URLs para pruebas
```

---

## 🎯 Casos de Uso

### Caso 1: Trackear Campaña de Google Ads

**Usuario hace clic en tu anuncio:**
```
URL: https://tu-sitio.com/?gclid=abc123&utm_source=google&utm_medium=cpc&utm_campaign=verano2024
```

**Se registra:**
- Evento: `page_view`
- Tipo: `paid`
- Plataforma: `google`
- Campaña: `verano2024`
- gclid: `abc123`

**Usuario hace clic en "Llamar":**
- Evento: `call_click`
- **Mantiene el gclid:** `abc123`
- Puedes reportar esta conversión a Google Ads

### Caso 2: Tráfico Orgánico desde Google

**Usuario busca en Google y hace clic:**
```
Referrer: https://www.google.com/search?q=tu+producto
```

**Se registra:**
- Evento: `page_view`
- Tipo: `organic`
- Plataforma: `google`
- Referrer: `google.com`

### Caso 3: Email Marketing

**Usuario hace clic en tu newsletter:**
```
URL: https://tu-sitio.com/?utm_source=newsletter&utm_medium=email&utm_campaign=boletin_semanal
```

**Se registra:**
- Evento: `page_view`
- Tipo: Depende de configuración
- Fuente: `newsletter`
- Medio: `email`
- Campaña: `boletin_semanal`

---

## 🔐 Seguridad

### Variables de Entorno

Nunca subas tu archivo `.env` a GitHub. Usa `.env.example` como template.

```env
NODE_ENV=production
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_jwt_secret_fuerte
PORT=3000
```

### MongoDB

- Usa contraseñas fuertes
- Configura reglas de firewall
- Solo permite IPs autorizadas

### API Keys

- Cada proyecto tiene su propia API key
- Las API keys se generan automáticamente
- No compartas tus API keys públicamente

---

## 📊 Métricas y KPIs

### Métricas Disponibles

- **Total de Visitas:** Número total de page_views
- **Visitas por Fuente:** Desglose por tipo de tráfico
- **Top Fuentes:** Las 5 fuentes principales
- **Conversiones:** Llamadas y formularios por campaña
- **Tasa de Conversión:** % de visitas que convierten

### Análisis Disponibles

- Tendencias temporales
- Comparación entre fuentes
- Rendimiento por campaña
- Páginas de aterrizaje más efectivas
- Distribución de tráfico

---

## 🚀 Despliegue

### Desarrollo Local

```bash
# Backend
npm start

# Frontend (dashboard)
cd dashboard
npm run dev
```

### Producción (Hostinger)

**Opción 1: Auto-deploy desde GitHub**
- Conecta tu repositorio
- Configura variables de entorno
- Deploy automático en cada push

**Opción 2: SSH Manual**
```bash
ssh usuario@hostinger.com
cd /ruta/a/tu/app
git pull origin main
npm install --production
pm2 restart metrics-lab
```

Lee la guía completa: **[GUIA_INSTALACION_WORDPRESS.md](GUIA_INSTALACION_WORDPRESS.md)**

---

## 🧪 Testing

### Probar Localmente

```bash
# Iniciar backend
npm start

# Iniciar dashboard
cd dashboard
npm run dev

# Abrir en navegador
http://localhost:3001
```

### Probar en Producción

Usa las URLs de prueba en: **[URLS_DE_PRUEBA.md](URLS_DE_PRUEBA.md)**

---

## 📈 Roadmap

### Completado ✅

- [x] Tracking de múltiples plataformas
- [x] Dashboard con pestañas
- [x] Detección automática de fuentes
- [x] Tracking de conversiones (llamadas, formularios)
- [x] Asociación de conversiones con campañas
- [x] Error handling y manejo de errores
- [x] Responsive design

### Próximas Funcionalidades 🚧

- [ ] Exportación de datos a CSV/Excel
- [ ] Integración directa con Google Ads API
- [ ] Integración con Facebook Ads API
- [ ] Reportes automáticos por email
- [ ] Alertas de rendimiento
- [ ] A/B testing de páginas de aterrizaje
- [ ] Heatmaps y grabaciones de sesiones

---

## 🤝 Contribuir

Este es un proyecto privado, pero si tienes sugerencias:

1. Crea un issue describiendo la mejora
2. Haz un fork del repositorio
3. Crea una rama con tu feature
4. Haz un pull request

---

## 📞 Soporte

### Documentación

- Lee las guías en este repositorio
- Revisa los archivos en `.kiro/specs/`

### Debugging

1. Activa `DEBUG_MODE = true` en el tracking script
2. Revisa la consola del navegador (F12)
3. Revisa los logs del servidor
4. Verifica las variables de entorno

### Problemas Comunes

| Problema | Solución |
|----------|----------|
| No veo eventos | Verifica API Key y endpoint |
| Error de CORS | Verifica configuración de CORS en backend |
| Script no carga | Verifica sintaxis y ubicación en WordPress |
| Campañas no se detectan | Verifica formato de URLs con parámetros |

---

## 📄 Licencia

Este proyecto es privado y propietario.

---

## 🎉 ¡Empecemos!

1. **Lee:** [CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)
2. **Sigue:** [CHECKLIST_DESPLIEGUE.md](CHECKLIST_DESPLIEGUE.md)
3. **Prueba:** [URLS_DE_PRUEBA.md](URLS_DE_PRUEBA.md)
4. **Monitorea:** Tu dashboard diariamente

**Tiempo total de configuración: ~30 minutos**

---

**Última actualización:** Noviembre 2024

**Versión:** 2.0.0

