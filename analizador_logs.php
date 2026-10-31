<?php
/**
 * Analizador de Logs de Apache en PHP para Sistema de Banca en Línea
 * Proyecto Universitario - UMG
 */

// Ruta al archivo de registros de Apache (ajusta la ruta según tu entorno local o servidor)
$logFilePath = 'access.log'; 

if (!file_exists($logFilePath)) {
    // Si no existe un log real, mostramos una demostración con datos de prueba
    echo "<h2>Reporte de Logs de Apache (Simulación de Entorno)</h2>";
    $lines = [
        '192.168.1.10 - - [31/Oct/2026:10:00:00 -0600] "GET /index.html HTTP/1.1" 200 1234',
        '192.168.1.11 - - [31/Oct/2026:10:01:00 -0600] "POST /api/login HTTP/1.1" 200 567',
        '192.168.1.12 - - [31/Oct/2026:10:02:00 -0600] "GET /admin/dashboard HTTP/1.1" 200 4321',
        '192.168.1.10 - - [31/Oct/2026:10:03:00 -0600] "GET /no_existe.php HTTP/1.1" 404 230',
        '192.168.1.13 - - [31/Oct/2026:10:04:00 -0600] "POST /api/transfer HTTP/1.1" 500 120'
    ];
} else {
    $lines = file($logFilePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
}

$totalHits = count($lines);
$status200 = 0;
$status404 = 0;
$status500 = 0;
$uniqueIPs = [];
$urls = [];

// Patrón de Expresión Regular para formato COMBINED / COMMON de Apache
$pattern = '/^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) \S+" (\d{3}) (\d+|-)/';

foreach ($lines as $line) {
    if (preg_match($pattern, $line, $matches)) {
        $ip = $matches[1];
        $url = $matches[4];
        $code = (int)$matches[5];

        // Conteo de IPs únicas
        $uniqueIPs[$ip] = true;

        // Conteo de URLs solicitadas
        if (!isset($urls[$url])) {
            $urls[$url] = 0;
        }
        $urls[$url]++;

        // Clasificación por código de estado HTTP
        if ($code >= 200 && $code < 300) {
            $status200++;
        } elseif ($code == 404) {
            $status404++;
        } elseif ($code >= 500) {
            $status500++;
        }
    }
}

$totalIPs = count($uniqueIPs);
$pct200 = $totalHits > 0 ? round(($status200 / $totalHits) * 100, 2) : 0;
$pct404 = $totalHits > 0 ? round(($status404 / $totalHits) * 100, 2) : 0;
$pct500 = $totalHits > 0 ? round(($status500 / $totalHits) * 100, 2) : 0;

arsort($urls);
$topUrl = !empty($urls) ? array_key_first($urls) : '/index.html';
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Análisis de Logs de Apache - PHP</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 30px; background-color: #f4f6f9; }
        .card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #003366; color: white; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Reporte de Análisis de Servidor Web (Apache Logs via PHP)</h2>
        <table>
            <tr><th>Métrica del Servidor</th><th>Valor Calculado</th><th>Descripción</th></tr>
            <tr><td><b>Total de Solicitudes (Hits)</b></td><td><?= $totalHits ?></td><td>Peticiones procesadas por el servidor.</td></tr>
            <tr><td><b>Visitantes Únicos (IPs)</b></td><td><?= $totalIPs ?></td><td>Direcciones IP independientes que accedieron.</td></tr>
            <tr><td><b>Respuestas Exitosas (200 OK)</b></td><td><?= $pct200 ?>% (<?= $status200 ?>)</td><td>Peticiones procesadas correctamente.</td></tr>
            <tr><td><b>Errores de Cliente (404 Not Found)</b></td><td><?= $pct404 ?>% (<?= $status404 ?>)</td><td>Recursos no encontrados.</td></tr>
            <tr><td><b>Errores de Servidor (500 Error)</b></td><td><?= $pct500 ?>% (<?= $status500 ?>)</td><td>Fallos en Stored Procedures / Backend.</td></tr>
            <tr><td><b>Recurso Más Solicitado</b></td><td><?= htmlspecialchars($topUrl) ?></td><td>Página o API con mayor tráfico.</td></tr>
        </table>
    </div>
</body>
</html>
