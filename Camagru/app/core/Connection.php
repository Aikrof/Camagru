<?php

namespace app\core;

use PDO;
use PDOException;

abstract class Connection
{
	
	protected $_connection;

	function __construct()
	{
		$config = require_once('app/config/db.php');
		$this->connect($config);
	}

	private function connect($config)
	{
		$host = $config['host'];

		try{
			$this->_connection = new PDO(
				"mysql:host={$host['host']};
				charset={$host['charset']}",
				$host['username'],
				$host['password']);
			$this->_connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		}catch(PDOException $e){
			$e->getMessage();
			http_response_code(500);
			exit;
		}
		$this->createDatabase($config);
		return ($this);
	}

	private function createDatabase($config)
	{
		$host = $config['host'];
		$creat = "CREATE DATABASE IF NOT EXISTS {$host['dbname']}";
		$this->_connection->exec($creat);
		
		$this->_connection->exec('USE ' . $host['dbname']);

		$this->creatTable($config);
	}

	private function creatTable($config)
	{
		unset($config['host']);
		
		foreach ($config as $key) {
			foreach ($key as $value) {
				$this->_connection->exec('CREATE TABLE IF NOT EXISTS ' . $value);
			}
		}

		$admin = [
			'login' => "admin",
			'password' => password_hash("admin12345", PASSWORD_DEFAULT),
		];
		$insert_admin = 'INSERT INTO `admin` (`login`, `password`) SELECT * FROM (SELECT "' . $admin['login'] . '", "' . $admin['password'] . '") AS tmp WHERE NOT EXISTS (SELECT `id` FROM `admin` WHERE `login` = "' . $admin['login'] . '")LIMIT 1';
		$this->_connection->exec($insert_admin);
	}
}
