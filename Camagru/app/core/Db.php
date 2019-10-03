<?php

namespace app\core;

use app\core\Connection;
use PDO;

class Db extends Connection
{
	private function query($sql, $params = [])
	{
		$query = $this->_connection->prepare($sql);
		if (!empty($params))
		{
			foreach ($params as $key => $val){
				$query->bindValue(':'. $key, $val);
			}
		}
		$query->execute();
		return ($query);
	}

	public function all($sql, $params = [])
	{
		$query = $this->query($sql, $params);
		$result = $query->fetchAll(PDO::FETCH_ASSOC);
		return ($result === false ? [] : $result);
	}

	public function column($sql, $params = [])
	{
		$query = $this->query($sql, $params);
		$result = $query->fetchColumn();
		return ($result === false ? "\0" : $result);
	}
// ALTER TABLE `users` AUTO_INCREMENT=0 - обновление id при удалении елемента
	public function lastId($sql, $params = [])
	{
		$query = $this->query($sql, $params);
		$result = $this->_connection->lastInsertId();
		return ($result);
	}

	public function void($sql, $params = [])
	{
		$this->query($sql, $params);
	}
}