import React from "react";
import ReactDOM from "react-dom";
import "../css/index.less";
// import Navbar from "./components/navbar-top.jsx";
import LoginForm from "./components/login-form.jsx";
// import Footer from "./components/footer.jsx";
// import Progress from "./components/progress.jsx";
// // import Calendar from "./components/calendar-form.jsx";
// import Department from "./components/department.jsx";
// import DepartmentList from './components/department-list.jsx'

import Tabs from './components/tabs.jsx';

const App = () => {
  return (
    <React.Fragment>
      <LoginForm />
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
