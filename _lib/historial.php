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
    $query = "SELECT SUM(precio) as total FROM tbl_comprobante";
    $result2 = mysqli_query($conn, $query);

    // No necesitas 'while' porque SUM() solo genera 1 fila
    $row2 = mysqli_fetch_assoc($result2);
    $totalAcumulado = $row2['total'] ?? 0;


    $sql = "SELECT documento, nombre, precio, fecha_registro 
    FROM tbl_comprobante";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result){
        while($row = $result->fetch_assoc()){
            $opciones[] = [
                'documento' => $row['documento'],
                'nombre'  => $row['nombre'],
                'precio'  => $row['precio'],
                'fecha' => $row['fecha_registro']
            ];
        }

        $var = 'bien';
    }else{
        $var = 'mal';
    }
    
}else{
    $var = 'mal';
}
$response = [
    'usuario' => $usuario,
    'role'    => $role,
    'name'    => $name,
    'total'   => $totalAcumulado,
    'datos'  => $opciones
];

ob_clean();
echo json_encode($response);
?>