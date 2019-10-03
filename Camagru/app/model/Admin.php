<?php

namespace app\model;

use app\core\Model;

class Admin extends Model
{
	private $t_users = "users";
	private $t_content = "content";
	private $t_posts = "posts";
	private $t_img_likes = "img_likes";
	private $t_friends_list = "friends_list";

	public function getUsers()
	{
		return (
			$this->_db->all(
				'SELECT `login`, `email`, `icon`, `creation_date` FROM `' . $this->t_users . '`'
			)
		);
	}

	public function getUserImg($login)
	{
		if (!preg_match("/^[a-zA-Z][a-zA-Z0-9_]{1,11}$/", $login))
			return (0);
		$select = 'SELECT `path`, `id` FROM `' . $this->t_content . '` WHERE `user_id` = (SELECT `id` FROM `' .$this->t_users . '` WHERE `login` = "' .$login . '") ORDER BY `id` DESC';
		$result = $this->_db->all($select);
		
		foreach ($result as $key => $value) {
			$size = getimagesize($value['path']);
			$contents = file_get_contents($value['path']);

			$result[$key]['path'] = "data:image/" . $size['mime'] . ";base64," . base64_encode($contents);
			$result[$key]['id'] = base64_encode($value['id']);
		}

		return ($result);
	}

	public function removeUserImg($id)
	{
		$this->_db->void('DELETE FROM `' . $this->t_content . '` WHERE id = ' . $id . ';
			DELETE FROM `' . $this->t_posts . '` WHERE img_id = ' . $id . ';
			DELETE FROM `' . $this->t_img_likes . '` WHERE img_id = ' . $id
		);
		$this->_db->void('ALTER TABLE `' . $this->t_content . '` AUTO_INCREMENT=0;
			ALTER TABLE `' . $this->t_posts . '` AUTO_INCREMENT=0;
			ALTER TABLE `' . $this->t_img_likes . '` AUTO_INCREMENT=0;');
	}
}