import React from "react";
import PatientSearchBar from "../patient-search-bar";
import { Descriptions, Empty } from "antd";

const mainContainer = {
  backgroundColor: "white",
  height: "fit-content",
  boxShadow: "0 0 1.5em rgba(0, 0, 0, 0.1)"
};
const searchBarContainer = {
  padding: "3%",
};
const prescriptionContainer = {
  padding: "0% 3% 3% 3%",
};

function CheckPrescription(props) {
  let prescriptions = "";
  prescriptions = props.prescriptions;
  return (
    <div style={mainContainer}>
      <div style={searchBarContainer}>
        <PatientSearchBar />
      </div>
      <div style={prescriptionContainer}>
        {prescriptions === "" ? (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            description={<span>No prescriptions</span>}
          ></Empty>
        ) : (
          <div style={{ height: "15em" }}>
            <div
              style={{
                width: "20%",
                minWidth: "10em",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                float: "left",
                textAlign: "center",
                lineHeight: "15em",
              }}
            >
              <h2>Prescriptions</h2>
            </div>
            <div
              style={{
                width: "80%",
                height: "100%",
                float: "left",
                padding: "3%",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                overflow: "hidden",
              }}
            >
              {prescriptions}
            </div>
            <div style={{ clear: "both" }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckPrescription;
