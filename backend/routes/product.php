<?php

use Slim\App;

// Rota listar produtos do cliente
$app->get("/api/client/products", function ($request, $response) {
    $db = new Database();
    $conn = $db->getConnection();

    // Capturar e decodificar o JSON da requisição
    $queryParams = $request->getQueryParams();
    $id = $queryParams["id"] ?? "";

    // Verificar se os campos estão preenchidos
    if (empty($id)) {
        $response
            ->getBody()
            ->write(json_encode(["error" => "Id do cliente é obrigatórios"]));
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(400);
    }

    // Pegar produtos do cliente do id fornecido no banco de dados
    $stmt = $conn->prepare(
        "SELECT s.id, s.clients_id, s.products_id, p.name, p.description, p.image_url
            FROM subscriptions as s
            INNER JOIN products as p ON s.products_id = p.id
            WHERE s.clients_id = :id;"
    );
    $stmt->execute(["id" => $id]);
    $produts = $stmt->fetchAll();

    if (!empty($produts)) {
        $response->getBody()->write(
            json_encode([
                "message" => "Produtos",
                "products" => $produts,
            ])
        );

        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(200);
    }
    return $response()
        ->json(["message" => "Products not found"])
        ->withHeader("Content-Type", "application/json")
        ->withStatus(404);
});
