# 🧪 URLs de Prueba - abogadodebancarrota.com

## 🎯 Instrucciones

Después de instalar el script de tracking en tu sitio, usa estas URLs para verificar que todo funcione correctamente.

**Importante:** Abre cada URL en modo incógnito para evitar que el cache interfiera.

---

## 📊 Test 1: Visita Directa (Direct Traffic)

### URL:
```
https://abogadodebancarrota.com/
```

### Qué Esperar:
- ✅ En la consola (F12): `[Metrics Lab] Inicializando Metrics Lab...`
- ✅ En el dashboard: Evento en pestaña "Direct"
- ✅ Tipo de tráfico: Direct
- ✅ Sin parámetros de campaña

---

## 💰 Test 2: Google Ads (Campaña de Bancarrota)

### URL:
```
https://abogadodebancarrota.com/?gclid=test_bancarrota_123&utm_source=google&utm_medium=cpc&utm_campaign=bancarrota_capitulo7&utm_term=abogado+bancarrota&utm_content=anuncio_principal
```

### Qué Esperar:
- ✅ En el dashboard: Evento en pestaña "Paid Campaigns"
- ✅ Fuente: Google
- ✅ Medio: CPC
- ✅ Campaña: bancarrota_capitulo7
- ✅ Término: abogado+bancarrota
- ✅ Contenido: anuncio_principal
- ✅ gclid: test_bancarrota_123

### Uso Real:
Esta URL simula un click en tu anuncio de Google Ads para "abogado de bancarrota capítulo 7".

---

## 📘 Test 3: Facebook Ads (Campaña de Consulta Gratis)

### URL:
```
https://abogadodebancarrota.com/?fbclid=test_facebook_456&utm_source=facebook&utm_medium=cpc&utm_campaign=consulta_gratis&utm_content=video_testimonial
```

### Qué Esperar:
- ✅ En el dashboard: Evento en pestaña "Paid Campaigns"
- ✅ Fuente: Facebook
- ✅ Medio: CPC
- ✅ Campaña: consulta_gratis
- ✅ Contenido: video_testimonial
- ✅ fbclid: test_facebook_456

### Uso Real:
Esta URL simula un click en tu anuncio de Facebook ofreciendo consulta gratis.

---

## 📱 Test 4: Instagram Ads (Campaña de Testimonios)

### URL:
```
https://abogadodebancarrota.com/?fbclid=test_instagram_789&utm_source=instagram&utm_medium=cpc&utm_campaign=testimonios_clientes&utm_content=carousel_historias
```

### Qué Esperar:
- ✅ En el dashboard: Evento en pestaña "Paid Campaigns"
- ✅ Fuente: Instagram
- ✅ Medio: CPC
- ✅ Campaña: testimonios_clientes
- ✅ Contenido: carousel_historias
- ✅ fbclid: test_instagram_789

### Uso Real:
Esta URL simula un click en tu anuncio de Instagram con testimonios de clientes.

---

## 📧 Test 5: Email Marketing (Newsletter Mensual)

### URL:
```
https://abogadodebancarrota.com/?utm_source=newsletter&utm_medium=email&utm_campaign=newsletter_mensual&utm_content=articulo_capitulo13
```

### Qué Esperar:
- ✅ En el dashboard: Evento en pestaña "Paid Campaigns" o "Referrals"
- ✅ Fuente: Newsletter
- ✅ Medio: Email
- ✅ Campaña: newsletter_mensual
- ✅ Contenido: articulo_capitulo13

### Uso Real:
Esta URL simula un click desde tu newsletter mensual en un artículo sobre capítulo 13.

---

## 🔍 Test 6: Búsqueda Orgánica de Google

### Cómo Probar:
1. Ve a Google.com
2. Busca: "abogado de bancarrota"
3. Haz clic en tu resultado (si aparece)

### O Simula con esta URL:
```
https://abogadodebancarrota.com/
```
**Pero antes:** Visita `https://www.google.com/search?q=abogado+de+bancarrota` y luego haz clic en un enlace a tu sitio.

### Qué Esperar:
- ✅ En el dashboard: Evento en pestaña "Organic"
- ✅ Fuente: Google (detectado por referrer)
- ✅ Tipo: Organic

---

## 🔗 Test 7: Referral desde Directorio Legal

### URL:
Visita primero un sitio como `https://www.avvo.com` y luego navega a:
```
https://abogadodebancarrota.com/
```

### O Simula con:
```
https://abogadodebancarrota.com/?utm_source=avvo&utm_medium=referral&utm_campaign=perfil_abogado
```

### Qué Esperar:
- ✅ En el dashboard: Evento en pestaña "Referrals"
- ✅ Fuente: Avvo (o el sitio que uses)
- ✅ Medio: Referral

---

## 📞 Test 8: Click en Botón de Llamada

### Requisito:
Tu sitio debe tener un botón de llamada como:
```html
<a href="tel:+15551234567">Llamar Ahora</a>
```

### Cómo Probar:
1. Visita cualquiera de las URLs de arriba
2. Haz clic en el botón de llamada
3. Verifica en el dashboard

### Qué Esperar:
- ✅ En el dashboard: Evento tipo "call_click"
- ✅ Número de teléfono registrado
- ✅ Asociado a la campaña original (si viniste de una campaña)

**Ejemplo:** Si visitas la URL de Google Ads y luego haces clic en "Llamar", el sistema sabrá que esa llamada vino de Google Ads.

---

## 📝 Test 9: Envío de Formulario de Contacto

### Requisito:
Tu sitio debe tener un formulario de contacto.

### Cómo Probar:
1. Visita cualquiera de las URLs de arriba
2. Llena el formulario de contacto
3. Haz clic en "Enviar"
4. Verifica en el dashboard

### Qué Esperar:
- ✅ En el dashboard: Evento tipo "form_submit"
- ✅ ID del formulario registrado
- ✅ Asociado a la campaña original

---

## 🎯 Test 10: Campaña Completa (Simulación Real)

### Escenario: Cliente Potencial desde Google Ads

**Paso 1:** Visita desde Google Ads
```
https://abogadodebancarrota.com/?gclid=test_real_001&utm_source=google&utm_medium=cpc&utm_campaign=bancarrota_urgente&utm_term=necesito+abogado+bancarrota
```

**Paso 2:** Navega por el sitio
- Haz clic en "Servicios"
- Haz clic en "Capítulo 7"
- Lee información

**Paso 3:** Haz clic en botón de llamada
```html
<a href="tel:+15551234567">Llamar Ahora</a>
```

**Paso 4:** O llena el formulario de contacto

### Qué Esperar en el Dashboard:
1. **Page View** - Página principal (con gclid)
2. **Click** - Click en "Servicios"
3. **Click** - Click en "Capítulo 7"
4. **Call Click** o **Form Submit** - Conversión

**Resultado:** Puedes ver todo el journey del cliente y saber que vino de Google Ads.

---

## 🔥 URLs de Campañas Reales (Para Usar en Producción)

### Google Ads - Capítulo 7
```
https://abogadodebancarrota.com/?utm_source=google&utm_medium=cpc&utm_campaign=capitulo7&utm_term={keyword}&utm_content={creative}
```

### Google Ads - Capítulo 13
```
https://abogadodebancarrota.com/?utm_source=google&utm_medium=cpc&utm_campaign=capitulo13&utm_term={keyword}&utm_content={creative}
```

### Facebook Ads - Consulta Gratis
```
https://abogadodebancarrota.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=consulta_gratis&utm_content={{ad.name}}
```

### Instagram Ads - Testimonios
```
https://abogadodebancarrota.com/?utm_source=instagram&utm_medium=cpc&utm_campaign=testimonios&utm_content={{ad.name}}
```

### Email Newsletter
```
https://abogadodebancarrota.com/?utm_source=newsletter&utm_medium=email&utm_campaign=mensual&utm_content=articulo_nombre
```

---

## ✅ Checklist de Verificación

Después de probar todas las URLs, verifica:

- [ ] **Direct Traffic** - Visita sin parámetros aparece en "Direct"
- [ ] **Google Ads** - Visita con gclid aparece en "Paid Campaigns"
- [ ] **Facebook Ads** - Visita con fbclid aparece en "Paid Campaigns"
- [ ] **Email** - Visita con utm_medium=email aparece correctamente
- [ ] **Organic** - Visita desde Google search aparece en "Organic"
- [ ] **Referral** - Visita desde otro sitio aparece en "Referrals"
- [ ] **Call Click** - Click en tel: se registra como "call_click"
- [ ] **Form Submit** - Envío de formulario se registra como "form_submit"
- [ ] **Journey Completo** - Puedes ver el recorrido completo del usuario
- [ ] **Asociación de Conversiones** - Las llamadas/formularios se asocian a la campaña original

---

## 🚨 Troubleshooting

### No veo eventos en el dashboard

1. **Verifica la consola (F12)**
   - Deberías ver: `[Metrics Lab] Inicializando Metrics Lab...`
   - Deberías ver: `[Metrics Lab] Enviando evento: page_view`

2. **Activa DEBUG_MODE**
   - En Code Snippets, cambia: `var DEBUG_MODE = true;`
   - Guarda y purga el cache
   - Verás logs detallados en la consola

3. **Verifica la configuración**
   - API_KEY está correcto
   - TRACKING_ENDPOINT está correcto
   - El snippet está activado

4. **Purga el cache**
   - LiteSpeed Cache: Purge All
   - WP Rocket: Clear Cache
   - Navegador: Ctrl+Shift+Delete

### Los eventos se registran pero no aparecen en el dashboard

1. **Verifica el rango de fechas** en el dashboard
2. **Refresca el dashboard** con Ctrl+F5
3. **Verifica que el API_KEY** sea el mismo en el script y en el proyecto

---

## 📊 Interpretación de Resultados

### Dashboard - Pestaña "Overview"
Verás un resumen de todo el tráfico:
- Total de eventos
- Eventos únicos
- Distribución por tipo de tráfico

### Dashboard - Pestaña "Organic"
Verás visitas desde búsquedas:
- Google, Bing, Yahoo, etc.
- Sin parámetros de campaña

### Dashboard - Pestaña "Paid Campaigns"
Verás visitas desde campañas publicitarias:
- Google Ads (con gclid)
- Facebook Ads (con fbclid)
- Campañas con UTM parameters

### Dashboard - Pestaña "Referrals"
Verás visitas desde otros sitios:
- Directorios legales
- Blogs
- Redes sociales (sin parámetros)

### Dashboard - Pestaña "Direct"
Verás visitas directas:
- URL escrita directamente
- Favoritos
- Sin referrer

---

## 🎯 Casos de Uso Reales

### Caso 1: Optimizar Google Ads
1. Crea diferentes campañas con diferentes utm_campaign
2. Monitorea cuál genera más llamadas
3. Aumenta presupuesto en la campaña exitosa

### Caso 2: Medir ROI de Facebook Ads
1. Usa fbclid en tus anuncios
2. Cuenta cuántas llamadas/formularios genera
3. Calcula: (Valor de conversión × Conversiones) - Costo de anuncios

### Caso 3: Mejorar SEO
1. Monitorea tráfico orgánico
2. Identifica qué páginas reciben más visitas
3. Optimiza esas páginas para más conversiones

### Caso 4: Email Marketing
1. Usa diferentes utm_content para cada artículo
2. Identifica qué contenido genera más clicks
3. Crea más contenido similar

---

## 📞 Soporte

Si tienes problemas con las pruebas:

1. **Verifica la instalación** - Lee `GUIA_INSTALACION_WORDPRESS_SEGURA.md`
2. **Activa DEBUG_MODE** - Para ver logs detallados
3. **Revisa la consola** - Busca errores en F12
4. **Purga el cache** - Limpia todos los caches

---

## 🎉 ¡Listo!

Ahora tienes URLs de prueba específicas para **abogadodebancarrota.com**. 

**Siguiente paso:** Abre tu sitio en modo incógnito y prueba cada URL.

**¡Buena suerte con tu tracking!** 🚀
