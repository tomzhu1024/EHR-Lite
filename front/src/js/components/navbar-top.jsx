import React from "react";
import Logo from "../../img/EHRLiteLOGO.png";
import style from "../../css/navbar-top.module.css";

function Navbar(props) {
    // needs to set superlink
  return (
    <div id={style["header-container"]}>
      <div id={style["header-content"]}>
        <div id={style["logo-wrapper"]}>
          <img src={Logo} alt="this is a logo" id={style["logo"]} />
        </div>
        <div id={style["navbar-wrapper"]}>
          <ul>
            <li>
              <a href="./appointments/appointments-department.html">
                Appointment
              </a>
            </li>
            <li>
              <a href="./appointments/appointments.html">Record</a>
            </li>
            <li>
              <a href="./appointments/appointments.html">Contact</a>
            </li>
            <li>
              <a href="./appointments/appointments.html">Profile</a>
            </li>
          </ul>
        </div>
        <div className={style["clearfix"]}></div>
      </div>
    </div>
  );
}

export default Navbar;
