window.onload = function(){

	function creatA1Content(target)
	{
		var parent;

		if (target.parentElement.className === 'a1')
			parent = target.parentElement;
		else
			parent = target;

		if (parent.attributes[1].nodeValue === '1')
			creatA2();
		else if (parent.attributes[1].nodeValue === '2')
			dellA2();

		function creatA2()
		{
			parent.lastElementChild.style.display = "flex";
			parent.attributes[1].nodeValue = '2';
			parent.children[1].src = getImgDir() + 'up.png';
		}

		function dellA2()
		{
			parent.lastElementChild.style.display = "block";
			parent.lastElementChild.removeAttribute('style');
			parent.children[1].src = getImgDir() + 'down.png';
			parent.attributes[1].nodeValue = '1';
		}

		(function(){
			if (parent.attributes[1].nodeValue !== '2')
				return;
			var attr = function(){
				for (let attr of parent.lastElementChild.attributes){
					if (attr.localName === 'realize')
					{
						if (attr.nodeValue === '1')
							return null;
						else
						{
							return attr;
						}
					}
				}
			}();

			if (!attr)
				return;
			else
				attr.nodeValue = '1';


			var json = function(){
				let json = 'contentImg=';
				json += encodeURIComponent(JSON.stringify(parent.children[0].innerText));
				return json;
			}();

			var request = new XMLHttpRequest();
			var url;

			url = get_path("UserArea/studio");
			request.open('POST', url, true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.send(json);

			request.onreadystatechange = function()
			{
				if (request.readyState != 4)
					return;
				if (request.status != 200)
				{
					alert(request.status + ': ' + request.statusText);
				}
				else
				{
					var result = JSON.parse(request.responseText);
					showContent(result);
				}
			}

			function showContent(result)
			{
				for (let icon_path of result){
					let new_img = document.createElement('img'); 
					new_img.className = 'a2_img';
					new_img.setAttribute('data', '0');
					new_img.setAttribute('src', icon_path);
					parent.lastElementChild.appendChild(new_img);
				}
			}
		}());

		(function()
		{
			var parent_space = parent.lastElementChild;

//-------->Mobile screen work with touch and with user space element <--------
			user_area.addEventListener('touchstart', (event) =>{
				event = event || window.event;

				event.preventDefault();
				event.stopPropagation();

				if (event.target.className !== 'a2_img')
					return;

				var pick = event.target;

				pick.ontouchmove = function(touch)
				{	
					moveElement(touch.changedTouches[0]);
				}

				pick.ontouchend = function(touch)
				{
					let box = user_img.getBoundingClientRect();
					let m = touch.changedTouches[0];

					if ((user_img.offsetLeft <= m.pageX && user_img.offsetTop <= m.pageY) &&
							user_img.offsetLeft + user_img.offsetWidth >= m.pageX && user_img.offsetTop + user_img.offsetHeight >= m.pageY)
						{
							
						}
						else
						{
							user_area.removeChild(pick);
							
						}
				}
	
				function moveElement(m)
				{
					pick.style.left = m.pageX - pick.offsetWidth / 2 + 'px';
					pick.style.top = m.pageY - pick.offsetHeight / 2 + 'px';
				}
			});

//-------->Mobile screen work with touch and with A2 element <--------
			parent_space.addEventListener('touchstart', (event) =>{
				event = event || window.event;

				event.preventDefault();
				event.stopPropagation();

				if (event.target.className !== 'a2_img' && event.target.id !== 'video')
					return;

				var pick = event.target;

				pick.ontouchend = function(e){
					if (pick.parentNode.className === 'a2')
					{
						let clone = pick.cloneNode(1);
						pick = clone;
					}

					pick.style.position = 'absolute';
					moveTouchedElem();
					user_area.appendChild(pick);
					pick.style.zIndex = 999;
				}

				function moveTouchedElem()
				{
					let box = user_img.getBoundingClientRect();

					pick.style.top = box.top + pageYOffset + (box.height / 2) + 'px';
					pick.style.left = box.left + pageXOffset + (box.width / 2) + 'px';
				}
			});

//-------->PC screen work with mouse <--------
			window.addEventListener('mouseover', (event) =>{
				event = event || window.event;

				if (event.target.className === 'resize')
				{
					event.target.onmousedown = function(){
						event.target.onmousemove = function(move){
							let child = event.target.firstChild;
							child.style.width = parseInt(event.target.style.width) - 10 + 'px';
							child.style.height = parseInt(event.target.style.height) - 10 + 'px';
						}
						event.target.onmouseup = function(){
							event.target.onmousemove = null;
							event.target.onmouseup = null;
						}
					}
				}

				if (event.target.className !== 'a2_img' && event.target.id !== 'video')
					return;

				var pick = event.target;

				pick.onmousedown = function(mouse){
					if (pick.attributes.data === undefined)
						return;

					if (pick.attributes.data.value === '1')
					{
						if (pick.parentElement.className === 'resize')
						{
							user_area.removeChild(pick.parentElement);
						}
					}

					if (pick.parentNode.className === 'a2')
					{
						let clone = pick.cloneNode(1);
						clone.attributes.data.value = '1';
						pick.parentNode.appendChild(clone);
						pick = clone;
					}

					pick.style.position = 'absolute';
					moveElement(mouse);
					document.body.appendChild(pick);
					pick.style.zIndex = 999;

					document.onmousemove = function(mouse)
					{
						moveElement(mouse);
					}
				
					pick.onmouseup = function(m)
					{
						if (((user_img.offsetLeft <= m.pageX && user_img.offsetTop <= m.pageY) &&
							user_img.offsetLeft + user_img.offsetWidth >= m.pageX && user_img.offsetTop + user_img.offsetHeight >= m.pageY) || ((video.offsetLeft <= m.pageX && video.offsetTop <= m.pageY) &&
							video.offsetLeft + video.offsetWidth >= m.pageX && video.offsetTop + video.offsetHeight >= m.pageY))
						{
							//класс оболочка
							let tmp = document.createElement('div');
							tmp.style.position = 'absolute';
							tmp.className = 'resize';
							tmp.style.zIndex = 999;
							tmp.style.width = pick.width + 10 +'px';
							tmp.style.height = pick.height + 10 +'px';
							tmp.style.left = pick.style.left;
							tmp.style.top = pick.style.top;
							// ------------------------------
							
							// убираем кординаты pick так как координаты будут считаться от оболочки + смещаем елемент в центр
							pick.style.left = '2.5px';
							pick.style.top = '2.5px';

							tmp.style.left = parseInt(tmp.style.left) - 2.5 + 'px';
							tmp.style.top = parseInt(tmp.style.top) - 2.5 + 'px';
							// -----------------------------
							// удаляем елемент с боди и добавляем в оболочку и оболочку добавляем в юсер арию
							document.body.removeChild(pick);
							tmp.appendChild(pick);
							user_area.appendChild(tmp);
						}
						else
						{
							document.body.removeChild(pick);
						}
						document.onmousemove = null;
						pick.onmouseup = null;
					}

					function moveElement(m)
					{
						pick.style.left = m.pageX - pick.offsetWidth / 2 + 'px';
						pick.style.top = m.pageY - pick.offsetHeight / 2 + 'px';
					}
				}

				pick.ondragstart = function(){
					return false;
				}
			});
		}());
	}

	function clearSelection()
	{
		if (window.getSelection)
			window.getSelection().removeAllRanges();
		else // старый IE
			document.selection.empty();
	}

	function getImgDir()
	{
		var path = document.getElementById('logo');
		path = path.childNodes[0].nextSibling.href;
		path += '/public/img/icons/';
		return (path);
	}

	function get_path(url)
	{
		var path = document.getElementById('logo');
		path = path.childNodes[0].nextSibling.href;
		path += '/' + url;
		return (path);
	}

	var video = document.querySelector('video');
	var canvas = document.querySelector('canvas');
	var user_img = document.getElementById('user_img');
	var user_area = document.getElementById('user_area');
	var img = document.getElementById('studio_inp');
	var result_img = document.getElementById('result_img');
	var result_space = document.getElementById('result_space');
	var space = document.getElementById('space');
	var nav_cont = document.getElementById('nav_cont');
	var fix =  document.getElementsByClassName('fix')[0];

	img.onchange = (im) =>{
		let file = im.target.files[0];

		if (!file)
			return;

		user_img.removeAttribute('src');
		user_img.removeAttribute('data');
		user_img.removeAttribute('style');

		if (video.style.display === "block")
		{
			video.style.display = "none";
		}

		if (!file.type.match('image*'))
		{
			alert('Invalid file type. Only JPG, GIF and PNG types are accepted.');
			return false;
		}

		if (file.size >  7000000 || file.size == 0)
		{
			alert('Invalid image');
			return false;
		}

		(function()
		{
			let fil = document.getElementById('fil');
			let formData = new FormData(fil);

    		formData.append('pic', im.target.value);

   			let ajax = new XMLHttpRequest();
    		ajax.open('POST', 'file', true);
   			ajax.send(formData);

   			ajax.onreadystatechange = function()
			{
				if (ajax.readyState != 4)
					return;
				if (ajax.status != 200)
				{
					alert(ajax.status + ': ' + ajax.statusText);
				}
				else
				{
					var result = JSON.parse(ajax.responseText);
					if (result.err !== undefined)
					{
						console.log(ajax.responseText);
					}
					else
					{
						user_img.setAttribute('src', result.src);
						user_img.style.display = "block";
						user_img.setAttribute('data', '2');
					}
				}
			}
		}());
	}

	window.addEventListener('click', (event) =>{
		event = event || window.event;

		if (result_space.style.display === 'flex')
		{
			let textarea = document.getElementById('textarea');

			if (event.target.className === 'choice remove_img')
			{
				fix.removeAttribute('style');
				result_space.removeAttribute('style');
				result_img.removeAttribute('src');
				textarea.value = "";
			}
			else if (event.target.className === 'choice save_to_myprofile')
				saveImgToMyprofile(result_img.src, textarea);
			

			while (user_area.childNodes.length !== 1)
			{
				if (user_area.childNodes[1].className === 'resize')
				{
					user_area.childNodes[1].removeChild(user_area.childNodes[1].children[0]);
					user_area.removeChild(user_area.childNodes[1]);
				}
				else if (user_area.childNodes[1].className === 'a2_img')
					user_area.removeChild(user_area.childNodes[1]);
			}
		}
		else if (event.target.className === 'choice take_photo')
		{
			user_img.removeAttribute('style');
			user_img.removeAttribute('src');
			user_img.removeAttribute('data');
			video.style.display = "block";

			if (event.target.attributes[1].nodeValue === '1')
			{
				event.target.attributes[1].nodeValue = '2';
				getWebCam(event.target);
			}
			else
			{
				event.target.attributes[1].nodeValue = '1';
				takePhoto();
				user_img.setAttribute('data', 1);
			}
		}
		else if (event.target.className === 'a1')
		{
			creatA1Content(event.target);
		}
		else if (event.target.id === 'add')
		{
			if (event.target.attributes.data !== undefined)
				return;

			let childrens = user_area.children;

			if (user_img.attributes.data === undefined)
				return;
			else if (user_img.attributes.data.value === '1')
				if (!userAreaChild(childrens))
				{
					alert('Adit your photo');
					return;
				}
			add_img(childrens, event.target);
		}
	});

	function saveImgToMyprofile(src, textarea)
	{
		var text = textarea.value;

		(function(){
			var json = function(){
				let json = 'image_save=';

				let obj ={
					'src' : src,
					'text' : text,
				};

				json += encodeURIComponent(JSON.stringify(obj));
				return json;
			}();

			let request = new XMLHttpRequest();

			request.open('POST', 'studio', true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.send(json);

			request.onreadystatechange = function()
			{
				if (request.readyState != 4)
					return;
				if (request.status != 200)
				{
					alert(request.status + ': ' + request.statusText);
				}
				else
				{
					let result = JSON.parse(request.responseText);
					parseSaveResult(result, textarea);
				}
			}
		}());

		function parseSaveResult(result, textarea)
		{
			if (!result)
				alert('ERROR Cannot save IMG');
			else
			{
				(function()
				{
					var seconds = 1.5;

					var img_was_save = document.getElementById('img_was_save');
					img_was_save.style.display = 'block';
					var seconds_timer_id = setInterval(function(){
            			if (seconds > 0)
							seconds --;
						else
						{
							textarea.value = "";
							img_was_save.removeAttribute('style');
							fix.removeAttribute('style');
							result_space.removeAttribute('style');
							result_img.removeAttribute('src');
							textarea.value = "";   
							clearInterval(seconds_timer_id);
						}
					}, 300);

				}());
			}
		}

	}

	function add_img(childrens, target)
	{
		(function(){
			var json = function(){
				let json = 'images=';
				let width;
				let height;
				let obj = {};
				let cont = {}; 

				obj = {
					'src' : user_img.attributes.src.value,
				};

				if (childrens[1] !== undefined &&  childrens[1].className === 'resize')
				{
					for (var i = 1; i < childrens.length; i++){
						width = childrens[i].children[0].style.width ===  "" ? "50" : childrens[i].children[0].style.width;
						height = childrens[i].children[0].style.height === "" ? "50" : childrens[i].children[0].style.height;

						cont[i - 1] = {
							'src' : childrens[i].children[0].src,
							'width' : width,
							'height' : height,
							'left' : parseInt(childrens[i].style.left) + 3.5 + parseInt(childrens[i].children[0].style.left) - user_area.offsetLeft,
							'top' : parseInt(childrens[i].style.top) +  3.5 + parseInt(childrens[i].children[0].style.top) - user_area.offsetTop,
						};
					}
				}		
				else
				{
					for (var i = 1; i < childrens.length; i++){
						width = childrens[i].style.width === "" ? "50" : childrens[i].style.width;
						height = childrens[i].style.height === "" ? "50" : childrens[i].style.height;

						cont[i - 1] = {
							'src' : childrens[i].src,
							'width' : width,
							'height' : height,
							'left' : parseInt(childrens[i].style.left) -  user_area.offsetLeft,
							'top' : parseInt(childrens[i].style.top) -  user_area.offsetTop,
						};
					}
				}

				let arr = {
					'obj' : obj,
					'cont' : cont,
				};
				json += encodeURIComponent(JSON.stringify(arr));
				return json;
			}();

			let request = new XMLHttpRequest();

			request.open('POST', 'studio', true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			target.setAttribute('data', '1');
			request.send(json);

			request.onreadystatechange = function()
			{
				if (request.readyState != 4)
					return;
				if (request.status != 200)
				{
					alert(request.status + ': ' + request.statusText);
				}
				else
				{
					try{	
						let result = JSON.parse(request.responseText);
						target.removeAttribute('data');
						getResultImg(result);
					}catch(e){
						if (e instanceof SyntaxError)
							location.href = location.href;
						console.log(e);
					}
				}
			}
		}());

		function getResultImg(img)
		{
			scroll_to_top();
			fil[0].value = "";
			user_img.removeAttribute('src');
			user_img.removeAttribute('data');
			user_img.removeAttribute('style');
			fix.style.display = 'none';
			result_space.style.display = 'flex';
			result_img.setAttribute('src', img);
		}
	}

	function scroll_to_top()
	{
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	}

	function userAreaChild(childrens)
 	{
		for (let child of childrens)
		{
			if (child.id !== 'user_img')
				if (child.className === 'a2_img' || (child.className === 'resize' && child.childNodes[0].className === 'a2_img'))
					return true;
		}
  		return false;
	}

	function takePhoto()
	{
		let context = canvas.getContext('2d');
		canvas.width = video.width;
		canvas.height = video.height;
		context.drawImage(video, 0, 0, video.width, video.height);

		var snap = canvas.toDataURL('image/png');
		user_img.setAttribute('src', snap);
		user_img.style.display = 'block';
		video.pause();
		video.style.display = "none";
	}

	function getWebCam(target)
	{
		let check = false;

		navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

		if (navigator.getUserMedia)
		{
			var options = {
				video:true}
		};

		navigator.getUserMedia(options, (stream) =>{
			video.srcObject = stream;
			video.play();
			check = true;
		}, (error) =>{
			target.attributes[1].nodeValue = '1';
			video.removeAttribute('style');
			alert(error.message);
		});
		return check;
	}

}