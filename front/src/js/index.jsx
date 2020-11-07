import React from 'react';
import ReactDOM from 'react-dom'
import '../css/index.less';
import Navbar from './components/navbar-top.jsx'
import LoginForm from './components/login-form.jsx'
import Footer from './components/footer.jsx'
import Progress from './components/progress.jsx'

const App = () => {
    return (
        <React.Fragment>
            <h1>Hello World</h1>
            <p>This is a test page.</p>
            {/* <Navbar /> */}
            {/* <LoginForm /> */}
            <Progress />
            {/* <Footer /> */}
        </React.Fragment>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
