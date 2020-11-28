import datetime
from hashlib import md5

from flask import request, jsonify, session
from flask_login import logout_user, login_required, current_user, login_user

from server import app, db
from server.tables import Patient, Doctor, Record, Schedule


@app.route("/patient/login", methods=['POST'])
def patient_login():
    try:
        patient_id = int(request.form['id'])
        password = request.form['password']
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    patient = Patient.query.filter_by(patient_id=patient_id).first()
    if not patient:
        return jsonify(success=False,
                       error_message='No such patient')
    else:
        if patient.password != md5(password.encode()).hexdigest():
            return jsonify(success=False,
                           error_message='Wrong password')
        else:
            login_user(patient)
            current_user.patient_id = patient.patient_id
            return jsonify(success=True)


@app.route("/patient/logout", methods=['GET'])
@login_required
def patient_logout():
    logout_user()
    session.clear()

    return jsonify(success=True)


@app.route("/patient/register", methods=['POST'])
def patient_register():
    try:
        patient_id = int(request.form['id'])
        password = request.form['password']
        password = md5(password.encode()).hexdigest()
        birthday = datetime.datetime.strptime(request.form['birthday'], '%Y-%m-%d').date()
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
        except Exception as e:
            print(e)
            return jsonify(success=False,
                           error_message='Unable to add in database')

        return jsonify(success=True)


@login_required
@app.route('/patient/getDepartmentList', methods=['GET'])
def patient_get_department_list():
    departs = Doctor.query.with_entities(Doctor.department).distinct().all()
    data = [i[0] for i in departs]
    return jsonify(success=True,
                   data=data)


@login_required
@app.route("/patient/getSlots", methods=['POST'])
def patient_get_slots():
    try:
        department = request.form['department']
        date = request.form['date']
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
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


@login_required
@app.route('/patient/appointment/reservation', methods=['POST'])
def patient_make_reservation():
    try:
        schedule_id = int(request.form['schedule_id'])
        schedule_date = datetime.datetime.strptime(request.form['date'], '%Y-%m-%d').date()
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    try:
        patient = Patient.query.filter_by(patient_id=current_user.patient_id).first()
        record = patient.new_record()
        patient.new_appointment(record_id=record.record_id, schedule_id=schedule_id, schedule_date=schedule_date)
    except Exception as e:
        return jsonify(success=False,
                       error_message=str(e))
    return jsonify(success=True)


@app.route("/patient/getRecord", methods=['GET'])
@login_required
def patient_get_record():
    patient = Patient.query.filter_by(patient_id=current_user.patient_id).first()
    records = patient.records
    data = [{'record_id': record.record_id, 'date': str(record.date), 'stage': record.stage} for record in records]
    return jsonify(success=True,
                   data=data)


@app.route("/patient/getAppointment", methods=['POST'])
@login_required
def patient_get_appointment():
    try:
        record_id = int(request.form['id'])
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    record = Record.query.filter_by(record_id=record_id).first()
    patient = Patient.query.filter_by(patient_id=current_user.patient_id).first()
    if not record:
        return jsonify(success=False,
                       error_message="Can't find such record")
    if record.patient != patient:
        return jsonify(success=False,
                       error_message="Invalid input")
    data = [{'appointment_id': appointment.appointment_id, 'doctor_id': appointment.doctor_id,
             'doctor_name': appointment.doctor.name, 'diagnosis': appointment.diagnosis, 'stage': appointment.stage,
             'drug': appointment.drug} for appointment in record.appointments]
    return jsonify(success=True,
                   data=data)


@app.route("/patient/checkQueue", methods=['GET'])
@login_required
def patient_get_position():
    patient = Patient.query.filter_by(patient_id=current_user.patient_id).first()
    appoint = patient.current_appointment()
    if not appoint or appoint.stage != 'In Queue':
        return jsonify(success=False,
                       error_message='Not in a queue')
    else:
        position = patient.position(appoint)
        return jsonify(success=True,
                       data=position)


@app.route("/patient/checkStage", methods=['GET'])
@login_required
def patient_get_stage():
    appoint = current_user.current_appointment()
    if not appoint:
        return jsonify(success=False,
                       error_message="No Appointments going on")
    else:
        return jsonify(success=True,
                       stage=appoint.stage)

