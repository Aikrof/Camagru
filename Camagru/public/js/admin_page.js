var target = new Object(null);
function userSrB(click) {
	var Amt_user_arrow = document.getElementById('Amt_user_arrow');
	var login_choice_space = document.getElementById('login_choice_space');
	var ucp_space = document.getElementById('ucp_space');
	var adm_no_form = document.getElementById('adm_no_form');
	var block_info = document.getElementById('block_info');
	var lcp_search = document.getElementById('lcp_search');
	var rgba_container = document.querySelector('.rgba_container_pr_user_img');
	
	var resur;

	if (!click.hasAttribute('data'))
	{
		click.setAttribute('data', "");

		(function(){
			var request = new XMLHttpRequest();
			request.open('POST', get_path("Admin/getUsers"), true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.send('get_users');
	
			request.onreadystatechange = ()=>{
				if (request.readyState != 4)
					return;
				else if (request.status != 200)
					location.href = get_path("");
				else
				{
					var result = JSON.parse(request.responseText);
					
					ucp_space.style.display = 'flex';
					
					if (result)
					{
						resur = result;
						printUsersForAdm(result, function(){
							Amt_user_arrow.style.display = 'flex';
							login_choice_space.style.display = 'flex';
						});
					}
				}
			}
		}());
	}
	else
	{
		removeBlockInfo(block_info.childNodes, function(){
			click.removeAttribute('data');
		});
		ucp_space.removeAttribute('style');
		Amt_user_arrow.removeAttribute('style');
		login_choice_space.removeAttribute('style');
	}


	function printUsersForAdm(result, call)
	{
		var callback = call || function(){};

		for (let elem of result){
			var gla_container = document.createElement('div');

			gla_container.className = 'gla_container';

			gla_container.innerHTML = '\
				<div class="click_info">\
				<img class="click_info_img" src="' +
				get_path('/public/img/icons/development-and-progress.png')
				+ '"></div>\
				<div class="gla_info"><p>' + elem.login + '</p></div>\
				<div class="gla_info"><p>'+ elem.email + '</p></div>\
				<div class="gla_info"><p>' + elem.icon + '</p></div>\
				<div class="gla_info"><p>'
				+ takeCreation(elem.creation_date) + '</p></div>';

			block_info.appendChild(gla_container);
		}
		callback();
	}

	document.body.addEventListener('mousedown', (event)=>{
		event = event || window.event

		if (target.element && event.target.classList[0] !== 'click_info_menu' &&
			event.target.className !== 'pr_user_img')
		{
			target.element.removeChild(target.element.lastElementChild);
			delete target.element;
		}

		if (event.target.className === 'abs_view')
			return;
		
		let abs_view = document.querySelector('.abs_view');
		if (abs_view)
		{
			let parent = abs_view.offsetParent;
			parent.removeAttribute('style');
			parent.firstChild.removeAttribute('style');
			parent.removeChild(abs_view);
		}
	});

	block_info.addEventListener('click', (event)=>{
		event = event || window.event;

		var elem;

		if (event.target.classList[0] === 'click_info_menu')
		{
			printUserImg(event.target.parentNode, 
				event.target.parentNode.parentNode.parentNode.childNodes[3].firstChild);
			return;
		}
		else if (event.target.classList[0] === 'click_info_img')
		{
			target.element = event.target.parentNode;
			let div =  document.createElement('div');
			div.className = "space_click_info_menu";
			div.innerHTML = '<p class="click_info_menu unselectable">\
							Delete User Img</p>';
			target.element.appendChild(div);
			return;
		}
		else if ((event.target.parentNode.className !== 'gla_info' &&
			event.target.className !== 'gla_info') ||
			event.target.className === 'abs_view')
			return;
		else if (event.target.className === 'gla_info')
			elem = event.target.firstChild;
		else
			elem = event.target;

		if (elem.innerText.length > 15)
		{
			let p = document.createElement('p');
			p.className = 'abs_view';
			p.innerHTML = elem.innerText;
			elem.parentNode.style.overflow = 'visible';
			elem.style.display = 'none';
			elem.parentNode.appendChild(p);
		}
	});

	onkeydown = (evt) =>{
		evt = evt || window.event;

			var isEscape = false;

			if ("key" in evt)
				isEscape = (evt.key === "Escape" || evt.key === "Esc");
			else
				isEscape = (evt.keyCode === 27);

		let abs_view = document.querySelector('.abs_view');
		if (isEscape && abs_view)
		{
			let parent = abs_view.offsetParent;
			parent.removeAttribute('style');
			parent.firstChild.removeAttribute('style');
			parent.removeChild(abs_view);
		}
		else if (rgba_container.hasAttribute('style'))
		{
			rgba_container.removeAttribute('style');
			removeChildRgbaContainer(rgba_container.lastElementChild);
		}

		if (target.element)
		{
			console.log(target.element);
			target.element.removeChild(target.element.lastElementChild);
			delete target.element;
		}
	}

	adm_no_form.onsubmit = (event)=>{
		event.preventDefault();
	}

	lcp_search.oninput = function(event){
		sortUcpSpace(this.value, resur);
	}

	function sortUcpSpace(value, res)
	{
		if (res)
		{
			res.sort(function(a, b){
				var i = 0;
				for ( ; i < value.length - 1; i++){
					if (a.login[i] !== value[i] ||
						b.login[i] !== value[i])
						break;
				}
				if (value[i] === a.login[i] && value[i] === b.login[i])
					return (0);
				else if (value[i] === a.login[i])
					return (-1);
				else if (value[i] === b.login[i])
					return (1);
			});

			removeBlockInfo(block_info.childNodes);
			printUsersForAdm(res);
			resur = res;
		}
	}

	rgba_container.onclick = function(event){
		event = event || window.event;

		if (event.target.className === 'rgba_container_pr_user_img' ||
			event.target.id === 'block_img_exit')
		{
			this.removeAttribute('style');
			removeChildRgbaContainer(this.lastElementChild);
		}
		else if (event.target.className === 'pr_user_img')
		{
			removeUserImg(event.target.id);
		}
	}
}

function removeUserImg(id)
{
	(function(){
		var json = function(){
			var json = "id=";

			return(
				json += encodeURIComponent(
					JSON.stringify(id)
				)
			);
		}();
		
		var request = new XMLHttpRequest();
		request.open('POST', get_path('Admin/removeUserImg'), true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		request.send(json);
	
		request.onreadystatechange = ()=>{
			if (request.readyState != 4)
				return;
			else if (request.status != 200)
				alert(request.status + request.responseText);
			else
			{
				// var result = JSON.parse(request.responseText);
				console.log(request.responseText);		
			}
		}

	}());
}

function removeChildRgbaContainer(child)
{
	let child_childrens = child.childNodes;
	while (child_childrens.length)
		child.removeChild(child_childrens[0]);
}

function printUserImg(parent, login)
{
	(function(){
		var json = function(){
			let json = "login=";
			return (
				json += encodeURIComponent(
					JSON.stringify(login.innerText))
			);
		}();

		var request = new XMLHttpRequest();
		request.open('POST', get_path('Admin/GetUserImg'), true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		request.send(json);
	
		request.onreadystatechange = ()=>{
			if (request.readyState != 4)
				return;
			else if (request.status != 200)
				alert(request.status + request.responseText)
			else
			{
				var result = JSON.parse(request.responseText);
				if (result)
					prImgs(parent, result, function(){
						document.getElementsByClassName('rgba_container_pr_user_img')[0].
						style.display = 'flex';
					});
			}
		}

	}());
}

function prImgs(parent, result, call)
{
	callback = call || function(){};

	let container = document.getElementsByClassName('container_pr_user_img')[0];

	for (let res of result){
		let div = document.createElement('div');
		let img = document.createElement('img');
		
		div.className = 'block_pr_user_img unselectable';
		img.className = 'pr_user_img';

		img.id = res.id;
		img.src = res.path;
		div.appendChild(img);
		container.appendChild(div);
	}
	callback();
}

function removeBlockInfo(children, call)
{
	var callback = call || function(){};

	while (children.length)
	{
		let child = children[0].childNodes;
		while (child.length)
			 children[0].removeChild(child[0]);
		block_info.removeChild(children[0]);
	}

	callback();
}

function takeCreation(elem)
{
	elem = elem.split('-');
	elem = elem.reverse();
	elem = elem.join(':');
	return (elem);
}