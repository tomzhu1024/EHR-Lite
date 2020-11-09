import React from "react";
import style from "../../../css/login-form/tabs.module.css";

function Tabs(props) {
  return (
    <button
      onClick={() => props.onClick(props.id)}
      className={
        style[props.selected === 1 ? "selected-button" : "unselected-button"]
      }
    >
      {props.title}
    </button>
  );
}

export default Tabs;
