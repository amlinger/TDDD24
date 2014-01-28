window.onload = function(){
    var view = document.getElementById('welcomeview').innerHTML;
    var wrap = document.getElementById('view_wrap');
    wrap.innerHTML=view;
    
    document.getElementById('signup_button').onclick = function(event) {
        
        event.preventDefault();
        if(validateEmptyFields(this)) {
            validatePasswordFields(this);
        }
        
        return false;
    };
    
     document.getElementById('login_button').onclick = function(event) {
        
        event.preventDefault();
        validateEmptyFields(this);
         
        return false;
    };
    /*
    var button = document.getElementsByTagName('input');
    
    for(var i=0, len=button.length; i<len; i++){
        if(button[i].hasAttribute('type') && button[i].getAttribute('type') === 'submit'){
            
        }
    }*/
  
};

function validatePasswordFields(context) {
    var pwds = context.parentNode.getElementsByClassName('repeat_password');
    
    if(pwds[0].value !== pwds[1].value) {
        pwds[0].style.border = 'solid 1px red';
        pwds[0].value = "";
        pwds[1].style.border = 'solid 1px red';
        pwds[1].value = "";
        
        var textArea = context.parentNode.getElementsByClassName('message_area')[0];
        textArea.innerHTML="Skindak!";
        
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
                element.style.border = 'solid 1px red';
                errorExists = true;
            } else {
                // restore border
            }
        }
       
        element = element.previousSibling;
    }
    
    return !errorExists;
    /*
    if(errorExists){
        return false;
    }
    else{
        return true;
    }*/
}

