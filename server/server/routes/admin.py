import datetime
from hashlib import md5

from flask import request, jsonify
from flask_login import logout_user, login_required, login_user

from server import app, db
from server.data.model import Doctor, Admin, Staff


@app.route("/admin/login", methods=['POST'])
def admin_login():
    try:
        name = request.form['username']
        password = request.form['password']
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    admin = Admin.query.filter_by(name=name).first()
    if not admin:
        return jsonify(success=False,
                       error_message='Authentication fail')
    else:
        if admin.password != md5(password.encode()).hexdigest():
            return jsonify(success=False,
                           error_message='Wrong password')
        else:
            login_user(admin)
            return jsonify(success=True)


@app.route("/admin/logout", methods=['GET'])
@login_required
def admin_logout():
    logout_user()
    return jsonify(success=True)


@app.route("/admin/addDoctor", methods=['POST'])
@login_required
def admin_add_doctor():
    try:
        name = request.form['username']
        password = md5(request.form['password'].encode()).hexdigest()
        department = request.form['department']
        title = request.form['title']
    except:
        return jsonify(success=False,
                error_message='Invalid input')
    new_d = Doctor(name=name, password=password, department=department, title=title)
    db.session.add(new_d)
    db.session.commit()
    return jsonify(success=True,
                   doctor_id=new_d.doctor_id)


@app.route("/admin/addSchedule", methods=['POST'])
@login_required
def admin_add_schedule():
    try:
        doctor_id = int(request.form['doctor_id'])
        weekday = int(request.form['weekday'])
        start = datetime.datetime.strptime(request.form['start'], '%H:%M').time()
        end = datetime.datetime.strptime(request.form['end'], '%H:%M').time()
        capacity = int(request.form['capacity'])
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    try:
        doctor = Doctor.query.filter_by(doctor_id=doctor_id).first()
        if not doctor:
            return jsonify(success=False,
                           error_message='No such doctor')
        doctor.add_schedule(weekday=weekday, start=start, end=end, capacity=capacity)
    except Exception as e:
        return jsonify(success=False,
                       error_message=str(e))
    return jsonify(success=True)


@app.route("/admin/addNewStaff", methods=['POST'])
@login_required
def admin_add_staff():
    try:
        name = request.form['name']
        password = md5(request.form['password'].encode()).hexdigest()
        role = request.form['position']
    except:
        return jsonify(success=False,
                       error_message='Invalid input')
    staff = Staff(name=name, password=password, role=role)
    db.session.add(staff)
    db.session.commit()
    return jsonify(success=True,
                   staff_id=staff.staff_id)
