<?php
session_start();
require_once '../db_config.php';

// Verificamos sesión por seguridad
if (!isset($_SESSION['usuario'])) {
    die("Acceso denegado.");
}

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    // Consultamos el documento binario
    $sql = "SELECT documento, nombre FROM tbl_comprobante WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $binario = $row['documento'];
        $nombre = $row['nombre'];

        // Como guardaste fotos de la cámara (base64 decode)
        // Enviamos el header de imagen para que el navegador la renderice
        header("Content-Type: image/png"); 
        header("Content-Disposition: inline; filename=\"$nombre.png\"");
        
        echo $binario;
        exit;
    }
}

echo "Archivo no encontrado.";
?>