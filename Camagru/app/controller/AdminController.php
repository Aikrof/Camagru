<?php

namespace app\controller;

use app\core\Db;
use app\core\Controller;
use app\core\View;


class AdminController extends Controller
{
	
	function __construct($route)
	{
		parent::__construct($route);

		if (!isset($_SESSION['admin']) || empty($_SESSION['admin']))
			View::errorCode(404);
	}

	public function actionAdminPage()
	{

		$this->_view->render();
	}

	public function actionGetUsers()
	{
		if (!isset($_POST['get_users']) || !empty($_POST['get_users']))
			http_response_code(500);

		exit(json_encode($this->_model->getUsers()));
	}

	public function actionGetUserImg()
	{
		if (!isset($_POST['login']) || empty($_POST['login']))
			http_response_code(500);

		$login = json_decode($_POST['login']);
		exit(json_encode($this->_model->getUserImg($login)));	
	}

	public function actionRemoveUserImg()
	{
		if (!isset($_POST['id']) || empty($_POST['id']))
			http_response_code(500);

		$id = base64_decode(json_decode($_POST['id']));
		$this->_model->removeUserImg($id);
		exit;
	}
}