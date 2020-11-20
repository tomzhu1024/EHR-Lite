import pymysql
from flask import Flask, session
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://test:se-dev-8899@dev.tomzhu.site:3306/EHR_Lite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'JuanWang'

conn = pymysql.connect(host='dev.tomzhu.site',
                       user='test',
                       password='se-dev-8899',
                       db='EHR_Lite',
                       port=3306,
                       charset='utf8mb4',
                       cursorclass=pymysql.cursors.DictCursor)
db = SQLAlchemy(app)
loginManager = LoginManager()
loginManager.init_app(app)
# Swagger(app)

from server.routes.patient import *
from server.routes.doctor import *
from server.routes.staff import *
from server.routes.admin import *
from server.tables import Patient, Doctor, Admin


@loginManager.user_loader
def load_user(user_id):
    if user_id.startswith('Patient'):
        user_id = user_id.lstrip('Patient')
        return Patient.query.get(int(user_id))
    elif user_id.startswith('Doctor'):
        user_id = user_id.lstrip('Doctor')
        return Doctor.query.get(int(user_id))
    elif user_id.startswith('Admin'):
        user_id = user_id.lstrip('Admin')
        return Admin.query.get(int(user_id))
    else:
        raise Exception
