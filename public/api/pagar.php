<?php
/**
 * /api/pagar.php?estudio=basico|presencial|verifica
 * Crea el cobro en Mercado Pago (Checkout Pro) y manda al cliente a pagar.
 */
define('PRAGASSI', true);
require __DIR__ . '/_lib.php';

$clave = (string) ($_GET['estudio'] ?? '');
$cfg = config();

if (!isset(ESTUDIOS[$clave])) {
    header('Location: ' . $cfg['url_sitio'] . '/solicitud/', true, 302);
    exit;
}
if (!configurado()) {
    header('Location: ' . $cfg['url_sitio'] . '/solicitud/?error=config', true, 302);
    exit;
}

$estudio = ESTUDIOS[$clave];
$referencia = 'PRG-' . strtoupper($clave) . '-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
$regreso = $cfg['url_sitio'] . '/solicitud/';

[$codigo, $preferencia] = mp('POST', '/checkout/preferences', [
    'items' => [[
        'id' => $clave,
        'title' => $estudio['nombre'],
        'description' => 'Pragassi · ' . $estudio['nombre'] . ' (1 persona)',
        'category_id' => 'services',
        'quantity' => 1,
        'currency_id' => 'MXN',
        'unit_price' => $estudio['precio'],
    ]],
    'external_reference' => $referencia,
    'metadata' => ['origen' => 'pragassi-web', 'estudio' => $clave],
    'back_urls' => ['success' => $regreso, 'pending' => $regreso, 'failure' => $regreso],
    'auto_return' => 'approved',
    'notification_url' => $cfg['url_sitio'] . '/api/aviso-mp.php',
    'statement_descriptor' => 'PRAGASSI',
    'payment_methods' => ['installments' => 1],
], $referencia);

if ($codigo >= 300 || empty($preferencia['init_point'])) {
    error_log('Pragassi: no se pudo crear el cobro (' . $codigo . '): ' . json_encode($preferencia));
    header('Location: ' . $cfg['url_sitio'] . '/solicitud/?error=pago', true, 302);
    exit;
}

header('Cache-Control: no-store');
header('Location: ' . $preferencia['init_point'], true, 303);
