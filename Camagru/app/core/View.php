<?php

namespace app\core;

class View
{
	protected $route;
	public $path;
	public $layout = 'default';
	public $rootDir;
	public $user;
	public $admin;
	
	function __construct($route)
	{
		$this->route = $route;
		$this->path = lcfirst($route['action']);
		$this->rootDir = require_once("app/config/dir.php");
		if (isset($_SESSION['user']) && !empty($_SESSION['user']))
			$this->user = $_SESSION['user']['login'];
		else if (isset($_SESSION['admin']) && !empty($_SESSION['admin']))
			$this->admin = $_SESSION['admin']['login'];
	}

	public function render($vars = [])
	{
		extract($vars);
		$title = self::setTitle($this->route);
		$path = 'view/models/' . $this->path . '.php';
		if (file_exists($path))
		{
			ob_start();
			require_once($path);
			$content = ob_get_clean();
			require_once('view/models/' . $this->layout . '.php');
		}
		else
			self::errorCode(404);
	}

	public function message($message)
	{
		$message = json_encode($message);
		header('Content-Type: application/json; charset=utf-8');
		exit ($message);
	}

	public function location($url = "")
	{
		$url = '/' . $this->rootDir . '/' .$url;
		exit(json_encode(['url' => $url]));
	}

	public function redirect($url)
	{
		header('Location:' . '/' . $this->rootDir . '/' . $url);
		exit;
	}

	private static function setTitle($route)
	{
		$title = "Camagru";
		if ($route['action'] !== "Index")
			return ($title . " | " . $route['action']);
		else
			return ($title);
	}

	public static function errorCode($code)
	{
		http_response_code($code);
		$path = 'view/err/' . $code . '.php';
		if (file_exists($path))
			include($path);
		exit;
	}
}