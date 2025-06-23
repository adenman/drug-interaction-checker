<?php
// Set headers for CORS (Cross-Origin Resource Sharing)
// This allows your React frontend (on a different port) to talk to your PHP backend
header("Access-Control-Allow-Origin: *"); // For local dev; in production, restrict to your domain
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// --- DATABASE CREDENTIALS ---
// Replace with your actual database details
$host = 'localhost';
$db_name = 'ocbenjic_Aden';     // Your database name from DBeaver
$username = 'ocbenjic_Aden';   // Your database username
$password = 'god578Aden!'; // Your database password

// --- ESTABLISH CONNECTION ---
$conn = new mysqli($host, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>