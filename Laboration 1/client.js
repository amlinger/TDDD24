window.onload = function() {
	
	updateView();
	
    document.getElementById('signup_button').onclick = function(event) {
        
        event.preventDefault();
		var message	= this.parentNode.getElementsByClassName('message_area')[0];
			
			
        if(!validateEmptyFields(this)) {
			// Fields are empty, displaying 
			message.innerHTML = 'All fields are mandatory.';
			return false;
        } else if (!validatePasswordFields(this)) {
			// Fields are empty, displaying 
			message.innerHTML = 'Password fields must contain the same value.';
			return false;
		}
		
		
		return false;
    };
    
    document.getElementById('login_button').onclick = function(event) {
			
	// Always prevent from actually sending the request.
		event.preventDefault();
	 
	// Fetch the message area for displaying error messages.
	var message	= this.parentNode.getElementsByClassName('message_area')[0];
	
	/* 	Only validation for Login area is the check for all fields being
			non-empty. If this is not OK, display error message and exit 
			function. */
	if(!validateEmptyFields(this)) {
		message.innerHTML = 'Please fill out an <b>Email</b> and  a <b>Password</b>.';
		return false;
	}
	
	var elements = this.parentNode;
	var token = serverstub.signIn(elements["email"], elements["password"]);	
	console.log(token);
	return false;
	}
};

function validatePasswordFields(context) {
    var pwds = context.parentNode.getElementsByClassName('repeat_password');
    
	if(pwds[0].value !== pwds[1].value) {
        pwds[0].style.borderColor = 'darkred';
        pwds[0].value = "";
        pwds[1].style.borderColor = 'darkred';
        pwds[1].value = "";
        
        return false;
    }
	
    return true;
}

function validateEmptyFields(context){

    var errorExists = false;
    
    var element = context.previousSibling;
    
    while(element){
        if(element.tagName === 'INPUT'){
            if(!element.value){
                element.style.borderColor = 'darkred';
                errorExists = true;
            } else {
                element.style.borderColor = '';
            }
        }
       
        element = element.previousSibling;
    }
    
    return !errorExists;
}

function updateView(token) {

	var undefined,
		view = "<strong>Something went terrably wrong on the server.</strong>",
    	wrap = document.getElementById('view_wrap');

	if(token === undefined || token === "") {
		view = document.getElementById('welcomeview').innerHTML;
	} else {
		view = document.getElementById('signedinview').innerHTML;
	}

	wrap.innerHTML=view;
}
