import React, {FC} from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './components/login-form/login-form-main';
import CalendarForm from './components/calendar-form'

const App: FC = () => (
    <>
        <CalendarForm />
    </>
);

ReactDOM.render(<App/>, document.getElementById('root'));
