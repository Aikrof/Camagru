<?php

session_start();

require_once __DIR__ . "/vendor/autoload.php";

use app\core\router\Router;
use app\Aplication;

(new Aplication())->run();
