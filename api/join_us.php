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
        $name = $_POST['name'] ?? null;
        $email = $_POST['email'] ?? null;
        $location = $_POST['location'] ?? null;
        $designation = $_POST['designation'] ?? null;
        $cv = $_FILES['cv'] ?? null;
        $cover = $_POST['cover'] ?? null;

        // Validate required fields
        if (!$name || !$email || !$location || !$designation || !$cv || !$cover) {
            throw new Exception("All fields are required.");
        }

        // Validate and upload CV file
        $cvPath = 'uploads/cv_images/' . basename($cv['name']);
        if (!move_uploaded_file($cv['tmp_name'], $cvPath)) {
            throw new Exception("Failed to upload CV.");
        }

        // Insert data into the database
        $stmt = $pdo->prepare("
            INSERT INTO join_us_form (name, email, location, designation, cv, cover) 
            VALUES (:name, :email, :location, :designation, :cv, :cover)
        ");
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':location' => $location,
            ':designation' => $designation,
            ':cv' => $cvPath,
            ':cover' => $cover,
        ]);

        // Set success response
        $response['success'] = true;
        $response['message'] = "Form submitted successfully.";
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
