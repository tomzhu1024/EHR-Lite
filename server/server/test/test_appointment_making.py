import unittest
from server.model import *
from server import db


class AppointmentMakingTest(unittest.TestCase):

    def setUp(self):
        # Initialize a doctor to be working on Monday, from 8:00-18:00, allowing 2 people to make reservation
        self.doctor = Doctor(doctor_id=99999, password='password', name='test', department='Cardiology', title='Senior Doctor')
        db.session.add(self.doctor)
        self.schedule = Schedule(schedule_id=99999,doctor_id=99999, start_time='8:00:00', end_time='18:00:00', capacity=2, weekday=0)
        db.session.add(self.schedule)
        self.patient = Patient(patient_id=99999, password='test', name='test', birthday='2000-01-01')
        db.session.add(self.patient)
        db.session.commit()

    def tearDown(self):
        # Remove the added doctor
        db.session.delete(self.schedule)
        db.session.delete(self.doctor)
        db.session.delete(self.patient)
        db.session.commit()

    # try to make an appointment when the time us incompatible
    def test_make_invalid_appointment(self):
        r = self.patient.new_record()
        with self.assertRaises(Exception):
            schedule_date = datetime.datetime.strptime('2020-12-6', '%Y-%m-%d').date()
            appointment1 = self.patient.new_appointment(r.record_id, 99999, schedule_date)
        db.session.delete(r)
        db.session.commit()

    # try to make an appointment when the schedule is full
    def test_make_full_appointment(self):
        patient1 = Patient(patient_id=99997, password='test', name='test', birthday='2000-01-01')
        db.session.add(patient1)
        patient2 = Patient(patient_id=99998, password='test', name='test', birthday='2000-01-01')
        db.session.add(patient2)
        db.session.commit()
        self.assertTrue(self.schedule.is_available_on('2020-12-7'))
        record1 = patient1.new_record()
        schedule_date = datetime.datetime.strptime('2020-12-7', '%Y-%m-%d').date()
        appointment1 = patient1.new_appointment(record1.record_id, 99999, schedule_date)
        record2 = patient2.new_record()
        appointment2 = patient2.new_appointment(record2.record_id, 99999, schedule_date)
        with self.assertRaises(Exception):
            r = self.patient.new_record()
            self.patient.new_appointment(r.record_id, 99999, schedule_date)
        db.session.delete(record1)
        db.session.delete(record2)
        db.session.delete(r)
        db.session.delete(appointment1)
        db.session.delete(appointment2)
        db.session.delete(patient1)
        db.session.delete(patient2)
        db.session.commit()

    # try to new a record when another is taking place
    def test_double_records(self):
        r = self.patient.new_record()
        with self.assertRaises(Exception):
            r2 = self.patient.new_record()
        db.session.delete(r)
        db.session.commit()

    # try to make an appointment when another is taking place
    def test_double_schedule(self):
        r = self.patient.new_record()
        schedule_date = datetime.datetime.strptime('2020-12-7', '%Y-%m-%d').date()
        appoint = self.patient.new_appointment(r.record_id, 99999, schedule_date)
        with self.assertRaises(Exception):
            appoint2 = self.patient.new_appointment(r.record_id, 99999, schedule_date)
        db.session.delete(appoint)
        db.session.delete(r)
        db.session.commit()

    # if current function work as expected
    def test_valid_current_state(self):
        self.assertEqual(None, self.patient.current_record())
        self.assertEqual(None, self.patient.current_appointment())
        r = self.patient.new_record()
        schedule_date = datetime.datetime.strptime('2020-12-7', '%Y-%m-%d').date()
        appoint = self.patient.new_appointment(r.record_id, 99999, schedule_date)
        self.assertEqual(r, self.patient.current_record())
        self.assertEqual(appoint, self.patient.current_appointment())
        db.session.delete(appoint)
        db.session.delete(r)
        db.session.commit()

if __name__ == '__main__':
    unittest.main()