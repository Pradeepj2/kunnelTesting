import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import ConcreteCategory from "./ConcreteCategory";
import Designation from "./designation";
import Grade from "./grade";
import ConcreteType from "./ConcreteType";
import CreateTask from "./CreateTask";
import AdvancedSetting from "./advancedsetting";

const Setting = () => {
  const [allSetting, setallSetting] = useState(false);
  const [creatandgrade, setcreatandgrade] = useState(false);
  const [createandtype, setcreateandtype] = useState(false);
  const [taskShow, settaskShow] = useState(false);
  const [dftkey, setdftkey] = useState();

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== ",") {
        temp += str[i];
      } else {
        // console.log(temp);
        if (temp === "Allsetting") {
          setallSetting(true);
          setdftkey("pendingRetension");
        } else if (temp === "grade") {
          setcreatandgrade(true);
          setdftkey("pendingRetension");
        } else if (temp === "type") {
          setcreateandtype(true);
          setdftkey("concreteCategory");
        } else if (temp === "task") {
          settaskShow(true);
          setdftkey("createTaskCode");
        }
        temp = "";
      }
    }
    if (temp === "Allsetting") {
      setallSetting(true);
      setdftkey("pendingRetension");
    } else if (temp === "grade") {
      setcreatandgrade(true);
      setdftkey("pendingRetension");
    } else if (temp === "type") {
      setcreateandtype(true);
      setdftkey("concreteCategory");
    } else if (temp === "task") {
      settaskShow(true);
      setdftkey("createTaskCode");
    }
  }, []);
  return (
    <div className="subSectionContainer">
      <div className="title">
        <span>Setting</span>
        <hr className="seperationLine" />
      </div>
      <div className="subContent">
        <hr className="seperationLine" />
        <Tabs
          defaultActiveKey={dftkey}
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          {creatandgrade || allSetting ? (
            <Tab eventKey="pendingRetension" title="Create Designation">
              <Designation />
            </Tab>
          ) : null}
          {creatandgrade || allSetting ? (
            <Tab eventKey="approvedRetensions" title="Create Grade">
              <Grade />
            </Tab>
          ) : null}
          {createandtype || allSetting ? (
            <Tab eventKey="concreteCategory" title="Create Concrete Category">
              <ConcreteCategory />
            </Tab>
          ) : null}
          {createandtype || allSetting ? (
            <Tab eventKey="concreteType" title="Create Concrete Type">
              <ConcreteType />
            </Tab>
          ) : null}
          {taskShow || allSetting ? (
            <Tab eventKey="createTaskCode" title="Create Task code & Task name">
              <CreateTask />
            </Tab>
          ) : null}
          {taskShow || allSetting ? (
            <Tab eventKey="advanceSetting" title="Advance Settings">
              <AdvancedSetting />
            </Tab>
          ) : null}
        </Tabs>
      </div>
    </div>
  );
};

export default Setting;
