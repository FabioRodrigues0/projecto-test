<?php
require __DIR__ . "/../config/bootstrap.php";
require __DIR__ . "/../config/database.php";
require __DIR__ . "/../vendor/autoload.php";
require __DIR__ . "/../routes/register.php";

use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ServerRequestFactory;
use Routes\Register;

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

// Registrar as rotas
Register::registerRoutes($app);

// Inicia o servidor Slim
$serverRequest = ServerRequestFactory::createFromGlobals();
$app->run($serverRequest);
