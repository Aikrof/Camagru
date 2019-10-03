<?php
	define("ICONS", '/' . $this->rootDir . '/public/img/icons/');
?>
<div id="c">
<div class="content_space">
	<?php foreach ($vars as $key => $value):?>
		<div class="a1" data="1" name=<?php echo $key;?>>
			<p class="a1"><?php echo $key ?></p>
			<img class="a1" id="up_down" src=<?php echo ICONS . 'down.png'?>>
			<div class="a2" realize="0"></div>
		</div>
	<?php endforeach;?>
</div>
<div id="result_space">
	<div id="ff">
		<p id='add_img_to_my_profile' class="unselectable">Add image to my profile?</p>
	<div id="user_result_area">
		<div>
			<div id="img_was_save">
				<p>Image was saved</p>
				<img src=<?php echo ICONS . 'checked.png'?>>
			</div>
			<img id="result_img" class="unselectable">
		</div>
	</div>
	<div>
		<div id="message" class="unselectable">
			<p>Your Message</p>
		</div>
		<p><textarea id="textarea" name="text"></textarea></p>
	</div>
	<div id="show_user_img">
		<div id="nav_result_space">
			<div id="nav_result_cons">
				<div class="choice remove_img" title="Delete"></div>
				<div class="choice save_to_myprofile" title='Save'></div>
			</div>
		</div>
	</div>
	</div>
	</div>
<div class="fix">
<div id="space">
	<div id="studio">
		<div id="user_space">
			<video id="video" width="640px" height="480px" autoplay></video>
			<div id="user_area"><img id="user_img" class="unselectable"></div>
			<canvas id="canvas"></canvas>
		</div>
	</div>
</div>
	<div id='nav_cont'>
		<div id="nav_spc">
			<div id="navi_rown">
		<div class="navi">  
			<label>
				<form id="fil">
				<input type="file" name="img" id="studio_inp">
				</form>
				<div class="choice add_img" alt='asd'></div>
			</label>
			<div class="choice take_photo" data="1"></div>
		</div>
		</div>
			<div id="add_content_space">
				<div id="add" class="choice add_content"></div>
			</div>
		</div>
	</div>
</div>
</div>

<script type="text/javascript" src =<?php echo '/' . $this->rootDir . '/public/js/studio.js'?>></script>