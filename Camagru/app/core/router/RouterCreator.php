<?php

namespace app\core\router;

use app\core\router\RouteValidator;
use app\core\View;

class RouterCreator
{
	public static function getRoute()
	{
		$route = array();
		$controller = 'Main';
		$action = 'Index';

		if (isset($_SERVER['PATH_INFO']))
		{
			$arr_uri = explode('/', trim($_SERVER['PATH_INFO'], '/'));

			if (count($arr_uri) > 2)
			{
				View::errorCode(404);
			}

			// $controller = ucfirst(strtolower($arr_uri[0]));

			if (isset($arr_uri[1]))
			{
				$controller = ucfirst(strtolower($arr_uri[0]));
				$action = "";
				$arr_action = explode('-', strtolower($arr_uri[1]));
				foreach ($arr_action as $key) {
					$action .= ucfirst($key);
				}
			}
			else
			{
				$action = "";
				$arr_action = explode('-', strtolower($arr_uri[0]));
				foreach ($arr_action as $key) {
					$action .= ucfirst($key);
				}
			}
		}
		return (RouteValidator::validate_route([
			'controller' => $controller,
			'action' => $action,
		]));
	}
}