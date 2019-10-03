<?php

namespace app\controller;

use app\core\Db;
use app\core\Controller;
use app\core\View;

class MainController extends Controller
{
	public function actionIndex()
	{
		if (isset($_POST['val']) && !empty($_POST['val']))
		{
			$json = json_decode($_POST['val']);

			$result = $this->_model->getContent($json);
			exit(json_encode($result));
		}
		$arr = ['global' => 1];

		$this->_view->render($arr);
	}

//Set new Icon in user menu
	public function actionSetIcon()
	{
		if ((isset($_POST['icon']) && !empty($_POST['icon']) &&
			($_FILES['icon']['tmp_name'] && $_FILES['icon']['name'])))
		{
			$service = include('app/service_func/fileChecker.php');

			$user_img = $_FILES['icon'];
			$filePath  = $_FILES['icon']['tmp_name'];
			$errorCode = $_FILES['icon']['error'];
			$mime = getimagesize($filePath);
	
			$outputMessage = checkFile($errorCode, $filePath, $user_img, $mime['mime']);
			if (!empty($outputMessage))
				$this->_view->message($outputMessage);

			$contents = file_get_contents($filePath);
			$result = $this->_model->saveIcon($contents, $user_img['type']);

			if ($result)
			{
				$path = $result['path'];

				$image = getimagesize($path);
				$contents = file_get_contents($path);
				$base = "data:image/" . $image['mime'] . ";base64," . base64_encode($contents);

				$_SESSION['user']['icon'] = $base;
				
				$path = ['src' => $base];
				exit(json_encode($path));
			}
			exit();
		}
		else
			View::errorCode(404);
	}

//get friends list
	public function actionGetFriendsList()
	{
		if (isset($_POST['getFriends']) && empty($_POST['getFriends']))
		{
			$id = $_SESSION['user']['id'];

			$result = $this->_model->getUserFriends($id);
			exit(json_encode($result));
		}
		else
			View::errorCode(404);
	}
//Send or don't save emails
	public function actionChangeSend()
	{
		if (isset($_POST['change']) && empty($_POST['change']))
			$this->_model->changeSend();
		else
			View::errorCode(404);
	}

//Change Password and E-mail
	public function actionChange()
	{
		if (isset($_POST['data']) && !empty($_POST['data']))
		{
			$json = json_decode($_POST['data'], true);

			if (isset($json['new_password']) && !empty($json['new_password']))
				$result = $this->_model->change_password($json);
			else if (isset($json['email']) && !empty($json['email']))
				$result = $this->_model->change_email($json);
			else if (isset($json['login']) && !empty($json['login']))
				$result = $this->_model->change_login($json);

			if (!$result)
				$result = ['err' => "Undefined Error."];

			exit(json_encode($result));
		}
		else
			View::errorCode(404);
	}

//log out in user menu
	public function actionExit()
	{
		if (isset($_POST['exit']))
		{
			if (isset($_SESSION['user']))
				unset($_SESSION['user']);
			else if (isset($_SESSION['admin']))
				unset($_SESSION['admin']);
			$this->_view->location();
		}
		else
			View::errorCode(404);
	}

//User close Window with site
	public function actionWindowClose()
	{
		if (!isset($_POST['close']) || !empty($_POST['close']))
			View::errorCode(404);

		if (isset($_SESSION['admin']))
			unset($_SESSION['admin']);
		else if (isset($_SESSION['user']) &&
			$_SESSION['user']['checkbox'] != 1)
			unset($_SESSION['user']);
	}
}