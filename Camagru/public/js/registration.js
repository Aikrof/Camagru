
function buttonOnClick(form, id){

	this.form = form; 
	this.id = id;
	this.errno = this.form.getElementsByClassName('error');

	this.elem = this.form.elements;

	if (!validate())
	{
		var sub = document.getElementById(this.id);
		connection(this.elem, sub, this.form, this.errno);
	}

	function validate()
	{
		var valid = 1;
		
		if (this.id === 'regSubmit')
		{
			valid = 0;
			valid += regLoginValid(this.elem.login.value);
			valid += regEmailValid(this.elem.email.value);
			valid += regPasswValid(this.elem.password.value, this.elem.confirm.value);
		}
		else if (this.id === 'logSubmit')
		{
			valid = 0;
			valid += logLoginValid(this.elem.login.value);
			valid += logPasswValid(this.elem.password.value);
			var con = document.getElementById('con');
			var exit = document.getElementsByClassName('exit');
			if (valid != 0)
			{
				con.style.width = "643px";
				exit[0].style.marginLeft = "290px";
			}
			else
			{
				con.style.width = "520px";
				exit[0].style.marginLeft = "230px";
			}
		}
		else if (this.id === 'forgotSubmit')
		{
			valid = 0;
			valid += forgotEmailValid(this.elem.email.value);
		}
		else if (this.id === 'resendSubmit')
		{
			valid = 0;
			valid += regLoginValid(this.elem.login.value);
			valid += regEmailValid(this.elem.email.value);
		}

		if (!valid)
			return (0);
		else
			return (1);

		function logLoginValid(login)
		{
			var regexp = /^[Aa-zZ]+([_]?[Aa-zZ0-9]+){3,}$/i;
			if (!regexp.test(login) || login.length > 12)
			{
				this.errno[0].style.width = "323px";
				this.errno[0].innerHTML = "<p>Login must contain a minimum of 4 characters and maximum 12 characters</p>";
				this.form.login.style.border = '2px solid red';
				this.errno[0].attributes.data.nodeValue = 1;
				return 1;
			}
			else
			{
				if (this.errno[0].attributes.data.nodeValue == 1)
				{
					this.errno[0].innerHTML = "";
					this.errno[0].style.width = "";
					this.errno[0].attributes.data.nodeValue = 0;
				}
				return 0;
			}
		}

		function regLoginValid(login)
		{
			var regexp = /^[Aa-zZ]+([_]?[Aa-zZ0-9]+){3,}$/i;
			if (!regexp.test(login) || login.length > 12)
			{
				this.errno[0].style.width = "323px";
				this.errno[0].innerHTML = "Login must contain a minimum of 4 characters and maximum 12 characters";
				this.form.login.style.border = '2px solid red';
				this.errno[0].attributes.data.nodeValue = 1;
				return 1;
			}
			else
			{
				if (this.errno[0].attributes.data.nodeValue == 1)
				{
					this.errno[0].innerHTML = "";
					this.errno[0].style.width = "";
					this.errno[0].attributes.data.nodeValue = 0;
				}
				return 0;
			}
		}

		function regEmailValid(email)
		{
			var regexp = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
			if (!regexp.test(email))
			{
				this.errno[1].style.width = "323px";
				this.errno[1].innerHTML = "Invalid email address";
				this.form.email.style.border = '2px solid red';
				this.errno[1].attributes.data.nodeValue = 1;
				return 1;
			}
			else
			{
				if (this.errno[1].attributes.data.nodeValue == 1)
				{
					this.errno[1].innerHTML = "";
					this.errno[1].style.width = "";
					this.errno[1].attributes.data.nodeValue = 0;
				}
				return 0;
			}
		}

		function forgotEmailValid(email)
		{
			var regexp = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
			if (!regexp.test(email))
			{
				this.errno[0].style.width = "323px";
				this.errno[0].innerHTML = "Invalid email address";
				this.form.email.style.border = '2px solid red';
				this.errno[0].attributes.data.nodeValue = 1;
				return 1;
			}
			else
			{
				if (this.errno[0].attributes.data.nodeValue == 1)
				{
					this.errno[0].innerHTML = "";
					this.errno[0].style.width = "";
					this.errno[0].attributes.data.nodeValue = 0;
				}
				return 0;
			}
		}

		function logPasswValid(pass)
		{
			var regexp = /^(?=.*[0-9])(?=.*[a-z])(?=\S+$).{7,}$/;
			if (!regexp.test(pass))
			{
				this.errno[1].style.width = "323px";
				this.errno[1].innerHTML = "Invalid password";
				this.form.password.style.border = '2px solid red';
				this.errno[1].attributes.data.nodeValue = 1;
				return 1;
			}
			else
			{
				if (this.errno[1].attributes.data.nodeValue == 1)
				{
					this.errno[1].innerHTML = "";
					this.errno[1].style.width = "";
					this.errno[1].attributes.data.nodeValue = 0;
				}
				return 0;
			}
		}

		function regPasswValid(pass, confirm)
		{
			var regexp = /^(?=.*[0-9])(?=.*[a-z])(?=\S+$).{7,}$/;
			var check = 0;

			//validate password
			if (!regexp.test(pass))
			{
				this.errno[2].style.width = "323px";
				this.errno[2].innerHTML = "Passwords must be at least 8 characters in length,\
				and must contain numeric and  characters symbols";
				this.form.password.style.border = '2px solid red';
				this.errno[2].attributes.data.nodeValue = 1;
				check++;
			}
			else
			{
				if (this.errno[2].attributes.data.nodeValue == 1)
				{
					this.errno[2].innerHTML = "";
					this.errno[2].style.width = "";
					this.errno[2].attributes.data.nodeValue = 0;
				}
			}

			//validate confirm password
			if (!regexp.test(confirm))
			{
				this.errno[3].style.width = "323px";
				this.errno[3].innerHTML = "Confirm must be at least 8 characters in length,\
				and must contain numeric and characters symbols and be equal password.";
				this.form.confirm.style.border = '2px solid red';
				this.errno[3].attributes.data.nodeValue = 1;
				check++;
			}
			else
			{
				if (this.errno[3].attributes.data.nodeValue == 1)
				{
					this.errno[3].innerHTML = "";
					this.errno[3].style.width = "";
					this.errno[3].attributes.data.nodeValue = 0;
				}
			}

			//mathc password and confirm
			if (!check)
			{
				if (pass !== confirm)
				{
					this.errno[4].style.width = "323px";
					this.errno[4].innerHTML = "Password and confirm mast be equal.";
					this.form.confirm.style.border = '2px solid red';
					this.errno[4].attributes.data.nodeValue = 1;
					return 1;
				}
				else
				{
					if (this.errno[4].attributes.data.nodeValue == 1)
					{
						this.errno[4].innerHTML = "";
						this.errno[4].style.width = "";
						this.errno[4].attributes.data.nodeValue = 0;
					}
					return 0;
				}
			}
			else
				return 1;
		}
	}
}