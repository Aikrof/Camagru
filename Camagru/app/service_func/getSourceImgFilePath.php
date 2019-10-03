<?php

function getSourceImgFilePath($source_path)
{
	$img = explode('/', $source_path);
	$img = $img[count($img) - 1];

	if ($img !== "default_user_icon.png")
		return ($source_path);
	
	$full_path = PATH . 'users/user_icons/' . $img;
	return ($full_path);
}
