import random
from flask_socketio import emit

from server import socketio
from server.data.model import Staff


class ChatService:
    def __init__(self, src):
        self.src = src


class PatientChatService(ChatService):
    def __init__(self, src):
        super().__init__(src)
        self.dest = None
        self.is_active = False
        self.history = []

    def find_front_staff(self):
        fronts = Staff.query.filter_by(role='front', online=True).all()
        if not fronts:
            return None
        else:
            return random.choice(random.choice(fronts))

    def start(self):
        staff = self.find_front_staff()
        if not staff:
            return False
        else:
            self.dest = staff
            emit('connect', staff.staff_id, namespace='/wschat')
            return True

    @socketio.on('chat', namespace='/wschat')
    def receive(self, json):
        if json['to'] == self.src.patient_id:
            msg = json['message']
            self.history.append(json)
            emit('receive', msg, namespace='/wschat')

    @socketio.on('sent', namespace='/wschat')
    def send(self, json):
        if json['from'] == self.src.patient_id:
            self.history.append(json)


class StaffChatService(ChatService):
    def __init__(self):
        self.history = {}
        super().__init__()

    @socketio.on('connect', namespace='/wschat')
    def connect(self, id):
        if id == self.src.staff_id:
            self.history[id] = []

    @socketio.on('chat', namespace='/wschat')
    def receive(self, json):
        if json['to'] == self.src.staff_id:
            msg = json['message']
            self.history['from'].append(json)
            emit('receive', msg, namespace='/wschat')

    @socketio.on('sent', namespace='/wschat')
    def send(self, json):
        if json['from'] == self.src.staff_id:
            self.history['to'].append(json)