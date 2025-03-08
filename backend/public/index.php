<?php
require __DIR__ . "/../config/bootstrap.php";
require __DIR__ . "/../config/database.php";
require __DIR__ . "/../vendor/autoload.php";

use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ServerRequestFactory;
use Dotenv\Parser\Value;

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

    // Select do user na base de dados
    $stmt = $conn->prepare(
        "SELECT id, name, password, email, is_verify FROM clients WHERE email = :email"
    );
    $stmt->execute(["email" => $email]);
    $user = $stmt->fetch();

    // Verificar se a password está correta
    if ($user && password_verify($password, $user["password"])) {
        // Remover a password do retorno por segurança
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

// Rota para dar update ao user
$app->put("/api/user", function ($request, $response) {
    $db = new Database();
    $conn = $db->getConnection();

    // pegar no id que foi passado na query string
    $data = json_decode($request->getBody()->getContents(), true);
    $id = $data["id"] ?? "";

    // Verificar se os campos estão preenchidos
    if (empty($id) || empty($data["name"]) || empty($data["email"])) {
        $response
            ->getBody()
            ->write(json_encode(["error" => "Campos obrigatórios"]));
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(400);
    }

    // Atualizar o user no banco de dados
    $stmt = $conn->prepare(
        "UPDATE clients SET name = :name, email = :email, is_verify = :is_verify WHERE id = :id"
    );
    $stmt->execute([
        "id" => $id,
        "name" => $data["name"],
        "email" => $data["email"],
        "is_verify" => $data["is_verify"],
    ]);

    $response
        ->getBody()
        ->write(json_encode(["message" => "Usuário atualizado com sucesso"]));
    return $response
        ->withHeader("Content-Type", "application/json")
        ->withStatus(200);
});

// Alterar o campo is_verify do user
$app->patch("/api/user/verify", function ($request, $response) {
    $db = new Database();
    $conn = $db->getConnection();

    $data = json_decode($request->getBody()->getContents(), true);
    $id = $data["id"] ?? "";

    if (empty($id)) {
        $response
            ->getBody()
            ->write(json_encode(["error" => "Id do cliente é obrigatórios"]));
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(400);
    }

    $stmt = $conn->prepare("UPDATE clients SET is_verify = 1 WHERE id = :id");
    $stmt->execute([
        "id" => $id,
        "is_verify" => $data["is_verify"],
    ]);

    $response
        ->getBody()
        ->write(json_encode(["message" => "Usuário atualizado com sucesso"]));
    return $response
        ->withHeader("Content-Type", "application/json")
        ->withStatus(200);
});

// pedir para ser verificado
$app->post("/api/get-verify", function ($request, $response) {
    $data = json_decode($request->getBody()->getContents(), true);
    $number = $data["number"] ?? "";

    $apiKey = $_ENV["WHAPI_TOKEN "];
    $whatsapp = new WhatsAppAPI($apiKey);

    $codigo = rand(100000, 999999); // Gera um código aleatório

    $mensagem = "Seu código de verificação é: *$codigo*";

    $response = $whatsapp->sendMessage($number, $mensagem);

    if ($response->status === "success") {
        echo "Código enviado com sucesso!";
    } else {
        echo "Erro ao enviar: " . $response->message;
    }
});

// Inicia o servidor Slim
$serverRequest = ServerRequestFactory::createFromGlobals();
$app->run($serverRequest);
