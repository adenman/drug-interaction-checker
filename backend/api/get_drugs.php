<?php
// Include the database connection file from the parent directory
require_once '../db.php';

$sql = "SELECT id, name FROM dic_drugs ORDER BY name ASC";
$result = $conn->query($sql);

$drugs = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $drugs[] = $row;
    }
}

// Set content type to JSON and output the data
header('Content-Type: application/json');
echo json_encode($drugs);

$conn->close();
?>