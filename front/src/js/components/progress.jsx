import React from "react";
import style from "../../css/progress.module.css";
import appointmentImg from "../../img/appointment.png";
import diagnoseImg from "../../img/diagnose.png";
import checkinImg from "../../img/checkin.png";
import medicineImg from "../../img/medicine.png";
import completedImg from "../../img/completed.png";
import upcomingImg from "../../img/upcoming.png";
import inProgressImg from "../../img/inProgress.png";

function Progress(props) {
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