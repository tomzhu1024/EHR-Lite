import React, {FC} from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './components/login-form/login-form-main';
// import CalendarForm from './components/calendar-form'
// import DepartmentList from './components/department-list'
import Appointment from './components/appointment'

const App: FC = () => (
    <>
        {/* <DepartmentList />
        <CalendarForm /> */}
        <Appointment />
    </>
);

ReactDOM.render(<App/>, document.getElementById('root'));
