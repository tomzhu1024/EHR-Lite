from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from flasgger import Swagger
from flask_login import LoginManager

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://test:se-dev-8899@dev.tomzhu.site:3306/EHR_Lite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'JuanWang'

db = SQLAlchemy(app)
loginManager = LoginManager()
loginManager.init_app(app)
Swagger(app)

from server.routes.patient import *
from server.routes.doctor import *
from server.routes.staff import *
from server.routes.admin import *
from server.tables import Patient, Docter


@loginManager.user_loader
def load_user(user_id):
    if session['user_type'] == 'patient':
        return Patient.query.get(int(user_id))
    elif session['user_type'] == 'doctor':
        return Docter.query.get(int(user_id))
    else:
        raise Exception



