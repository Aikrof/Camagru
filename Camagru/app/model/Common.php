<?php

namespace app\model;

use app\core\Model;

class Common extends Model
{
	private $t_users = "users";
	private $t_content = "content";
	private $t_posts = "posts";
	private $t_img_likes = "img_likes";
	private $t_friends_list = "friends_list";

	public function getSearchRequest($request)
	{
		include('app/service_func/getSourceImgFilePath.php');

		if (!preg_match("/^[a-zA-Z][a-zA-Z0-9_]{1,11}$/", $request))
			return (0);

		$select = 'SELECT `login`, `icon` FROM `' . $this->t_users . '` WHERE `login` LIKE "%' . $request . '%"';

		$result = $this->_db->all($select);
		
		if (empty($result))
			return (0);

		$result = $this->searchTheSame($result, $request);

		foreach ($result as $key => $value) {
			$value['icon'] = getSourceImgFilePath($value['icon']);
			
			$size = getimagesize($value['icon']);
			$contents = file_get_contents($value['icon']);

			$result[$key]['icon'] = "data:image/" . $size['mime'] . ";base64," . base64_encode($contents);
		}
		return ($result);
	}

	public function addLike($img_id)
	{
		if (!isset($_SESSION['user']) ||
			empty($_SESSION['user']) ||
			!is_numeric($img_id))
		{
			return (false);
		}

		if ($_SESSION['user']['id'] == 
			$this->_db->column('SELECT `user_id` FROM `' . $this->t_content . '` WHERE `id` = ' . $img_id))
		{
			return (false);
		}

		if (!$this->checkLikedImg($img_id))
		{
			$this->deleteLike($img_id);
			$delete = true;
		}
		else
		{
			$this->addNewLike($img_id);
			$delete = false;
		}

		$result = [
			'user_id' => $_SESSION['user']['id'],
			'user_login' => $_SESSION['user']['login'],
			'user_icon' => $_SESSION['user']['icon'],
			'is_friend' => true,
			'delete' => $delete,
		]; 

		return ($result);
	}

	public function addFriend($login)
	{
		if ($_SESSION['user']['login'] === $login ||
			!$friend_id = $this->getUserId($login))
			return (false);

		$params = [
			'user_id' => $_SESSION['user']['id'],
			'friend_id' => $friend_id,
		];

		if ($this->_db->all('SELECT * FROM `' . $this->t_friends_list . '` WHERE `user_id` = :user_id AND `friend_id` = :friend_id', $params))
			return (false);

		$keys = $values = array();
		foreach ($params as $key => $value){
			$keys[] = '`' . $key . '`';
			$values[] = "'" . $value . "'";
		}
		$keys = implode(",", $keys);
		$values = implode(",", $values);

		$insert = 'INSERT INTO `' . $this->t_friends_list . '` (' . $keys . ') VALUES (' . $values . ');';
		if ($var = $this->_db->lastId($insert, $params))
			return (true);

		return (false);
	}

	public function getPosts($id)
	{
		if (!is_numeric($id))
			return (0);

		include('app/service_func/getSourceImgFilePath.php');

		$select_posts = 'SELECT `user_icon`, `user_login`, `text` FROM `' . $this->t_posts . '` WHERE img_id = ' . $id . ' ORDER BY (`id`)';
		
		$posts = $this->_db->all($select_posts);

		foreach ($posts as $key => $value){
			$value['user_icon'] = getSourceImgFilePath($value['user_icon']);
			
			$size = getimagesize($value['user_icon']);
			$contents = file_get_contents($value['user_icon']);

			$posts[$key]['user_icon'] = "data:image/" . $size['mime'] . ";base64," . base64_encode($contents);
		}
		
		return ($posts);
	}

	public function getPeopleWhoLikes($id)
	{
		if (!is_numeric($id))
			return (0);

		$params = [
			'img_id' => $id,
		];

		$select = 'SELECT `user_id`, `user_icon`, `user_login` FROM `' . $this->t_img_likes . '` WHERE `img_id` = :img_id ORDER BY `id` DESC';
		$result = $this->_db->all($select, $params);

		foreach ($result as $key => $value){
				$value['user_icon'] = getSourceImgFilePath($value['user_icon']);

			$size = getimagesize($value['user_icon']);
			$contents = file_get_contents($value['user_icon']);

			$result[$key]['user_icon'] = "data:image/" . $size['mime'] . ";base64," . base64_encode($contents);
			$result[$key]['is_friend'] = $this->checkFriendList($value['user_id']);
		}

		return ($result);
	}

	public function checkFriendList($friend_id)
	{
		if (!isset($_SESSION['user']))
			return (true);
		else if ($_SESSION['user']['id'] === $friend_id)
			return (true);

		$params = [
			'user_id' => $_SESSION['user']['id'],
			'friend_id' => $friend_id,
		];

		$select = 'SELECT * FROM `' . $this->t_friends_list . '` WHERE `user_id` = :user_id AND `friend_id` = :friend_id';

		$result = $this->_db->all($select, $params);
		if (empty($result))
			return (false);
		return (true);
	}

	public function addNewPost($json)
	{
		if (!isset($_SESSION['user']))
			return (0);
		
		include('app/service_func/getSourceImgFilePath.php');

		$params = [
			'img_id' => $json['img_id'],
			'user_icon' => $this->getUserIcon($_SESSION['user']['id']),
			'user_login' => $_SESSION['user']['login'],
			'text' => $json['text'],
		];
		if ($params['user_icon'] === "/Camagru/users/user_icons/default_user_icon.png")
		{
			$params['user_icon'] = getSourceImgFilePath($params['user_icon']);
		}

		$keys = $values = array();
		foreach ($params as $key => $value){
			$keys[] = '`' . $key . '`';
			$values[] = "'" . $value . "'";
		}
		$keys = implode(",", $keys);
		$values = implode(",", $values);

		$insert = 'INSERT INTO `' . $this->t_posts . '` (' . $keys . ') VALUES (' . $values . ');';

		$this->_db->void($insert);
		
		$this->sendMail($json['img_id'], $json['text']);

		unset($params['img_id']);

		$size = getimagesize($params['user_icon']);
		$contents = file_get_contents($params['user_icon']);
		$params['user_icon'] = "data:image/" . $size['mime'] . ";base64," . base64_encode($contents);
 
		return ($params);
	}

	private function searchTheSame($result, $request)
	{
		$count = count($result);
		for ($i = 0; $i < $count; $i++){
			if ($result[$i]['login'] === $request)
			{
				$newResult[0] = $result[$i];
				return ($newResult); 
			}
		}
		return ($result);
	}

	private function getUserIcon($id)
	{
		$select = 'SELECT `icon` FROM `' . $this->t_users . '` WHERE `id` = ' . $id;

		$user_icon = $this->_db->column($select);
	
		return ($user_icon);
	}

	private function getUserId($user_login)
	{
		if (!preg_match("/^[a-zA-Z][a-zA-Z0-9_]{3,11}$/", $user_login))
			return (0);

		$select = 'SELECT `id` FROM `' . $this->t_users . '` WHERE `login` = "' . $user_login . '"';

		$result = $this->_db->all($select);

		if ($result)
			$result = $result[0]['id'];
		return ($result);
	}

	private function deleteLike($img_id)
	{
		$update = 'UPDATE `' . $this->t_content . '` SET `likes` = likes - 1 WHERE `id` = ' . $img_id;
		$this->_db->void($update);

		$params = [
			'img_id' => $img_id,
			'user_id' => $_SESSION['user']['id'],
		];
		$drop = 'DELETE FROM `' . $this->t_img_likes . '` WHERE `img_id` = :img_id AND `user_id` = :user_id';
		$this->_db->void($drop, $params);
	}

	private function addNewLike($img_id)
	{
		include('app/service_func/getSourceImgFilePath.php');

		$select = 'SELECT `icon` FROM `' . $this->t_users . '` WHERE id = ' . $_SESSION['user']['id'];
		$user_img = $this->_db->column($select);

		$params = [
			'img_id' => $img_id,
			'user_id' => $_SESSION['user']['id'],
			'user_icon' => getSourceImgFilePath($user_img),
			'user_login' => $_SESSION['user']['login'],
		];

		$update = 'UPDATE `' . $this->t_content . '` SET `likes` = likes + 1 WHERE `id` = ' . $img_id;
		$this->_db->void($update);

		$keys = $values = array();
		foreach ($params as $key => $value) {
			$keys[] = '`' . $key . '`';
			$values[] = "'" . $value . "'";
		}

		$keys = implode(",", $keys);
		$values = implode(",", $values);

		$insert = 'INSERT INTO `' . $this->t_img_likes . '` (' . $keys . ') VALUES (' . $values . ')';
		$this->_db->void($insert, $params);
	}

	private function checkLikedImg($img_id)
	{
		$params = [
			'img_id' => $img_id,
			'user_id' => $_SESSION['user']['id'],
		];

		$select = 'SELECT * FROM `' . $this->t_img_likes . '` WHERE `img_id` = :img_id AND `user_id` = :user_id';
		$result = $this->_db->all($select, $params);

		if (!empty($result))
			return (false);
		
		unset($result);

		$img_owner_select = 'SELECT `user_id` FROM `' . $this->t_content . '` WHERE img_id = :img_id';
		$result = $this->_db->all ($select, $params);

		return ((!empty($result)) ? false : true);
	}

	private function sendMail($img_id, $text)
	{
		$select = 'SELECT `user_id` FROM `' . $this->t_content . '` WHERE `id` = ' . $img_id;

		$user_id = $this->_db->column($select);

		if ($_SESSION['user']['id'] === $user_id)
			return;

		$select = 'SELECT `email`, `login`, `send` FROM `' . $this->t_users . '` WHERE `id` = ' . $user_id;
		$result = $this->_db->all($select);
		$result = $result[0];

		if (!$result['send'])
			return;

		$to = $result['email'];
		$login = $result['login'];

		$header = "Content-type: text/html; charset=utf-8 \r\n";
		$header .= "From: =?utf-8?B?" . base64_encode('Camagru') . "?=";

		$subject = "Camagru new post";
		$message = "<p><strong>Hello " . $login  . "</strong>,</p><br>";
		$message .= "Your have new post from <strong>" . $_SESSION['user']['login'] . "</strong> : <p>" . $text . "</p>";
		mail($to, $subject, $message, $header);
	}
}
