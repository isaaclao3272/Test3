from flask import Flask, render_template, request, jsonify, redirect, url_for ,send_file, Response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
import pandas as pd
import mysql.connector
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, ForeignKey
from werkzeug.utils import secure_filename
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash, check_password_hash
import os
import logging
from io import StringIO, BytesIO

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Skylovesk2',
    'database': 'member_db',    
}


gehomeServer = Flask(__name__)
gehomeServer.config['JWT_SECRET_KEY'] = 'UAcSIZC2sA2mhJ2jQ3Yn2OyZOiCOvIlqLbb-_4dl6V6pvX8n4Pfi2E4Jql50arvFxKNrY4SmTL7dElVejRlhBQ'
jwt = JWTManager(gehomeServer)
CORS(gehomeServer, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"], "supports_credentials": True}})

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

#update Member ~~~~~~~~~~~~~~~~
@gehomeServer.route('/updateMember', methods = ['PUT'])
def updateMember():
    data= request.get_json().get('data' , None)
    if data: 
        df = pd.DataFrame(data)
        df.to_sql('members2', con= engine, if_exists='replace', index=False)
        return jsonify({'Message': 'Data updated successfully'}), 200
    else:
        return jsonify({'Error': 'No data provided'}), 400

#update Event~~~~~~~~
@gehomeServer.route('/updateEvent', methods = ['PUT'])
def updateEvent():
    data= request.get_json().get('data' , None)
    if data: 
        df = pd.DataFrame(data)
        df.to_sql('eventRecord', con= engine, if_exists='replace', index=False)
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
    df = pd.read_excel(file.stream, engine ='openpyxl',parse_dates=['出生日期(原)'])
    df['出生日期(原)'] = pd.to_datetime(df['出生日期(原)'], format="mixed")
    df['出生日期(原)'] = df['出生日期(原)'].dt.strftime('%Y-%m-%d')
    df.to_sql('members2', con= engine, if_exists='replace', index=False)
    return jsonify({'Message': 'File uploaded and processed successfully'}), 200

#~~~~~upload event
@gehomeServer.route('/uploadEvent', methods = ['POST'])
def upLoadEvent():
    if 'excelFile' not in request.files:
        return jsonify({'Error':'no file part'}), 400
    file = request.files['excelFile']
    if file.filename == '':
        return jsonify({'Error':'No selected file'}), 400
    if not allowed_file(file.filename):
        return jsonify({'Error':'File Type not allowed'}), 400
    df = pd.read_excel(file.stream, engine ='openpyxl',parse_dates=['開始日期'])
    df['開始日期'] = df['開始日期'].dt.strftime('%Y-%m-%d')
    df['結束日期'] = df['結束日期'].dt.strftime('%Y-%m-%d')
    df.to_sql('eventRecord', con= engine, if_exists='append', index=False)
    return jsonify({'Message': 'File uploaded and processed successfully'}), 200

# SHOW all member TABLE~~~~~~~~~~~~~~~~~

@gehomeServer.route('/showData', methods=["GET"])
def showAllMember():
    try:
        page_size = 50  # 每頁顯示 100 條
        page = int(request.args.get('page', 1))  # 獲取頁碼，默認第 1 頁
        offset = (page - 1) * page_size

        sql = f'SELECT * FROM members2 LIMIT {page_size} OFFSET {offset}'
        connection = getDbConnection(db_config)
        if connection is None:
            return jsonify({'Error': 'Database connection failed'}), 500

        with connection.cursor(dictionary=True) as cursor:
            cursor.execute(sql)
            desire_columnTitle = ['ID','中文姓名', '主管確認資格', '任職公司(S)', '任職公司(原)', '備註', '入會日期(月/日/年)', '出生日期(原)', '出生日期TEST', '員工號碼', '回鄉證號碼', '外文姓名', '家屬姓名', '家屬電話', '年齡', '性別', '推薦人任職公司', '推薦人博企員工號碼', '推薦人回鄉證號碼', '推薦人姓名', '推薦人會員編號', '推薦人職位', '推薦人身份證號碼', '會員來源', '會員是推薦人的', '會員類形', '確認資料齊全及無誤', '經手人', '職位', '職業', '資料更新日期', '身份證號碼', '附件', '電話', '願意收取訊息']
            data = cursor.fetchall()
            row = [{col: row[col] for col in desire_columnTitle}for row in data]
        if not data:
            return jsonify({'Error': 'No data found'}), 404

        return jsonify({"data": row, "columnTitle": desire_columnTitle})
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        if connection:
            connection.close()

# SHOW EVENT
@gehomeServer.route('/showEvent', methods=["GET"])
def showEvent():
    page_size = 50
    page = int(request.args.get("page",1))
    offSet = (page -1) * page_size

    try:
        sql= (f'SELECT * FROM eventRecord LIMIT {page_size} OFFSET {offSet}')
        connector = getDbConnection(db_config)
        if connector is None:
            return jsonify({"Error":"unable to connect databasic"}), 500

        with connector.cursor(dictionary=True) as cursor:
            cursor.execute(sql)
            data = cursor.fetchall()
            columnTitle = [desc[0] for desc in cursor.description]
            if not data:
                return jsonify({"Error":"There is no data"}), 404
            
            return jsonify({"data":data, "columnTitle":columnTitle})
    except Exception as e:
        return jsonify({"Error":str(e)})
    finally:
        if connector:
            connector.close()

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
# ~~~~~~~~~~Login
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

@gehomeServer.route('/codition', methods = ['GET'])
def conformExist():
    with engine.connect as connection:
        event_df = pd.read_sql('SELECT * FROM eventRecord',connection)
        member_df = pd.read_sql('SELECT * FROM members2', connection)
        valid_members = member_df[member_df['ID'].isin(event_df['參加者會員編號'])]
        conformMember = valid_members.to_dict(orient='records')

        return jsonify(conformMember)
    

@gehomeServer.route('/download_excel', methods=["GET"])
def download_excel():
    try:
        logging.info("Executing SQL query...")
        sql = ('SELECT * FROM eventRecord')
        result_proxy = excuteCon(sql)
        
        logging.info(f"SQL query executed successfully. Number of rows fetched: {len(result_proxy)}")
        
        if result_proxy:
            logging.info("Converting result set to DataFrame...")
            data = [dict(row) for row in result_proxy]
            df = pd.DataFrame(data)

            desired_order = ['項目名稱','子項目名稱','開始日期','結束日期','錄入日期','錄入者','參加者姓名','參加者會員編號',
                             '參加者電話','家長姓名','家長電話','是否工作人員/志願者','參與場數','參與時數','有否出席','項目負責人']
            
            df = df[desired_order]

            logging.info("Creating in-memory Excel file...")
            output = BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='EventRecords')
            output.seek(0)
            
            def generate():
                chunk_size = 4096
                while True:
                    chunk = output.read(chunk_size)
                    if not chunk:
                        break
                    yield chunk

            headers = {
                'Content-Disposition': 'attachment; filename="event_records.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
            
            logging.info("Sending file response...")
            return Response(generate(), headers=headers)
        else:
            logging.warning("No data found in eventRecord table.")
            return jsonify({'Error': 'No data found'}), 404
    except Exception as e:
        logging.error(f"Error in /download_excel: {str(e)}", exc_info=True)
        return jsonify({'Error': str(e)}), 500




if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    gehomeServer.run(debug=True)