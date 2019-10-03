<?php

namespace app\model;

use app\core\Model;

class UserArea extends Model
{
	private $t_users = "users";
	private $t_content = "content";
	private $t_posts = "posts";
	private $t_img_likes = "img_likes";
	private $t_friends_list = "friends_list";

	public function takeProfileContent($content_count, $id)
	{
		$params = [
			'user_id' => $id,
		];
	
		$select_content = 'SELECT `id`,`path`, `likes` FROM `' . $this->t_content . '` WHERE `user_id` = :user_id ORDER BY `id` DESC LIMIT ' . $content_count . ', 10';

		$content = $this->_db->all($select_content, $params);
		if (!count($content))
			return 0;

		$result = [];
		
		foreach ($content as $key => $val){
			$size = getimagesize($val['path']);
			$contents = file_get_contents($val['path']);

			$result[$key] = [
				'img_liked' => $this->checkLikedImg($val['id'], $id),
				'src' => "data:image/" . $size['mime'] . ";base64," . base64_encode($contents),
				'id' => base64_encode($val['id']),
				'likes' => $val['likes'],
			];
		}
		return ($result);
	}

	public function getIconsContent($content, $json)
	{
		$result = [];

		foreach ($content as $key => $icons){
			if ($key === $json)
				$result = $icons;
		}
		return $result;
	}

	public function getStudioEditImg()
	{
		$content = [];

		$rootDir = include('app/config/dir.php');
		$studio =  $_SERVER['CONTEXT_DOCUMENT_ROOT'] . '/' . $rootDir . '/public/img/studio';

		if (!file_exists($studio))
			return;
		
		$scan = scandir($studio);

		foreach ($scan as $dir){
			$scan_dir = $studio . "/" .$dir;

			if (is_dir($scan_dir) && ($dir !== '.' && $dir !== '..'))
			{
				$img_dir = $studio . "/" . $dir;
				$scan_dir = scandir($img_dir);
				$arr = [];

				foreach ($scan_dir as $img) {
					$img_path = $img_dir . "/" . $img;

					if (!is_dir($img_path) && preg_match("/^[^_].*\.(png)$/i", $img))
					{
						$img_path = '/' . $rootDir . '/public/img/studio/' . $dir . '/' . $img;
						array_push($arr, $img_path);
					}
				}
				$content[$dir] = $arr;
			}
		}
		return ($content);
	}

	public function creatImg($json)
	{
		if (!empty($json['cont']))
		{
			$src = $json['obj']['src'];
			$icons = $json['cont'];

			$result = $this->creatImgFromPhoto($src, $icons);
		}
		else
			$result = $json['obj']['src'];
		return ($result);
	}

	public function prepareAndSave($json)
	{
		$src = $json['src'];
		$text = $json['text'];

		$img = explode(',', $src);

		$ext = explode(';', $img[0]);
		$ext = explode('/', $ext[0]);
		$ext = isset($ext[2]) ? $ext[2] : $ext[1];
		$base = base64_decode($img[1]);
		$str_img = imagecreatefromstring($base);

		return ($this->saveImg($str_img, strtolower($ext), $text));
	}

	public function getUserId($user_login)
	{
		if (!preg_match("/^[a-zA-Z][a-zA-Z0-9_]{3,11}$/", $user_login))
			return (0);

		$select = 'SELECT `id` FROM `' . $this->t_users . '` WHERE `login` = "' . $user_login . '"';

		$result = $this->_db->all($select);

		if ($result)
			$result = $result[0]['id'];
		return ($result);
	}

	public function getAndEncodeUserIcon($login)
	{
		include('app/service_func/getSourceImgFilePath.php');

		$select = 'SELECT `icon` FROM `' . $this->t_users . '` WHERE `login` = "' . $login . '"';

		$user_icon = $this->_db->column($select);

		if ($user_icon === "/Camagru/users/user_icons/default_user_icon.png")
			$user_icon = getSourceImgFilePath($user_icon);

		$size = getimagesize($user_icon);
		$contents = file_get_contents($user_icon);
		$icon = "data:image/" . $size['mime'] . ";base64," . base64_encode($contents);
		return ($icon);
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

	private function creatImgFromPhoto($src, $icons)
	{
		$count = count($icons);

		$img = explode(',', $src);

		$ext = explode(';', $img[0]);
		$ext = explode('/', $ext[0]);
		if (isset($ext[2]))
			$ext = 'image/' . $ext[2];
		else
			$ext = 'image/' . $ext[1];

		$base = base64_decode($img[1]);
		$str_img = imagecreatefromstring($base);
		$str_new = imagecreatetruecolor(640, 480);
		imagecopyresampled($str_new, $str_img, 0, 0, 0, 0, 640, 480, imagesx($str_img), imagesy($str_img));

		for ($i = 0; $i < $count; $i++){
			$src_icon = imagecreatefrompng($icons[$i]['src']);
			$icon = imagecreatetruecolor(intval($icons[$i]['width']), intval($icons[$i]['height']));
			$transparent = imagecolorallocatealpha($icon, 0, 0, 0, 127);
			imagefill($icon, 0, 0, $transparent);
			imagecopyresampled($icon, $src_icon, 0, 0, 0, 0, intval($icons[$i]['width']), intval($icons[$i]['height']),  imagesx($src_icon),  imagesy($src_icon));

			imagecopy($str_new, $icon, intval($icons[$i]['left']), intval($icons[$i]['top']), 0, 0, intval($icons[$i]['width']), intval($icons[$i]['height']));
		}

		ob_start();

		if ($ext === 'gif' || $ext === 'png')
			$err = $ext === 'gif' ? imagegif($str_new) : imagepng($str_new);
		else
			$err = imagejpeg($str_new);
		if (!$err)
			$result = $err;

		$contents =  ob_get_contents();
		ob_end_clean();

		$result = "data:image/" . $ext . ";base64," . base64_encode($contents);
		imagedestroy($str_new);
		return ($result);
	}

	private function saveImg($src, $ext, $text)
	{
		include('app/service_func/generate_img_name.php');

		$folder = PATH . 'users/content';

		if (!file_exists($folder))
			mkdir($folder);

		$img_name = generateImgName() . '.' . $ext;
		$path = $folder . '/' . $img_name;

		if ($ext === 'gif' || $ext === 'png')
			$err = $ext === 'gif' ? imagegif($src, $path) : imagepng($src, $path);
		else
			$err = imagejpeg($src, $path);

		if (!$err)
			return ($err);
		
		imagedestroy($src);

		$date = date("Y.m.d");
		$params = [
			'user_id' => $_SESSION['user']['id'],
			'path' => $path,
			'creation_date' => $date,
		];
		$keys = $values = array();
		foreach ($params as $key => $value) {
			$keys[] = '`' . $key . '`';
			$values[] = "'" . $value . "'";
		}

		$keys = implode(",", $keys);
		$values = implode(",", $values);

		$insert_img = 'INSERT INTO `' . $this->t_content . '` (' . $keys . ') VALUES (' . $values . ');';
		$id = $this->_db->lastId($insert_img, $params);
		
		if (!empty($text))
		{
			unset($keys, $values, $params);

			$user_icon = $this->getUserIcon($_SESSION['user']['id']);
			$params = [
				'img_id' => $id,
				'user_icon' => $user_icon,
				'user_login' => $_SESSION['user']['login'],
				'text' => $text,
			];
		
			$keys = $values = array();
			foreach ($params as $key => $value) {
				$keys[] = '`' . $key . '`';
				$values[] = "'" . $value . "'";
			}

			$keys = implode(",", $keys);
			$values = implode(",", $values);

			$insert_post = 'INSERT INTO `' . $this->t_posts . '` (' . $keys . ') VALUES (' . $values . ');';
			$this->_db->void($insert_post, $params);
		}
		return (true);
	}

	private function getUserIcon($id)
	{
		$select = 'SELECT `icon` FROM `' . $this->t_users . '` WHERE `id` = ' . $id;

		$user_icon = $this->_db->column($select);
	
		return ($user_icon);
	}
}