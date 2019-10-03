var search_form = document.getElementById('search_form');
var search_result = document.getElementById('search_result');
var butt_search = document.getElementById('search_hiden_butt');
var search = document.getElementById('search');

search_form.onsubmit = (event)=>{
	event = event || window.event;

	event.preventDefault();
	event.stopPropagation();

	if (!butt_search.hasAttribute('data') && search.value &&
		search.value.length > 1)
	{
		removeSearchResult()
		butt_search.setAttribute('data', "1");
		sendSearch();
	}
}

	butt_search.onclick = (event)=>{
		event = event || window.event;

		event.preventDefault();
		event.stopPropagation();

		if (!butt_search.hasAttribute('data') && search.value &&
			search.value.length > 1)
		{
			removeSearchResult()
			butt_search.setAttribute('data', "1");
			sendSearch();
		}
	}

	window.addEventListener('click', (event)=>{
		event = event || window.event;

		if (!search_result.hasAttribute('style'))
			return;
		else if (event.target.classList[1] === 'ser_cl')
		{
			userSearchTrans(event.target);
		}
		else if (event.target.id !== 'search_result' &&
			event.target.parentElement.id !== 'search_result')
		{
			removeSearchResult();
			search_result.removeAttribute('style');
		}
	});

	window.addEventListener('mouseover', (event)=>{
		event = event || window.event;

		if (event.target.classList[1] !== 'ser_cl')
			return;

		var parent = event.target.parentElement;

		parent.childNodes[0].style.border = '2px solid #079BCF';
		parent.childNodes[0].style.transition = 'box-shadow 1s ease, color 0.4s ease';

		parent.childNodes[1].style.color = '#079BCF';
		parent.childNodes[1].style.fontSize = '23px';
		parent.childNodes[1].style.fontWeight = 'bold';
	});

	window.addEventListener('mouseout', (event)=>{
		event = event || window.event;

		if (event.target.classList[1] !== 'ser_cl')
			return;

		var parent = event.target.parentElement;

		parent.childNodes[0].removeAttribute('style');
		parent.childNodes[1].removeAttribute('style');
	});

	function sendSearch()
	{
		(function(){
			var json = function(){
				var json = "search=";

				json += encodeURIComponent(JSON.stringify(search.value));
				return (json);
			}();

			var request = new XMLHttpRequest();
			request.open('POST', get_path("Common/search"), true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.send(json);

			request.onreadystatechange = ()=>{
				if (request.readyState != 4)
					return;
				else if (request.status != 200)
					location.href = get_path("");
				else
				{
					var result = JSON.parse(request.responseText);
					if (result)
						printSearchResult(result);
					search_result.style.display = 'flex';
					butt_search.removeAttribute('data');
				}
			}
		}());

		function printSearchResult(result)
		{
			for (let res of result){
				var div = document.createElement('div');
				var img = document.createElement('img');
				var p = document.createElement('p');

				div.className = 'res_search_block unselectable';
				img.className = 'res_search_user_icon ser_cl';
				p.className = 'res_search_user_login ser_cl';

				img.setAttribute('src', res.icon);
				p.innerHTML = res.login;

				div.appendChild(img);
				div.appendChild(p);
				search_result.appendChild(div);
			}
		}
	}

	function removeSearchResult()
	{
		while (search_result.childNodes.length)
		{
			let child = search_result.childNodes[0];
			while (child.childNodes.length)
			{
				child.removeChild(child.childNodes[0]);
			}
			search_result.removeChild(child);
		}
	}

	function userSearchTrans(target)
	{
		var parent = target.parentElement;
		var login = parent.lastChild.innerText;

		location.href = get_path("UserArea/page")+ '?user=' + login;
	}

window.onunload = function(){
	var request = new XMLHttpRequest();
	request.open('POST', get_path('/windowClose'), true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.send('close');
}
