import React from 'react';
import DepartmentList from "./department-list";
import CalendarForm from "./calendar-form";
import style from "../../css/appointment.module.css"

function Appointment(props) {
  return (
    <>
      <div className={style["department-list"]}>
        <DepartmentList />
      </div>
      <div className={style["calendar-form"]}>
        <CalendarForm />
      </div>
      <div className={style["clear-fix"]}></div>
    </>
  );
}

export default Appointment;