<?php

$dir = str_replace('\\', '/', __DIR__);

$dir = explode('/', $dir);

$dir = $dir[count($dir) - 3];

return ($dir);