<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Allow cross-origin requests
header("Content-Security-Policy: script-src 'self' 'unsafe-eval';");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $image = $_FILES['image'] ?? null;

    // Validate the input fields
    if (empty($title) || empty($description) || !$image) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    // Handle the image upload
    $uploadDir = 'uploads/blog_images/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true); // Create directory if it doesn't exist
    }
    
    $imageName = basename($image['name']);
    $targetFilePath = $uploadDir . $imageName;

    // Check if the file is an image
    $imageFileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
    $allowedTypes = ['jpg', 'png', 'jpeg', 'gif'];
    if (!in_array($imageFileType, $allowedTypes)) {
        echo json_encode(['status' => 'error', 'message' => 'Only image files are allowed.']);
        exit;
    }

    // Move the uploaded image to the server folder
    if (!move_uploaded_file($image['tmp_name'], $targetFilePath)) {
        echo json_encode(['status' => 'error', 'message' => 'Image upload failed.']);
        exit;
    }

    // Include database connection
    include_once './config/db.php'; // Assuming db.php contains the PDO connection

    try {
        // Prepare and execute the SQL query with PDO
        $sql = "INSERT INTO blogs (blog_title, blog_description, blog_image) VALUES (:title, :description, :image)";
        $stmt = $pdo->prepare($sql);

        // Bind the parameters to avoid SQL injection
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':image', $targetFilePath);

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Blog added successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to insert data into the database.']);
        }
    } catch (PDOException $e) {
        // Output specific database error
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
