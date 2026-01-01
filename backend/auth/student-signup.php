<?php

header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

error_log("Processing signup request");


require_once 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $dob = $_POST['dob'];

    if (empty($name) || empty($email) || empty($password) || empty($dob)) {
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "error", "message" => "Email already exists"]);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, dob) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $hashed_password, $dob]);
        
        echo json_encode(["status" => "success", "message" => "User registered successfully"]);
    } catch(PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Registration failed: " . $e->getMessage()]);
    }
} else {

    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>