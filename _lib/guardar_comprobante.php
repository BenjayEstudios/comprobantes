<?php
session_start();
require_once '../db_config.php';
header('Content-Type: application/json');

$response = ['success' => false, 'mensaje' => ''];

// Verificamos que el usuario esté logueado
if (!isset($_SESSION['usuario'])) {
    $response['mensaje'] = "Sesión no iniciada";
    echo json_encode($response);
    exit;
}

if (isset($_POST['imagen'])) {
    $imgRaw     = $_POST['imagen'];
    $nombre     = trim($_POST['nombre']);
    $precio     = $_POST['precio'];
    $digitador  = $_SESSION['name'];

    $partes = explode(',', $imgRaw);
    $imgData = count($partes) > 1 ? $partes[1] : $partes[0];
    $binario = base64_decode($imgData);
    // 1. Limpiar el string Base64 (quitar el encabezado de data:image)
    // $imgData = str_replace('data:image/png;base64,', '', $imgRaw);
    // $imgData = str_replace(' ', '+', $imgData);
    // $binario = base64_decode($imgData);

    // 2. Preparar SQL (Usamos 's' para el blob ya que enviamos los datos binarios)
    $sql = "INSERT INTO tbl_comprobante (nombre, precio, documento, digitador) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    // 's' para strings, 'd' para decimal/double, 'b' para blob
    // Nota: send_long_data es mejor para archivos grandes, pero para fotos 720p bind_param funciona bien.
    $stmt->bind_param("sdss", $nombre, $precio, $binario, $digitador);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['mensaje'] = "Comprobante guardado correctamente.";
    } else {
        $response['mensaje'] = "Error en DB: " . $conn->error;
    }
} else {
    $response['mensaje'] = "No se recibió ninguna imagen.";
}

ob_clean();
echo json_encode($response);