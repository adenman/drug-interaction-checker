<?php
// FILE: backend/api/register.php

require_once '../db.php';

// Get the posted data.
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Username and password are required."]);
    exit();
}

$username = trim($data->username);
$password = trim($data->password);

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "Username and password cannot be empty."]);
    exit();
}

// Hash the password for security
$password_hash = password_hash($password, PASSWORD_BCRYPT);

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO dic_users (username, password) VALUES (?, ?)");
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["message" => "Database prepare failed: " . $conn->error]);
    exit();
}
$stmt->bind_param("ss", $username, $password_hash);

// Execute the statement
if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["message" => "User registered successfully."]);
} else {
    // Check for duplicate entry
    if ($conn->errno == 1062) {
        http_response_code(409);
        echo json_encode(["message" => "Username already exists."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error registering user: " . $stmt->error]);
    }
}

$stmt->close();
$conn->close();
?>