import React, {FC} from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './components/login-form/login-form-main';

const App: FC = () => (
    <>
        <LoginForm/>
    </>
);

ReactDOM.render(<App/>, document.getElementById('root'));
