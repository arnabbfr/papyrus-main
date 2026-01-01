<?php

$host = "localhost"; 
$dbname = "user_authentication"; 
$username = "root"; 
$password = ""; 

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $conn->exec("SET NAMES utf8");
    
} catch(PDOException $e) {
    error_log("Connection failed: " . $e->getMessage());
    
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}
?>