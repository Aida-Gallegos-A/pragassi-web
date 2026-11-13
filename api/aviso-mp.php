<?php
/**
 * /api/aviso-mp.php — Mercado Pago avisa aquí cada vez que cambia un pago.
 *
 * Si el pago quedó aprobado y el cliente todavía no manda los datos (por ejemplo,
 * pagó en OXXO o cerró la ventana), se le envía por correo el enlace al formulario
 * y se avisa a Pragassi.
 */
define('PRAGASSI', true);
require __DIR__ . '/_lib.php';

// Mercado Pago solo necesita un 200 rápido; la consulta real se hace contra su API.
$cuerpo = json_decode((string) file_get_contents('php://input'), true) ?: [];
$tipo = (string) ($_GET['type'] ?? $_GET['topic'] ?? $cuerpo['type'] ?? $cuerpo['topic'] ?? '');
$pagoId = (string) ($_GET['data_id'] ?? $cuerpo['data']['id'] ?? $_GET['id'] ?? '');

if ($tipo !== 'payment' || $pagoId === '' || !configurado()) {
    responder_json(['ok' => true]);
}

$pago = consultar_pago($pagoId);
if (!$pago || $pago['estado'] !== 'approved') {
    responder_json(['ok' => true]);
}

$candado = fopen(carpeta_datos() . '/' . $pago['id'] . '.lock', 'c');
flock($candado, LOCK_EX);
$registro = registro($pago['id']);
if (!empty($registro['datos_enviados']) || !empty($registro['aviso_enviado'])) {
    responder_json(['ok' => true]);
}
guardar_registro($pago['id'], ['aviso_enviado' => true, 'aviso_en' => date('c'), 'estudio' => $pago['estudio']]);
flock($candado, LOCK_UN);

$cfg = config();
$enlace = enlace_solicitud($pago['id']);

if ($pago['correo_pagador'] !== '' && filter_var($pago['correo_pagador'], FILTER_VALIDATE_EMAIL)) {
    enviar_correo(
        $pago['correo_pagador'],
        'Tu pago fue aprobado · Envía los datos del estudio',
        implode("\n", [
            'Hola,',
            '',
            'Recibimos tu pago de ' . pesos($pago['monto']) . ' por: ' . $pago['estudio'] . '.',
            '',
            'Para comenzar, captura los datos de la persona del estudio en este enlace:',
            $enlace,
            '',
            'Si ya los enviaste, ignora este mensaje.',
            'Dudas por WhatsApp: https://wa.me/' . $cfg['whatsapp'],
            '',
            'Pragassi Consultoría RH',
        ]),
        $cfg['correo_destino']
    );
}

enviar_correo(
    $cfg['correo_destino'],
    'Pago recibido (esperando datos): ' . $pago['estudio'],
    implode("\n", [
        'Mercado Pago aprobó un pago y el cliente aún no ha enviado los datos del estudio.',
        '',
        'Estudio:    ' . $pago['estudio'],
        'Monto:      ' . pesos($pago['monto']) . ' · Mercado Pago #' . $pago['id'],
        'Referencia: ' . $pago['referencia'],
        'Pagador:    ' . ($pago['correo_pagador'] ?: '—'),
        '',
        'Ya le enviamos este enlace por correo. Si te contacta por WhatsApp, puedes reenviárselo:',
        $enlace,
        '',
        'Cuando lo llene, recibirás otro correo con todos los datos.',
    ])
);

responder_json(['ok' => true]);
