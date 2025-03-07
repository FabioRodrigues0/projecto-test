<?php
require __DIR__ . "/../vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

// Define constantes apenas se ainda não foram definidas
if (!defined("APP_NAME")) {
    define("APP_NAME", $_ENV["APP_NAME"]);
}
if (!defined("APP_ENV")) {
    define("APP_ENV", $_ENV["APP_ENV"]);
}
if (!defined("APP_DEBUG")) {
    define("APP_DEBUG", $_ENV["APP_DEBUG"]);
}
