import sqlite3
import random
import hashlib
import traceback
from flask import Flask, g

#app = Flask(__name__)

class DatabaseHelper:
	def __init__(self,app):
		self.app = app;
		with self.app.app_context():
			db = self.get_db()
			with app.open_resource('database.schema', mode='r') as f:
				db.cursor().executescript(f.read())
				db.commit()
				self.close_db()

	def get_db(self):
		"""Opens a new database connection if there is none yet for the
		current application context."""
		if not hasattr(g, 'sqlite_db'):
			g.sqlite_db = sqlite3.connect('database.db')
			return g.sqlite_db

	def close_db(self):
		"""Closes the database again at the end of the request."""
		if hasattr(g, 'sqlite_db'):
			g.sqlite_db.close()

	def prepare_password(self, password):
		md5 = hashlib.md5()
		md5.update(password)
		return md5.hexdigest()

	def prepare_email(self, email):
		return email.lower()

	#ESCAPE STRINGS (PARAMETERS TO "EXECUTE")
	def execute(self, query, args=[]):
		with self.app.app_context():
			db = self.get_db()
			cursor = db.cursor()
			try:
				cursor.execute(query,args)
			except:
				traceback.print_exc()
			
			result = cursor.fetchall()
			if(not result):
				result = (cursor.rowcount > 0)
			db.commit()
			self.close_db()
		return result

	def user_exists(self, email):
		email = self.prepare_email(email)
		query  = "SELECT COUNT(email) FROM user WHERE email=? LIMIT 1"
		result = self.execute(query,[email])
		return 1 == result[0][0]

	def is_user_logged_in(self, email_or_token):
		query  = "SELECT COUNT(user) FROM token WHERE user=? OR token=? LIMIT 1"
		email = self.prepare_email(email_or_token)
		result = self.execute(query,[email, email_or_token])
		return 1 == result[0][0]

	def insert_user(self, email, password, firstname, familyname, gender, city, country):
		email = self.prepare_email(email)
		password = self.prepare_password(password)
		query  = "INSERT INTO user VALUES (?,?,?,?,?,?,?)"
		self.execute(query,[email, password, firstname, familyname, gender, city, country])

	def show_table(self,table):
		query = "SELECT * FROM " + table
		result = self.execute(query)
		if(not result):
			return;
		print("---------" + table + "---------")
		for i in range(0, len(result)):
			print(result[i])
		print("")

	def login(self,email,password):
		email = self.prepare_email(email)
		password = self.prepare_password(password)
		query = "SELECT COUNT(email) FROM user WHERE email=? AND password=? LIMIT 1"
		result = self.execute(query,[email,password])
		return 1 == result[0][0]

	def logout(self,token):
		query = "DELETE FROM token WHERE token=?"
		result = self.execute(query,[token])

	def generate_token(self,email):
		email = self.prepare_email(email)
		letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
		token = ""
		for i in range(0, 36):
			token += letters[random.randint(0, len(letters)-1)]

		query = "INSERT INTO token VALUES(?,?)"
		self.execute(query,[token,email])

		return token

	def get_user_by_token(self,token):
		query = "SELECT user from token where token=?"
		result = self.execute(query,[token])
		return result[0][0]

	def change_password(self,token,old_pass,new_pass):
		old_pass = self.prepare_password(old_pass)
		new_pass = self.prepare_password(new_pass)
		user = self.get_user_by_token(token)
		query = "UPDATE user SET password=? WHERE email=? AND password=?"
		return(self.execute(query,[new_pass,user,old_pass]))

	def get_user_data_by_email(self,email):
		email = self.prepare_email(email)
		query = "SELECT email,first_name,family_name,gender,city,country FROM user WHERE email=?"
		result = self.execute(query,[email])
		return{
				"email" 		: result[0][0],
				"firstname" 	: result[0][1],
				"familyname" 	: result[0][2],
				"gender" 		: result[0][3],
				"city" 			: result[0][4],
				"country" 		: result[0][5]
			}

	def post_message(self,token,message,email):
		poster = self.get_user_by_token(token)
		email = self.prepare_email(email)
		query = "INSERT INTO message VALUES (?,?,?)"
		self.execute(query,[message,email,poster])

	def get_messages_by_email(self,email):
		email = self.prepare_email(email)
		query = "SELECT * FROM message WHERE user=?"
		result = self.execute(query, [email])

		if(not type(result) is list):
			result = []
			
		messages = []
		for message in result:
			messages.append({
				"message" 		: message[0],
				"sender"		: message[2]
			})

		return messages
