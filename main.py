import pyrebase
from flask import Flask, jsonify, request
import psycopg2 as pg


hostname = "127.0.0.1"


database = "areia"
username  = "postgres"
pwd = "170501"
port_id = 54321

conn = None
curr = None

"Comments"

# app = Flask(__name__)

firebaseConfig = {
  'apiKey': "AIzaSyDsaoJNe0tsifIcvXgm_TIKXObupo8ndKc",
  'authDomain': "aire-26c18.firebaseapp.com",
  'databaseURL': "https://aire-26c18-default-rtdb.firebaseio.com/",
  'projectId': "aire-26c18",
  'storageBucket': "aire-26c18.appspot.com",
  'messagingSenderId': "171285043318",
  'appId': "1:171285043318:web:c0909e3afac978f71fa757",
  'measurementId': "G-BESBCSEJ2J"
}


firebase = pyrebase.initialize_app(firebaseConfig)

db = firebase.database()
data = {'username':"ssoparkar", 
          'passcode':"ssoparkar123", 
          'instaDetails': {'insta_username': "abc", 
          'insta_passcode':""}
          
          }

# # db.push(data)
#pushing data
# db.child("userDetails").child(data['username']).set(data)

#update
# db.child('userDetails').child('svashisht').update({'username':'svashisht'})

people = db.child('userDetails').get()
for p in people.each():
  print(p['username'])


# @app.route('/get_all', methods=['GET'])
# def get_all():
#   pass