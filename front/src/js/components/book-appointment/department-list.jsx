import React from "react";
import { Menu, Divider } from "antd";
import style from "../../../css/department-list.module.css";

function onClickDepartment(item){
  let key = parseInt(item.key);
  console.log(key);
}

function DepartmentList(props) {
  const departments = props.departments;
  return (
    
    <div id={style["main-container"]}>
      <div id={style["title-wrapper"]}>
        <h1>Departments</h1>
      </div>
      <div className={style["department-list-wrapper"]}>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="light"
          onSelect={onClickDepartment}
        >
          {departments.map((e, i) => {
            return <Menu.Item key={i}>{e}</Menu.Item>;
          })}
        </Menu>
      </div>
    </div>
  );
}

export default DepartmentList;
