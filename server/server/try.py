from server.model import *
import datetime
if __name__ == '__main__':
    p = Patient.query.first()
    r = p.new_record()
    id = r.record_id
    d = datetime.date(2020, 2, 15)
    a = p.new_appointment(id, 1, 5, d)
    print(a)

