from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flasgger import Swagger

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://test:se-dev-8899@dev.tomzhu.site:3306/EHR_Lite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
Swagger(app)

from server.routes.patient import *
from server.routes.doctor import *
from server.routes.staff import *
from server.routes.admin import *



