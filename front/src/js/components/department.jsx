import React from "react";
import style from "../../css/department.module.css";

function Department(props) {
  return (
    <div className={style.itemContainer}>
      <div className={style.itemContent}>
          {props.name}
      </div>
    </div>
  );
}

export default Department;
