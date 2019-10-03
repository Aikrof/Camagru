<?php

function checkFile($errorCode, $filePath, $upload, $mime)
{
	$outputMessage = [];
   	$acceptable = array(
		'image/jpeg',
		'image/jpg',
		'image/gif',
		'image/png',
	);

	if ($errorCode !== UPLOAD_ERR_OK || !is_uploaded_file($filePath))
	{

		// Массив с названиями ошибок
   		$errorMessages = [
       		UPLOAD_ERR_INI_SIZE   => 'Размер файла превысил значение upload_max_filesize в конфигурации PHP.',
			UPLOAD_ERR_FORM_SIZE  => 'Размер загружаемого файла превысил значение MAX_FILE_SIZE в HTML-форме.',
			UPLOAD_ERR_PARTIAL    => 'Загружаемый файл был получен только частично.',
			UPLOAD_ERR_NO_FILE    => 'Файл не был загружен.',
			UPLOAD_ERR_NO_TMP_DIR => 'Отсутствует временная папка.',
			UPLOAD_ERR_CANT_WRITE => 'Не удалось записать файл на диск.',
			UPLOAD_ERR_EXTENSION  => 'PHP-расширение остановило загрузку файла.',
		];
		// Зададим неизвестную ошибку
		$unknownMessage = 'При загрузке файла произошла неизвестная ошибка.';
		// Если в массиве нет кода ошибки, скажем, что ошибка неизвестна
		$outputMessage['err'] = isset($errorMessages[$errorCode]) ? $errorMessages[$errorCode] : $unknownMessage;
		// Выведем название ошибки
	}
	else if ((!in_array($upload['type'], $acceptable) && !empty($upload['type'])) || !in_array($mime, $acceptable))
		$outputMessage = ['err' => 'Invalid file type. Only JPG, GIF and PNG types are accepted.'];
	return ($outputMessage);
}