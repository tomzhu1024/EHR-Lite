import React from "react";
import appointmentImg from "../../../assets/appointment.png";
import checkinImg from "../../../assets/checkin.png";
import diagnosisImg from "../../../assets/diagnose.png";
import medicineImg from "../../../assets/medicine.png";

function BarImg(props) {
  const imgs = [appointmentImg, checkinImg, diagnosisImg, medicineImg];
  const alt = ["Appointment", "Check In", "Diagnosis", "Medicine"];
  const style1 = {
    width: "8em",
  };
  const style2 = {
    width: "10em",
  };
  return (
    <img
      src={imgs[props.id]}
      alt={alt[props.id]}
      style={props.id === 0 ? style2 : style1}
    />
  );
}

export default BarImg;
