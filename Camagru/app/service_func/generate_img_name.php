<?php

function generateImgName()
{
	$str = "qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP+-_";
	$len = 65;
	$size = strlen($str) - 1;
	$generate = [];
	$i = -1;
	while (--$len)
		$generate[++$i] = $str[rand(0, $size)];
	return (implode('', $generate));
}