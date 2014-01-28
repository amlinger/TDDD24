window.onload = function() {
	
	// Fetching views  
	var view = document.getElementById('welcomeview').innerHTML,
    	wrap = document.getElementById('view_wrap');
				
		
    wrap.innerHTML=view;
    
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
			
			message.innerHTML = 'Please fill out an <b>Email</b> and  a <b>Password</b>.';
			
      return false;
	 
		};
    
  
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