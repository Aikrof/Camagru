var log = document.getElementById('log_in');
var forgot = document.getElementById('forgot');

log.onclick = () =>{
	scroll_to_top();
	document.body.style.overflow = 'hidden';
	var errno = document.getElementsByClassName('error');

	for (let i = 0; i < errno.length; i++)
	{
		if (errno[i].attributes.data.nodeValue != 0)
		{
			this.errno[i].innerHTML = "";
			this.errno[i].style.width = "";
			this.errno[i].attributes.data.nodeValue = 0;
		}
	}

	var body = document.getElementsByTagName('body');
	body[0].style.backgroundColor = "rgba(0, 0, 0, 0.3)";
	var container = creat_container();

	container.innerHTML = "\
	<h1 id='signIn' class='unselectable'>Sign in</h1>\
		<div class='exit login_exit'></div>\
		<div id='con'>\
			<div id='logForm'>\
				<form id='login'>\
					<div class='form'>\
						<input type='text' name='login'><p class='p unselectable'>Username</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='form'>\
						<input type='password' name='password'><p class='p unselectable'>Password</p>\
							<div class='error' data=''></div>\
					</div>\
					<div class='passwd_forg'>\
						<a href='" + get_path('user/forgot') + "' class='forgot'><p class='unselectable'>Forgot password?</p></a>\
					</div>\
					<div class='rem'>\
						<input type='checkbox' id='remember' name='checkbox' checked data='1' onclick='check(this)'\>\
							<label for='remember' class='unselectable'>Remember me</label>\
					</div>\
					<div class='sub'>\
						<button id='logSubmit' type='submit' class='unselectable'>Sign in</button>\
					</div>\
				</div>\
			</div>\
		</div>";
	onkeydown = (evt) =>{
		key_down(evt, body[0], container);
	}
	container.addEventListener('mousedown', function(event){
		container_click(event, body[0], container);
	});
}

if (forgot)
{
	forgot.onsubmit = function(event){
		event = event || window.event;
		event.preventDefault();
		console.log(event.target);
	}
}

window.addEventListener('click', (event) =>{
	event = event || window.event;

	if (event.target.id === 'log_container')
		return;
	else if (event.target.localName === 'button')
	{
		event.preventDefault();

		var id = event.target.id;
		if (id === 'regSubmit' || id === 'logSubmit'
			|| id === 'forgotSubmit' || id === 'resendSubmit')
		{
			buttonOnClick(event.target.form, event.target.id);
		}
	}
});

function scroll_to_top() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function creat_container(){
	var container = document.createElement('div');
	container.id = 'log_container';
	document.body.appendChild(container);
	return (container);
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

function get_path(url)
{
	var path = document.getElementById('logo');
	path = path.childNodes[0].nextSibling.href;
	path += '/' + url;
	return (path);
}

function key_down(evt, body, container)
{
	evt = evt || window.event;
	
	if (document.getElementById('log_container') === null)
		return;

	var isEscape = false;
	if ("key" in evt)
		isEscape = (evt.key === "Escape" || evt.key === "Esc");
	else
		isEscape = (evt.keyCode === 27);
	if (isEscape)
	{
		body.style.backgroundColor = "#fff";
		document.body.removeChild(container);
	}
}

function container_click(event, body, container, result)
{
	event = event || window.event;

	if (event.target.id === 'log_container'
		|| event.target.className === 'exit login_exit')
	{
		document.body.removeChild(container);
		document.body.removeAttribute('style');
	}

	if (event.target.id === 'ok')
		window.location.href = result.url;
}

function check(box)
{
	if (box.attributes.data.value === '1')
	{
		box.attributes.data.value = '0';
		box.value = 'off';
	}
	else
	{
		box.value = 'on';
		box.attributes.data.value = '1';
	}
}