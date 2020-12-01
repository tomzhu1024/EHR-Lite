from flask import jsonify, request, session
from flask_login import login_user, logout_user, login_required, current_user
from hashlib import md5
import datetime

from server import app, db
from server.tables import Doctor, Appointment, Patient, Record


@app.route('/doctor/login', methods=['POST'])
def doctor_login():
    try:
        doctor_id = int(request.form['id'])
        password = request.form['password']
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    doctor = Doctor.query.filter_by(doctor_id=doctor_id).first()
    if not doctor:
        return jsonify(success=False,
                       error_message='No such Doctor')
    else:
        if doctor.password != md5(password.encode()).hexdigest():
            return jsonify(success=False,
                           error_message='Wrong password')
        else:
            login_user(doctor)
            current_user.doctor_id = doctor.doctor_id
            return jsonify(success=True)


@app.route("/doctor/logout", methods=['GET'])
@login_required
def doctor_logout():
    logout_user()
    session.clear()
    return jsonify(success=True)


@app.route("/doctor/nextAppointment", methods=['GET'])
@login_required
def doctor_next_appointment():
    doctor = Doctor.query.filter_by(doctor_id=current_user.doctor_id).first()
    appointment = doctor.get_next_patient()

    if not appointment:
        return jsonify(success=False,
                       error_message="No Patient in queue")
    else:
        try:
            if appointment.stage != 'In Queue':
                raise Exception
            appointment.stage = 'In Progress'
            db.session.commit()
        except:
            return jsonify(success=False,
                           error_message="Internal Error")
        return jsonify(success=True,
                       patient_id=appointment.record.patient.patient_id,
                       name=appointment.record.patient.name,
                       appointment_id=appointment.appointment_id)


@app.route("/doctor/submitDiagnosis", methods=['POST'])
@login_required
def doctor_submit_diagnosis():
    try:
        appointment_id = int(request.form['appointment_id'])
        diagnosis = request.form['diagnosis']
        drug = request.form['drug']
    except:
        return jsonify(success=False,
                       error_message='Invalid input')

    appointment = Appointment.query.filter_by(appointment_id=appointment_id).first()
    if not appointment:
        return jsonify(success=False,
                       error_message='Wrong appointment ID')
    try:
        appointment.diagnosis = diagnosis
        appointment.drug = drug
        db.session.commit()
    except:
        return jsonify(success=False,
                       error_messaga='Internal Error')
    return jsonify(success=True)


@app.route("/doctor/getQueue", methods=['GET'])
@login_required
def doctor_get_queue():
    queue = current_user.get_queue()
    queue = [{'name': appoint.record.patient.name, 'patient_id': appoint.record.patient.patient_id} for appoint in queue]
    return jsonify(success=True,
                   queue=queue)


@app.route("/doctor/getRecord", methods=['POST'])
@login_required
def doctor_check_patient_record():
    try:
        patient_id = request.form.get('patient_id')
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    patient = Patient.query.filter_by(patient_id=patient_id).first()
    if not patient:
        return jsonify(success=False,
                       error_message='No such patient')
    data = [{'record_id': r.record_id, 'stage': r.stage} for r in patient.records]
    return jsonify(success=True,
                   data=data)


@app.route("/doctor/getRecordDetail", methods=['POST'])
@login_required
def doctor_get_record_detail():
    try:
        record_id = request.form.get('record_id')
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    record = Record.query.filter_by(record_id=record_id).first()
    if not record:
        return jsonify(success=False,
                       error_message='No such record')
    data = [{'date': appoint.schedule_date, 'doctor_name': appoint.doctor.name, 'department': appoint.doctor.department,
             'diagnosis': appoint.diagnosis, 'drug': appoint.drug} for appoint in record.appointments]
    return jsonify(success=True,
                   data=data)


@app.route("/doctor/finishAppointment", methods=['POST'])
@login_required
def doctor_finish_appointment():
    try:
        appointment_id = request.form.get('appointment_id')
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    appoint = Appointment.query.filter_by(appointment_id=appointment_id).first()

    if not appoint:
        return jsonify(success=False,
                       error_message='No such appointment')
    if appoint.doctor_id != current_user.doctor_id:
        return jsonify(success=False,
                       error_message='Not your Appointment')
    try:
        appoint.finish()
    except Exception as e:
        return jsonify(success=False,
                       error_message=str(e))
    return jsonify(success=True)