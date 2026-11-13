<?php
/**
 * /api/verificar.php?payment_id=123
 * Le dice a la página /solicitud/ si el pago está aprobado y si ya se enviaron los datos.
 */
define('PRAGASSI', true);
require __DIR__ . '/_lib.php';

if (!configurado()) {
    responder_json(['ok' => false, 'error' => 'config'], 503);
}

$pago = consultar_pago((string) ($_GET['payment_id'] ?? ''));
if (!$pago) {
    responder_json(['ok' => false, 'error' => 'no_encontrado'], 404);
}

$registro = registro($pago['id']);

responder_json([
    'ok' => true,
    'estado' => $pago['estado'],
    'estudio' => $pago['estudio'],
    'estudio_clave' => $pago['estudio_clave'],
    'requiere_domicilio' => $pago['requiere_domicilio'],
    'monto' => $pago['monto'],
    'referencia' => $pago['referencia'],
    'correo_pagador' => $pago['correo_pagador'],
    'datos_enviados' => !empty($registro['datos_enviados']),
]);
