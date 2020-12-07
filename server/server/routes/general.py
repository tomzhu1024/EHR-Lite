from flask import jsonify
from flask_login import current_user

from server import app
from server.model import Patient, Doctor, Admin, Staff


@app.route('/isLogin', methods=['GET'])
def isLogin():
    if current_user.is_authenticated:
        user_id = current_user.get_id()
        if user_id.startswith('Patient'):
            user_id = user_id.lstrip('Patient')
            patient = Patient.query.get(int(user_id))
            return jsonify(is_login=True,
                           name=patient.name)
        elif user_id.startswith('Doctor'):
            user_id = user_id.lstrip('Doctor')
            doctor = Doctor.query.get(int(user_id))
            return jsonify(is_login=True,
                           name=doctor.name)
        elif user_id.startswith('Admin'):
            user_id = user_id.lstrip('Admin')
            admin = Admin.query.get(int(user_id))
            return jsonify(is_login=True,
                           name=admin.name)
        elif user_id.startswith('Staff'):
            user_id = user_id.lstrip('Staff')
            staff = Staff.query.get(int(user_id))
            return jsonify(is_login=True,
                           name=staff.name,
                           role=staff.role)
    return jsonify(is_login=False)
