import React from "react";
import ReactDOM from "react-dom";
import "../css/index.less";
import Navbar from "./components/navbar-top.jsx";
import LoginForm from "./components/login-form.jsx";
import Footer from "./components/footer.jsx";
import Progress from "./components/progress.jsx";
// import Calendar from "./components/calendar-form.jsx";
import Department from "./components/department.jsx";
import DepartmentList from './components/department-list.jsx'

const App = () => {
  return (
    <React.Fragment>
        <DepartmentList />
      {/* <Department name={"Oncology"}/> */}
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
