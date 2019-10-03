function connection(elem, sub, form, errno)
{
	this.elem = elem;
	this.errno = errno;

	var answ = function(){

		var json = function(){
			var json = 'data=';
			var obj = {};

			for (let i = 0; i < this.elem.length; i++)
			{
				if (this.elem[i].localName === 'input')
				{
					obj[this.elem[i].name] = this.elem[i].value;
				}
			}
			json += encodeURIComponent(JSON.stringify(obj));
			return json;
		}();

	var request = new XMLHttpRequest();
	var url;

	if (form.id === "form" || form.id === "login")
	{
		url = form.id === "form" ? get_path("user/set") : get_path("user/get");
	}
	else if (form.id === "forgot" || form.id === "resend")
	{
		url = form.id === "forgot" ? get_path("user/forgot") : get_path("user/resend");
	}

	request.open('POST', url, true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.send(json);
	sub.disabled = true;

	request.onreadystatechange = function()
	{
		sub.disabled = false;
		if (request.readyState != 4)
			return;
		if (request.status != 200)
		{
			alert(request.status + ': ' + request.statusText);
		}
		else
		{
			var result = JSON.parse(request.responseText);
			answer(result, form, sub);
		}
	}
	}();
}

function answer(result, form, sub)
{
	if (form.id === "form")
		regAnswValid(result);
	else if (form.id === "login")
		logAnswValid(result);
	else if (form.id === "forgot")
		forgotAnswValid(result);
	else if (form.id === "resend")
		resendAnswValid(result);
 
	function regAnswValid(result)
	{
		clear_form();

		if (result.url)
		{
			for (let i = 0; i < form.length; i++)
				form[i].value = "";

			var body = document.getElementsByTagName('body');
			body[0].style.backgroundColor = "rgba(0, 0, 0, 0.3)";

			var container = creat_container();

			container.innerHTML = "\
			<h1 id='Confirm_em_adr' class='unselectable'>Confirm e-mail</h1>\
			<div class='exit login_exit'></div>\
			<div id='confirm_con'>\
				<div id='confirm'>\
					<p id='send'>\
						We have send an email with a confirmation link to your email address.\
						In order to complete the sign-up process, please click the confirmation link.\
					</p>\
					<div class='sub'>\
						<button id='ok' type='button' class='unselectable'>Ok</button>\
					</div>\
				</div>\
			</div>";
			onkeydown = (evt) =>{
				key_down(evt, body[0], container);
			}
			container.addEventListener('mousedown', function(event){
				container_click(event, body[0], container, result);
			});
		}

		if (result['login'] !== undefined &&
			result['email'] !== undefined)
		{
			this.errno[0].style.width = "323px";
			this.errno[0].innerHTML = result['login']; 
			this.form.login.style.border = '2px solid red';
			this.errno[0].attributes.data.nodeValue = 2;

			this.errno[1].style.width = "323px";
			this.errno[1].innerHTML = result['email']; 
			this.form.email.style.border = '2px solid red';
			this.errno[1].attributes.data.nodeValue = 2;

			this.errno[2].style.width = "323px";
			this.errno[2].innerHTML = "<a href='forgot' class='forgot'><p class='unselectable'>Forgot your password?</p></a>";
			this.errno[2].style.color = "#079BCF";
			this.errno[2].style.textAlign = "center";
			this.errno[2].attributes.data.nodeValue = 2;

			this.errno[3].style.width = "323px";
			this.errno[3].attributes.data.nodeValue = 2;
		}
		else
		{
			if (result['login'] !== undefined)
			{
				this.errno[0].style.width = "323px";
				this.errno[0].innerHTML = result['login'];
				this.errno[0].attributes.data.nodeValue = 2;
			}
			if (result['email'] !== undefined)
			{
				this.errno[1].style.width = "323px";
				this.errno[1].innerHTML = result['email'];
				this.errno[1].attributes.data.nodeValue = 2;
			}
			if (result['confirm'] !== undefined)
			{
				this.errno[3].style.width = "323px";
				this.errno[3].innerHTML = result['confirm'];
				this.errno[3].attributes.data.nodeValue = 2;
			}
		}

		function clear_form()
		{

			if (this.errno[0].attributes.data.nodeValue == 2 &&
				this.errno[1].attributes.data.nodeValue == 2 &&
				this.errno[3].attributes.data.nodeValue == 2)
			{
				this.errno[0].innerHTML = "";
				this.errno[0].style.width = "";
				this.errno[0].attributes.data.nodeValue = 0;
			
				this.errno[1].innerHTML = "";
				this.errno[1].style.width = "";
				this.errno[1].attributes.data.nodeValue = 0;
			
				this.errno[2].innerHTML = "";
				this.errno[2].style.width = "";
				this.errno[2].attributes.data.nodeValue = 0;

				this.errno[3].style.width = "";
				this.errno[3].attributes.data.nodeValue = 0;
			}
			else if (this.errno[0].attributes.data.nodeValue == 2)
			{
				this.errno[0].innerHTML = "";
				this.errno[0].style.width = "";
				this.errno[0].attributes.data.nodeValue = 0;
			}
			else if (this.errno[1].attributes.data.nodeValue == 2)
			{
				this.errno[1].innerHTML = "";
				this.errno[1].style.width = "";
				this.errno[1].attributes.data.nodeValue = 0;
			}
			else if (this.errno[3].attributes.data.nodeValue == 2)
			{
				this.errno[3].innerHTML = "";
				this.errno[3].style.width = "";
				this.errno[3].attributes.data.nodeValue = 0;
			}
		}
	}

	function logAnswValid(result)
	{
		var con = document.getElementById('con');
		var exit = document.getElementsByClassName('exit');

		clear_form(con, exit);

		if (result.url)
			window.location.href = result.url;
		else
		{
			con.style.width = "643px";
			exit[0].style.marginLeft = "290px";
			if (result.login !== undefined)
			{
				this.errno[0].style.width = "323px";
				this.errno[0].innerHTML = result['login']; 
				this.form.login.style.border = '2px solid red';
				this.errno[0].attributes.data.nodeValue = 2;
			}
			if (result.password !== undefined)
			{
				this.errno[1].style.width = "323px";
				this.errno[1].innerHTML = result['password']; 
				this.form.password.style.border = '2px solid red';
				this.errno[1].attributes.data.nodeValue = 2;
			}
			if (result.confirm !== undefined)
			{
				this.errno[0].style.width = "323px";
				this.errno[0].innerHTML = result['confirm'];
				this.form.login.style.border = '2px solid red';
				this.errno[0].attributes.data.nodeValue = 2;

				this.errno[1].style.width = "323px";
				this.errno[1].innerHTML = "<div class='forgot'><a id='resend_activation' href='" + get_path('user/resend') + "'>\
										<p class='unselectable'>Resend activation?</p></a></div>"; 
				this.form.password.style.border = '2px solid red';
				this.errno[1].attributes.data.nodeValue = 2;
			}
		}
		
		function clear_form(con, exit)
		{
			if (con.style.width === "643px")
			{
				this.errno[0].innerHTML = "";
				this.errno[0].style.width = "";
				this.errno[0].attributes.data.nodeValue = 0;
				this.form.login.style.border = '2px solid #ccc';

				this.errno[1].innerHTML = "";
				this.errno[1].style.width = "";
				this.errno[1].attributes.data.nodeValue = 0;
				this.form.password.style.border = '2px solid #ccc';

				con.style.width = "520px";
				exit[0].style.marginLeft = "230px";
			}
		}
	}

	function forgotAnswValid(result)
	{
		clear_form();

		if (result.url)
		{
			for (let i = 0; i < form.length; i++)
				form[i].value = "";

			var body = document.getElementsByTagName('body');
			body[0].style.backgroundColor = "rgba(0, 0, 0, 0.3)";

			var container = creat_container();

			container.innerHTML = "\
			<h1 id='Confirm_em_adr' class='unselectable'>New password</h1>\
			<div class='exit login_exit'></div>\
			<div id='confirm_con'>\
				<div id='confirm'>\
					<p id='send'>\
						We have send an email with a new password, please check your e-mail.\
					</p>\
					<div class='sub'>\
						<button id='ok' type='button' class='unselectable'>Ok</button>\
					</div>\
				</div>\
			</div>";
			onkeydown = (evt) =>{
				key_down(evt, body[0], container);
			}
			container.addEventListener('mousedown', function(event){
				container_click(event, body[0], container, result);
			});
		}
		else if (result.email !== undefined)
		{
			this.errno[0].style.width = "323px";
			this.errno[0].innerHTML = result.email; 
			this.form.email.style.border = '2px solid red';
			this.errno[0].attributes.data.nodeValue = 2;
		}
		else if (result.confirm)
		{
			this.errno[0].style.width = "323px";
			this.errno[0].innerHTML = result.confirm + "<div class='forgot'><a id='resend_activation' href='" + get_path('user/resend') + "''>\
									<p class='unselectable'>Resend activation?</p></a></div>"; 
			this.form.email.style.border = '2px solid red';
			this.errno[0].attributes.data.nodeValue = 2;
		}

		function clear_form()
		{

			if (this.errno[0].attributes.data.nodeValue == 2)
			{
				this.errno[0].innerHTML = "";
				this.errno[0].style.width = "";
				this.errno[0].attributes.data.nodeValue = 0;
			}
		}
	}

	function resendAnswValid(result)
	{
		clear_form();

		if (result.url)
		{
			for (let i = 0; i < form.length; i++)
				form[i].value = "";

			var body = document.getElementsByTagName('body');
			body[0].style.backgroundColor = "rgba(0, 0, 0, 0.3)";

			var container = creat_container();

			container.innerHTML = "\
			<h1 id='Confirm_em_adr' class='unselectable'>Confirm e-mail</h1>\
			<div class='exit login_exit'></div>\
			<div id='confirm_con'>\
				<div id='confirm'>\
					<p id='send'>\
						We have send an email with a confirmation link to your email address.\
						In order to complete the sign-up process, please click the confirmation link.\
					</p>\
					<div class='sub'>\
						<button id='ok' type='button' class='unselectable'>Ok</button>\
					</div>\
				</div>\
			</div>";
			onkeydown = (evt) =>{
				key_down(evt, body[0], container);
			}
			container.addEventListener('mousedown', function(event){
				container_click(event, body[0], container, result);
			});
		}
		else if (result.login !== undefined)
		{
			this.errno[0].style.width = "323px";
			this.errno[0].innerHTML = result.login; 
			this.form.login.style.border = '2px solid red';
			this.errno[0].attributes.data.nodeValue = 2;
		}
		else if (result.email !== undefined)
		{
			this.errno[1].style.width = "323px";
			this.errno[1].innerHTML = result.email; 
			this.form.email.style.border = '2px solid red';
			this.errno[1].attributes.data.nodeValue = 2;
		}
		else if (result.confirm !== undefined)
		{
			this.errno[0].style.width = "323px";
			this.errno[0].innerHTML = result.confirm; 
			this.form.login.style.border = '2px solid red';
			this.errno[0].attributes.data.nodeValue = 2;
		}

		function clear_form()
		{
			if (this.errno[0].attributes.data.nodeValue == 2)
			{
				this.errno[0].innerHTML = "";
				this.errno[0].style.width = "";
				this.errno[0].attributes.data.nodeValue = 0;
			}
			else if (this.errno[1].attributes.data.nodeValue == 2)
			{
				this.errno[1].innerHTML = "";
				this.errno[1].style.width = "";
				this.errno[1].attributes.data.nodeValue = 0;
			}
		}
	}
}