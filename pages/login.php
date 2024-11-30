<?php
// login.php

// Include database connection
include_once './config/db.php'; // Assuming db.php contains the connection to your MySQL database

// CORS settings
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Get JSON data from the client
$data = json_decode(file_get_contents("php://input"));

// Get the email and password from the client
$email = isset($data->email) ? $data->email : '';
$password = isset($data->password) ? $data->password : '';

// Check if email and password are provided
if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Email and Password are required."]);
    exit();
}

// Prepare the SQL query to check if the admin exists
$query = "SELECT * FROM admin WHERE email = :email";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':email', $email, PDO::PARAM_STR);
$stmt->execute();

// Check if a matching admin was found
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if ($admin) {
    // Verify the password (assuming password is hashed in the database)
    if (password_verify($password, $admin['password'])) {
        // Generate a JWT token (can use libraries like Firebase JWT)
        $secret_key = getenv('JWT_SECRET_KEY'); // Store secret key in an env variable or a config file
        $issued_at = time();
        $expiration_time = $issued_at + 3600;  // jwt valid for 1 hour from the issued time
        $payload = array(
            "iat" => $issued_at,
            "exp" => $expiration_time,
            "user_id" => $admin['id'],
            "email" => $admin['email']
        );

        // Encode the payload to create a JWT
        $jwt = jwtEncode($payload, $secret_key);

        // Return success response with the JWT token
        echo json_encode(["status" => "success", "message" => "Login successful", "token" => $jwt]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid password."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Admin not found."]);
}

// Function to encode the payload and generate the JWT token
function jwtEncode($payload, $secret_key) {
    $header = json_encode(["typ" => "JWT", "alg" => "HS256"]);
    $base64UrlHeader = base64UrlEncode($header);
    
    $base64UrlPayload = base64UrlEncode(json_encode($payload));
    
    // Create the signature
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true);
    $base64UrlSignature = base64UrlEncode($signature);

    // Combine the header, payload, and signature to create the final JWT
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

// Function to encode the data to Base64 URL format
function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
?>
