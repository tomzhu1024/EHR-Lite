import React from "react";
import style from "../../css/diagnosis-page.module.css";
import { Button, Table } from "antd";
import DoctorText from "./doctor-text";

const boxProperty = [
  { title: "Complaints", line: 2 },
  { title: "Diagnosis", line: 4 },
  { title: "Prescription", line: 3 },
];

const patientInfo = [
  { key: "1", name: "Olivia", age: 32, history: "Breast Cancer" },
];

const columns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "History", dataIndex: "history", key: "history" },
];

function DiagnosisPage(props) {
  return (
    <>
      <div className={style["main-container"]}>
        <div className={style["patient-info-container"]}>
          <div className={style["title-wrapper"]}>
            <h1>Patient Information</h1>
          </div>
          <Table
            dataSource={patientInfo}
            columns={columns}
            pagination={false}
            style={{ width: "900px" }}
          />
        </div>
        <div className={style["diagnosis-page-container"]}>
          <div className={style["title-wrapper"]}>
            <h1>Diagnosis</h1>
          </div>
          <form action="PASTE_URL_HERE" method="POST">
            {boxProperty.map((e, i) => {
              return (
                <div className={style["textbox"]}>
                  <DoctorText title={e.title} line={e.line} />
                </div>
              );
            })}
            <div className={style["submit-button"]}>
              <Button
                type="primary"
                style={{ width: "150px" }}
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
            <div className={style["clear-fix"]}></div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DiagnosisPage;
