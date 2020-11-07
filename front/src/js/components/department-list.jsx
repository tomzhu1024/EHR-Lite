import React from "react";
import Department from "./department.jsx";
import style from "../../css/department-list.module.css";

function DepartmentList(props) {
  const departments = ["Oncology", "Intensive Care Unit", "Cardiology"];
  return (
    <div id={style.mainContainer}>
      <div id={style.titleWrapper}>
        <h1>Departments</h1>
      </div>
      <div id={style.listWrapper}>
        <ul>
          {departments.map((element, idx) => {
            return (
              <li>
                <Department name={element} key={idx}/>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default DepartmentList;
