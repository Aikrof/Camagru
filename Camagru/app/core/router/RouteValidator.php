<?php

namespace app\core\router;

use app\core\View;

class RouteValidator
{

	private static function paramCompare($controller, $action)
	{
		$method = new \ReflectionMethod($controller, $action);
		$argc = $method->getParameters();
		if (count($argc) != count($_GET))
		{
			return (false);
		}
		foreach ($argc as $arg) {
			if (!self::checkGetWithArg($arg->name))
			{
				return (false);
			}
		}
		return (true);
	}

	private static function checkGetWithArg($arg)
	{
		foreach ($_GET as $get => $val) {
			if ($get == $arg)
			{
				return (true);
			}
		}
		return (false);
	}

	public static function validate_route($route)
	{
		$controller = "\\app\\controller\\" . $route['controller'] . "Controller";
		$action = 'action' . $route['action'];

		if (!class_exists($controller) ||
			!method_exists($controller, $action) ||
			!self::paramCompare($controller, $action))
		{
			View::errorCode(404);
		}
		return ($route);
	}
}