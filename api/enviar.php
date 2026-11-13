<?php
/**
 * /api/enviar.php (POST, JSON)
 * Recibe los datos del estudio, vuelve a confirmar el pago con Mercado Pago
 * y los envía por correo a Pragassi. Cada pago solo se puede usar una vez.
 */
define('PRAGASSI', true);
require __DIR__ . '/_lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder_json(['ok' => false, 'error' => 'metodo'], 405);
}
if (!configurado()) {
    responder_json(['ok' => false, 'error' => 'config'], 503);
}

$entrada = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($entrada)) {
    responder_json(['ok' => false, 'error' => 'datos'], 400);
}

/** Toma un texto del formulario, limpio y con largo máximo. */
function campo(array $origen, string $nombre, int $max = 200): string
{
    $valor = $origen[$nombre] ?? '';
    if (!is_string($valor)) {
        return '';
    }
    $valor = trim(preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', '', $valor) ?? '');
    return mb_substr($valor, 0, $max);
}

$pago = consultar_pago(campo($entrada, 'payment_id', 20));
if (!$pago) {
    responder_json(['ok' => false, 'error' => 'no_encontrado'], 404);
}
if ($pago['estado'] !== 'approved') {
    responder_json(['ok' => false, 'error' => 'pago_no_aprobado', 'estado' => $pago['estado']], 409);
}

$d = [
    'empresa' => campo($entrada, 'empresa'),
    'contacto' => campo($entrada, 'contacto'),
    'correo' => campo($entrada, 'correo', 120),
    'telefono' => campo($entrada, 'telefono', 30),
    'persona' => campo($entrada, 'persona'),
    'persona_tel' => campo($entrada, 'persona_tel', 30),
    'persona_tel2' => campo($entrada, 'persona_tel2', 30),
    'persona_correo' => campo($entrada, 'persona_correo', 120),
    'puesto' => campo($entrada, 'puesto'),
    'calle' => campo($entrada, 'calle'),
    'colonia' => campo($entrada, 'colonia'),
    'municipio' => campo($entrada, 'municipio'),
    'estado' => campo($entrada, 'estado', 60),
    'cp' => campo($entrada, 'cp', 5),
    'referencias_domicilio' => campo($entrada, 'referencias_domicilio', 300),
    'factura' => !empty($entrada['factura']),
    'rfc' => strtoupper(campo($entrada, 'rfc', 13)),
    'razon_social' => campo($entrada, 'razon_social'),
    'regimen' => campo($entrada, 'regimen', 120),
    'cp_fiscal' => campo($entrada, 'cp_fiscal', 5),
    'uso_cfdi' => campo($entrada, 'uso_cfdi', 120),
    'comentarios' => campo($entrada, 'comentarios', 1500),
    'acepto' => !empty($entrada['acepto']),
];

$faltan = [];
foreach (['empresa', 'contacto', 'correo', 'telefono', 'persona', 'persona_tel'] as $obligatorio) {
    if ($d[$obligatorio] === '') {
        $faltan[] = $obligatorio;
    }
}
if ($pago['requiere_domicilio']) {
    foreach (['calle', 'colonia', 'municipio', 'estado', 'cp'] as $obligatorio) {
        if ($d[$obligatorio] === '') {
            $faltan[] = $obligatorio;
        }
    }
}
if ($d['factura']) {
    foreach (['rfc', 'razon_social', 'regimen', 'cp_fiscal'] as $obligatorio) {
        if ($d[$obligatorio] === '') {
            $faltan[] = $obligatorio;
        }
    }
}
if (!$pago['requiere_domicilio'] && !filter_var($d['persona_correo'], FILTER_VALIDATE_EMAIL)) {
    $faltan[] = 'persona_correo'; // Verifica: el enlace del test se envía a la persona
}
if (!filter_var($d['correo'], FILTER_VALIDATE_EMAIL)) {
    $faltan[] = 'correo';
}
if (!$d['acepto']) {
    $faltan[] = 'acepto';
}
if ($faltan) {
    responder_json(['ok' => false, 'error' => 'faltan_datos', 'campos' => array_values(array_unique($faltan))], 422);
}

// Un pago = un estudio. El candado evita que dos envíos simultáneos usen el mismo pago.
$candado = fopen(carpeta_datos() . '/' . $pago['id'] . '.lock', 'c');
flock($candado, LOCK_EX);
if (!empty(registro($pago['id'])['datos_enviados'])) {
    responder_json(['ok' => false, 'error' => 'ya_enviado'], 409);
}

$v = static fn(string $texto): string => $texto === '' ? '—' : $texto;
$lineas = [
    'NUEVA SOLICITUD PAGADA EN LÍNEA',
    '',
    'Estudio:      ' . $pago['estudio'],
    'Pagado:       ' . pesos($pago['monto']) . ' · Mercado Pago #' . $pago['id'],
    'Referencia:   ' . $pago['referencia'],
    'Fecha pago:   ' . $pago['fecha'],
    '',
    '— QUIEN SOLICITA —',
    'Empresa/negocio: ' . $d['empresa'],
    'Contacto:        ' . $d['contacto'],
    'Correo:          ' . $d['correo'],
    'Teléfono:        ' . $d['telefono'],
    '',
    '— PERSONA DEL ESTUDIO —',
    'Nombre:            ' . $d['persona'],
    'Teléfono celular:  ' . $d['persona_tel'],
    'Teléfono alterno:  ' . $v($d['persona_tel2']),
    'Correo:            ' . $v($d['persona_correo']),
    'Puesto al que aplica: ' . $v($d['puesto']),
];
if ($pago['requiere_domicilio']) {
    array_push(
        $lineas,
        '',
        '— DOMICILIO —',
        $d['calle'],
        'Col. ' . $d['colonia'] . ', ' . $d['municipio'] . ', ' . $d['estado'] . ', C.P. ' . $d['cp'],
        'Referencias: ' . $v($d['referencias_domicilio'])
    );
}
array_push($lineas, '', '— FACTURA —');
if ($d['factura']) {
    array_push(
        $lineas,
        'RFC:            ' . $d['rfc'],
        'Razón social:   ' . $d['razon_social'],
        'Régimen fiscal: ' . $d['regimen'],
        'C.P. fiscal:    ' . $d['cp_fiscal'],
        'Uso de CFDI:    ' . $v($d['uso_cfdi'])
    );
} else {
    $lineas[] = 'No requiere factura.';
}
array_push(
    $lineas,
    '',
    '— COMENTARIOS —',
    $v($d['comentarios']),
    '',
    'El solicitante confirmó que la persona está enterada y autoriza el estudio, y aceptó el aviso de privacidad.',
    'Puedes responder este correo para escribirle directamente al solicitante.'
);

$cfg = config();
$enviado = enviar_correo(
    $cfg['correo_destino'],
    'Estudio pagado: ' . $d['persona'] . ' · ' . $d['empresa'],
    implode("\n", $lineas),
    $d['correo']
);
if (!$enviado) {
    error_log('Pragassi: no se pudo enviar el correo del pago ' . $pago['id']);
    responder_json(['ok' => false, 'error' => 'correo'], 500);
}

guardar_registro($pago['id'], [
    'datos_enviados' => true,
    'enviado_en' => date('c'),
    'estudio' => $pago['estudio'],
    'solicitud' => $d,
]);
flock($candado, LOCK_UN);

enviar_correo(
    $d['correo'],
    'Recibimos tu solicitud · Pragassi',
    implode("\n", [
        'Hola ' . $d['contacto'] . ',',
        '',
        'Gracias por tu pago. Recibimos los datos para el ' . mb_strtolower($pago['estudio']) . ' de ' . $d['persona'] . '.',
        'Folio de pago: ' . $pago['id'] . ' · ' . pesos($pago['monto']),
        '',
        'En breve nos pondremos en contacto para confirmar el inicio del estudio.',
        'Si necesitas algo, responde este correo o escríbenos por WhatsApp: https://wa.me/' . $cfg['whatsapp'],
        '',
        'Pragassi Consultoría RH',
        $cfg['url_sitio'],
    ]),
    $cfg['correo_destino']
);

responder_json(['ok' => true]);
