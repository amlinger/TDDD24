/*
 *  Initializing extended functionality to 
 */

HTMLElement.prototype.hasClass = function(className) {
    return this.className && (this.className.indexOf(className) !== -1);
}

HTMLElement.prototype.removeClass = function(className) {
    if(this.hasClass(className)) {
        this.className = this.className.replace(className, "")
    }
    return this;
}

HTMLElement.prototype.addClass = function(className) {
    if(!this.hasClass(className)) {
        this.className = this.className + " " + className;
    }
    return this;
}

HTMLElement.prototype.getElementByClassName = function(className) {
    return this.getElementsByClassName(className)[0];
}

function getToken() {
    return localStorage.getItem('clientToken');
}

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
        
        // Preventing default action, since we do not want the 
        // form to actually be sent.
        event.preventDefault();
		
        var message	= this.parentNode.getElementByClassName('message_area'),
            fields  = ['firstname','familyname','gender','city','country','email','password'],
            form    = document.getElementById('signup_form'),
            newUser = {};

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
        

        // Fetch all parameters passed from the form.
        fields.forEach(function(field) {
            newUser[field] = form.elements[field].value;
        });
        
        serverproxy.signUp(newUser, function(response) { 
            message.innerHTML   = response.message;
            
            // Erase all input values if 
            if(response.success) {
                fields.forEach(function(field) {
                    form.elements[field].value = "";
                });
            } else {
                /* Indicate that an error has occoured on this field by adding
                    a red border to the input */
                form.elements['email'].addClass('error');
            }

        });
    };
    
    document.getElementById('login_button').onclick = function(event) {
    			
    	// Always prevent from actually sending the request.
    	event.preventDefault();
    	 
    	// Fetch the message area for displaying error messages.
    	var elements = this.parentNode,
            message	 = elements.getElementByClassName('message_area');
            
    	/* 	Only validation for Login area is the check for all fields being
    		non-empty. If this is not OK, display error message and exit 
    		function. */
    	if(!validateEmptyFields(this)) {
    		message.innerHTML = 'Please fill out an <b>Email</b> and  a <b>Password</b>.';
    		return false;
    	}
    	
        serverproxy.signIn(
            elements["email"].value, 
            elements["password"].value, 
            function(response) {
                
                /* Present the new view if login request is successful, otherwise
                   indicate the error by a red border around the input area. */
                if(response.success){
                    localStorage.setItem('clientToken',response.data);
                    updateView(localStorage.getItem('clientToken'));
                    serverproxy.connectWebSocket(response.data);
                
                } else {
                    elements['email'].addClass('error');
                    elements['password'].addClass('error');
                    message.innerHTML = response.message;
                }

            }
        );
            
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

        pwds[0].addClass('error').value = "";
        pwds[1].addClass('error').value = "";
        
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

    var errorExists = false,
        element     = context.previousSibling;
    
    while(element){
        if(element.tagName === 'INPUT'){
            if(!element.value){
                element.addClass('error');
                errorExists = true;
            } else {
                element.removeClass('error');
            }
        }
       
        element = element.previousSibling;
    }
    
    return !errorExists;
}

function printHomePosts(messages) {
    printPosts(messages, document.getElementById('wall'));
}

function printBrowsePosts(messages) {
    printPosts(messages, document.getElementById('browse_wall'));
}

function printPosts(messages, wall){
    
    wall.innerHTML = '';
    
    if(messages.error) {
        wall.innerHTML = 'Failed to load messages.';
        return;
    }

    console.log(messages);
    
    messages.data.forEach(function(message) {
        post  = "<article><b>POSTED BY:</b> " + message.sender;
        post += '<hr />';
        post += message.message + "</article>";

        wall.insertAdjacentHTML('beforeend', post);
    });
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
	} else {

		view = document.getElementById('profileview').innerHTML;
        wrap.innerHTML=view; 
        
        showTab('home');
        bindDefaultEvents();
        bindHomeTabEvents();

        document.getElementById('browse_tab').onclick = function(event){
            event.preventDefault();
            showTab('browse');
            bindBrowseTabEvents();
        }

        bindAccountTabEvents();
	}
}

function printUserData(userData,element){
    while(element){
        var children = element.childNodes;

        if(children[3])
            children[3].innerHTML = userData.data[children[3].getAttribute('class')];

        element = element.nextSibling;
    }         
}

function showTab(selected) {
    var tabs = ['home', 'browse', 'account'];

    for(var tab in tabs) {
        document.getElementById(tabs[tab] + '_tab').removeClass('highlight');
        document.getElementById(tabs[tab] + '_content').removeClass('visible');
    }

    document.getElementById(selected + '_tab').addClass('highlight');
    document.getElementById(selected + '_content').addClass('visible');
}

function bindHomeTabEvents(){
    document.getElementById('home_tab').onclick = function(event){
        event.preventDefault(); 
        showTab('home');
        bindDefaultEvents();
    };
}


function bindDefaultEvents() {
    
    var element = document.getElementById('user_profile').firstChild,
        token   = localStorage.getItem('clientToken');

    serverproxy.getUserDataByToken(getToken(), function(userData) {
        if(!userData.success) return;

        printUserData(userData,element);
        serverproxy.getUserMessagesByToken(getToken(), printHomePosts);

        serverproxy.webSocketMessage(function(response){
            if(response.message === "update_wall" && response.data === userData.data.email){
                serverproxy.getUserMessagesByToken(token, printHomePosts);
            }
        });

        document.getElementById('post_button').onclick = function(event){
            event.preventDefault();
            var message = document.getElementById('post_text_area').value;

            serverproxy.postMessage(token, message, userData.data.email, function(response) {
                if(!response.success) return;
                
                document.getElementById('post_text_area').value = '';

                serverproxy.getUserMessagesByEmail(token, userData.data.email, printHomePosts);
            });
        }
        
        document.getElementById('update_wall_button').onclick = function(event){
            event.preventDefault();
            serverproxy.getUserMessagesByToken(token, printHomePosts);
        }
    });   
}

function bindBrowseTabEvents(){
        
    document.getElementById('search_button').onclick = function(event){
        event.preventDefault();
        var field = document.getElementById('search_field'),
            email = field.value,
            token = localStorage.getItem('clientToken');


        serverproxy.getUserDataByEmail(token, email, function(userData){
            if(!userData.success) return;

            email = userData.data.email;
            field.value = '';

            var browse_elements = document.getElementsByClassName('browse_element');
            for(var i = 0; i < browse_elements.length; i++){ 
                browse_elements[i].style.display = 'block'
            }

            printUserData(userData, document.getElementById('browse_profile').firstChild);
            serverproxy.getUserMessagesByEmail(token, email, printBrowsePosts);

            serverproxy.webSocketMessage(function(response){
                console.log(response);
                console.log(userData);
                
                if(response.message === "update_wall" && response.data === userData.data.email){
                    serverproxy.getUserMessagesByEmail(token,email, printBrowsePosts);
                }
            });

            document.getElementById('browse_post_button').onclick = function(event){
                event.preventDefault();
                var message = document.getElementById('browse_post_text_area').value;
                
                serverproxy.postMessage(token, message, userData.data.email, function(response) {
                    if(!response.success) return;

                    document.getElementById('browse_post_text_area').value = '';

                    serverproxy.getUserMessagesByEmail(token, email, printBrowsePosts);
                });
            };

            document.getElementById('update_wall_button').onclick = function(event){
                event.preventDefault();
                serverproxy.getUserMessagesByEmail(token,email, printBrowsePosts);
            };
        });                                
    }
}

function bindAccountTabEvents(){
    document.getElementById('account_tab').onclick = function(event){
        event.preventDefault();

        showTab('account');
        
        document.getElementById('logout').onclick = function(event){
            serverproxy.signOut(localStorage.getItem('clientToken'), function(response) {

                localStorage.setItem('clientToken', "");
                updateView(localStorage.getItem('clientToken'));
            });
            
        }
        
        document.getElementById('change_button').onclick = function(event){
            event.preventDefault();

            var element = this.parentNode,
                message	= element.getElementByClassName('message_area');

            if(!validateEmptyFields(this)) {
                 // Fields are empty, displaying
                message.innerHTML = 'All fields are mandatory.';
                return false;
            } else if (!validatePasswordFields(this)) {
                // Fields are empty, displaying 
                message.innerHTML = 'Password fields must contain the same value.';
                return false;
            }
            
            serverproxy.changePassword(
                getToken(),
                element['old_pass'].value, 
                element['new_pass'].value, 
                function(response) {
                    message.innerHTML = response.message;
                }
            );
        }            
    };
}