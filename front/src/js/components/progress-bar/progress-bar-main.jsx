import React from "react";
import style from "../../../css/progress-bar/progress-bar-main.module.css";
import appointmentImg from "../../../assets/appointment.png";
import diagnoseImg from "../../../assets/diagnose.png";
import checkinImg from "../../../assets/checkin.png";
import medicineImg from "../../../assets/medicine.png";
import completedImg from "../../../assets/completed.png";
import upcomingImg from "../../../assets/upcoming.png";
import inProgressImg from "../../../assets/inProgress.png";

function Progress(props) {

  const current_progress = props.progress;

  return (
    <div id={style["progress-container"]}>
      <div id={style["progress-wrapper"]}>
        <div id={style["progress-title"]}>
          <h1>
            <b>My Progress</b>
          </h1>
        </div>
        <ul>
          <li>
            <img
              src={appointmentImg}
              alt="Appointment"
              className={style["progress-img"]}
            />
            <br />
            <img
              src={completedImg}
              alt="Completed"
              className={style["status-img"]}
            />
            <p>Book Appointment</p>
          </li>
          <li>
            <img src={checkinImg} alt="Signin" className={style["progress-img"]} />
            <br />
            <img
              src={inProgressImg}
              alt="Completed"
              className={style["status-img"]}
            />
            <p>Sign In At Hospital</p>
          </li>
          <li>
            <img
              src={diagnoseImg}
              alt="Diagnosis"
              className={style["progress-img"]}
            />
            <br />
            <img
              src={upcomingImg}
              alt="Completed"
              className={style["status-img"]}
            />
            <p>See Doctor</p>
          </li>
          <li>
            <img
              src={medicineImg}
              alt="Prescription"
              className={style["progress-img"]}
            />
            <br />
            <img
              src={upcomingImg}
              alt="Completed"
              className={style["status-img"]}
            />
            <p>Get Medicine</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Progress;