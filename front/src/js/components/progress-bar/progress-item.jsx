import React from "react";
import style from "../../../css/progress-bar/progress-item.module.css";
import appointmentImg from "../../../img/appointment.png";
import diagnoseImg from "../../../img/diagnose.png";
import checkinImg from "../../../img/checkin.png";
import medicineImg from "../../../img/medicine.png";
import completedImg from "../../../img/completed.png";
import upcomingImg from "../../../img/upcoming.png";
import inProgressImg from "../../../img/inProgress.png";

function ProgressItem(props) {
  const progressTitle = [
    "Book Appointment",
    "Check In",
    "See Doctor",
    "Get Medicine",
  ];
  const progressImg = [appointmentImg, checkinImg, diagnoseImg, medicineImg];
  let state;
  if (props.progress === props.id) {
    state = 0;
  } else if (props.progress > props.id) {
    state = 1;
  } else {
    state = -1;
  }

  return (
    <>
      <img
        src={progressImg[props.id]}
        alt={props.altText}
        className={style["progress-img"]}
      />
      <br />
      {determineImg(state)}
      <p>{progressTitle[props.id]}</p>
    </>
  );
}

function determineImg(state) {
  if (state === 0) {
    return (
      <img
        src={inProgressImg}
        alt="InProgress"
        className={style["inProgress"]}
      />
    );
  } else if (state === 1) {
    return (
      <img src={upcomingImg} alt="Upcoming" className={style["upcoming"]} />
    );
  } else {
    return (
      <img src={completedImg} alt="Completed" className={style["completed"]} />
    );
  }
}

export default ProgressItem;