<?php
// Définition des en-têtes pour CORS
header("Access-Control-Allow-Origin: *"); // Autorise toutes les origines, ajustez si nécessaire
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Fonction pour envoyer une réponse JSON avec un code de statut
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

// Récupération de la méthode de requête et de l'endpoint
$requestMethod = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$endpoint = trim($uri, '/'); // Récupère le endpoint après le '/' initial

// Liste simulée des ressources (en vrai, vous récupérerez ces données depuis une base de données)
$resources = [
    ['id' => 1, 'name' => 'Ressource 1', 'description' => 'Description de la ressource 1'],
    ['id' => 2, 'name' => 'Ressource 2', 'description' => 'Description de la ressource 2'],
];

// Traitement des requêtes
switch ($endpoint) {
    case 'resource':  // Endpoint pour "resource"
        switch ($requestMethod) {
            case 'GET':
                // Retourne toutes les ressources
                sendJsonResponse($resources);

            case 'POST':
                // Création d'une nouvelle ressource
                $data = json_decode(file_get_contents('php://input'), true); // Récupère les données envoyées par le client
                if (!isset($data['name']) || empty($data['name'])) {
                    sendJsonResponse(['error' => 'Le champ "name" est requis.'], 400);
                }
                $newResource = [
                    'id' => count($resources) + 1, // Génère un nouvel ID
                    'name' => $data['name'],
                    'description' => $data['description'] ?? 'Aucune description'
                ];
                // Ajout de la nouvelle ressource à la liste simulée
                $resources[] = $newResource;
                sendJsonResponse(['message' => 'Ressource créée.', 'data' => $newResource], 201);

            default:
                sendJsonResponse(['error' => 'Méthode HTTP non autorisée pour cet endpoint.'], 405);
        }
        break;

    default:
        sendJsonResponse(['error' => 'Endpoint non trouvé.'], 404);
}
?>
