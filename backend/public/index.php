<?php
require __DIR__ . "/../config/bootstrap.php";
require __DIR__ . "/../config/database.php";
require __DIR__ . "/../vendor/autoload.php";

use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ServerRequestFactory;

$app = AppFactory::create();
$app->addRoutingMiddleware();

// Middleware para permitir CORS
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader("Access-Control-Allow-Origin", "*")
        ->withHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        )
        ->withHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        )
        ->withHeader("Access-Control-Allow-Credentials", "true");
});

// Rota especial para capturar OPTIONS automaticamente e evitar erro 405
$app->options("/{routes:.+}", function ($request, $response) {
    return $response;
});
// Rota de Login
$app->post("/api/login", function ($request, $response) {
    $db = new Database();
    $conn = $db->getConnection();

    // Capturar e decodificar o JSON da requisição
    $data = json_decode($request->getBody()->getContents(), true);
    $email = $data["email"] ?? "";
    $password = $data["password"] ?? "";

    // Verificar se os campos estão preenchidos
    if (empty($email) || empty($password)) {
        $response
            ->getBody()
            ->write(json_encode(["error" => "Email e senha são obrigatórios"]));
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(400);
    }

    // Buscar o usuário no banco de dados
    $stmt = $conn->prepare(
        "SELECT id, name, password, is_verify FROM clients WHERE email = :email"
    );
    $stmt->execute(["email" => $email]);
    $user = $stmt->fetch();

    // Verificar se a senha está correta
    if ($user && password_verify($password, $user["password"])) {
        // Remover a senha do retorno por segurança
        unset($user["password"]);

        $response->getBody()->write(
            json_encode([
                "message" => "Login bem-sucedido!",
                "user" => $user,
            ])
        );
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(200);
    } else {
        $response
            ->getBody()
            ->write(json_encode(["error" => "Credenciais inválidas"]));
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(401);
    }
});

$app->post("/api/registro", function ($request, $response) {
    $db = new Database();
    $conn = $db->getConnection();

    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data["email"]) || !isset($data["password"])) {
        $response
            ->getBody()
            ->write(json_encode(["error" => "Email e senha são obrigatórios"]));
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(400);
    }

    $email = $data["email"];
    $password = password_hash($data["password"], PASSWORD_DEFAULT);

    // Gerar o nome a partir do email
    $nomeOriginal = explode("@", $email)[0];
    $nomeFormatado = str_replace([".", "_", "-"], " ", $nomeOriginal);
    $name = ucwords($nomeFormatado);

    $stmt = $conn->prepare(
        "INSERT INTO clients (name, email, password) VALUES (:name, :email, :password)"
    );
    $stmt->execute([
        "name" => $name,
        "email" => $email,
        "password" => $password,
    ]);

    $response
        ->getBody()
        ->write(json_encode(["message" => "Usuário cadastrado com sucesso!"]));
    return $response
        ->withHeader("Content-Type", "application/json")
        ->withStatus(201);
});

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

    // Buscar o usuário no banco de dados
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

// Rota para testar se api esta a funcionar
$app->get("/api/test", function ($request, $response) {
    $data = ["message" => "API Online!"];
    $response->getBody()->write(json_encode($data));
    return $response->withHeader("Content-Type", "application/json");
});

// Inicia o servidor Slim
$serverRequest = ServerRequestFactory::createFromGlobals();
$app->run($serverRequest);
