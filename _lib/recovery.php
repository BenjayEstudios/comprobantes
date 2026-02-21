<?php
require_once '../db_config.php'; 

header('Content-Type: application/json');
ob_start();

$usuario = trim($_POST['usuario'] ?? '');
$response = ['success' => false, 'mensaje' => ''];

if ($usuario) {
    // 1. Verificar si el usuario existe y está activo
    $sql = "SELECT email FROM tbl_usuarios WHERE (usuario=? OR email=?) AND active=1 LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $usuario, $usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows === 1) {
        $user_data = $result->fetch_assoc();
        $email_destino = $user_data['email'];

        // AQUÍ IRÍA LA LÓGICA DE ENVÍO DE EMAIL (PHPMailer por ejemplo)
        // Por ahora simulamos éxito:
        
        $response['success'] = true;
        $response['mensaje'] = "✅ Si el usuario existe, se enviará un correo a: " . ocultarEmail($email_destino);
    } else {
        // Por seguridad, a veces es mejor dar el mismo mensaje que si existiera
        $response['mensaje'] = "⚠️ No se encontró una cuenta asociada a ese usuario.";
    }
} else {
    $response['mensaje'] = "⚠️ Por favor, ingresa tu usuario.";
}

function ocultarEmail($email) {
    $em   = explode("@", $email);
    $name = implode('@', array_slice($em, 0, count($em)-1));
    $len  = floor(strlen($name) / 2);
    return substr($name, 0, $len) . str_repeat('*', $len) . "@" . end($em);
}

ob_clean();
echo json_encode($response);