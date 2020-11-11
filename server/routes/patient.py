from server import app
from flask import session, request, jsonify
from server.tables import Patient
from flask_login import login_user, logout_user, login_required, current_user
from hashlib import md5


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


@app.route("/patient/logout", methods=['GET'])
@login_required
def patient_logout():
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
    logout_user()
    return jsonify(success=True,
                   error_message=None)
