from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pandas as pd
import mysql.connector
from sqlalchemy import create_engine
from werkzeug.utils import secure_filename
import os

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Skylovesk2',
    'database': 'member_db',    
}

DATABASE_URI = 'mysql+pymysql://root:Skylovesk2@localhost/member_db'
engine = create_engine(DATABASE_URI)

gehomeServer = Flask(__name__)

CORS(gehomeServer)

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
    except mysql.conector.Error as err:
        print(f"Query execution error: {err}")
    finally:
        connection.close()
        return data

#----------------------------------------------------------


ALLOWED_EXTENSIONS = {'xlsx', 'xls'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@gehomeServer.route('/')
def homPage():
    return '連接成功'

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


if __name__ == "__main__":
    gehomeServer.run(debug=True)

