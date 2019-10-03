<?php

namespace app\model;

use app\core\Model;

class Main extends Model
{
	private $t_users = "users";
	private $t_content = "content";
	private $t_img_likes = "img_likes";
	private $t_posts = "posts";
	private $t_friends_list = "friends_list";

	public function getContent($content_count)
	{
		$select = 'SELECT `id`, `user_id`,`path`, `likes` FROM `' . $this->t_content . '` ORDER BY `id` DESC LIMIT ' . $content_count . ', 10';;
		$content = $this->_db->all($select);
		if (!count($content))
			return 0;

		$result = [];

		foreach ($content as $key => $val){
			$size = getimagesize($val['path']);
			$contents = file_get_contents($val['path']);

			$login = 'SELECT `login` FROM `' . $this->t_users . '` WHERE `id` = ' . $val['user_id'];
			$id = $val['user_id'];
			
			$result[$key] = [
				'img_liked' => $this->checkLikedImg($val['id'], $id),
				'src' => "data:image/" . $size['mime'] . ";base64," . base64_encode($contents),
				'id' => base64_encode($val['id']),
				'likes' => $val['likes'],
				'login' => ucwords($this->_db->column($login)),
			];
		}
		return ($result);
	}

	public function saveIcon($src, $type)
	{
		include('app/service_func/generate_img_name.php');

		$folder = PATH . 'users/user_icons';

		if (!file_exists($folder))
			@mkdir($folder);

		$ext = explode('/', $type);
		$ext = $ext[1];

		$img_name = generateImgName() . '.' . $ext;

		$path = $folder . '/' . $img_name;
	
		$user_icon = imagecreatefromstring($src);
		$new_icon = imagecreatetruecolor(150, 150);
		imagecopyresampled($new_icon, $user_icon, 0, 0, 0, 0, 150, 150, imagesx($user_icon), imagesy($user_icon));

		if ($ext === 'png')
			$err = imagepng($new_icon, $path);
		else
			$err = imagejpeg($new_icon, $path);

		if (!$err)
			return (false);

		$this->removeOldIcon($_SESSION['user']['id']);

		$params = [
			'id' => $_SESSION['user']['id'],
			'icon' => $path,
		];

		$update = 'UPDATE `' . $this->t_users . '` SET `icon` = :icon WHERE id = :id';
		$this->_db->void($update, $params);

		unset($params['id']);
		$params['user_login'] = $_SESSION['user']['login'];

		$update = 'UPDATE `'  . $this->t_img_likes . '` SET `user_icon` = :icon WHERE `user_login` = :user_login; UPDATE `' . $this->t_posts . '` SET `user_icon` = :icon WHERE `user_login` = :user_login';

		$this->_db->void($update, $params);

		$result = [
			'path' => $path,
		];
		return ($result);
	}

	public function getUserFriends($id)
	{
		include('app/service_func/getSourceImgFilePath.php');

		$select = 'SELECT `login`, `icon` FROM `' . $this->t_users . '`, `' . $this->t_friends_list . '` WHERE ' . $this->t_users . '.id = ' . $this->t_friends_list . '.friend_id AND ' . $this->t_friends_list . '.user_id = ' . $id;

		$result = $this->_db->all($select);
		if (empty($result))
			return (false);
		
		sort($result);
		foreach ($result as $key => $value){
			$value['icon'] = getSourceImgFilePath($value['icon']);
			
			$size = getimagesize($value['icon']);
			$contents = file_get_contents($value['icon']);

			$result[$key]['icon'] = "data:image/" . $size['mime'] . ";base64," . base64_encode($contents);
		}
		return ($result);
	}

	public function changeSend()
	{
		if ($_SESSION['user']['send'])
		{
			$_SESSION['user']['send'] = 0;
			$val = 0;
		}
		else
		{
			$_SESSION['user']['send'] = 1;
			$val = 1;
		}

		$this->_db->void('
			UPDATE `' . $this->t_users . '` SET `send` = ' . $val . ' WHERE `id` = ' . $_SESSION['user']['id']);
	}

	public function change_login($json)
	{
		$err = $this->valid($json);

		if (!empty($err))
			return ($err);

		$params = [
			'id' => $_SESSION['user']['id'],
			'login' => $json['login'],
		];

		$update = 'UPDATE `' . $this->t_users . '` SET `login` = :login WHERE `id` = :id';

		$this->_db->void($update, $params);
		$_SESSION['user']['login'] = $json['login'];
		return(['result' => true]);
	}

	public function change_password($json)
	{
		$err = $this->valid($json);

		if (!empty($err))
			return ($err);

		$password = password_hash($json['new_password'], PASSWORD_DEFAULT);

		$params = [
			'id' => $_SESSION['user']['id'],
			'password' => $password,
		];

		$update = 'UPDATE `' . $this->t_users . '` SET `password` = :password WHERE `id` = :id';

		$this->_db->void($update, $params);
		return (['result' => true]);
	}

	public function change_email($json)
	{
		$err = $this->valid($json);

		if (!empty($err))
			return ($err);

		$params = [
			'id' => $_SESSION['user']['id'],
			'email' => $json['email'],
		];

		$update = 'UPDATE `' . $this->t_users . '` SET `email` = :email WHERE `id` = :id';

		$this->_db->void($update, $params);
		return(['result' => true]);
	}

	private function removeOldIcon($id)
	{
		if ($_SESSION['user']['icon'] !== 'default_user_icon.png')
		{
			$select = 'SELECT `icon` FROM `' . $this->t_users . '` WHERE `id` = ' . $id;

			$unlink_path = $this->_db->column($select);
			@unlink($unlink_path);
		}
	}

	private function valid($arr)
	{
		$err = [];

		if ($arr['password'] !== $arr['confirm'])
		{
			$err =  ['confirm' => "Your password and confirmation password do not match."];
		}
		else if (isset($arr['new_password']))
		{
			if ($arr['password'] === $arr['new_password'])
			{
				$err = ['new_password' => "password and new password should not match."];
			}
		}
		else if (isset($arr['email']))
		{
			$check = $this->checkEmail($arr['email']);

			if (!$check)
				$err = ['email' => "Invalid e-mail address."];
		}
		else if (isset($arr['login']))
		{
			if (!preg_match("/^[a-zA-Z][a-zA-Z0-9_]{3,11}$/", $arr['login']))
				$err = ['login' => "Invalid login."];

			if ($_SESSION['user']['login'] === $arr['login'])
			{
				$err = ['login' => "Your login and new login should not match."];
			}
			else
			{
				$check = $this->_db->all('SELECT * FROM `' . $this->t_users . '` WHERE `login` = "' . $arr['login'] . '"');
				if (!empty($check))
					$err = ['login' => "User with this login is already exist."];
			}
		}

		if (empty($err))
			$err = $this->checkDbUserPasswd($arr['password']);

		return ($err);
	}

	private function checkEmail($email)
	{
		$domain = substr(strrchr($email, "@"), 1);
		$mx = getmxrr($domain, $mx_records, $mx_weight);
		if ($mx == false || count($mx_records) == 0 ||
			(count($mx_records) == 1 && ($mx_records[0] == null || $mx_records[0] == "0.0.0.0")))
		{
			return false;
		}
		else
		{
			return true;
		}
	}

	private function checkDbUserPasswd($password)
	{
		$params = [
			'id' => $_SESSION['user']['id'],
		];

		$select = 'SELECT `password` FROM `' .  $this->t_users . '` WHERE `id` = :id';

		$hash = $this->_db->column($select, $params);
		
		if (!password_verify($password, $hash))
			return (['password' => "Password do not match this account."]);
	}

	private function checkLikedImg($img_id, $user_id)
	{
		if (!isset($_SESSION['user']['id']) ||
			$user_id === $_SESSION['user']['id'])
			return (0);

		$params = [
			'img_id' => $img_id,
			'user_login' => $_SESSION['user']['login'],
		];

		$select = 'SELECT * FROM `' . $this->t_img_likes . '` WHERE `img_id` = :img_id AND `user_login` =:user_login';
		$result = $this->_db->all($select, $params);

		return ((!empty($result)? 0 : 1));
	}
}
