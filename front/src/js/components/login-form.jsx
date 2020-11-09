import React from "react";
import Tabs from "./tabs.jsx";
import style from "../../css/login-form.module.css";

// function is needed for selecting tab from the list of tabs

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          title: "Patient",
          selected: 1,
        },
        {
          title: "Doctor",
          selected: 0,
        },
        {
          title: "Staff",
          selected: 0,
        },
      ],
    };
  }

  tabSwitch(i) {
    let tabs = [...this.state.tabs];
    let val = tabs.findIndex((e) => e.selected === 1);
    tabs[val] = { ...tabs[val], selected: 0 };
    tabs[i] = { ...tabs[i], selected: 1 };
    this.setState({ tabs });
  }

  formSubmit(id, password) {
    let identity = this.state.tabs.findIndex((e, i) => e.selected === 1);
    console.log(id);
    console.log(password);
    console.log(identity);
  }

  render() {
    return (
      <React.Fragment>
        <div id={style["tabs"]}>
          {this.state.tabs.map((e, i) => {
            return (
              <div className={style["tabs-item"]}>
                <Tabs
                  id={i}
                  title={e.title}
                  selected={e.selected}
                  key={e}
                  onClick={this.tabSwitch.bind(this)}
                />
              </div>
            );
          })}
          <div className={style["clearfix"]}></div>
        </div>
        <div
          id={
            style[this.state.tabs[0].selected ? "container-l" : "container-s"]
          }
        >
          <div id={style["wrapper"]}>
            <form>
              <input
                type="text"
                id={style["id"]}
                className={style["input-box"]}
                placeholder="ID Number"
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
              {!this.state.tabs[0].selected ? null : (
                <>
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
                </>
              )}
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LoginForm;
