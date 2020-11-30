import React from "react";
import PatientSearchBar from "../patient-search-bar";
import { Descriptions, Empty } from "antd";

const mainContainer = {
    backgroundColor: "white"
};
const searchBarContainer = {
    padding:'3%'
};
const prescriptionContainer = {
    padding:'3%',
    backgroundColor: "white",
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
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                float: "left",
                textAlign: "center",
                // verticalAlign: "middle",
                lineHeight: "15em"
              }}
            >
              <h3>Prescription</h3>
            </div>
            <div style={{ width: "80%", height: "100%", float: "left", padding:'3%', overflow:'scroll'}}>
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
