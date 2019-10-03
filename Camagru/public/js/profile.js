var my_profile = document.getElementById('my_profile');
var main_inp = document.getElementById('hidden');
var select_container = document.getElementById('select_container');
var escImg = document.getElementById('escImg');
var posts_cont_FEs5t = document.getElementById('posts_cont_FEs5t');
var cou_block = document.getElementById('cou_block');

	(function(){
		if (main_inp !== null && main_inp.value === "")
		{
			main_inp.value = 0;
			sendRequestToGetContent();
		}
	}());

	function sendRequestToGetContent()
	{
		var json = function(){
			var json = 'val=';
			json +=  encodeURIComponent(JSON.stringify(main_inp.value));
			return json;
		}();

		var request = new XMLHttpRequest();

		request.open('POST', location.href, true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		request.send(json);

		request.onreadystatechange = ()=>{
			if (request.readyState != 4)
				return;
			else if (request.status != 200)
				document.location.href = get_path("");
			else
			{
				var result = JSON.parse(request.responseText);
				if (result)
				{
					creatResultDiv(result);
					main_inp.attributes.data.nodeValue = '0';
				}
			}
		}

		function creatResultDiv(result)
		{
			for (let val of result){
				let div = document.createElement('div');
				let img = document.createElement('img');
				let rgba_div = document.createElement('div');
				let likes_img = document.createElement('img');

				div.className = 'profile_content unselectable';
				div.id = val.id;

				img.className = 'AeS83i';
				img.setAttribute('src', val.src);

				rgba_div.className = 'rgba_div';
				likes_img.className = 'likes_img unselectable';


				let src_likes_img = val.img_liked === 0 ?
				get_path("public/img/icons/like_red.svg") :
				get_path("public/img/icons/like_white.png");
				likes_img.setAttribute('src', src_likes_img);

				rgba_div.appendChild(likes_img);

				div.appendChild(img);
				div.appendChild(rgba_div);

				my_profile.appendChild(div);

			}
			main_inp.value = parseInt(main_inp.value) + 10;
		}	
	}

	window.addEventListener('click', (event)=>{
		event = event || window.event;

		event.stopPropagation();

		if (event.target.className === 'like_RB')
		{
			let target = event.target.src.split('/');
			target = target[target.length - 1];
			addLikeToImg(event.target.parentNode.parentNode.
					nextElementSibling.attributes.target.value);
		}
		else if (event.target.classList[0] === 'add_friend_butt' ||
				 event.target.id === 'page_user_butt')
		{
			let login = event.target.previousElementSibling.innerHTML;
			addFriend(login, event.target);
		}

		if (event.target.className === 'irF82kf' ||
			event.target.className === 'lrd43df' ||
			event.target.className === 'img_lks over' ||
			event.target.className === 'p_lks over')
		{
			let children = event.target.parentNode.childNodes;
			let login;

			for (let child of children){
				if (child.className === 'lrd43df' ||
					child.className === 'p_lks over')
				{
					login = child.innerText;
					break;
				}
			}

			if (login)
				userTransition(login);
		}

		if (event.target.id === 'post_butt')
		{
			let val = event.target.previousElementSibling.value;
			event.target.previousElementSibling.value = "";
			let target = event.target.parentNode.attributes.target.nodeValue;
			takeNewPost(val, target);
			return;
		}
		else if (event.target.id === 'Erp7DRx' || event.target.id === 'Erp6DFx' ||
		event.target.className === 'select_exit')
		{
			removeSelectContainer();
			return;
		}
		else if (event.target.className !== 'rgba_div'
			&& event.target.parentNode.className !== 'rgba_div')
			return;

		var target;
		var img_id;

		var like_RB = document.getElementsByClassName('like_RB')[0];
		var src_like_RB;

		if (event.target.className === "likes_img unselectable")
		{
			target = event.target.parentNode.previousElementSibling;
			img_id = event.target.parentNode.parentNode.id;
			src_like_RB = event.target.parentNode.firstChild.src;
		}
		else
		{
			target = event.target.parentNode.firstChild;
			img_id = event.target.parentNode.id;
			src_like_RB = event.target.firstChild.src;
		}

		let spl = src_like_RB.split('/');
		if (spl[spl.length - 1] === 'like_white.png')
		{
			spl[spl.length - 1] = 'like_black.svg';
			src_like_RB = spl.join('/');
		}

		select_container.style.display = 'flex';
		select_container.style.top = window.pageYOffset + 'px';
		escImg.setAttribute('src', target.src);
		document.body.style.overflow = 'hidden';

		like_RB.setAttribute('src', src_like_RB);

		getPostsAndLikes(img_id);

	});

	function addLikeToImg(target_id)
	{
		(function(){
			var json = function(){
				var json = 'like='

				json += encodeURIComponent(JSON.stringify(target_id));
				return (json);
			}();

			var request = new XMLHttpRequest();
			request.open('POST', get_path('Common/addLike'), true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.send(json);

			request.onreadystatechange = ()=>{
				if (request.readyState != 4)
					return;
				else if (request.status != 200)
					document.location.href = get_path("");
				else
				{
					var result = JSON.parse(request.responseText);

					if (result)
					{
						let like_cont_Es3 = document.getElementsByClassName('like_cont_Es3')[0];
						let like_RB = like_cont_Es3.firstElementChild;
						let like_count_cou_cou_block = like_cont_Es3.lastElementChild.firstElementChild;
						let profile_content = document.getElementsByClassName('profile_content'); 
						let like_img_rgba_div;
						let like_count_rgba_div;
						for (let elem of profile_content){
							if (elem.attributes.id.value == target_id)
							{
								like_img_rgba_div = elem.lastElementChild.firstElementChild;
								like_count_rgba_div = elem.lastElementChild.lastElementChild;
								break;
							}
						}
				
						let like_img;
						if (!result.delete)
						{
							like_img = get_path("public/img/icons/like_red.svg");
							like_RB.attributes.src.value = like_img;
							cou_block.innerHTML = parseInt(cou_block.innerHTML) + 1;
							creatLikes(result);
						}
						else
						{
							like_img = get_path("public/img/icons/like_white.png");
							like_RB.attributes.src.value = get_path("public/img/icons/like_black.svg");
							cou_block.innerHTML = parseInt(cou_block.innerHTML) - 1;
							removeLikes(result);
						}
						like_img_rgba_div.attributes.src.value = like_img;
					}
				}
			}
		}());
	}

	function addFriend(login, target)
	{
		(function(){
			var json = function(){
				var json = 'friend=' + encodeURIComponent(JSON.stringify(login));
				return (json);
			}();
			
			var request = new XMLHttpRequest();
			request.open('POST', get_path('Common/addFriend'), true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.send(json);

			request.onreadystatechange = ()=>{
				if (request.readyState != 4)
					return;
				else if (request.status != 200)
					document.location.href = get_path("");
				else
				{
					var result = JSON.parse(request.responseText);
					if (result)
					{
						if (target.classList[0] === 'add_friend_butt')
							target.parentNode.removeChild(target);
						else
							document.getElementById('page_user_butt').id = 're_page_user_butt';
					}
				}
			}
		}());
	}

	function userTransition(login)
	{
		document.location.href = get_path("UserArea/page") + '?user=' + login;
	}

	function takeNewPost(val, target)
	{
		if (!val)
			return;
		
		(function(){
			var json = function(){
				var json = 'new_post=';

				obj = {
					'img_id' : target,
					'text' : val,
				};

				json += encodeURIComponent(JSON.stringify(obj));
				return (json);
			}();

			var request = new XMLHttpRequest();
			request.open('POST', get_path('Common/addNewPost'), true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.send(json);

			request.onreadystatechange = ()=>{
				if (request.readyState != 4)
					return;
				else if (request.status != 200)
					document.location.href = get_path("");
				else
				{
					var result = JSON.parse(request.responseText);
					if (result)
					{
						creatPost(result);
						posts_cont_FEs5t.scrollTop = posts_cont_FEs5t.scrollHeight;
					}
				}
			}

		}());
	}

	function removeSelectContainer()
	{
		
		select_container.removeAttribute('style');
		escImg.removeAttribute('src');
		document.body.removeAttribute('style');

		var children;

		children = posts_cont_FEs5t.childNodes;
		removeAllChildren(children, posts_cont_FEs5t);
		
		var who_likes_block = document.getElementsByClassName('who_likes_block over')[0];
		children = who_likes_block.childNodes;
		removeAllChildren(children, who_likes_block);

		document.getElementById('user_post_Es4').removeAttribute('target');
		cou_block.innerHTML = "";

		function removeAllChildren(children, parent)
		{
			while (children.length)
			{
				while(children[0].childNodes.length)
					children[0].removeChild(children[0].childNodes[0]);
				parent.removeChild(children[0]);
			}
		}

	}

	function getPostsAndLikes(img_id)
	{
		var json = function(){
			var json = 'posts=';

			var obj = {
				'id' : img_id,
			};

			json +=  encodeURIComponent(JSON.stringify(obj));
			return (json);
		}();

		var request = new XMLHttpRequest();
		request.open('POST', get_path('Common/getPostsAndLikes'));
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		request.send(json);
	
		request.onreadystatechange = ()=>{
			if (request.readyState != 4)
				return;
			else if (request.status != 200){
				document.location.href = this.location.href;
			}
			else
			{
				var result = JSON.parse(request.responseText);
				document.getElementById('user_post_Es4').setAttribute('target', img_id);
				if (result['posts'])
					creatResultPosts(result['posts']);

				cou_block.innerHTML = 0;
				if (result['peopleLikes'])
					creatResultLikes(result['peopleLikes']);

			}
		}
	}

	function creatResultPosts(result)
	{
		for (let val of result){
			creatPost(val);
		}
	}

	function creatPost(val)
	{
		//creat post place
		var div = document.createElement('div');
		var img = document.createElement('img');
		var login = document.createElement('p');
		var post = document.createElement('p');

		div.className = 'drF902x';
		img.className = 'irF82kf';
		login.className = 'lrd43df';
		post.className = 'prFsd23s';

		img.setAttribute('src', val.user_icon);
		login.innerHTML = val.user_login;

		for (let i = 0; i < val.text.length; i++){
			if (val.text[i] === '\n')
				post.innerHTML += '<br>';
			else
				post.innerHTML += val.text[i];
		}
			
		div.appendChild(img);
		div.appendChild(login);
		div.appendChild(post);

		posts_cont_FEs5t.appendChild(div);
	}

	function creatResultLikes(result)
	{
		let iter = 0;

		for (let val of result){
			iter++;
			creatLikes(val);
		}
		cou_block.innerHTML = iter;
	}

	function creatLikes(val)
	{
		var who_likes_block = document.getElementsByClassName('who_likes_block over')[0];

		var cont_div_lks = document.createElement('div');
		var img_lks = document.createElement('img');
		var p_lks = document.createElement('p');

		cont_div_lks.className = 'cont_div_lks over';
		img_lks.className = 'img_lks over';
		p_lks.className = 'p_lks over';

		img_lks.setAttribute('src', val.user_icon);
		p_lks.innerHTML = val.user_login;

		cont_div_lks.appendChild(img_lks);
		cont_div_lks.appendChild(p_lks);

		/*создаем кнопку для добавление в друзья(если пользователя
		нету в списке друзей)*/
		if (!val.is_friend)
		{
			var add_friend_butt = document.createElement('button');
			add_friend_butt.className = 'add_friend_butt over';
			add_friend_butt.setAttribute('type', 'button');
			add_friend_butt.innerHTML = 'Add';
			cont_div_lks.appendChild(add_friend_butt);
		}
		who_likes_block.appendChild(cont_div_lks);
	}

	function removeLikes(val)
	{
		var who_likes_block = document.getElementsByClassName('who_likes_block over')[0];

		for (let child of who_likes_block.children){
			if (child.lastElementChild.innerHTML === val.user_login)
			{
				while(child.children.length){
					child.removeChild(child.children[0]);
				}
				who_likes_block.removeChild(child);
				break;
			}
		}
	}

	window.addEventListener('scroll', (event)=>{
		event = event || window.event;

		event.stopPropagation();

		if (my_profile === null)
			return;

		if (main_inp.attributes.data.nodeValue === '0')
		{
			if (window.pageYOffset + window.screen.height > my_profile.offsetHeight)
			{
				main_inp.attributes.data.nodeValue = '1';
				sendRequestToGetContent();
			}
		}
	});

	window.addEventListener('mouseover', (event)=>{
		event = event || window.event;

		event.stopPropagation();

		let fix_cont_ESrt5 = document.getElementById('fix_cont_ESrt5');
		if (fix_cont_ESrt5)
		{
			if (event.target.id === 'cou_block' &&
				cou_block.innerHTML !== "0")
			{
				document.getElementsByClassName('img_errow_eR7z over')[0].style.display = 'block';
				document.getElementsByClassName('who_likes_block over')[0].style.display = 'flex';
				document.getElementsByClassName('errow_eR7z over')[0].style.display = 'flex';
			}
			else if (event.target.classList[event.target.classList.length - 1] !== 'over')
			{
				document.getElementsByClassName('errow_eR7z over')[0].removeAttribute('style');
				document.getElementsByClassName('img_errow_eR7z over')[0].removeAttribute('style');
				document.getElementsByClassName('who_likes_block over')[0].removeAttribute('style');
			}
			else
				return;
		}
	});

onkeydown = (evt) =>{
	evt = evt || window.evt;

	let select_container = document.getElementById('select_container');
	
	if (select_container && select_container.style.display === 'flex')
	{
		var isEscape = false;

		if ("key" in evt)
			isEscape = (evt.key === "Escape" || evt.key === "Esc");
		else
			isEscape = (evt.keyCode === 27);

		if (isEscape)
		removeSelectContainer();
	}
}

window.onbeforeunload = function(){
	scroll_to_top();
}

function scroll_to_top()
{
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
