<?php

namespace app\core;

use app\core\Db;

abstract class Model
{
	protected $_db;

	function __construct()
	{
		$this->_db = new Db();
	}
}