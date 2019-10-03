<div id="abs_func">
<div id="include">
	<div id="icon_cont">
		<img id="i" class="unselectable" src=<?php echo $_SESSION['user']['icon'];?>>
		<label id="re_icon">
			<form id="menu_form">
				<input type="file" name="icon" id="icon_inp">
			</form>
		</label>
	</div>
	<div class="ErP2">
		<a class="ARd2s" href=<?php echo ROOT . '/UserArea/profile';?>>My Profile</a>
	</div>
	<div class="ErP2">
		<a class="ARd2s" href=<?php echo ROOT . '/UserArea/studio';?>>My Studio</a>
	</div>
	<div id="friends_container_Ae3">
		<div id="friEs21K">
			<div id="friends_img"></div><p id="Fr2Es">Friends</p>
		</div>
		<div id="Fr2Es_container"></div>
	</div>
	<ul><div id="setAs1s"><div id="ul_img"></div><p id="sett_text">Settings</p></div>
		<div id="li_cont">
			<?php if ($_SESSION['user']['send']):?>
				<li class="sett_li"><p id="change_send">Do not send me emails</p></li>
			<?php else:?>
				<li class="sett_li"><p id="change_send" class="c">Send me emails</p></li>
			<?php endif;?>
			<li class="sett_li"><p id="change_login">Change login</p></li>
			<li class="sett_li"><p id="change_passwd">Change password</p></li>
			<li class="sett_li"><p id="change_email">Change E-Mail</p></li>
		</div>
	</ul>
	<div id="exit">
		<div id="exit_icon"></div><p id="text_p">Exit</p>
	</div>
</div>
</div>
