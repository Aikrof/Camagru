<?php

namespace app\model;

use app\core\Model;

class User extends Model
{
	private $t_admin = "admin";
	private $t_account = "users";

	public function setUser($json)
	{
		if (!preg_match("/^[a-zA-Z][a-zA-Z0-9_]{3,11}$/", $json['login']))
		{

			return (['login' => "Invalid login: <span>" . mb_strimwidth($json['login'], 0, 37, "...") . "</span>"]);
		}

		$params = [
			'login' => $json['login'],
			'email' => $json['email'],
		];

		$search = $this->_db->all('SELECT * FROM `' . $this->t_account . '` WHERE login = :login or email = :email', $params);

		if (!$search)
		{
			if (!$this->checkEmail($json['email']))
				$insert = ['mail' => 'Invalid email address'];
			else
			{
				$json['password'] = password_hash($json['password'], PASSWORD_DEFAULT);
				$id = $this->prepareInsert($this->t_account, $json);
				$insert['user'] = true;
				$this->sendMail($json, $id, date("Y-m-d"));
			}
		}
		else
		{
			$search = $search[0];
			if (strtolower($params['login']) === $search['login'])
			{
				$insert['login'] = "User with this login: <span>" . $params['login'] . "</span> already exists.";
			}
			if ($params['email'] === $search['email'])
			{
				$insert['email'] = "User with this email: <span>" . $params['email'] . "</span> already exists.";
			}
		}
		return ($insert);
	}

//check admin log in
	public function checkAdmin($json)
	{
		if (!(in_array('admin', explode('_', $json['login']))))
			return (false);

		$select = 'SELECT `password` FROM `' . $this->t_admin . '` WHERE `login` = "' . $json['login'] . '"';

		$admin_passwd = $this->_db->column($select);
		if (!password_verify($json['password'], $admin_passwd))
			return (false);
		return (true);
	}

// account already exists
	public function getUser($json)
	{
		$params = [
			'login' => $json['login'],
		];

		$search = $this->_db->all('SELECT `id`, `login`, `password`, `confirm`, `icon`, `send` FROM `' . $this->t_account . '` WHERE login = :login', $params);

		if (!$search)
		{
			$result['login'] = "No such user with login: <span>" .$json['login'] . "</span>.";
			return ($result);
		}

		$search = $search[0];

		if (!password_verify($json['password'], $search['password']))
		{
			$result['password'] = "Password do not match this account.";
		}
		else if (!$search['confirm'])
			$result['confirm'] = "Confirm your email address.";
		else
		{
			$result['user'] = [
				'id' => $search['id'],
				'login' => $search['login'],
				'password' => $search['password'],
				'checkbox' => ($json['checkbox'] === 'on' ? 1 : 0),
				'icon' => $search['icon'],
				'send' => $search['send'],
			];
		}
		return ($result);
	}

	public function forgotPasswd($json)
	{
		$email = $json['email'];

		if (!$this->checkEmail($email))
			$result['email'] = "Invalid e-mail address.";
		else
		{
			$search = $this->_db->all('SELECT `id`,`login`, `confirm` FROM `' . $this->t_account . '` WHERE email = "' . $email . '"');
			if (!$search)
			{
				$result['email'] = "No such user with e-mail: <span>" .$email . "</span>.";
			}
			else
			{
				$search = $search[0];
				if (!$search['confirm'])
				{
					$result['confirm'] = "You have not yet confirmed your e-mail address.";
				}
				else
				{
					$newPasswd = $this->generateNewPasswd();

					$send = [
						'login' => $search['login'],
						'email' => $email,
						'password' => $newPasswd,
					];

					$newPasswd = password_hash($newPasswd, PASSWORD_DEFAULT);
					$this->_db->void('UPDATE `' .$this->t_account . '` SET `password` = "' . $newPasswd . '" WHERE `id` = ' . $search['id']);

					$result['user'] = true;

					$this->sendMail($send);
				}
			}
		}
		return ($result);
	}

	public function resendActivation($json)
	{
		if (!$this->checkEmail($json['email']))
			$result['email'] = "Invalid e-mail address";
		else
		{
			$params = [
				'login' => $json['login'],
				'email' => $json['email'],
			];

			$search = $this->_db->all('SELECT `id`, `confirm`, `creation_date` FROM `' . $this->t_account . '` WHERE login = :login and email = :email', $params);
			if (!$search)
			{
				$result['login'] = "login or e-mail do not match this account.";
			}
			else
			{
				$search = $search[0];

				if ($search['confirm'])
					$result['confirm'] = "This user has already been activated.";
				else
				{
					$result['user'] = true;
					$this->sendMail($json, $search['id'], $search['creation_date']); 
				}
			}
		}
		return ($result);
	}

	public function validActivation($token)
	{
		$token = explode('/', $token);
		if (!is_numeric($token[0]))
			return false;
		$search = $this->_db->all('SELECT `login`, `confirm`, `creation_date` FROM `' . $this->t_account . '` WHERE id = '. $token[0]);
		if (isset($search[0]) && $search[0]['confirm'] == 0)
		{
			$search = $search[0];
			if ($search['login'] === $token[1] && $search['creation_date'] === $token[2])
			{ 
				$this->_db->void('UPDATE `' . $this->t_account . '` SET `confirm` = 1 WHERE `id` = ' .$token[0]);
				return true;
			}
		}
		return false;
	}

	private function prepareInsert($table, $params)
	{
		$params['confirm'] = 0;
		$params['creation_date'] = date("Y.m.d");
		$keys = $values = array();

		foreach ($params as $key => $val) {
			$keys[] = "`$key`";
			$values[] = ":$key";
		}

		$keys = implode(",", $keys);
		$values = implode(",", $values);
		
		$insert = 'INSERT INTO `'. $table . '`(' . $keys .') VALUES (' . $values . ');';
		return ($this->_db->lastId($insert, $params));
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

	private function sendMail($json, $id = "", $date = "")
	{
		$to = $json['email'];

		$path = explode('/', $_SERVER['HTTP_REFERER']);
		unset($path[count($path) - 1], $path[count($path) - 1]);
		array_push($path, "user");
		array_push($path, "activation?token=");
		$path = implode('/', $path);

		$header = "Content-type: text/html; charset=utf-8 \r\n";
		$header .= "From: =?utf-8?B?" . base64_encode('Camagru') . "?=";
		if (!empty($id) && !empty($date))
		{
			$activation = $id . "/" . $json['login'] . "/" . $date;
			$activation = base64_encode($activation);

			$path .= $activation;

			$subject = "Camagru Confirmation Email";

			$message = "<p><strong>Hello " . $json['login'] . "</strong>,</p><br>";
			$message .= "<p>Thank you for registering for our ";
			$message .= '<a href="http://localhost/Camagru">Camagru</a></p>';
			$message .= "<p>To complete your registration, please click for this link: ";
			$message .= '<a href="' . $path . '">Activate your registration.</a></p>';
			$message .= "<br><p><strong>If this request was not initiated by you, you can safely ignore this message.</strong></p>";
		}
		else
		{
			$subject = "Camagru forgot password";
			$message = "<p><strong>Hello " . $json['login'] . "</strong>,</p><br>";
			$message .= "Your new password is: <strong>" . $json['password'] . "</strong>";
		}

		mail($to, $subject, $message, $header);
	}

	private function generateNewPasswd()
	{
		$str = "qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP";
		$len = 12;
		$size = strlen($str) - 1;
		$new_passwd = [];
		$i = -1;
		while (--$len)
			$new_passwd[++$i] = $str[rand(0, $size)];
		return (implode('', $new_passwd));
	}
}