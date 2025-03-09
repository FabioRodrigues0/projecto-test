<?php

use Slim\App;

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
