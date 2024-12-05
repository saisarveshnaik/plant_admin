<?php
// Include the database connection
include_once './config/db.php'; // Assuming db.php contains the PDO connection

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Check if the request method is DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get the blog_id from the request
    $inputData = json_decode(file_get_contents("php://input"));
    
    if (isset($inputData->blog_id)) {
        $blog_id = $inputData->blog_id;

        // SQL query to delete the blog
        $sql = "DELETE FROM blogs WHERE blog_id = :blog_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':blog_id', $blog_id, PDO::PARAM_INT);

        // Execute the query and check if the blog was deleted
        if ($stmt->execute()) {
            echo json_encode(["message" => "Blog deleted successfully"]);
        } else {
            echo json_encode(["message" => "Failed to delete blog"]);
        }
    } else {
        echo json_encode(["message" => "Blog ID is required"]);
    }
} else {
    echo json_encode(["message" => "Invalid request method"]);
}

// Close the PDO connection
$pdo = null;
?>
