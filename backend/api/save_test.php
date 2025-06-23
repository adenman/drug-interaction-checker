<?php
// FILE: backend/api/save_test.php

session_start();
require_once '../db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized. Please log in to save a test."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->test_name) || !isset($data->drug_ids) || !is_array($data->drug_ids)) {
    http_response_code(400);
    echo json_encode(["message" => "Test name and an array of drug IDs are required."]);
    exit();
}

$user_id = $_SESSION['user_id'];
$test_name = trim($data->test_name);
$drug_ids = $data->drug_ids;

if (empty($test_name) || empty($drug_ids)) {
    http_response_code(400);
    echo json_encode(["message" => "Test name and at least one drug are required."]);
    exit();
}

// Use a transaction to ensure all queries succeed or none do
$conn->begin_transaction();

try {
    // Insert into user_tests table
    $stmt1 = $conn->prepare("INSERT INTO dic_user_tests (user_id, test_name) VALUES (?, ?)");
    $stmt1->bind_param("is", $user_id, $test_name);
    $stmt1->execute();
    
    // Get the ID of the test we just inserted
    $test_id = $stmt1->insert_id;
    $stmt1->close();

    // Insert each drug into the test_drugs table
    $stmt2 = $conn->prepare("INSERT INTO dic_test_drugs (test_id, drug_id) VALUES (?, ?)");
    foreach ($drug_ids as $drug_id) {
        $stmt2->bind_param("ii", $test_id, $drug_id);
        $stmt2->execute();
    }
    $stmt2->close();

    // If we got this far, commit the transaction
    $conn->commit();
    http_response_code(201);
    echo json_encode(["message" => "Test saved successfully.", "test_id" => $test_id]);

} catch (mysqli_sql_exception $exception) {
    // An error occurred, roll back the transaction
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["message" => "Failed to save test.", "error" => $exception->getMessage()]);
}

$conn->close();
?>