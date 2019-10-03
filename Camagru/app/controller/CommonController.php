<?php

namespace app\controller;

use app\core\Db;
use app\core\Controller;
use app\core\View;

class CommonController extends Controller{

	public function actionSearch()
	{
		if (!isset($_POST['search']) || empty($_POST['search']))
			View::errorCode(404);

		$json = json_decode($_POST['search']);

		$result = $this->_model->getSearchRequest($json);
		exit(json_encode($result));
	}

	public function actionAddLike()
	{
		if (!isset($_POST['like']) || empty($_POST['like']))
			View::errorCode(404);

		$img_id = base64_decode(json_decode($_POST['like']));

		$result = $this->_model->addLike($img_id);
		exit(json_encode($result));
	}

	public function actionAddFriend()
	{
		if (!isset($_POST['friend']) || empty($_POST['friend']))
			View::errorCode(404);
	
		$login = json_decode($_POST['friend']);

		$bool = $this->_model->addFriend($login);
		exit(json_encode($bool));
	}

	public function actionGetPostsAndLikes()
	{
		if (!isset($_POST['posts']) || empty($_POST['posts']))
			View::errorCode(404);
		
		$json = json_decode($_POST['posts'], true);
		
		$img_id = base64_decode($json['id']);

		$posts = $this->_model->getPosts($img_id);
		$peopleLikes = $this->_model->getPeopleWhoLikes($img_id);


		if (!$posts)
			$posts = 0;
		if (!$peopleLikes)
			$peopleLikes = 0;

		$result = [
			'posts' => $posts,
			'peopleLikes' => $peopleLikes,
		];
		exit(json_encode($result));
	}

	public function actionAddNewPost()
	{
		if (isset($_POST['new_post']) && !empty($_POST['new_post']))
		
		$json = json_decode($_POST['new_post'], true);
		$json['img_id'] = base64_decode($json['img_id']);

		$result = $this->_model->addNewPost($json);
		exit(json_encode($result));
		
	}
}