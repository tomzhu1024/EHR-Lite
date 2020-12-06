import unittest
from server.tables import *
from server import db


class ScheduleTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Initialize a doctor to be working on Monday, from 8:00-18:00, allowing 2 people to make reservation
        doctor = Doctor(doctor_id=99999, password='password', name='test', department='Cardiology', title='Senior Doctor')
        db.session.add(doctor)
        schedule = Schedule(schedule_id=99999,doctor_id=99999, start_time='8:00:00', end_time='18:00:00', capacity=2, weekday=0)
        db.session.add(schedule)
        db.session.commit()

    @classmethod
    def tearDownClass(cls):
        # Remove the added doctor
        schedule = Schedule.query.get(99999)
        db.session.delete(schedule)
        doctor = Doctor.query.get(99999)
        db.session.delete(doctor)
        db.session.commit()

    def test_try(self):
        self.assertEqual(1, 1)


if __name__ == '__main__':
    unittest.main()

