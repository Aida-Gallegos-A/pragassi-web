<?php
/**
 * Pragassi · funciones compartidas para cobrar estudios con Mercado Pago.
 *
 * La configuración privada (token de Mercado Pago, correos) vive FUERA de
 * public_html, en el archivo "pragassi-config.php" de la carpeta del dominio:
 *   /home/uXXXX/domains/pragassi.com/pragassi-config.php
 * Ver PAGOS-EN-LINEA.md.
 */

if (!defined('PRAGASSI')) {
    http_response_code(403);
    exit;
}

// Los avisos de PHP van al registro de errores, nunca a la respuesta (romperían el JSON).
ini_set('display_errors', '0');

/** Estudios que se pueden pagar en línea. El precio que se cobra sale de aquí, nunca del navegador. */
const ESTUDIOS = [
    'basico' => [
        'nombre' => 'Estudio socioeconómico básico',
        'precio' => 580.00,
        'domicilio' => true,
    ],
    'presencial' => [
        'nombre' => 'Estudio socioeconómico presencial (con visita domiciliaria)',
        'precio' => 850.00,
        'domicilio' => true,
    ],
    'verifica' => [
        'nombre' => 'Verifica · test de confianza individual',
        'precio' => 400.00,
        'domicilio' => false,
    ],
];

function config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }
    $rutas = [
        dirname(__DIR__, 2) . '/pragassi-config.php', // carpeta del dominio (recomendado)
        dirname(__DIR__) . '/pragassi-config.php',    // respaldo: dentro de public_html
    ];
    foreach ($rutas as $ruta) {
        if (is_file($ruta)) {
            $config = require $ruta;
            break;
        }
    }
    if (!is_array($config) || empty($config['mp_access_token'])) {
        error_log('Pragassi: falta pragassi-config.php o el token de Mercado Pago.');
        $config = [];
    }
    $config += [
        'url_sitio' => 'https://pragassi.com',
        'correo_destino' => 'aida.gallegos@pragassi.com',
        'correo_remitente' => 'aida.gallegos@pragassi.com',
        'whatsapp' => '525546591720',
    ];
    $config['url_sitio'] = rtrim($config['url_sitio'], '/');
    return $config;
}

function configurado(): bool
{
    return !empty(config()['mp_access_token']);
}

function responder_json(array $datos, int $codigo = 200): void
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Llamada a la API de Mercado Pago. Devuelve [codigo_http, respuesta_decodificada]. */
function mp(string $metodo, string $ruta, ?array $cuerpo = null, ?string $idempotencia = null): array
{
    $cabeceras = [
        'Authorization: Bearer ' . config()['mp_access_token'],
        'Content-Type: application/json',
    ];
    if ($idempotencia) {
        $cabeceras[] = 'X-Idempotency-Key: ' . $idempotencia;
    }
    $ch = curl_init('https://api.mercadopago.com' . $ruta);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $metodo,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $cabeceras,
        CURLOPT_TIMEOUT => 20,
    ]);
    if ($cuerpo !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($cuerpo, JSON_UNESCAPED_UNICODE));
    }
    $respuesta = curl_exec($ch);
    $codigo = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($respuesta === false) {
        error_log('Pragassi: error de red con Mercado Pago: ' . curl_error($ch));
    }
    return [$codigo, json_decode((string) $respuesta, true) ?: []];
}

/**
 * Consulta un pago en Mercado Pago y confirma que es un estudio vendido desde el sitio.
 * Devuelve null si el pago no existe o no corresponde a un estudio.
 */
function consultar_pago(string $pagoId): ?array
{
    if (!preg_match('/^\d{5,20}$/', $pagoId)) {
        return null;
    }
    [$codigo, $pago] = mp('GET', '/v1/payments/' . $pagoId);
    if ($codigo !== 200 || empty($pago['id'])) {
        return null;
    }
    $clave = $pago['metadata']['estudio'] ?? '';
    if (($pago['metadata']['origen'] ?? '') !== 'pragassi-web' || !isset(ESTUDIOS[$clave])) {
        return null;
    }
    $estudio = ESTUDIOS[$clave];
    $montoCorrecto = ($pago['currency_id'] ?? '') === 'MXN'
        && (float) ($pago['transaction_amount'] ?? 0) + 0.001 >= $estudio['precio'];

    return [
        'id' => (string) $pago['id'],
        'estado' => $montoCorrecto ? (string) $pago['status'] : 'monto_invalido',
        'estudio_clave' => $clave,
        'estudio' => $estudio['nombre'],
        'requiere_domicilio' => $estudio['domicilio'],
        'monto' => (float) $pago['transaction_amount'],
        'fecha' => (string) ($pago['date_approved'] ?? $pago['date_created'] ?? ''),
        'correo_pagador' => (string) ($pago['payer']['email'] ?? ''),
        'referencia' => (string) ($pago['external_reference'] ?? ''),
    ];
}

/** Carpeta privada (fuera de public_html) donde se guarda qué pagos ya se usaron. */
function carpeta_datos(): string
{
    $opciones = [dirname(__DIR__, 2) . '/pragassi-solicitudes', __DIR__ . '/_solicitudes'];
    foreach ($opciones as $dir) {
        if (is_dir($dir) || @mkdir($dir, 0700, true)) {
            if (is_writable($dir)) {
                if (str_ends_with($dir, '_solicitudes') && !is_file($dir . '/.htaccess')) {
                    file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
                }
                return $dir;
            }
        }
    }
    throw new RuntimeException('No hay carpeta escribible para guardar solicitudes.');
}

function registro(string $pagoId): array
{
    $archivo = carpeta_datos() . '/' . $pagoId . '.json';
    return is_file($archivo) ? (json_decode((string) file_get_contents($archivo), true) ?: []) : [];
}

function guardar_registro(string $pagoId, array $cambios): void
{
    $archivo = carpeta_datos() . '/' . $pagoId . '.json';
    $datos = array_merge(registro($pagoId), $cambios);
    file_put_contents($archivo, json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

function enlace_solicitud(string $pagoId): string
{
    return config()['url_sitio'] . '/solicitud/?payment_id=' . rawurlencode($pagoId);
}

function enviar_correo(string $para, string $asunto, string $texto, ?string $responderA = null): bool
{
    $remitente = config()['correo_remitente'];
    $cabeceras = [
        'From: =?UTF-8?B?' . base64_encode('Pragassi') . '?= <' . $remitente . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    if ($responderA && filter_var($responderA, FILTER_VALIDATE_EMAIL)) {
        $cabeceras[] = 'Reply-To: ' . $responderA;
    }
    $asuntoCodificado = '=?UTF-8?B?' . base64_encode($asunto) . '?=';
    return mail($para, $asuntoCodificado, $texto, implode("\r\n", $cabeceras), '-f' . $remitente);
}

function pesos(float $monto): string
{
    return '$' . number_format($monto, 2) . ' MXN';
}
