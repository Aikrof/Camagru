<?php
	define("ICONS", '/' . $this->rootDir . '/public/img/icons/');
?>
<div id="admin_page_container">
	<div id="admin_block_container">
		<div class="admin_block">
			<div class="AmTsp2">
				<p id="Amt_user" class="unselectable" onclick="userSrB(this);">Users</p>
			</div>
			<img id="Amt_user_arrow" src=<?php echo ICONS . 'right.png';?>>
		</div>
		
	</div>
	<div id="login_choice_space">
		<div id="lcp">
			<p class="unselectable">User login</p>
			<form id="adm_no_form">
				<input type="text" name="user_login" id="lcp_search" autocomplete="off">
			</form>
		</div>
		<img src=<?php echo ICONS . 'right.png';?>>
	</div>
	<div id="ucp_space">
	<div id="ucp_cont">
		<div id="ucp">
			<div id="aUs_ucp_Ars3">
				<div class="info_clr"></div>
				<div class="info"><p>Login</p></div>
				<div class="info"><p>Email</p></div>
				<div class="info"><p>Icon</p></div>
				<div class="info"><p>Creation</p></div>
			</div>
			<div id="block_info"></div>
		</div>
	</div>
	</div>
</div>
<div class="rgba_container_pr_user_img">
	<div id='block_img_exit'></div>
	<div class="container_pr_user_img">
		
	</div>
</div>