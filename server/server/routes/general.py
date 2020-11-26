from flask import request, jsonify
from flask_login import logout_user, login_required, current_user

from server import app


@app.route('/isLogin', methods=['GET'])
def isLogin():
    return jsonify(is_login=current_user.is_authenticated)
