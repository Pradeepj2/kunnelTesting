import React, { useState, useEffect } from "react";
import "./Attendance.css";
import { Tab, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import { site_list } from "../../redux/actions/siteActions";
import { attendance } from "../../redux/actions/fetchActions";
import AttendanceTable from "./AttendanceTable";
import CurrentAttendanceTable from "./CurrentAttendanceTable";

const Attendance = ({ sites, site_list }) => {
  const [currentattendence, setcurrentattendence] = useState(false);
  const [pastattendence, setpastattendence] = useState(false);
  const [allattendence, setallattendence] = useState(false);
  const [dftkey, setdftkey] = useState();

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] != ",") {
        temp += str[i];
      } else {
        if (temp === "currentattendence") {
          setcurrentattendence(true);
          setdftkey("currentReport");
        } else if (temp === "pastattendence") {
          setpastattendence(true);
          setdftkey("pastReport");
        } else if (temp === "Allattendence") {
          setdftkey("currentReport");
          setallattendence(true);
        }
        temp = "";
      }
    }
    if (temp === "currentattendence") {
      setcurrentattendence(true);
      setdftkey("currentReport");
    } else if (temp === "pastattendence") {
      setpastattendence(true);
      setdftkey("pastReport");
    } else if (temp === "Allattendence") {
      setdftkey("currentReport");
      setallattendence(true);
    }
  }, []);

  return (
    <div className="subSectionContainer">
      {/* {(loading)?( <Spinner animation="border" role="status" className="loading">
        </Spinner>):null} */}
      <div className="title">
        <span>Attendance</span>
        <hr className="seperationLine" />
      </div>
      {/* <div className="subContent"> */}
      <div className="subContent p-5" style={{ backgroundColor: "white" }}>
        <Tabs
          defaultActiveKey={dftkey}
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          {currentattendence || allattendence ? (
            <Tab eventKey="currentReport" title="Current Attendance">
              <CurrentAttendanceTable />
            </Tab>
          ) : null}
          {pastattendence || allattendence ? (
            <Tab eventKey="pastReport" title="Past Attendance">
              <AttendanceTable />
            </Tab>
          ) : null}
        </Tabs>
      </div>
    </div>
    // </div>
  );
};
const mapStateToProps = (state) => ({
  sites: state.sites,
});
export default connect(mapStateToProps, { site_list, attendance })(Attendance);
