<?php
/**
 * COPIA ESTE ARCHIVO a Hostinger con el nombre "pragassi-config.php"
 * en la carpeta del dominio, UN NIVEL ARRIBA de public_html:
 *
 *   domains/pragassi.com/pragassi-config.php      <- aquí
 *   domains/pragassi.com/public_html/             <- aquí NO
 *
 * Nunca lo subas a GitHub: contiene la llave privada de Mercado Pago.
 */
return [
    // Mercado Pago → Tus integraciones → tu aplicación → Credenciales de producción → Access Token
    // Para pruebas, usa el Access Token de "Credenciales de prueba".
    'mp_access_token' => 'APP_USR-PEGA-AQUI-TU-ACCESS-TOKEN',

    // Adónde llegan las solicitudes pagadas
    'correo_destino' => 'aida.gallegos@pragassi.com',

    // Desde qué correo se envían (debe existir en el Correo de Hostinger de pragassi.com)
    'correo_remitente' => 'aida.gallegos@pragassi.com',

    'url_sitio' => 'https://pragassi.com',
    'whatsapp' => '525546591720',
];
