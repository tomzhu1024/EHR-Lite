from flask import jsonify, session, request
from flask_login import login_user, login_required, logout_user, current_user
from hashlib import md5
import datetime

from server import app, db
from server.tables import Staff, Patient, Appointment
from server.service.chat import StaffChatService


@app.route('/staff/login', methods=['POST'])
def staff_login():
    try:
        staff_id = int(request.form['id'])
        password = request.form['password']
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    staff = Staff.query.filter_by(staff_id=staff_id).first()
    if not staff:
        return jsonify(success=False,
                       error_message='No such Staff')
    if staff.password != md5(password.encode()).hexdigest():
        return jsonify(success=False,
                       error_message='Wrong password')
    login_user(staff)
    if staff.role == 'front':
        staff.online = True
        db.session.commit()
        chat = StaffChatService(staff)
        staff.chat = chat

    return jsonify(success=True,
                   role=staff.role)


@app.route("/staff/logout", methods=['GET'])
@login_required
def staff_logout():
    logout_user()
    session.clear()
    return jsonify(success=True)


@app.route("/staff/front/searchPatient", methods=['POST'])
@login_required
def staff_front_search_patient():
    try:
        patient_id = int(request.form['id'])
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    patient = Patient.query.filter_by(patient_id=patient_id).first()
    if not patient:
        return jsonify(success=False,
                       error_message='No such patient')
    cur_appoint = patient.current_appointment()
    if not cur_appoint:
        return jsonify(success=False,
                       error_message='No Appointment scheduled')
    return jsonify(success=True, name=patient.name, doctor_name=cur_appoint.doctor.name,
                   department=cur_appoint.doctor.department, date=str(cur_appoint.schedule_date),
                   start_time=str(cur_appoint.schedule.start_time), end_time=str(cur_appoint.schedule.end_time),
                   stage=cur_appoint.stage)


@app.route("/staff/front/check-in", methods=['POST'])
@login_required
def staff_front_checkin():
    try:
        patient_id = int(request.form['id'])
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    patient = Patient.query.filter_by(patient_id=patient_id).first()
    if not patient:
        return jsonify(success=False,
                       error_message='No such patient')
    else:
        cur_appoint = patient.current_appointment()
        if not cur_appoint:
            return jsonify(success=False,
                           error_message='Patient has no schedule')
        if cur_appoint.stage != 'Upcoming' or cur_appoint.schedule_date != datetime.date.today():
            return jsonify(success=False,
                           error_message="Patient doesn't meet requiremtent of check in")
        cur_appoint.stage = 'In Queue'
        cur_appoint.check_in_time = datetime.datetime.now()
        db.session.commit()
        return jsonify(success=True)


@app.route("/staff/dispenser/checkPrescription", methods=['POST'])
@login_required
def staff_dipenser_check_prescription():
    try:
        patient_id = int(request.form['id'])
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    patient = Patient.query.filter_by(patient_id=patient_id).first()
    if not patient:
        return jsonify(success=False,
                       error_message='No such patient')
    cur_appoint = patient.current_appointment()
    if not cur_appoint:
        return jsonify(success=False,
                       error_message="No appointment going")
    if cur_appoint.stage != 'Get Drug':
        return jsonify(success=False,
                       error_message="Not in dispense stage")
    return jsonify(success=True,
                   drug=cur_appoint.drug)


@app.route("/staff/dispenser/finishAppointment", methods=['POST'])
@login_required
def staff_dispenser_finish_appointment():
    try:
        patient_id = int(request.form['id'])
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    patient = Patient.query.filter_by(patient_id=patient_id).first()
    if not patient:
        return jsonify(success=False,
                       error_message='No such patient')
    try:
        patient.current_appointment().finish()
    except Exception as e:
        return jsonify(success=False,
                       error_message=str(e))
    return jsonify(success=True)


@app.route("/staff/chat", methods=['GET'])
@login_required
def patient_chat():
    chat_service = current_user.chat
    return chat_service.history
