<?php
// FILE: backend/api/login.php

// Start session to store user data
session_start();
require_once '../db.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Username and password are required."]);
    exit();
}

$username = $data->username;
$password = $data->password;

// Prepare statement to prevent SQL injection
$stmt = $conn->prepare("SELECT id, username, password FROM dic_users WHERE username = ?");
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["message" => "Database prepare failed: " . $conn->error]);
    exit();
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Verify user exists and password is correct
if ($user && password_verify($password, $user['password'])) {
    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];

    http_response_code(200);
    echo json_encode([
        "message" => "Login successful.",
        "user_id" => $user['id'],
        "username" => $user['username']
    ]);
} else {
    http_response_code(401);
    echo json_encode(["message" => "Invalid username or password."]);
}

$stmt->close();
$conn->close();
?>