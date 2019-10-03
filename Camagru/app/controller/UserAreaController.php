<?php

namespace app\controller;

use app\core\Db;
use app\core\Controller;
use app\core\View;

class UserAreaController extends Controller
{
	public function actionProfile()
	{
		if (isset($_SESSION['admin']))
			$this->_view->redirect("");
		else if (!isset($_SESSION['user']) || empty($_SESSION['user']))
			View::errorCode(404);

		else if (isset($_POST['val']) && !empty($_POST['val']))
		{
			$id = $_SESSION['user']['id'];
			$json = json_decode($_POST['val']);

			$result = $this->_model->takeProfileContent($json, $id);
			exit(json_encode($result));
		}

		$this->_view->render();
	}

	public function actionStudio()
	{
		if (isset($_SESSION['admin']))
			$this->_view->redirect("");
		else if (!isset($_SESSION['user']) || empty($_SESSION['user']))
			View::errorCode(404);

		$content = [];
		
		$content = $this->_model->getStudioEditImg();

		if (isset($_POST['contentImg']) && !empty($_POST['contentImg']))
		{
			$json = json_decode($_POST['contentImg'], true);
			
			$result = $this->_model->getIconsContent($content, $json);
			exit(json_encode($result));
		}
		elseif (isset($_POST['images']) && !empty($_POST['images']))
		{
			$json = json_decode($_POST['images'], true);

			$result = $this->_model->creatImg($json);
			exit(json_encode($result));
		}
		else if (isset($_POST['image_save']) && !empty($_POST['image_save']))
		{
			$json = json_decode($_POST['image_save'], true);

			$err = $this->_model->prepareAndSave($json);
			exit(json_encode($err));
		}
		$this->_view->render($content);
	}

	public function actionFile()
	{
		if (isset($_POST['pic']) && (isset($_FILES)) && ($_FILES['img']['tmp_name'] && $_FILES['img']['name']) && is_uploaded_file($_FILES['img']['tmp_name']))
		{
			$img = $_FILES['img'];
			$filePath  = $_FILES['img']['tmp_name'];
			$errorCode = $_FILES['img']['error'];
			$image = getimagesize($filePath);
			
			$service = include('app/service_func/fileChecker.php');

			$outputMessage = checkFile($errorCode, $filePath, $img, $image['mime']);
			if (!empty($outputMessage))
				$this->_view->message($outputMessage);

			$contents = file_get_contents($filePath);
			$base = "data:image/" . $image['mime'] . ";base64," . base64_encode($contents);
			exit(json_encode(['src' => $base]));
		}
		else
			View::errorCode(404);
	}

	public function actionPage($user)
	{
		if (isset($_SESSION['user']) && $user === $_SESSION['user']['login'])
			$this->_view->redirect('UserArea/profile');
		else if (!($id = $this->_model->getUserId($user)))
			View::errorCode(404);

		if (isset($_POST['val']) && !empty($_POST['val']))
		{
			$json = json_decode($_POST['val']);

			$result = $this->_model->takeProfileContent($json, $id);
			exit(json_encode($result));
		}

		$vars = [
			'login' => $user,
			'icon' => $this->_model->getAndEncodeUserIcon($user),
			'is_friend' => $this->_model->checkFriendList($this->_model->getUserId($user)),
		];

		$this->_view->render($vars);
	}
}