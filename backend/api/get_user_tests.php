<?php
// FILE: backend/api/get_user_tests.php

session_start();
require_once '../db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized. Please log in."]);
    exit();
}

$user_id = $_SESSION['user_id'];

// SQL query to get all tests and their associated drugs for the logged-in user
$sql = "
    SELECT 
        ut.id AS test_id, 
        ut.test_name, 
        ut.created_at, 
        GROUP_CONCAT(d.name ORDER BY d.name SEPARATOR ', ') AS drugs
    FROM dic_user_tests ut
    JOIN dic_test_drugs td ON ut.id = td.test_id
    JOIN dic_drugs d ON td.drug_id = d.id
    WHERE ut.user_id = ?
    GROUP BY ut.id, ut.test_name, ut.created_at
    ORDER BY ut.created_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$tests = [];
while ($row = $result->fetch_assoc()) {
    $tests[] = $row;
}

header('Content-Type: application/json');
echo json_encode($tests);

$stmt->close();
$conn->close();
?>