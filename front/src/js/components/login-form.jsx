import React from "react";
import style from "../../css/login-form.module.css";

// function is needed for selecting tab from the list of tabs

function LoginForm(props) {
  return (
    <React.Fragment>
      <div id={style["tabs"]}>
        <button>Patient</button>
        <button>Doctor</button>
        <button>Staff</button>
        <div className={style["clearfix"]}></div>
      </div>
      <div id={style["container"]}>
        <div id={style["wrapper"]}>
          <form action="POST">
            <input
              type="text"
              id={style["email"]}
              className={style["input-box"]}
              placeholder="Email"
            />
            <br />
            <input
              type="password"
              id={style["password"]}
              className={style["input-box"]}
              placeholder="Password"
            />
            <br />
            <button
              id={style["login-button"]}
              className={style["submit-button"]}
            >
              Log In
            </button>
            <div id={style["form-text"]}>
              <a href="">
                <h5>Forget your password?</h5>
              </a>
            </div>
            <div>
              <div className={style["hr"]}></div>
            </div>
            <button
              id={style["create-button"]}
              className={style["submit-button"]}
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

export default LoginForm;
