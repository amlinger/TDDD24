from database_helper import *
from flask import Flask, request, jsonify

app = Flask(__name__)
db = DatabaseHelper(app)

@app.route('/')
def hello_world():
    return app.send_static_file('../client/client.html')


@app.route('/sign_up', methods=['POST'])
def sign_up():

	email = request.form['email']
	password = request.form['password']
	first_name = request.form['first_name']
	family_name = request.form['family_name']
	gender = request.form['gender']
	city = request.form['city']
	country = request.form['country']

	if(db.user_exists(email)):
		return jsonify(
			success = False,
			message = "User already exists")

	db.insert_user(email, password, first_name, family_name, gender, city, country)

	return jsonify(
		success = True,
		message = "User signed up")

@app.route('/sign_in', methods=['POST', 'OPTIONS'])
def sign_in():

	email = request.form['email']
	password = request.form['password']

	print(email)
	print(password)



	if(not db.user_exists(email)):
		return jsonify(
			success = False, 
			message = "User does not exists")

	if(db.is_user_logged_in(email)):
		return jsonify(
			success = False, 
			message = "User already logged in")
	
	success = db.login(email,password)

	if(success):
		token = db.generate_token(email)
		return jsonify(
			success = True, 
			message = "User logged in",
			data = token)

	return jsonify(
		success = False, 
		message = "Wrong password")

@app.route('/sign_out', methods=['POST'])
def sign_out():

	token = request.form['token']
	
	#This check is not acctually needed, but helps to send a good response
	if(not db.is_user_logged_in(token)):
		return jsonify(
			success = False, 
			message = "User not logged in")
	
	db.logout(token)

	return jsonify(
		success = True, 
		message = "User successfully logged out")

@app.route('/change_password', methods=['POST'])
def change_password():

	token = request.form['token']

	if(not db.is_user_logged_in(token)):
		return jsonify(
			success = False, 
			message = "User not logged in")

	old_pass = request.form['old_pass']
	new_pass = request.form['new_pass']

	if(db.change_password(token,old_pass,new_pass)):
		return jsonify(
			success = True, 
			message = "Password changed")

	return jsonify(
			success = False, 
			message = "Wrong password")

@app.route('/get_user_data_by_email', methods=['POST'])
def get_user_data_by_email():

	token = request.form['token']

	if(not db.is_user_logged_in(token)):
		return jsonify(
			success = False, 
			message = "User not logged in")

	email = request.form['email']
	result = db.get_user_data_by_email(email)

	return jsonify(
		success = True,
		message = "User data recived", 
		data = result)

@app.route('/get_user_data_by_token', methods=['POST'])
def get_user_data_by_token():

	token = request.form['token']
	
	if(not db.is_user_logged_in(token)):
		return jsonify(
			success = False, 
			message = "User not logged in")

	email = db.get_user_by_token(token)

	result = db.get_user_data_by_email(email)

	return jsonify(
		success = True,
		message = "User data recived",
		data = result)

@app.route('/post_message', methods=['POST'])
def post_message():

	token = request.form['token']
	message = request.form['message']
	email = request.form['email']

	if(not db.is_user_logged_in(token)):
		return jsonify(
			success = False, 
			message = "User not logged in")

	if(not db.user_exists(email)):
		return jsonify(
			success = False,
			message = "Recipient does not exists")

	db.post_message(token,message,email)

	return jsonify(
			success = True,
			message = "Message successfully posted")

@app.route('/get_messages_by_email', methods=['POST'])
def get_messages_by_email():

	token = request.form['token']
	email = request.form['email']

	if(not db.is_user_logged_in(token)):
		return jsonify(
			success = False, 
			message = "User not logged in")

	if(not db.user_exists(email)):
		return jsonify(
			success = False,
			message = "User does not exists")

	result = db.get_messages_by_email(email)

	return jsonify(
		success = True,
		message = "User messages recived",
		data = result)

@app.route('/get_messages_by_token', methods=['POST'])
def get_messages_by_token():

	token = request.form['token']

	if(not db.is_user_logged_in(token)):
		return jsonify(
			success = False, 
			message = "User not logged in")

	email = db.get_user_by_token(token)

	result = db.get_messages_by_email(email)

	return jsonify(
		success = True,
		message = "User messages recived",
		data = result)

if __name__ == '__main__':
	db.show_table("user")
	db.show_table("token")
	db.show_table("message")
	app.run()