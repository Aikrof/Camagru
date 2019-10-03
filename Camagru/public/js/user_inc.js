
function user_menu(){
	var log_user = document.getElementById('log_user');
	var abs_func = document.getElementById('abs_func');
	var friends = document.getElementById('friEs21K');
	var Fr2Es_container = document.getElementById('Fr2Es_container');
	var settings = document.getElementById('setAs1s');
	var li_cont = document.getElementById('li_cont');
	var re_icon = document.getElementById('re_icon');
	var icon_inp = document.getElementById('icon_inp');
	var exit = document.getElementById('exit');
	var change_send = document.getElementById('change_send');
	var change_login = document.getElementById('change_login');
	var change_passwd = document.getElementById('change_passwd');
	var	change_email = document.getElementById('change_email');

	(function(){
		let user_ico_A2kU = document.getElementById('user_ico_A2kU');
		let user_echo = document.getElementById('user_echo');

		if (!log_user.hasAttribute('check'))
		{
			log_user.setAttribute('check', '');

			user_ico_A2kU.style = ['width: 55px;height: 55px;\
									background: url("/Camagru/public/img/icons/user_gradient.png");\
									background-repeat: no-repeat;\
									background-size: 55px;'];
			user_echo.style = ['position: absolute;top: 42px;left: 58px;\
						  background-color: orange;\
						  font-size: 25px;\
						  transition: box-shadow 1s ease, color 0.4s ease;\
						  color: #079BCF;'];

			abs_func.style.display = 'block';

			settings.onclick = () =>{
				if (li_cont.style.display === '')
					li_cont.style.display = 'flex';
				else
					li_cont.removeAttribute('style');
			}

			friends.onclick = ()=>{
				if (Fr2Es_container.style.display === '')
					getFriends();
				else
					removeFriendsCont();
			}

			icon_inp.onchange = (icon) =>{
				let file = icon.target.files[0];

				if (!file)
					return;
				if (!file.type.match('image*'))
				{
					alert('Invalid file type.');
					return;
				}
				if (file.size >  7000000 || file.size == 0)
				{
					alert('Invalid image');
					return false;
				}
				
				(function(){
					let i = document.getElementById('i');
					let menu_form = document.getElementById('menu_form');
					let formData = new FormData(menu_form);

					formData.append('icon', icon.target.value);

					let request = new XMLHttpRequest();
					request.open('POST', get_path('setIcon'), true);
					request.send(formData);

					request.onreadystatechange = function(){
						if (request.readyState != 4)
							return;
						else if (request.status != 200)
							return;
						else
						{
							let result = JSON.parse(request.responseText);
							
							if (result.err)
								alert(result.err);
							else
								i.setAttribute('src', result.src);
						}
					}

				}());
			}

			exit.onclick = ()=>{
				(function(){
					let request = new XMLHttpRequest();
					request.open('POST', get_path('exit'), true);
					request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					request.send('exit');

					request.onreadystatechange = function(){
						if (request.readyState != 4)
							return;
						else if (request.status != 200)
							return;
						else
						{
							let result = JSON.parse(request.responseText);
							document.location.href = result.url;
						}
					}
				}());
			}

			change_send.onclick = ()=>{
				change_send.classList.toggle("c");
				if (change_send.className === 'c')
					change_send.innerHTML = "Send me emails";
				else
					change_send.innerHTML = "Do not send me emails";
				var request = new XMLHttpRequest();

				request.open('POST', get_path('changeSend'), true);
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				request.send("change");

				request.onreadystatechange = function(){
					if (request.readyState != 4)
						return;
					else if (request.status != 200)
						location.href = location.href;
				}
			}

			change_login.onclick = ()=>{
				var container = creat_container();

				container.innerHTML = "\
		<h1 id='signIn' class='unselectable'>Change login</h1>\
		<div class='exit login_exit'></div>\
		<div id='con'>\
			<div id='logForm'>\
				<form class='f_change'>\
					<div class='form'>\
						<input type='password' name='password'><p class='p unselectable'>Password</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='form'>\
						<input type='password' name='confirm'><p class='p unselectable'>Confirm</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='form'>\
						<input type='text' name='login' autocomplete='off'><p class='p unselectable'>New login</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='sub'>\
						<button id='but_passwd' type='button' class='unselectable'>Change</button>\
					</div>\
				</div>\
			</div>\
		</div>";
			}

			change_passwd.onclick = ()=>{
				var container = creat_container();

				container.innerHTML = "\
		<h1 id='signIn' class='unselectable'>Change password</h1>\
		<div class='exit login_exit'></div>\
		<div id='con'>\
			<div id='logForm'>\
				<form class='f_change'>\
					<div class='form'>\
						<input type='password' name='password'><p class='p unselectable'>Password</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='form'>\
						<input type='password' name='confirm'><p class='p unselectable'>Confirm</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='form'>\
						<input type='password' name='new_password'><p class='p unselectable'>New password</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='sub'>\
						<button id='but_passwd' type='button' class='unselectable'>Change</button>\
					</div>\
				</div>\
			</div>\
		</div>";
			}

			change_email.onclick = ()=>{
				var container = creat_container();

				container.innerHTML = "\
		<h1 id='signIn' class='unselectable'>Change E-Mail</h1>\
		<div class='exit login_exit'></div>\
		<div id='con'>\
			<div id='logForm'>\
				<form class='f_change'>\
					<div class='form'>\
						<input type='password' name='password'><p class='p unselectable'>Password</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='form'>\
						<input type='password' name='confirm'><p class='p unselectable'>Confirm</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='form'>\
						<input type='text' name='email'><p class='p unselectable'>New E-Mail</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='sub'>\
						<button id='butt_email' type='button' class='unselectable'>Change</button>\
					</div>\
				</div>\
			</div>\
		</div>";
			}
		}
		else
		{
			removeUserMenu();
		}

		window.addEventListener('mouseup', (event)=>{
			event = event || window.event;

			event.stopPropagation();

			let user_container = document.getElementById('user_container');
			let abs_func = document.getElementById('abs_func');

			if (user_container !== null)
			{
				if (event.target.id === 'user_container')
					document.body.removeChild(user_container);
				else if (event.target.className === 'exit login_exit')
					document.body.removeChild(user_container);
			}
		});

		window.addEventListener('click', (event)=>{
			event = event || window.event;

			if (event.target.offsetParent !== null && abs_func.hasAttribute('style') && (event.target.id !== 'include' &&
				event.target.offsetParent.id !== 'abs_func' &&
				event.target.id !== 'user_ico_A2kU' &&
				event.target.id !== 'user_echo'))
			{
				removeUserMenu();
			}

			if (event.target.classList[1] === 'frList_lin')
				userSearchTrans(event.target);
			let user_container = document.getElementById('user_container');
			
			if (user_container !== null)
			{
				let form = document.getElementsByClassName('f_change')[0];

				if (event.target.localName === form[form.length - 1].localName)
				{
					for (let field of form){
						if (field.localName === 'input')
							validateFormFields(field);
					}

					let check = 1;
					for (let check_valid of form){
						let err = check_valid.parentElement.getElementsByClassName('error')[0];

						if (check_valid.localName === 'input')
						{
							if (err !== undefined && err.attributes.data.nodeValue == 1)
							{
								check = 0;
								break;
							}
						}
					}

					if (check == 1)
						sendForm(form);
				}
			}

		});

		onkeydown = (evt) =>{
			evt = evt || window.event;

			if (document.getElementById('user_container') !== null)
			{
				var isEscape = false;

				if ("key" in evt)
					isEscape = (evt.key === "Escape" || evt.key === "Esc");
				else
					isEscape = (evt.keyCode === 27);

				if (isEscape)
					document.body.removeChild(document.getElementById('user_container'));
			}
			else if (abs_func.hasAttribute('style'))
			{
				var isEscape = false;

				if ("key" in evt)
					isEscape = (evt.key === "Escape" || evt.key === "Esc");
				else
					isEscape = (evt.keyCode === 27);

				if (isEscape)
					removeUserMenu();
			}
		}

		window.addEventListener('focusin', (event) =>{
			event = event || window.event;

			if (event.target.id === 'search')
				return;
			else if (event.target.localName === 'input' && event.target.type !== 'checkbox')
			{
				event.target.nextElementSibling.style.color = "#079BCF";
				event.target.style.borderColor = "#079BCF";
			}
		});
		window.addEventListener('focusout', (event) =>{
			event = event || window.event;
			
			if (event.target.id === 'search')
				return;
			else if (event.target.localName === 'input'  && event.target.type !== 'checkbox')
			{
				event.target.nextElementSibling.style.color = "black";
				event.target.style.borderColor = "#ccc";
			}
		});
	
	}());

	window.addEventListener('mouseover', (event)=>{
		event = event || window.event;

		if (event.target.classList[1] !== 'frList_lin')
			return;

		var parent = event.target.parentElement;

		parent.childNodes[0].style.border = '2px solid #079BCF';
		parent.childNodes[0].style.transition = 'box-shadow 1s ease, color 0.4s ease';

		parent.childNodes[1].style.color = '#079BCF';
		parent.childNodes[1].style.fontSize = '24px';
		parent.childNodes[1].style.transition = 'box-shadow 1s ease, color 0.4s ease';
	});

	window.addEventListener('mouseout', (event)=>{
		event = event || window.event;

		if (event.target.classList[1] !== 'frList_lin')
			return;

		var parent = event.target.parentElement;

		parent.childNodes[0].removeAttribute('style');
		parent.childNodes[1].removeAttribute('style');
	});
}

function sendForm(form)
{
	(function(){

		var json = function(){
			var json = "data=";

			var obj = {};

			for (let field of form){
				if (field.localName === 'input')
					obj[field.name] = field.value;
			}

			json += encodeURIComponent(JSON.stringify(obj));
			return (json);
		}();
		
		var request = new XMLHttpRequest();

		request.open('POST', get_path('change'), true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		request.send(json);

		request.onreadystatechange = ()=>{

			if (request.readyState != 4)
				return;
			else if (request.status != 200)
				document.location.href = get_path();
			else
			{
				var result = JSON.parse(request.responseText);
				validChangeResult(result, form, function(){
					if (!result.err)
						location.href = location.href;
				});
			}
		}

	}());

	function validChangeResult(result, form, call)
	{
		callback = call || function(){};
		var key = Object.keys(result)[0];

		for(let field of form){
			if (field.name === key)
			{
				setErr(Object.values(result)[0], field);
				return;
			}
		}
		callback();
	}
}

function validateFormFields(field)
{
	var err = field.parentElement.getElementsByClassName('error')[0];
	var con = document.getElementById('con');
	var exit = document.getElementsByClassName('exit login_exit')[0];

	if (field.name === 'password' || field.name === 'confirm' ||
		field.name === 'new_password')
	{
		let regexp = /^(?=.*[0-9])(?=.*[a-z])(?=\S+$).{7,}$/;
		
		if (!regexp.test(field.value))
		{
			let text = "Passwords must be at least 8 characters in length,\
				and must contain numeric and  characters symbols";

			setErr(text, field);
		}
		else
		{
			if (err.attributes.data.nodeValue == 1)
				removeErr();
		}
	}
	else if (field.name === 'email')
	{
		var regexp = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

		if (!regexp.test(field.value))
		{
			let text = "Invalid email address";

			setErr(text, field);
		}
		else
		{
			if (err.attributes.data.nodeValue == 1)
				removeErr();
		}
	}
	else if (field.name === 'login')
	{
		var regexp = /^[Aa-zZ]+([_]?[Aa-zZ0-9]+){3,}$/i;

		if (!regexp.test(field.value))
		{
			let text = "Invalid login.";
			setErr(text, field);
		}
		else
		{
			if (err.attributes.data.nodeValue == 1)
				removeErr();
		}
	}

	function removeErr()
	{
		con.removeAttribute('style');
		exit.removeAttribute('style');

		err.removeAttribute('style');
		err.innerHTML = "";
		field.removeAttribute('style');
		err.attributes.data.nodeValue = 0;
	}
}

function getFriends()
{
	Fr2Es_container.style.display = 'flex';

	(function(){

		var request = new XMLHttpRequest();
		request.open('POST', get_path('getFriendsList'), true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		request.send("getFriends");

		request.onreadystatechange = ()=>{

			if (request.readyState != 4)
				return;
			else if (request.status != 200){
				document.location.href = get_path();
			}
			else
			{
				var result = JSON.parse(request.responseText);
				if (result)
					creatFriendsList(result);
			}
		}
	}());

	function creatFriendsList(result)
	{
		for(let friend of result){
			var block = document.createElement('div');
			var icon = document.createElement('img');
			var login = document.createElement('p');

			block.className = 're_frList_block unselectable';
			icon.className = 're_frList_ic frList_lin';
			login.className = 're_frList_log frList_lin';

			icon.setAttribute('src', friend.icon);
			login.innerHTML = friend.login;

			block.appendChild(icon);
			block.appendChild(login);
			Fr2Es_container.appendChild(block);	
		}
	}
}

function setErr(text, field)
{
	var err = field.parentElement.getElementsByClassName('error')[0];
	var con = document.getElementById('con');
	var exit = document.getElementsByClassName('exit login_exit')[0];
	
	con.style.width = "720px";
	exit.style.marginLeft = "330px";

	err.style.width = "323px";
	err.innerHTML = text;
	field.style.border = '2px solid red';
	err.attributes.data.nodeValue = 1;
}

function get_path(url)
{
	var path = document.getElementById('logo');
	path = path.childNodes[0].nextSibling.href;
	path += '/' + url;
	return (path);
}

function creat_container(){
	var container = document.createElement('div');
	container.id = 'user_container';
	var height = Math.max(
				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight
				);
	container.style.height = height + 'px';
	document.body.appendChild(container);
	return (container);
}

function removeUserMenu()
{
	log_user.removeAttribute('check');
	user_ico_A2kU.removeAttribute('style');
	user_echo.removeAttribute('style');
	abs_func.removeAttribute('style');

	if (li_cont.hasAttribute('style'))
		li_cont.removeAttribute('style');
	removeFriendsCont();
}

function removeFriendsCont()
{

	while (Fr2Es_container.childNodes.length)
	{
		let child = Fr2Es_container.childNodes[0];
		while (child.childNodes.length)
		{
			child.removeChild(child.childNodes[0]);
		}
		Fr2Es_container.removeChild(child);
	}

	Fr2Es_container.removeAttribute('style');
}