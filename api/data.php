<?php
// Définition des en-têtes pour CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Fonction pour envoyer une réponse JSON avec un code de statut
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

// Traitement de la méthode GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Exemple de données à retourner
    $data = [
        [
            'name' => 'Jean Dupont',
            'email' => 'jean.dupont@example.com'
        ],
        [
            'name' => 'Marie Curie',
            'email' => 'marie.curie@example.com'
        ]
    ];
    
    // Retourner les données en JSON
    sendJsonResponse($data);
}

// Vérification si la méthode est bien POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = [];

    // Traitement des fichiers
    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        if ($file['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true); // Crée le répertoire si nécessaire
            }

            $destination = $uploadDir . basename($file['name']);
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                $response['file'] = $destination;
            } else {
                $response['file_error'] = 'Erreur lors du déplacement du fichier.';
            }
        } else {
            $response['file_error'] = 'Erreur lors du téléchargement du fichier.';
        }
    }

    // Traitement des autres données (ex : nom, email)
    if (isset($_POST['name'])) {
        $response['name'] = $_POST['name'];
    }
    if (isset($_POST['email'])) {
        $response['email'] = $_POST['email'];
    }

    // Retourner la réponse JSON
    sendJsonResponse($response, 200);
} 

sendJsonResponse(['error' => 'Méthode HTTP non autorisée'], 405);
?>
