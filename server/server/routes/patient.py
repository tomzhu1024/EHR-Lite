from server import app, db
from flask import request, jsonify
from server.tables import Patient, Doctor
from flask_login import logout_user, login_required
from hashlib import md5
import datetime

@app.route("/patient/login", methods=['POST'])
def patient_login():
    """
        ---
        tags:
          - Patient
        parameters:
          - name: id
            in: query
            type: int
            required: true
            description: The identification number for patient
          - name: password
            in: query
            type: string
            required: true
        responses:
          500:
            description: Internal Error
          200:
            description: Successful login
            schema:
              properties:
                verify:
                  type: boolean
                  description: The user entered the right password
                error_message:
                  type: string
                  description: Whatever reason user is not successful in logging in

    """
    try:
        patient_id = int(request.form['id'])
        password = request.form['password']
    except:
        return jsonify(verify=False,
                       error_message='Invalid input')
    patient = Patient.query.filter_by(patient_id=patient_id).first()
    if not patient:
        return jsonify(verify=False,
                       error_message='No such patient')
    else:
        if patient.password != md5(password.encode()).hexdigest():
            return jsonify(verify=False,
                       error_message='Wrong password')
        else:
            return jsonify(verify=True,
                    error_message=None)


@app.route("/patient/register", methods=['POST'])
def patient_register():
    try:
        patient_id = int(request.form['id'])
        password = request.form['password']
        password = md5(password.encode()).hexdigest()
        birthday = request.form['birthday']
        birthday = datetime.date.strptime(birthday, '%Y-%m-%d')
        name = request.form['name']
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    patient = Patient.query.filter_by(patient_id=patient_id).first()
    if patient:
        return jsonify(success=False,
                       error_message='Patient already exist')
    else:
        new_p = Patient(patient_id=patient_id,
                        password=password,
                        birthday=birthday,
                        name=name)
        try:
            db.session.add(new_p)
            db.session.commit()
        except:
            return jsonify(success=False,
                       error_message='Unable to add in database')

        return jsonify(success=True,
                       error_message=None)


@app.route('/patient/getDepartmentList', methods=['GET'])
def patient_get_department_list():
    departs = Doctor.query.with_entities(Doctor.department).distinct().all()
    return jsonify(success=True,
                   data=departs)


@app.route("/patient/getSlots", methods=['POST'])
@login_required
def patient_get_slots():
    try:
        department = request.form['department']
        date = request.form['date']
        date = datetime.datetime.strptime(date, '%Y-%m-%d')
    except:
        return jsonify(success=False,
                       error_message='Invalid input')

    doctors = Doctor.query.filter_by(department=department).all()
    slots = []
    for d in doctors:
        for s in d.available_schedule_on(date):
            slot_info = {'doctor_id': d.doctor_id, 'name': d.name, 'title': d.title,
                         'schedule_id': s.schedule_id, 'start': str(s.start_time), 'end': str(s.end_time)}
            slots.append(slot_info)
    return jsonify(success=True,
                   data=slots)


@app.route("/patient/logout", methods=['GET'])
@login_required
def patient_logout():
    logout_user()
    return jsonify(success=True,
                   error_message=None)
