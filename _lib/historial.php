<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
require_once '../db_config.php';
header('Content-Type: application/json');

// Usamos el operador null coalescing (??) para evitar errores si la sesión expiró
$usuario = $_SESSION['usuario'] ?? null;
$role    = $_SESSION['role']    ?? null;
$name    = $_SESSION['name']    ?? null;
$opciones = array();

if($role){
    // 1. CORRECCIÓN SQL: Cambiamos "role_access=$role" por "?" para usar bind_param
    // 2. RECOMENDACIÓN: Usamos FIND_IN_SET si un menú puede pertenecer a varios roles (ej: 'admin,user')
    $sql = "SELECT nombre, precio, documento, fecha_registro 
    FROM tbl_comprobante";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $role);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result){
        while($row = $result->fetch_assoc()){
            $opciones[] = [
                'nombre'  => $row['nombre'],
                'precio'  => $row['precio'],
                'documento' => $row['documento'],
                'url' => $row['fecha_registro']
            ];
        }
    }
}
$response = [
    'usuario' => $usuario,
    'role'    => $role,
    'name'    => $name,
    'datos'    => $opciones  // 3. CORRECCIÓN: Quitamos los [] para mandar el array completo, no uno vacío.
];

ob_clean();
echo json_encode($response);
?>