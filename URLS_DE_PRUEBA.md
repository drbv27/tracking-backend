# 🔗 URLs de Prueba - Metrics Lab

## 📋 Instrucciones

Usa estas URLs para probar que tu tracking funcione correctamente. Reemplaza `https://tu-sitio-wordpress.com` con tu URL real.

**Importante:** Abre cada URL en modo incógnito con la consola del navegador abierta (F12) para ver los logs.

---

## 🎯 Pruebas Básicas

### 1. Visita Directa (Direct Traffic)

```
https://tu-sitio-wordpress.com/
```

**Qué esperar:**
- En consola: `[Metrics Lab] Enviando evento: page_view`
- En dashboard: Pestaña "Direct" → +1 visita
- Traffic Source: `direct`

---

### 2. Visita Orgánica Simulada (Organic Traffic)

Para simular tráfico orgánico, necesitas venir desde un buscador real. Pero puedes probar:

```
https://tu-sitio-wordpress.com/
```

**Con referrer de Google** (usa una extensión de navegador o herramienta para modificar el referrer a `https://www.google.com/search?q=test`)

**Qué esperar:**
- En consola: `[Metrics Lab] Enviando evento: page_view` con referrer
- En dashboard: Pestaña "Organic" → Google → +1 visita
- Traffic Source: `organic`, Platform: `google`

---

## 💰 Pruebas de Campañas Pagadas

### 3. Google Ads (con gclid)

```
https://tu-sitio-wordpress.com/?gclid=test_google_123&utm_source=google&utm_medium=cpc&utm_campaign=prueba_google_ads&utm_term=keyword_test&utm_content=ad_variant_a
```

**Qué esperar:**
- En consola: Evento con `gclid: "test_google_123"`
- En dashboard: Pestaña "Paid Campaigns" → Google → Campaña "prueba_google_ads"
- Traffic Source: `paid`, Platform: `google`, Medium: `cpc`

**Ahora haz clic en un botón de llamada:**
- Debería registrar `call_click` con el mismo `gclid`
- En dashboard: Verás el call_click asociado a la campaña de Google

---

### 4. Facebook Ads (con fbclid)

```
https://tu-sitio-wordpress.com/?fbclid=test_facebook_456&utm_source=facebook&utm_medium=cpc&utm_campaign=prueba_facebook_ads&utm_content=carousel_ad
```

**Qué esperar:**
- En consola: Evento con `fbclid: "test_facebook_456"`
- En dashboard: Pestaña "Paid Campaigns" → Facebook → Campaña "prueba_facebook_ads"
- Traffic Source: `paid`, Platform: `facebook`, Medium: `cpc`

---

### 5. Instagram Ads

```
https://tu-sitio-wordpress.com/?utm_source=instagram&utm_medium=cpc&utm_campaign=prueba_instagram_ads&utm_content=story_ad
```

**Qué esperar:**
- En consola: Evento con UTM parameters
- En dashboard: Pestaña "Paid Campaigns" → Instagram → Campaña "prueba_instagram_ads"
- Traffic Source: `paid`, Platform: `instagram`, Medium: `cpc`

---

### 6. TikTok Ads (con ttclid)

```
https://tu-sitio-wordpress.com/?ttclid=test_tiktok_789&utm_source=tiktok&utm_medium=cpc&utm_campaign=prueba_tiktok_ads
```

**Qué esperar:**
- En consola: Evento con `ttclid: "test_tiktok_789"`
- En dashboard: Pestaña "Paid Campaigns" → TikTok → Campaña "prueba_tiktok_ads"
- Traffic Source: `paid`, Platform: `tiktok`, Medium: `cpc`

---

### 7. LinkedIn Ads (con li_fat_id)

```
https://tu-sitio-wordpress.com/?li_fat_id=test_linkedin_999&utm_source=linkedin&utm_medium=cpc&utm_campaign=prueba_linkedin_ads
```

**Qué esperar:**
- En consola: Evento con `li_fat_id: "test_linkedin_999"`
- En dashboard: Pestaña "Paid Campaigns" → LinkedIn → Campaña "prueba_linkedin_ads"
- Traffic Source: `paid`, Platform: `linkedin`, Medium: `cpc`

---

### 8. YouTube Ads

```
https://tu-sitio-wordpress.com/?utm_source=youtube&utm_medium=cpc&utm_campaign=prueba_youtube_ads&utm_content=video_ad
```

**Qué esperar:**
- En consola: Evento con UTM parameters
- En dashboard: Pestaña "Paid Campaigns" → YouTube → Campaña "prueba_youtube_ads"
- Traffic Source: `paid`, Platform: `youtube`, Medium: `cpc`

---

## 📧 Pruebas de Email Marketing

### 9. Newsletter Semanal

```
https://tu-sitio-wordpress.com/?utm_source=newsletter&utm_medium=email&utm_campaign=boletin_semanal&utm_content=header_cta
```

**Qué esperar:**
- En consola: Evento con UTM parameters
- En dashboard: Pestaña "Paid Campaigns" (o Referrals) → Newsletter
- Traffic Source: Depende de la configuración, probablemente `referral` o `paid`

---

### 10. Email de Promoción

```
https://tu-sitio-wordpress.com/?utm_source=email_promo&utm_medium=email&utm_campaign=descuento_verano&utm_content=button_cta
```

**Qué esperar:**
- En consola: Evento con UTM parameters
- En dashboard: Campaña "descuento_verano"

---

## 🔗 Pruebas de Tráfico Referido

### 11. Referido desde Blog Externo

Para simular esto, necesitas crear un enlace en otro sitio o usar una herramienta para modificar el referrer.

```
https://tu-sitio-wordpress.com/
```

**Con referrer:** `https://blog-amigo.com/articulo-sobre-mi-producto`

**Qué esperar:**
- En consola: Evento con `referrer: "https://blog-amigo.com/..."`
- En dashboard: Pestaña "Referrals" → blog-amigo.com → +1 visita
- Traffic Source: `referral`, Platform: `blog-amigo.com`

---

## 📱 Pruebas de Redes Sociales Orgánicas

### 12. Post Orgánico de Facebook

```
https://tu-sitio-wordpress.com/?utm_source=facebook&utm_medium=social&utm_campaign=post_organico
```

**Qué esperar:**
- En consola: Evento con UTM parameters
- En dashboard: Pestaña "Paid Campaigns" o "Referrals" → Facebook
- Traffic Source: `social`, Platform: `facebook`

---

### 13. Tweet Orgánico

```
https://tu-sitio-wordpress.com/?utm_source=twitter&utm_medium=social&utm_campaign=tweet_organico
```

**Qué esperar:**
- En consola: Evento con UTM parameters
- En dashboard: Twitter → Campaña "tweet_organico"
- Traffic Source: `social`, Platform: `twitter`

---

## 🎯 Pruebas de Conversiones

### 14. Campaña con Conversión de Llamada

**Paso 1:** Visita con campaña de Google Ads
```
https://tu-sitio-wordpress.com/?gclid=conversion_test_123&utm_source=google&utm_medium=cpc&utm_campaign=test_conversion
```

**Paso 2:** Haz clic en un botón de llamada en tu sitio
```html
<a href="tel:+1234567890">Llamar Ahora</a>
```

**Qué esperar:**
- Evento 1: `page_view` con `gclid: "conversion_test_123"`
- Evento 2: `call_click` con el MISMO `gclid: "conversion_test_123"`
- En dashboard: Campaña "test_conversion" → Ver detalles → Ver el call_click

**Esto te permite saber que la llamada vino de esa campaña específica de Google Ads** 🎯

---

### 15. Campaña con Conversión de Formulario

**Paso 1:** Visita con campaña de Facebook
```
https://tu-sitio-wordpress.com/?fbclid=form_test_456&utm_source=facebook&utm_medium=cpc&utm_campaign=test_form_conversion
```

**Paso 2:** Llena y envía un formulario en tu sitio

**Qué esperar:**
- Evento 1: `page_view` con `fbclid: "form_test_456"`
- Evento 2: `form_submit` con el MISMO `fbclid: "form_test_456"`
- En dashboard: Campaña "test_form_conversion" → Ver detalles → Ver el form_submit

---

## 🧪 Pruebas Avanzadas

### 16. Múltiples Parámetros UTM

```
https://tu-sitio-wordpress.com/?utm_source=google&utm_medium=cpc&utm_campaign=verano_2024&utm_term=zapatos+deportivos&utm_content=ad_variant_b&gclid=multi_param_test
```

**Qué esperar:**
- Todos los parámetros capturados correctamente
- En dashboard: Ver todos los detalles de la campaña

---

### 17. URL con Parámetros Adicionales

```
https://tu-sitio-wordpress.com/productos/?categoria=zapatos&color=rojo&gclid=extra_params_test&utm_source=google&utm_medium=cpc&utm_campaign=test_extra
```

**Qué esperar:**
- Los parámetros UTM y gclid se capturan correctamente
- Los parámetros adicionales (categoria, color) no interfieren

---

### 18. URL con Fragmento (#)

```
https://tu-sitio-wordpress.com/productos#seccion-destacados?utm_source=email&utm_medium=newsletter&utm_campaign=test_fragment
```

**Nota:** Los parámetros después de # pueden no funcionar correctamente. Usa siempre `?` antes de los parámetros.

**Formato correcto:**
```
https://tu-sitio-wordpress.com/productos?utm_source=email&utm_medium=newsletter&utm_campaign=test_fragment#seccion-destacados
```

---

## 📊 Tabla Resumen de Pruebas

| # | Tipo de Prueba | Parámetro Clave | Pestaña en Dashboard |
|---|----------------|-----------------|----------------------|
| 1 | Direct | Ninguno | Direct |
| 2 | Organic | referrer de Google | Organic |
| 3 | Google Ads | gclid | Paid Campaigns |
| 4 | Facebook Ads | fbclid | Paid Campaigns |
| 5 | Instagram Ads | utm_source=instagram | Paid Campaigns |
| 6 | TikTok Ads | ttclid | Paid Campaigns |
| 7 | LinkedIn Ads | li_fat_id | Paid Campaigns |
| 8 | YouTube Ads | utm_source=youtube | Paid Campaigns |
| 9 | Newsletter | utm_medium=email | Paid Campaigns |
| 10 | Email Promo | utm_medium=email | Paid Campaigns |
| 11 | Referral | referrer externo | Referrals |
| 12 | Facebook Orgánico | utm_medium=social | Social/Referrals |
| 13 | Twitter Orgánico | utm_medium=social | Social/Referrals |
| 14 | Call Conversion | gclid + call_click | Paid Campaigns |
| 15 | Form Conversion | fbclid + form_submit | Paid Campaigns |

---

## 🎯 Plantilla para Crear tus Propias URLs

### Formato General

```
https://tu-sitio-wordpress.com/[pagina]?[parametros]
```

### Parámetros Disponibles

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `gclid` | Google Ads Click ID | `gclid=abc123` |
| `fbclid` | Facebook Ads Click ID | `fbclid=xyz789` |
| `ttclid` | TikTok Ads Click ID | `ttclid=def456` |
| `li_fat_id` | LinkedIn Ads ID | `li_fat_id=ghi789` |
| `utm_source` | Fuente de la campaña | `utm_source=google` |
| `utm_medium` | Medio de la campaña | `utm_medium=cpc` |
| `utm_campaign` | Nombre de la campaña | `utm_campaign=verano2024` |
| `utm_term` | Término/keyword | `utm_term=zapatos` |
| `utm_content` | Contenido/variante | `utm_content=ad_variant_a` |

### Ejemplo Completo

```
https://tu-sitio-wordpress.com/productos?gclid=abc123&utm_source=google&utm_medium=cpc&utm_campaign=verano2024&utm_term=zapatos+deportivos&utm_content=ad_variant_a
```

---

## 🔧 Herramientas Útiles

### Generador de URLs con UTM

Usa estas herramientas para generar URLs con parámetros UTM:

1. **Google Campaign URL Builder**
   - https://ga-dev-tools.google/campaign-url-builder/

2. **UTM.io**
   - https://utm.io/

3. **Bitly Campaign Builder**
   - https://bitly.com/pages/features/campaign-builder

---

## ✅ Checklist de Pruebas

Marca cada prueba cuando la completes:

- [ ] Prueba 1: Direct Traffic
- [ ] Prueba 2: Organic Traffic
- [ ] Prueba 3: Google Ads
- [ ] Prueba 4: Facebook Ads
- [ ] Prueba 5: Instagram Ads
- [ ] Prueba 6: TikTok Ads
- [ ] Prueba 7: LinkedIn Ads
- [ ] Prueba 8: YouTube Ads
- [ ] Prueba 9: Newsletter
- [ ] Prueba 10: Email Promo
- [ ] Prueba 11: Referral
- [ ] Prueba 12: Facebook Orgánico
- [ ] Prueba 13: Twitter Orgánico
- [ ] Prueba 14: Call Conversion
- [ ] Prueba 15: Form Conversion

---

## 📝 Notas

- Espera 1-2 minutos después de cada prueba para que los datos aparezcan en el dashboard
- Usa modo incógnito para evitar que el cache interfiera
- Activa DEBUG_MODE para ver logs detallados en la consola
- Si una prueba falla, revisa la consola del navegador para ver errores

---

**¡Listo para probar!** 🚀

Copia estas URLs, reemplaza `tu-sitio-wordpress.com` con tu dominio real, y empieza a probar.

