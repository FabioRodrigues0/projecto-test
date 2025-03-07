<?php

use Dotenv\Parser\Value;

require __DIR__ . "/bootstrap.php"; // Importa variáveis do .env

class Database
{
    private $pdo;

    public function __construct()
    {
        $host = $_ENV["DB_HOST"];
        $port = (int) $_ENV["DB_PORT"];
        $dbname = $_ENV["DB_NAME"];
        $user = $_ENV["DB_USER"];
        $pass = $_ENV["DB_PASS"];
        $charset = $_ENV["DB_CHARSET"];

        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $this->pdo = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            die("Erro na conexão: " . $e->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->pdo;
    }
}
