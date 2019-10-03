function admin_menu(){
	var log_user = document.getElementById('log_user');
	var abs_func = document.getElementById('abs_func');
	var exit = document.getElementById('exit');

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
		}
		else
		{
			log_user.removeAttribute('check');
			user_ico_A2kU.removeAttribute('style');
			user_echo.removeAttribute('style');
			abs_func.removeAttribute('style');
		}
	}());
}

function get_path(url)
{
	var path = document.getElementById('logo');
	path = path.childNodes[0].nextSibling.href;
	path += '/' + url;
	return (path);
}

window.addEventListener('keydown', (evt)=>{
	evt = evt || window.event;

	var isEscape = false;

	if ("key" in evt)
		isEscape = (evt.key === "Escape" || evt.key === "Esc");
	else
		isEscape = (evt.keyCode === 27);
	
	if (isEscape && abs_func.hasAttribute('style'))
	{
		if (isEscape)
		{
			log_user.removeAttribute('check');
			user_ico_A2kU.removeAttribute('style');
			user_echo.removeAttribute('style');
			abs_func.removeAttribute('style');
		}
	}
});
