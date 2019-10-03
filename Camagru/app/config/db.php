<?php

$dir = require("app/config/dir.php");

//for Windows
// $BD_DSN = '127.0.0.1';

//for Apple
$BD_DSN = 'localhost;port=8100;';

$DB_USER = 'root';
$DB_PASSWORD = 'kapr1s';

return ([
	'host' => [
		'host' => $BD_DSN,
		'dbname' => 'camagru_db',
		'username' => $DB_USER,
		'password' => $DB_PASSWORD,
		'charset' => 'utf8',
	],
	'users_table' => [
		'`users`(
			`id` INT NOT NULL AUTO_INCREMENT,
    		`login` VARCHAR(64) NOT NULL,
    		`email` VARCHAR(64) NOT NULL,
    		`password` VARCHAR(256) NOT NULL,
    		`confirm` INT NOT NULL DEFAULT 0,
    		`icon` VARCHAR(256) NOT NULL DEFAULT "/' . $dir . '/users/user_icons/default_user_icon.png",
    		`send` INT NOT NULL DEFAULT 1,
    		`creation_date` DATE NOT NULL,
    		PRIMARY KEY (id)
		)'
	],
	'img_table' => [
		'`content`(
			`id` INT NOT NULL AUTO_INCREMENT,
			`user_id` INT NOT NULL,
			`path` VARCHAR(256) NOT NULL,
			`likes` INT NOT NULL DEFAULT 0,
			`creation_date` DATE NOT NULL,
			PRIMARY KEY (id)
		)'
	],
	'posts' => [
		'`posts`(
			`id` INT NOT NULL AUTO_INCREMENT,
			`img_id` INT NOT NULL,
			`user_icon` VARCHAR(256) NOT NULL,
			`user_login` VARCHAR(64) NOT NULL,
			`text` TEXT NOT NULL,
			PRIMARY KEY (id)
		)'
	],
	'img_likes' => [
		'`img_likes`(
			`id` INT NOT NULL AUTO_INCREMENT,
			`img_id` INT NOT NULL,
			`user_id` INT NOT NULL,
			`user_icon` VARCHAR(256) NOT NULL,
			`user_login` VARCHAR(64) NOT NULL,
			PRIMARY KEY (id)	
		)'
	],
	'friends_list' =>[
		'`friends_list`(
			`id` INT NOT NULL AUTO_INCREMENT,
			`user_id` INT NOT NULL,
			`friend_id` INT NOT NULL,
			PRIMARY KEY (id)
		)'
	],
	'admin' => [
		'`admin` (
			`id` INT NOT NULL AUTO_INCREMENT,
			`login` VARCHAR(64) NOT NULL,
			`password` VARCHAR(256) NOT NULL,
			PRIMARY KEY (id)
		)'
	],
	'compare_table' => [
		'`compare`(
			`user_id` INT NOT NULL, 
			 `img_id` INT NOT NULL
		)'
	],
]);