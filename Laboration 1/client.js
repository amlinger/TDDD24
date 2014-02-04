window.onload = function() {
    // Load view when window is loaded.
	updateView(localStorage.getItem('clientToken'));   
};

/*
 * Binds all events (click events) to the welcome view, should be
 * called when view is fully loaded, since the elements must exist
 * to be abel to have evenets.
 */
function bindWelcomEvents() {
    document.getElementById('signup_button').onclick = function(event) {
        
        event.preventDefault();
		var message	= this.parentNode.getElementsByClassName('message_area')[0];
			
		
        /*
          In order to send the data to the server, some validation
          is performed before sending:
          
          * No fields may be empty; all are mandatory.
          * The password field must contain the same value as 
            the repeat password field
          
          If these criteria are not met, the function is abandoned
          by issuing a return. This is all beccause we want to limit
          the requests sent and recieved from the server.
         */
        if(!validateEmptyFields(this)) {
			message.innerHTML = 'All fields are mandatory.';
			return false;
        } else if (!validatePasswordFields(this)) {
			message.innerHTML = 'Password fields must contain the same value.';
			return false;
		}
        
        var form = document.getElementById('signup_form');
        
        // Fetch all parameters passed from the fomr.
        var formObject = {
            firstname       : form.elements['firstname'].value,
            familyname      : form.elements['familyname'].value,
            gender          : form.elements['gender'].value,
            city            : form.elements['city'].value,
            country         : form.elements['country'].value,
            email           : form.elements['email'].value,
            password        : form.elements['password'].value    
        }
        
        var response = serverstub.signUp(formObject);  
        message.innerHTML = response.message;
        
        // Erase all input values if 
        if(response.success) {
            form.elements['firstname'].value    = "";
            form.elements['familyname'].value   = "";
            form.elements['city'].value         = "";
            form.elements['country'].value      = "";
            form.elements['email'].value        = "";
            form.elements['password'].value     = "";
            form.elements['re_password'].value  = "";
        
        } else {
            /* Indicate that an error has occoured on this field by adding
                a red border to the input */
            form.elements['email'].style.borderColor = "darkred";
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
    	
    	var elements = this.parentNode, 
            token = serverstub.signIn(elements["email"].value, elements["password"].value);
        
        /* Present the new view if login request is successful, otherwise
           indicate the error by a red border around the input area. */
        if(token.success){
            localStorage.setItem('clientToken',token.data);
            updateView(localStorage.getItem('clientToken'));
        
        } else {
            elements['email'].style.borderColor     = 'darkred';
            elements['password'].style.borderColor  = 'darkred';
            message.innerHTML = token.message;
        }
            
    	return false;
    };
}

/**
 * Given a context, this function returns true or false
 * depending on the comparison between two fields with
 * classname repeat_password. 
 */
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

/**
 * Check for empty fields given in the context, e.g.
 * fields without any value property set. If this is 
 * not the case, false is returned and the fields 
 * without any value are marked with a red border.
 */
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

function printPosts(wall,messages){
    
    wall.innerHTML = '';
    
    for (var i=0;i < messages.data.length;i++){
        post = "<article><b>Posted by:</b> " + messages.data[i].writer + "<br>";
        post = post + messages.data[i].content;
        wall.insertAdjacentHTML('beforeend',post);
    }
}

function updateView(token) {
    var undefined;
    view = "<strong>Something went terrably wrong on the server.</strong>",
    wrap = document.getElementById('view_wrap');

    /* Is anything else then null necessary? */
	if(token === null || token === undefined || token === '') {
		view = document.getElementById('welcomeview').innerHTML;
        wrap.innerHTML=view;
        bindWelcomEvents();
	} 
    
    else {
		view = document.getElementById('profileview').innerHTML;
        console.log(view);
        wrap.innerHTML=view; 
        
        bindDefaultEvents();
        bindHomeTabEvents();
        bindBrowseTabEvents();
        bindAccountTabEvents();
	}
}

function bindDefaultEvents(){
    
    var userData = serverstub.getUserDataByToken(localStorage.getItem('clientToken'));
    var element = document.getElementById('user_profile').firstChild;
    
    printUserData(userData,element);
    
    document.getElementById('post_button').onclick = function(event){
        event.preventDefault();
        var message = document.getElementById('post_text_area').value;
        var respone = serverstub.postMessage(localStorage.getItem('clientToken'),message,userData.data.email);
        
        if(respone.success){
            document.getElementById('post_text_area').value = '';
        
            var wall = document.getElementById('wall');
            var messages = serverstub.getUserMessagesByToken(localStorage.getItem('clientToken'));
        
            printPosts(wall,messages);
        }
    }
    
    document.getElementById('update_wall_button').onclick = function(event){
        
        var wall = document.getElementById('wall');
        var messages = serverstub.getUserMessagesByToken(localStorage.getItem('clientToken'));
        printPosts(wall,messages);
    }
    
    var wall = document.getElementById('wall');
    var messages = serverstub.getUserMessagesByToken(localStorage.getItem('clientToken'));
    printPosts(wall,messages);
}

function printUserData(userData,element){
    while(element){
        var children = element.childNodes;

        if(children[3])
            children[3].innerHTML = userData.data[children[3].getAttribute('class')];

        element = element.nextSibling;
    }         
}

function bindHomeTabEvents(){
    document.getElementById('home_tab').onclick = function(event){
        event.preventDefault();
        document.getElementById('home_content').style.display = 'block';
        document.getElementById('browse_content').style.display = 'none';
        document.getElementById('account_content').style.display = 'none';
            
        bindDefaultEvents();
    };
}

function bindBrowseTabEvents(){
    document.getElementById('browse_tab').onclick = function(event){
        event.preventDefault();
        document.getElementById('home_content').style.display = 'none';
        document.getElementById('browse_content').style.display = 'block';
        document.getElementById('account_content').style.display = 'none';
        
        document.getElementById('search_button').onclick = function(event){
            event.preventDefault();
            var email = document.getElementById('search_field').value;
            var userData = serverstub.getUserDataByEmail(localStorage.getItem('clientToken'),email);
            
            if(userData.success){
                document.getElementById('search_field').value = '';
                var browse_elements = document.getElementsByClassName('browse_element');
                for(var i = 0; i < browse_elements.length; i++){ 
                    browse_elements[i].style.display = 'block'
                }
                
                document.getElementById('browse_post_button').onclick = function(event){
                    event.preventDefault();
                    var message = document.getElementById('browse_post_text_area').value;
                    var respone = serverstub.postMessage(localStorage.getItem('clientToken'),message,userData.data.email);
                    
                    if(respone.success){
                        document.getElementById('browse_post_text_area').value = '';
                    
                        var wall = document.getElementById('browse_wall');
                        var messages = serverstub.getUserMessagesByEmail(localStorage.getItem('clientToken'),email);
                    
                        printPosts(wall,messages);
                    }
                };
                
                document.getElementById('update_wall_button').onclick = function(event){
        
                    var wall = document.getElementById('browse_wall');
                    var messages = serverstub.getUserMessagesByEmail(localStorage.getItem('clientToken'),email);
                    printPosts(wall,messages);
                };
                
                var element = document.getElementById('browse_profile').firstChild;
                printUserData(userData,element);
                
                var wall = document.getElementById('browse_wall');
                var messages = serverstub.getUserMessagesByEmail(localStorage.getItem('clientToken'),email);
                printPosts(wall,messages);
                
            }                                            
        }
        
    };
}

function bindAccountTabEvents(){
    document.getElementById('account_tab').onclick = function(event){
        event.preventDefault();
        document.getElementById('home_content').style.display = 'none';
        document.getElementById('browse_content').style.display = 'none';
        document.getElementById('account_content').style.display = 'block';
        
        document.getElementById('logout').onclick = function(event){
            var response = serverstub.signOut(localStorage.getItem('clientToken'));
            if(response.success){
                localStorage.setItem('clientToken', "");
                updateView(localStorage.getItem('clientToken'));
            }
        }
        
        document.getElementById('change_button').onclick = function(event){
            event.preventDefault();
            var message	= this.parentNode.getElementsByClassName('message_area')[0];
            var element = this.parentNode;
            if(!validateEmptyFields(this)) {
                 // Fields are empty, displaying
                message.innerHTML = 'All fields are mandatory.';
                return false;
            } else if (!validatePasswordFields(this)) {
                // Fields are empty, displaying 
                message.innerHTML = 'Password fields must contain the same value.';
                return false;
            }
            
            var response = serverstub.changePassword(localStorage.getItem('clientToken'),
                                                                  element['old_pass'].value,
                                                                  element['new_pass'].value);
                                                     
            message.innerHTML = response.message;
        }            
    };
}