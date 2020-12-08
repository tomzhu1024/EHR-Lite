import datetime

from flask_login import UserMixin

from server import db


class Patient(db.Model, UserMixin):
    __tablename__ = 'patient'
    patient_id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    records = db.relationship('Record', backref='patient')

    def __init__(self):
        self.chat_ = None

    def __repr__(self):
        return self.name

    def get_id(self):
        return 'Patient' + str(self.patient_id)

    def set_chat(self, chat_service):
        self.chat_ = chat_service

    def get_chat(self):
        return self.chat_

    def remove_chat(self):
        del self.chat_
        self.chat_ = None

    def new_record(self):
        for r in self.records:
            if r.stage == "In Progress":
                raise Exception("Can't new an record when another record is not over")
        new_r = Record(patient_id=self.patient_id, stage='In Progress')
        db.session.add(new_r)
        db.session.commit()
        return new_r

    def new_appointment(self, record_id, schedule_id, schedule_date):
        if self.current_appointment():
            raise Exception("Another appointment going on")
        r = Record.query.filter_by(record_id=record_id, patient_id=self.patient_id).first()
        s = Schedule.query.filter_by(schedule_id=schedule_id).first()
        if not r or not s or s.weekday != datetime.date.weekday(schedule_date):
            raise Exception("Appoint info don't match")
        if not s.is_available_on(schedule_date):
            raise Exception("Appointment full")

        new_appoint = Appointment(record_id=record_id, doctor_id=s.doctor_id, schedule_id=schedule_id,
                                  schedule_date=schedule_date, stage='Upcoming')
        db.session.add(new_appoint)
        db.session.commit()
        return new_appoint

    def current_appointment(self):
        record = self.current_record()
        if not record:
            return None
        for appoint in record.appointments:
            if appoint.stage in ['Upcoming', 'In Queue', 'In Progress', 'Get Drug']:
                return appoint
        return None

    def current_record(self):
        record = Record.query.filter_by(stage='In Progress', patient_id=self.patient_id).first()
        return record

    def position(self, appointment):
        queue = Appointment.query.filter_by(schedule_id=appointment.schedule_id,
                                            schedule_date=appointment.schedule_date,
                                            stage='In Queue').order_by(Appointment.check_in_time.asc()).all()
        i = queue.index(appointment)
        return i


class Doctor(db.Model, UserMixin):
    __tablename__ = "doctor"
    doctor_id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    department = db.Column(db.Date, nullable=False)
    title = db.Column(db.Date, nullable=False)
    schedules = db.relationship('Schedule', backref='doctor')
    appointments = db.relationship('Appointment', backref='doctor')

    def __repr__(self):
        return self.name

    def get_id(self):
        return 'Doctor' + str(self.doctor_id)

    def available_schedule_on(self, date):
        if not isinstance(date, datetime.date):
            try:
                datetime.datetime.strptime(date, '%Y-%m-%d')
            except ValueError:
                raise ValueError("Not a date")
        slots = []
        for i in self.schedules:
            if i.weekday == date.weekday() and i.is_available_on(date):
                slots.append(i)
        return slots

    def add_schedule(self, weekday, start, end, capacity):
        schedules = self.schedules
        for sched in schedules:
            if sched.weekday == weekday and max(sched.start_time, start) <= min(sched.end_time, end):
                raise Exception('Incompatible time')
        new_sched = Schedule(doctor_id=self.doctor_id, weekday=weekday,
                             start_time=start, end_time=end, capacity=capacity)
        db.session.add(new_sched)
        db.session.commit()

    def current_schedule(self):
        for sched in self.schedules:
            if sched.weekday == datetime.date.today().weekday() and \
                    sched.start_time < datetime.time.now().time() < sched.end_time:
                return sched

    def get_queue(self):
        def take_checkin(appoint):
            return appoint.check_in_time

        queue = []
        for appoint in self.appointments:
            if appoint.stage == 'In Queue' and appoint.schedule_date == datetime.date.today() and \
                    appoint.schedule.start_time < datetime.datetime.now().time() < appoint.schedule.end_time:
                queue.append(appoint)
        queue.sort(key=take_checkin)
        return queue

    def get_next_patient(self):
        queue = self.get_queue()
        if not queue:
            return None
        else:
            return queue[0]


class Schedule(db.Model):
    __tablename__ = "schedule"
    schedule_id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.doctor_id'), nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    weekday = db.Column(db.Integer, nullable=False)
    schedules = db.relationship('Appointment', backref='schedule')

    def __repr__(self):
        return 'Schedule' + str(self.schedule_id)

    def is_available_on(self, date):
        if not isinstance(date, datetime.date):
            try:
                date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
            except ValueError:
                raise ValueError("Not a date")
        if date.weekday() != self.weekday:
            raise ValueError("Not a valid date")
        availables = self.capacity
        for i in self.schedules:
            if i.schedule_date == date and i.stage != 'Canceled':
                availables -= 1
            if availables <= 0:
                return False
        return True


class Record(db.Model):
    __tablename__ = "record"
    record_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patient.patient_id"), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.date.today)
    stage = db.Column(db.String(20), nullable=False)
    appointments = db.relationship('Appointment', backref='record')

    def __repr__(self):
        return f"<Record %{self.record_id} {self.patient_id} {self.date}>"


class Appointment(db.Model):
    __tablename__ = "appointment"
    appointment_id = db.Column(db.Integer, primary_key=True)
    record_id = db.Column(db.Integer, db.ForeignKey("record.record_id"), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctor.doctor_id"), nullable=False)
    diagnosis = db.Column(db.String(10000), nullable=False)
    drug = db.Column(db.String(500), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey("schedule.schedule_id"), nullable=False)
    schedule_date = db.Column(db.Date, nullable=False)
    check_in_time = db.Column(db.DateTime(500), nullable=True)
    stage = db.Column(db.String(20), nullable=False)

    def finish(self):
        if self.stage not in ['In Progress', 'Get Drug']:
            raise Exception("Can't end an appointment now")
        self.record.stage = 'Finish'
        self.stage = 'Finish'
        db.session.commit()


class Admin(db.Model, UserMixin):
    __tablename__ = 'admin'
    admin_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(10), unique=True)
    password = db.Column(db.String(30))

    def get_id(self):
        return 'Admin' + str(self.admin_id)


class Staff(db.Model, UserMixin):
    __tablename__ = 'staff'
    staff_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(10), unique=True)
    password = db.Column(db.String(30))
    role = db.Column(db.String(20))
    online = db.Column(db.Boolean)

    def get_id(self):
        return 'Staff' + str(self.staff_id)

    @property
    def chat(self):
        return self.chat_

    @chat.setter
    def set_chat(self, chat_service):
        self.chat_ = chat_service

    @chat.getter
    def get_chat(self):
        return self.chat_

