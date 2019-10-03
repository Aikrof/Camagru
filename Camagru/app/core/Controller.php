<?php

namespace app\core;

use app\core\View;

abstract class Controller
{
	protected $route;
	protected $_view;
	public $_model;

	public function __construct($route)
	{
		$this->route = $route;
		$this->_view = new View($this->route);
		$this->_model = $this->loadModel($route['controller']);
	}

	public function loadModel($name)
	{
		$path = 'app\model\\' . ucfirst($name);
		if (class_exists($path))
			return (new $path);
	}
}