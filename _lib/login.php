<?php
session_start();

require_once '../db_config.php'; // require_once '../../../db_config.php';

header('Content-Type: application/json');

// 1. Descomenta las entradas para que las variables existan
$usuario = trim($_POST['usuario'] ?? 'test_user');
$pswd    = trim($_POST['pswd'] ?? 'test_pass');

$response   = ['success'=>false,'mensaje'=>''];

if($usuario && $pswd){
    $sql = "SELECT usuario, role, name FROM tbl_usuarios WHERE usuario=? AND pswd=SHA2(?,256) AND active=1 LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss",$usuario,$pswd);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result && $result->num_rows===1){
        $data = $result->fetch_assoc();
        $_SESSION['usuario']    = $data['usuario'];
        $_SESSION['role']       = $data['role'];
        $_SESSION['name']       = $data['name'];
        $response['success']    = true;
        $response['mensaje']    = "✅ Inicio de sesión exitoso!";
        $response['redirect']   = "menu/index.html"; # Redirigir a menu principal
    } else {
        $response['mensaje']    = "⚠️ Usuario o contraseña incorrectos.";
    }
} else {
    $response['mensaje']        = "⚠️ Completa todos los campos.";
}

// Limpia cualquier buffer de salida previo para evitar que se cuelen errores HTML
ob_clean();

echo json_encode($response);