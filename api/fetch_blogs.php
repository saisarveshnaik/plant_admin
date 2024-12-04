<?php
// Include the database connection
include_once './config/db.php'; // Assuming db.php contains the PDO connection

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Fetch all blogs
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['blog_id'])) {
    $sql = "SELECT blog_id, blog_title, blog_description, blog_image FROM blogs";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Remove backslashes from image paths (if any)
    foreach ($blogs as &$blog) {
        $blog['blog_image'] = str_replace('\/', '/', $blog['blog_image']); // Fix the path
    }

    if ($blogs) {
        echo json_encode($blogs, JSON_UNESCAPED_SLASHES);  // Prevent escaping slashes
    } else {
        echo json_encode(["message" => "No blogs found"]);
    }
}

// Fetch individual blog by blog_id
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['blog_id'])) {
    $blog_id = $_GET['blog_id'];
    $sql = "SELECT blog_id, blog_title, blog_description, blog_image FROM blogs WHERE blog_id = :blog_id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':blog_id', $blog_id, PDO::PARAM_INT);
    $stmt->execute();

    $blog = $stmt->fetch(PDO::FETCH_ASSOC);

    // Remove backslashes from image paths (if any)
    if ($blog) {
        $blog['blog_image'] = str_replace('\/', '/', $blog['blog_image']); // Fix the path
        echo json_encode($blog, JSON_UNESCAPED_SLASHES);  // Prevent escaping slashes
    } else {
        echo json_encode(["message" => "Blog not found"]);
    }
}

// Close the PDO connection
$pdo = null;
?>
