<?php
	$dir = str_replace('\\', '/', __DIR__);
	$dir = explode('/', $dir);
	$dir = $dir[count($dir) - 3];
	
	define('PG404', '/' . $dir . '/public/css/404.css');
	define('RESET', '/' . $dir . '/public/css/reset.css');
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>404</title>
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href=<?php echo RESET;?> >
	<link rel="stylesheet" type="text/css" href=<?php echo PG404;?>>
</head>
<body>
	<div>
		<h1 id="P_404" class="unselectable">404</h1>
		<div id="p_n_f_container">
			<p id="p_n_f" class="unselectable">Page not found</p>
		</div>
	</div>
</body>
</html>