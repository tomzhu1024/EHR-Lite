import React from "react";
import ReactDOM from "react-dom";
import "../css/index.less";
// import Navbar from "./components/navbar-top.jsx";
import LoginForm from "./components/login-form/login-form-main.jsx";
// import Footer from "./components/footer.jsx";
import Progress from "./components/progress-bar/progress-bar-main.jsx";
import CalendarForm from "./components/calendar-form.jsx";
// import Department from "./components/department.jsx";
// import DepartmentList from './components/department-list.jsx'

import Tabs from './components/login-form/tabs.jsx';

const App = () => {
  return (
    <React.Fragment>
      <CalendarForm />
      {/* <LoginForm /> */}
      {/* <Progress /> */}
        {/* <DepartmentList /> */}
      {/* <Department name={"Oncology"}/> */}
      {/* <Tabs title={"Doctor"} id={1} selected={1} onClick={handleClick} />
      <Tabs title={"Patient"} id={2} selected={0} onClick={handleClick} /> */}
    </React.Fragment>
  );
};

function handleClick(i){
  console.log(i);
}

ReactDOM.render(<App />, document.getElementById("root"));
