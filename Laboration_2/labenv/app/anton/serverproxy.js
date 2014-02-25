/**
 * Created by TDDD24.
 */

var serverproxy = new Object();

// Public methods

serverproxy.showUsers = function(callback){
    var response = serverstub.showUsers();
    callback(response);
};
serverproxy.signIn = function(email, password, callback){
    var response = serverstub.signIn(email, password);
    callback(response);
};
serverproxy.postMessage = function(token, content, toEmail, callback){
    var response = serverstub.postMessage(token, content, toEmail);
    callback(response);
};
serverproxy.getUserDataByToken = function(token, callback){
    var response = serverstub.getUserDataByToken(token);
    callback(response);
};
serverproxy.getUserDataByEmail = function(token, email, callback){
    var response = serverstub.getUserDataByEmail(token, email);
    callback(response);
};
serverproxy.getUserMessagesByToken = function(token, callback){
    var response = serverstub.getUserMessagesByToken(token);
    callback(response);
};
serverproxy.getUserMessagesByEmail = function(token, email, callback){
    var response = serverstub.getUserMessagesByEmail(token, email);
    callback(response);
};
serverproxy.signOut = function(token, callback){
    var response = serverstub.signOut(token);
    callback(response);
};
serverproxy.signUp = function(formData, callback){
    var response = serverstub.signUp(formData);
    callback(response);
};
serverproxy.changePassword = function(token, oldPassword, newPassword, callback){
    var response = serverstub.changePassword(token, oldPassword, newPassword);
    callback(response);
};