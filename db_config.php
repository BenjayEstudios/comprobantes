<?php

// Datos de tu base de datos
$db_host = 'localhost';
$db_user = 'root'; 
$db_pass = ''; 
$db_name = 'db_comprobantes';

// Crear una conexión global a la base de datos
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Verificar la conexión y detener la ejecución si hay un error
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

?>