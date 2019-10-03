<?php

namespace app;

use app\core\router\Router;

class Aplication
{
	private $path = "\\app\\controller\\";
	private $action = 'action';
	private $_route = [];

	function __construct()
	{
		$router = new Router();

		$this->path .= $router->getController() . "Controller";
		$this->action .= $router->getAction();
		$this->route = [
			'controller' => $router->getController(),
			'action' => $router->getAction(),
		];
	}
	public function run()
	{
		call_user_func_array([
			new $this->path($this->route),
			$this->action,
		], $_GET);
	}
}