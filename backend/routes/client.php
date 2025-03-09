<?php

use Slim\App;

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
$app->post("/api/user/verify", function ($request, $response) {
    $db = new Database();
    $conn = $db->getConnection();

    $data = json_decode($request->getBody()->getContents(), true);
    $id = $data["id"] ?? "";
    $codigo = $data["codigoVerificacao"] ?? "";

    // Verifica se o id e o código de verificação estão presentes
    if (empty($id) && empty($codigo)) {
        $response->getBody()->write(
            json_encode([
                "error" =>
                    "Id do cliente e código de verificação são obrigatórios",
            ])
        );
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(400);
    }

    // Recupera o codigo que tinha sido guardado no cache
    $cache = $db->dbcache();
    $result = $cache->exec(
        "SELECT * FROM verification_codes WHERE client_id = $id and code = $codigo"
    );

    // Se retornou true e porque esta certo
    if ($result) {
        // update coluna is_verify
        $stmt = $conn->prepare(
            "UPDATE clients SET is_verify = :is_verify WHERE id = :id"
        );

        $stmt->execute([
            "id" => $id,
            "is_verify" => 1,
        ]);

        // limpa cache
        $cache->exec("TRUNCATE TABLE verification_codes;");

        $response
            ->getBody()
            ->write(
                json_encode(["message" => "Usuário atualizado com sucesso"])
            );
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(200);
    } else {
        $response->getBody()->write(
            json_encode([
                "error" => "Cache expirado ou não encontrado.",
            ])
        );
    }
});

// pedir para ser verificado
$app->post("/api/get-verify", function ($request, $response) {
    $data = json_decode($request->getBody()->getContents(), true);
    $number = $data["clientNumber"] ?? "";
    $id = $data["id"] ?? "";

    // Pegar o token do env
    $apiKey = $_ENV["WHAPI_TOKEN"];

    // gerar codigo
    $codigo = rand(100000, 999999);

    $mensagem = "Seu código de verificação é: $codigo";

    $client = new \GuzzleHttp\Client();
    try {
        $response = $client->request(
            "POST",
            "https://gate.whapi.cloud/messages/text",
            [
                "body" =>
                    '{"typing_time": 0,"to":"351' .
                    $number .
                    '","body":"' .
                    $mensagem .
                    '"}',
                "headers" => [
                    "accept" => "application/json",
                    "authorization" => "Bearer " . $apiKey,
                    "content-type" => "application/json",
                ],
            ]
        );

        if (!empty($response)) {
            $db = new Database();
            $cache = $db->dbcache();

            // Armazenar o código na cache
            $stmt = $cache->prepare(
                "INSERT INTO verification_codes (number, code, timestamp, client_id) VALUES (:number, :code, :timestamp, :client_id)"
            );

            $stmt->execute([
                ":number" => $number,
                ":code" => $codigo,
                ":timestamp" => time(),
                ":client_id" => $id,
            ]);

            $response->getBody()->write(
                json_encode([
                    "message" => "Código enviado com sucesso!",
                ])
            );
            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(200);
        } else {
            $response->getBody()->write(
                json_encode([
                    "error" => "Erro ao enviar: " . $response->message,
                ])
            );
            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(400);
        }
    } catch (\Exception $e) {
        $response->getBody()->write(
            json_encode([
                "error" => "Erro ao enviar: " . $response->message,
            ])
        );
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(500);
    }
});
