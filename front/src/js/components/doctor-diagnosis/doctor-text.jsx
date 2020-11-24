import React from "react";
import style from "../../css/doctor-text.module.css";
import { Input } from "antd";

const { TextArea } = Input;

function DoctorText(props) {
  return (
		<>
      <div className={style["title"]}>
        <h3>{props.title}</h3>
      </div>
      <div className={style["text-area"]}>
        <TextArea
          style={{ width: 600 }}
          size="large"
          rows={props.line}
					name={props.title}
        />
      </div>
			<div className={style["clear-fix"]}></div>
    </>
  );
}

export default DoctorText;
