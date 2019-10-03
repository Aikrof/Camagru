<?php
	define("ROOT", '/' . $this->rootDir);
	define("CSS", '/' . $this->rootDir . '/public/css/') ;
	define("JS", '/' . $this->rootDir . '/public/js/');
	define("IMG", '/' . $this->rootDir . '/public/img/');
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<title><?php echo $title;?></title>
	<meta charset="utf-8">

	<link rel="stylesheet" type="text/css" href=<?php echo CSS . 'reset.css'?>>
	<?php if ($this->path === 'registration'): ?>
		<link rel="stylesheet" type="text/css" href=<?php echo CSS . 'registration.css'?>>
	<?php else: ?>
		<link rel="stylesheet" type="text/css" href=<?php echo CSS .'default.css'?>>
	<?php endif;?>
	<?php if (isset($this->user)): ?>
		<link rel="stylesheet" type="text/css" href=<?php echo CSS . 'user_page.css'?>>
	<?php elseif (isset($this->admin)): ?>
		<link rel="stylesheet" type="text/css" href=<?php echo CSS . 'admin_page.css'?>>
	<?php endif;?>
	<?php if (isset($this->user) || isset($this->admin)): ?>
		<link rel="stylesheet" type="text/css" href=<?php echo CSS . 'user_inc.css'?>>
	<?php endif;?>
	<?php if (isset($vars['global'])):?>
		<link rel="stylesheet" type="text/css" href=<?php echo CSS . 'index.css'?>>
	<?php else:?>
		<link rel="stylesheet" type="text/css" href=<?php echo CSS . 'profile.css'?>>
	<?php endif;?>

</head>
<body>
<header>
	<div id="logo" class="unselectable">
		<a href=<?php echo ROOT?>>Camagru</a>
	</div>
	<div id="header_user_container">
		<div id="search_user">
		<form id="search_form">
			<input type="search" name="search" id="search" autocomplete="off">
			<div id="search_leb">
			<label>
				<button type="submit" id="search_hiden_butt"></button>
				<img id="search_icon" src=<?php echo IMG . 'icons/search.png'?>>
			</label>
			</div>
		</form>
			<div id="search_result"></div>
		</div>
	</div>
	<div class='usr unselectable'>
		<?php if (!isset($this->user) && !isset($this->admin)): ?>
			<div id='log_in' class='user_func'>Log in</div>
			<?php if ($this->path !== 'registration'): ?>
				<a id='registration' class='user_func' href=<?php echo ROOT . '/user/registration'?>>Registration</a>
			<?php endif;?>
		<?php elseif (isset($this->admin)): ?>
			<div id='log_user'><div id="user_ico_A2kU" onClick="admin_menu()"></div><p id="user_echo" onClick="admin_menu()"><?php echo ucfirst($this->admin);?></p></div>
			<?php include('view/models/admin_inc.php');?>
		<?php else: ?>
			<div id='log_user'><div id="user_ico_A2kU" onClick="user_menu()"></div><p id="user_echo" onClick="user_menu()"><?php echo ucfirst($this->user);?></p></div>
			<?php include('view/models/user_inc.php'); ?>
		<?php endif;?>
	</div>
</header>

	<?php echo $content; ?>

<footer>
	<address class="unselectable">
		<p>Created by Dminakov</p>
		<p id="unit">Unit 2019</p>
	</address>
</footer>

<?php if (!isset($this->user) && !isset($this->admin)):?>
	<script type="text/javascript" src=<?php echo JS . 'logIn.js'?>></script>
	<script type="text/javascript" src=<?php echo JS . 'connection.js'?>></script>
	<script type="text/javascript" src=<?php echo JS . 'registration.js'?>></script>
<?php elseif ($this->user):?>
	<script type="text/javascript" src=<?php echo JS . 'user_inc.js'?>></script>
<?php elseif ($this->admin):?>
	<script type="text/javascript" src=<?php echo JS . 'admin_inc.js'?>></script>
	<script type="text/javascript" src=<?php echo JS . 'admin_page.js'?>></script>
<?php endif;?>
	<script type="text/javascript" src=<?php echo JS . 'search.js';?>></script>
<?php if (isset($vars['global'])):?>
	<script type="text/javascript" src=<?php echo JS . 'index.js';?>></script>
<?php else:?>
	<script type="text/javascript" src=<?php echo JS . 'profile.js'?>></script>
<?php endif;?>
</body>
</html>
