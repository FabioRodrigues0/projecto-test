<?php
namespace Routes;

use Slim\App;

class Register
{
    public static function registerRoutes(App $app)
    {
        require __DIR__ . "/auth.php";
        require __DIR__ . "/product.php";
        require __DIR__ . "/client.php";
    }
}
