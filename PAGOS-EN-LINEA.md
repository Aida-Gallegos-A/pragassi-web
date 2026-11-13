# Pagos en línea con Mercado Pago

Para clientes de una sola vez: eligen el estudio, pagan y después envían los datos de la persona. Nadie puede enviar datos sin haber pagado, y cada pago sirve para **un solo estudio**.

## Cómo funciona

1. El cliente entra a **https://pragassi.com/solicitud/**. Puede llegar desde los botones "Págalo en línea" de Precios y Verifica, o porque tú le mandas el enlace por WhatsApp.
2. Elige el estudio (Básico $580, Presencial $850 o Verifica $400) y paga en Mercado Pago con tarjeta, OXXO, transferencia o saldo.
3. Al aprobarse el pago, Mercado Pago lo regresa al sitio. El sitio confirma el pago **directamente con Mercado Pago** y le muestra el formulario.
4. Captura los datos: empresa, contacto, persona del estudio, domicilio, teléfonos, factura (opcional) y el consentimiento.
5. Te llega un correo a **aida.gallegos@pragassi.com** con todo y el folio de pago. Al cliente le llega su confirmación.

**Si paga en OXXO o cierra la ventana:** cuando Mercado Pago aprueba el pago, el sistema le manda al cliente por correo el enlace al formulario. A ti te avisa con el asunto *"Pago recibido (esperando datos)"*, con el mismo enlace por si quieres reenviárselo por WhatsApp.

Los precios que se cobran están en `public/api/_lib.php` (sección `ESTUDIOS`). Los que se muestran están en `src/data/content.ts` (`ONLINE_STUDIES`). Si cambias un precio, cámbialo en los dos.

## Configuración (una sola vez)

### 1. Cuenta y credenciales de Mercado Pago

1. Entra a https://www.mercadopago.com.mx/developers/panel/app con la cuenta de Mercado Pago de Pragassi.
2. **Crear aplicación** → nombre *Pragassi Web* → tipo *Pagos en línea* → *Checkout Pro*.
3. En la aplicación, abre **Credenciales de producción** y copia el **Access Token** (empieza con `APP_USR-`).
   - Es una llave privada. No la compartas ni la pegues en WhatsApp ni en GitHub.

### 2. Subir la configuración a Hostinger

1. Abre `deploy-config/pragassi-config.ejemplo.php`, pega tu Access Token y revisa los correos.
2. hPanel → pragassi.com → **Administrador de archivos**.
3. Sube el archivo a la carpeta del dominio, **un nivel arriba de `public_html`**, con el nombre exacto **`pragassi-config.php`**:
   ```
   domains/pragassi.com/pragassi-config.php   ← aquí
   domains/pragassi.com/public_html/          ← no dentro de esta
   ```
   Así nunca queda visible en internet y no se borra cuando se publica una versión nueva del sitio.
4. El sistema crea solo la carpeta `domains/pragassi.com/pragassi-solicitudes/`. Ahí guarda qué pagos ya se usaron y una copia de cada solicitud, como respaldo por si un correo no llega.

### 3. Correo

`correo_remitente` debe ser un buzón que exista en **Correos de Hostinger** para pragassi.com. Si los correos no llegan, revisa la carpeta de spam y que el buzón exista.

### 4. Publicar

Guarda los cambios en `main`. GitHub compila el sitio y Hostinger lo publica, igual que siempre (ver `PUBLICAR-EN-HOSTINGER.md`).

## Probar antes de cobrar de verdad

1. En el panel de Mercado Pago → tu aplicación → **Cuentas de prueba**, crea un *vendedor* y un *comprador* de prueba.
2. Inicia sesión con el vendedor de prueba, copia su Access Token de **producción** y ponlo en `pragassi-config.php`.
3. Abre pragassi.com/solicitud/ en una ventana de incógnito, paga con el comprador de prueba y usa una [tarjeta de prueba](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/integration-test/test-cards). Con el titular **APRO** el pago se aprueba.
4. Llena el formulario y confirma que te llega el correo.
5. Cuando todo esté bien, cambia al Access Token real de Pragassi.

## Si algo falla

| Síntoma | Qué revisar |
| --- | --- |
| "No pudimos abrir el pago" | Falta `pragassi-config.php`, está en otra carpeta o el token está mal copiado. |
| El cliente pagó pero dice "No encontramos este pago" | El token es de otra cuenta (por ejemplo, quedó el de prueba). |
| No llega el correo | Revisa spam y que `correo_remitente` exista en Correos de Hostinger. Los datos quedan respaldados en `pragassi-solicitudes/`. |
| Necesitas el detalle de un error | hPanel → **Avanzado → Registros de errores** (las líneas empiezan con "Pragassi:"). |
