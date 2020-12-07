import unittest
import datetime
from server.model import *
from server import db


class ScheduleTest(unittest.TestCase):

    def setUp(self):
        # Initialize a doctor to be working on Monday, from 8:00-18:00, allowing 2 people to make reservation
        self.doctor = Doctor(doctor_id=99999, password='password', name='test', department='Cardiology', title='Senior Doctor')
        db.session.add(self.doctor)
        self.schedule = Schedule(schedule_id=99999,doctor_id=99999, start_time='8:00:00', end_time='18:00:00', capacity=2, weekday=0)
        db.session.add(self.schedule)
        db.session.commit()

    def tearDown(self):
        # Remove the added doctor
        db.session.delete(self.schedule)
        db.session.delete(self.doctor)
        db.session.commit()

    # a valid input
    def test_valid_response(self):
        self.assertTrue(self.schedule.is_available_on('2020-12-7'))

    # input with wrong type or incompatible date
    def test_invalid_input(self):
        with self.assertRaises(Exception):
            self.schedule.is_available_on(3)
        with self.assertRaises(ValueError):
            self.schedule.is_available_on('2020-02-14')

    # make sure patient can't access a schedule when there's already reach max capacity
    def test_max_capacity(self):
        patient1 = Patient(patient_id=99999, password='test', name='test', birthday='2000-01-01')
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
        self.assertFalse(self.schedule.is_available_on(schedule_date))
        db.session.delete(record1)
        db.session.delete(record2)
        db.session.delete(appointment1)
        db.session.delete(appointment2)
        db.session.delete(patient1)
        db.session.delete(patient2)
        db.session.commit()


if __name__ == '__main__':
    unittest.main()

