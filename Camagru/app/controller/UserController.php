<?php

namespace app\controller;

use app\core\Db;
use app\core\Controller;
use app\core\View;

class UserController extends Controller
{
	//page for registration
	public function actionRegistration()
	{
		if (isset($_SESSION['admin']))
			$this->_view->redirect('');
		else if (isset($_SESSION['user']) && !empty($_SESSION['user']))
			View::errorCode(404);

		$this->_view->render();
	}

	//login user
	public function actionGet()
	{
		if (!isset($_POST['data']) || !strlen($_POST['data']))
			View::errorCode(404);
		
		$json = json_decode($_POST['data'], true);

		if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest')
		{
			die($_POST['data']);
			View::errorCode(404);
		}

		if (!(preg_match("/^[a-zA-Z][a-zA-Z0-9_]{3,11}$/", $json['login'])))
		{
			$err['login'] = "Invalid login login: <span>" . $json['login'] . "</span>.";
			$this->_view->message($err);
		}

		if ($this->_model->checkAdmin($json))
		{
			$admin = [
				'login' => $json['login'],
			];
			$_SESSION['admin'] = $admin;
			$this->_view->location();
		}
		$result = $this->_model->getUser($json);

		if (isset($result['user']) && !empty($result['user']))
		{
			$_SESSION['user'] = $result['user'];

			$icon_name = explode('/', $_SESSION['user']['icon']);
			$icon_name = $icon_name[count($icon_name) - 1];

			if ($icon_name !== 'default_user_icon.png' && file_exists($_SESSION['user']['icon']))
			{
				$icon_path = $_SESSION['user']['icon'];
				$size = getimagesize($icon_path);
				$contents = file_get_contents($icon_path);
				$base = "data:image/" . $size['mime'] . ";base64," . base64_encode($contents);
				$_SESSION['user']['icon'] = $base;
			}

			$this->_view->location();
		}
		else
			$this->_view->message($result);
	}

	//registration user
	public function actionSet()
	{
		if (!isset($_POST['data']) || !strlen($_POST['data']))
			View::errorCode(404);

		$json = json_decode($_POST['data'], true);

		if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest')
		{
			die($_POST['data']);
			View::errorCode(404);
		}

		if ($json['password'] !== $json['confirm'])
			$insert = ['confirm' => "Those passwords didn't match."];
		else
			$insert = $this->_model->setUser($json);

		if (isset($insert['user']) && !empty($insert['user']))
			$this->_view->location();
		else
			$this->_view->message($insert);
	}

	//page for reset password and send email to reset password
	public function actionForgot()
	{
		if ((isset($_SESSION['user']) && !empty($_SESSION['user'])) ||
			 isset($_SESSION['admin']))
			View::errorCode(404);
		else if (isset($_POST['data']) || !empty($_POST['data']))
		{
			$json = json_decode($_POST['data'], true);
			$result = $this->_model->forgotPasswd($json);

			if (isset($result['user']) && !empty($result['user']))
				$this->_view->location();
			else
				$this->_view->message($result);
		}
		else
			$this->_view->render();
	}

	//page for activation user when he confirm link on his email
	public function actionActivation($token)
	{
		if (isset($token) && (isset($_GET['token']) && !empty($_GET['token'])) && $token === $_GET['token'])
		{
			$token = base64_decode($token);
			if ($this->_model->validActivation($token))
			{
				$this->_view->render();
			}
			else 
				View::errorCode(404);
		}
		else
			View::errorCode(404);
	}

	public function actionResend()
	{
		if ((isset($_SESSION['user']) && !empty($_SESSION['user'])) ||
			 isset($_SESSION['admin']))
			View::errorCode(404);
		else if (isset($_POST['data']) || !empty($_POST['data']))
		{
			$json = json_decode($_POST['data'], true);
			$result = $this->_model->resendActivation($json);

			if (isset($result['user']) && !empty($result['user']))
				$this->_view->location();
			else
				$this->_view->message($result);
		}
		else
			$this->_view->render();
	}
}
