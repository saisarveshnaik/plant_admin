<?php
// Include the database connection
require_once './config/db.php';

// Set response header to JSON
header('Content-Type: application/json');

// Set CORS headers
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin
header('Access-Control-Allow-Methods: GET, OPTIONS'); // Allow specific HTTP methods
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
    "data" => []
];

try {
    // Fetch all data if no ID is passed
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Check if an individual id is provided
        if (isset($_GET['id'])) {
            $id = $_GET['id'];

            // Prepare SQL to fetch data by ID
            $stmt = $pdo->prepare("SELECT * FROM join_us_form WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($data) {
                $response['success'] = true;
                $response['data'] = $data;
                $response['message'] = "Data retrieved successfully.";
            } else {
                $response['message'] = "No data found for the given ID.";
            }
        } else {
            // Prepare SQL to fetch all records
            $stmt = $pdo->prepare("SELECT * FROM join_us_form");
            $stmt->execute();

            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($data) {
                $response['success'] = true;
                $response['data'] = $data;
                $response['message'] = "Data retrieved successfully.";
            } else {
                $response['message'] = "No data found.";
            }
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
