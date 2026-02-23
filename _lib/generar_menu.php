<?php
session_start();
require_once '../db_config.php';    # conexion a la base de datos
header('Content-Type: application/json');

// Usamos el operador null coalescing (??) para evitar errores si la sesión expiró
$usuario = $_SESSION['usuario'] ?? null;
$role    = $_SESSION['role']    ?? null;
$name    = $_SESSION['name']    ?? null;
$opciones = array();

if($role){  # si el rol existe, entonces consultamos el menú

    $stmt = $conn->prepare("SELECT icon, link, label FROM tbl_menu WHERE role_access='$role' AND active=1 ORDER BY orden ASC");
    $stmt->execute();
    $result = $stmt->get_result();
    if($result){
        while($row = $result->fetch_assoc()){
            $opciones[] = [
                'icon'  => $row['icon'],
                'link'  => $row['link'],
                'label' => $row['label']
            ];
        }
    }
}

$response = [
    'usuario' => $usuario,
    'role'    => $role,
    'name'    => $name,
    'menu'    => $opciones
];

ob_clean();
echo json_encode($response);    # devolvemos el JSON con los datos del usuario y el menú correspondiente a su rol

