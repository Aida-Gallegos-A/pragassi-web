# Publicar el sitio de Pragassi en Hostinger

Archivo a subir: `deploy/pragassi-hostinger.zip` (15 archivos, 2.75 MB).
Si cambias algo del sitio, genera uno nuevo con `npm run build` (queda en `dist/`).

## Antes de empezar

1. **Respalda el sitio actual.** Hoy pragassi.com está hecho con el *Creador de sitios web* de Hostinger. No se borra, pero deja de mostrarse cuando el dominio apunte al nuevo sitio.
2. **Verifica que tengas un plan de Web Hosting** (Premium, Business o Cloud). Si verifica.pragassi.com funciona, ya lo tienes.
3. **Ten el SSL activo** en pragassi.com: hPanel → *Seguridad* → *SSL*. El `.htaccess` redirige todo a `https://`.

## Paso 1 · Conectar el dominio al Web Hosting

Si pragassi.com está ligado al Creador de sitios web:

1. En hPanel, entra a **Sitios web** y busca *pragassi.com*.
2. Si aparece como sitio del Creador, usa **Cambiar a hosting** o **Desconectar** para que el dominio use el Web Hosting (con carpeta `public_html`). Si no ves la opción, el chat de soporte de Hostinger lo hace en minutos: pídeles *"apuntar pragassi.com a mi plan de Web Hosting en lugar del Creador de sitios"*.
3. **No toques el subdominio `verifica`**; es un sitio aparte y sigue igual.

## Paso 2 · Subir los archivos

1. hPanel → **Sitios web** → pragassi.com → **Administrador de archivos**.
2. Abre la carpeta **`public_html`**.
3. Si hay archivos viejos (por ejemplo `default.php` o un `index.html` de prueba), muévelos a una carpeta `respaldo/` o bórralos. **No borres la carpeta de `verifica`** si estuviera ahí dentro.
4. Botón **Subir** → elige `pragassi-hostinger.zip`.
5. Clic derecho en el ZIP → **Extraer** → destino: `public_html` (directo, no en una subcarpeta).
6. Revisa que en `public_html` queden: `index.html`, `.htaccess`, `assets/`, `models/`, los logos, `og-image.jpg`, `robots.txt` y `sitemap.xml`.
   - El `.htaccess` es un archivo oculto: activa *Mostrar archivos ocultos* en la configuración del Administrador de archivos si no lo ves.
7. Borra el ZIP de `public_html`.

## Paso 3 · Comprobar

1. Abre **https://pragassi.com** en modo incógnito.
2. Revisa: el planeta 3D carga, los botones de WhatsApp abren el chat, el formulario de contacto funciona y en el celular se ve bien.
3. Prueba la vista previa al compartir: pega el enlace en https://developers.facebook.com/tools/debug/ y pulsa *Volver a extraer*. WhatsApp puede tardar unas horas en refrescar su vista previa.

## Paso 4 · Google (opcional, recomendado)

1. En https://search.google.com/search-console agrega `pragassi.com`.
2. En *Sitemaps*, envía `https://pragassi.com/sitemap.xml`.

## Si algo falla

| Síntoma | Solución |
| --- | --- |
| Se ve el sitio viejo | Limpia la caché del navegador y, en hPanel, *Rendimiento → Borrar caché*. Revisa el Paso 1. |
| Error "demasiadas redirecciones" | El SSL no está activo. Actívalo o borra el primer bloque del `.htaccess`. |
| El planeta no carga | Confirma que existe la carpeta `models/` con los 3 archivos. |
| Página en blanco | Los archivos quedaron en una subcarpeta; muévelos directo a `public_html`. |
