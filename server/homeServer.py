from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
import pandas as pd
import mysql.connector
from sqlalchemy import create_engine
from werkzeug.utils import secure_filename
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash, check_password_hash
import os
import logging


db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Skylovesk2',
    'database': 'member_db',    
}


gehomeServer = Flask(__name__)
gehomeServer.config['JWT_SECRET_KEY'] = 'UAcSIZC2sA2mhJ2jQ3Yn2OyZOiCOvIlqLbb-_4dl6V6pvX8n4Pfi2E4Jql50arvFxKNrY4SmTL7dElVejRlhBQ'
jwt = JWTManager(gehomeServer)
CORS(gehomeServer)

DATABASE_URI = 'mysql+pymysql://root:Skylovesk2@localhost/member_db'
engine = create_engine(DATABASE_URI)
gehomeServer.config['SQLALCHEMY_DATABASE_URI']=DATABASE_URI
gehomeServer.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(gehomeServer)
class User(db.Model):
    __tablename__ = 'users'  # 指定模型对应的数据库表名
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

def getDbConnection(config):
    try:
        connection = mysql.connector.connect(**config)
        return connection
    except mysql.connector.Error as err:
        print(f"connection failed: {err}")
        return None

def excuteCon(sql,args=None):
    data = []
    connection = getDbConnection(db_config)
    if connection is None:
        print("Failed to get DB connection.")
        return data 
    try:
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute(sql, args)
            data = cursor.fetchall()
    except mysql.connector.Error as err:
        print(f"Query execution error: {err}")
    finally:
        connection.close()
        return data

#----------------------------------------------------------


ALLOWED_EXTENSIONS = {'xlsx', 'xls'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#updateCell~~~~~~~~~~~~~~~~~

@gehomeServer.route('/updateCell', methods = ['PUT'])
def updateCell():
    data= request.get_json().get('data' , None)
    if data: 
        df = pd.DataFrame(data)
        df.to_sql('members2', con= engine, if_exists='replace', index=False)
        return jsonify({'Message': 'Data updated successfully'}), 200
    else:
        return jsonify({'Error': 'No data provided'}), 400
    
#First page ~~~~~~~~~~~~~~~~~~

@gehomeServer.route('/', methods = ['GET'])
def homPage():
    return '連接成功'

#Upload~~~~~~~~~~~~~~~~~~~~~~~~~

@gehomeServer.route('/upload', methods = ['POST'])
def upLoadFile():
    if 'excelFile' not in request.files:
        return jsonify({'Error':'no file part'}), 400
    file = request.files['excelFile']
    if file.filename == '':
        return jsonify({'Error':'No selected file'}), 400
    if not allowed_file(file.filename):
        return jsonify({'Error':'File Type not allowed'}), 400
    df = pd.read_excel(file.stream, engine ='openpyxl')
    df.to_sql('members2', con= engine, if_exists='replace', index=False)
    return jsonify({'Message': 'File uploaded and processed successfully'}), 200


# SHOW TABLE~~~~~~~~~~~~~~~~~~

@gehomeServer.route('/showData', methods=["POST"])
def show():
    sql= ('SELECT * FROM members2')
    data=excuteCon(sql)
    if data:
        return jsonify(data)
    else:
        return jsonify({'Error':'Failed to retrieve data'}), 400

##Register~~~~~~~~~~~~~~~
@gehomeServer.route('/Register',methods=['GET','POST'])
@cross_origin(origins="http://localhost:3000")
def Registe():
        username = request.json.get('username')
        password = request.json.get('password')

        if User.query.filter_by(username=username).first() is not None:

            return jsonify({'error': 'Username already exists'}), 400
        
        password_hash = generate_password_hash(password)

            # 创建新用户并添加到数据库
        new_user = User(username=username, password_hash=password_hash)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201

@gehomeServer.route('/Login', methods =['POST'])
def Login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username = username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity = username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "密碼或帳號錯誤"}), 401


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    gehomeServer.run(debug=True)