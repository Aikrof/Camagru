<?php

namespace app\core\router;

use app\core\router\RouterCreator;

class Router
{
	protected $_rote = array();

	function __construct()
	{
		$this->_rote = RouterCreator::getRoute();
	}
	public function getController()
	{
		return ($this->_rote['controller']);
	}
	public function getAction()
	{
		return ($this->_rote['action']);
	}
}