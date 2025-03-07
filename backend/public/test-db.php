<?php
require __DIR__ . "/../config/database.php";

$db = new Database();
$conn = $db->getConnection();

$query = $conn->query("SELECT 'Conexão bem-sucedida!' AS mensagem");
$result = $query->fetch();

echo json_encode($result);
