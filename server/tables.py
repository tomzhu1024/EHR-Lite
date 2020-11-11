from server import db
import datetime


class Patient(db.Model):
    __tablename__ = 'patient'
    patient_id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    birthday = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return self.name


class Docter(db.Model):
    __tablename__ = "docter"
    doctor_id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    department = db.Column(db.Date, nullable=False)
    title = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return self.name


class Schedule(db.Model):
    __tablename__ = "schedule"
    schedule_id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.doctor_id'), nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    weekday = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return 'Schedule' + str(self.schedule_id)


class Record(db.Model):
    __tablename__ = "record"
    record_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patient.patient_id"), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.date.today)

    def __repr__(self):
        return f"<Record %{self.record_id} {self.patient_id} {self.date}>"


class Appointment(db.Model):
    __tablename__ = "appointment"
    appointment_id = db.Column(db.Integer, primary_key=True)
    record_id = db.Column(db.Integer, db.ForeignKey("record.record_id"), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctor.doctor"), nullable=False)
    diagnosis = db.Column(db.String(10000), nullable=False)
    drug = db.Column(db.String(500), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey("schedule.schedule_id"), nullable=False)
    check_in_time = db.Column(db.DateTime(500), nullable=True)
    stage = db.Column(db.Integer, nullable=False)