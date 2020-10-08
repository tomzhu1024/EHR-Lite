import React from 'react';
import ReactDOM from 'react-dom'
import {Button} from 'antd';
import '../css/index.less';

const App = () => {
    return (
        <>
            <h1>Hello World</h1>
            <p>This is a test page.</p>
            <Button onClick={() => {
                alert('You clicked the button.');
            }}>Click Me</Button>
        </>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
