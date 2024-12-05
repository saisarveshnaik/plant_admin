<?php
// Include the database connection
require_once './config/db.php';

// Set response header to JSON
header('Content-Type: application/json');

// Set CORS headers
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Allow specific HTTP methods
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allow specific headers

// Handle preflight requests (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Initialize response array
$response = [
    "success" => false,
    "message" => "",
];

try {
    // Check if the request method is POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Retrieve input data
        $id = $_POST['id'] ?? null;

        // Validate ID
        if (!$id) {
            throw new Exception("ID is required.");
        }

        // Prepare the SQL query to delete the record
        $stmt = $pdo->prepare("DELETE FROM join_us_form WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        
        // Execute the query
        if ($stmt->execute()) {
            // Set success response
            $response['success'] = true;
            $response['message'] = "Form deleted successfully.";
        } else {
            throw new Exception("Failed to delete form.");
        }
    } else {
        throw new Exception("Invalid request method.");
    }
} catch (Exception $e) {
    // Handle errors
    $response['message'] = $e->getMessage();
}

// Send JSON response
echo json_encode($response);
?>
