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
  { key: "1", name: "Olivia", age: 32, ID: "N12345678", PhoneNum: "11662255378", Allergy: "qqq, www, eee, rrr" },
];

const columns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "ID", dataIndex: "ID", key: "ID" },
  { title: "Phone Number", dataIndex: "PhoneNum", key: "PhoneNum"},
  { title: "Allergy", dataIndex: "Allergy", key: "Allergy"}
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
            style={{ "margin-left":"20px", width: "770px" }}
          />
          <div className={style["check-history"]}><a>View Previous Records</a></div>
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
