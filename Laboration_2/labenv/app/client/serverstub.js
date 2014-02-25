/**
 * Created by TDDD24.
 */

var serverstub = new Object();

serverstub.signIn = function(email, password){ 
    var xmlhttp = createXHR();
/*
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
    document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
  }*/




    xmlhttp.open("POST", "http://127.0.0.1:5000/sign_in", false);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5000");
    //xmlhttp.setRequestHeader("Origin","http://127.0.0.1:5000");
    console.log(xmlhttp.getAllResponseHeaders());//.getAllResponseHeaders());
    
    //try {
    xmlhttp.send("email=" + email + "&password=" + password);
    //} catch(exception) {
    //    console.log(exception);
    //}
    
    //console.log(JSON.parse(xmlhttp.responseText));



};

serverstub.postMessage = function(token, content, toEmail){
};

serverstub.getUserDataByToken = function(token){
};

serverstub.getUserDataByEmail = function(token, email){
};

serverstub.getUserMessagesByToken = function(token){
};

serverstub.getUserMessagesByEmail = function(token, email){
};

serverstub.signOut = function(token){
};

serverstub.signUp = function(formData){ // {email, password, firstname, familyname, gender, city, country}
};

serverstub.changePassword = function(token, oldPassword, newPassword){
};

function createXHR(){
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        return new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
};