import React from 'react';
import ReactDOM from 'react-dom'
import {Button} from 'antd';
import '../css/index.less';
import Counter from './components/counter.jsx'

const App = () => {
    return (
        <React.Fragment>
            <h1>Hello World</h1>
            <p>This is a test page.</p>
            <Counter />
            <Button onClick={() => {
                alert('You clicked the button.');
            }}>Click Me</Button>
        </React.Fragment>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
