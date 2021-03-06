/**
 * Created by TDDD24.
 */

var serverproxy = new Object();

// Public methods
function createXHR(){
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        return new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
};

//Sends the XML request to the given route on the server.
function send(url, args, callback) {

    var xmlhttp = createXHR(), 
        argString = ""

    xmlhttp.open("POST", "http://" + document.domain + ":5000" + url, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status==200) {
            callback(JSON.parse(xmlhttp.responseText));
        }
    }

    // Visit non-inherited enumerable keys
    Object.keys(args).forEach(function(key) {
        argString += "&" + key + "=" + args[key];
    });

    xmlhttp.send(argString.substring(1));
};

serverproxy.connectWebSocket = function(token){
    serverproxy.ws = new WebSocket("ws://" + document.domain + ":5000/register_socket");

    serverproxy.ws.onerror = function() {
        console.error("Error!");
    };

    serverproxy.ws.onopen = function () {
      serverproxy.ws.send(token);
    };

};

serverproxy.webSocketMessage = function(callback){
    if(!serverproxy.ws)
        serverproxy.connectWebSocket(localStorage.getItem('client_token'));

    serverproxy.ws.onmessage = function(event){
        callback(JSON.parse(event.data));
    };
}

serverproxy.signIn = function(email, password, callback){
    send(
        '/sign_in',
        { "email" : email, "password" : password },
        callback
    );
};

serverproxy.postMessage = function(token, content, toEmail, callback){
  send(
        '/post_message',
        { "token" : token, "message" : content, "email" : toEmail },
        callback
    );
};

serverproxy.getUserDataByToken = function(token, callback){
   send(
        '/get_user_data_by_token',
        { "token" : token},
        callback
    );
};

serverproxy.getUserDataByEmail = function(token, email, callback){
    send(
        '/get_user_data_by_email',
        { "token" : token, "email" : email},
        callback
    );
};

serverproxy.getUserMessagesByToken = function(token, callback){
     send(
        '/get_messages_by_token',
        { "token" : token},
        callback
    );
};

serverproxy.getUserMessagesByEmail = function(token, email, callback){
  send(
        '/get_messages_by_email',
        { "token" : token, "email" : email},
        callback
    );
};

serverproxy.signOut = function(token, callback){
     send(
        '/sign_out',
        { "token" : token},
        callback
    );
};

serverproxy.signUp = function(formData, callback){
    send(
        '/sign_up',
        formData,
        callback
    );
};

serverproxy.changePassword = function(token, oldPassword, newPassword, callback){
    send(
        '/change_password',
        { "token" : token, "old_pass" : oldPassword, "new_pass" : newPassword},
        callback
    );
};