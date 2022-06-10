import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import OTSelection from "./OTSelection";
import OTApproval from "./OTApproval";
import OTAuthorization from "./OTAuthorization";
import Reports from "./Reports";

const LabourOT = () => {
  const [approvalId, setApprovalId] = useState([]);
  const [tempapprovalid, settempapprovalid] = useState([]);
  const [body, setBody] = useState(null);

  const [createot, setcreateot] = useState(false);
  const [otapproval, setotapproval] = useState(false);
  const [otauth, setotauth] = useState(false);
  const [otreport, setotreport] = useState(false);
  const [allOt, setallOt] = useState(false);
  const [dftkey, setDftkey] = useState();

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] != ",") {
        temp += str[i];
      } else {
        if (temp === "createot") {
          setDftkey("OtSelection");
          setcreateot(true);
        } else if (temp === "otapproval") {
          setDftkey("OtApproval");
          setotapproval(true);
        } else if (temp === "otauthorization") {
          setDftkey("OtAuthorization");
          setotauth(true);
        } else if (temp === "otreport") {
          setDftkey("OtReports");
          setotreport(true);
        } else if (temp === "AllOt") {
          setDftkey("OtSelection");
          setallOt(true);
        }
        temp = "";
      }
    }
    if (temp === "createot") {
      setDftkey("OtSelection");
      setcreateot(true);
    } else if (temp === "otapproval") {
      setDftkey("OtApproval");
      setotapproval(true);
    } else if (temp === "otauthorization") {
      setDftkey("OtAuthorization");
      setotauth(true);
    } else if (temp === "otreport") {
      setDftkey("OtReports");
      setotreport(true);
    } else if (temp === "AllOt") {
      setDftkey("OtSelection");
      setallOt(true);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userType") === "ProjectManager") {
      var element = (
        <Tabs
          defaultActiveKey={dftkey}
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          {otauth || allOt ? (
            <Tab eventKey="OtAuthorization" title="OT Authorization">
              <OTAuthorization />
            </Tab>
          ) : null}
        </Tabs>
      );
      setBody(element);
    } else if (localStorage.getItem("userType") === "SiteAssitant") {
      var element = (
        <Tabs
          defaultActiveKey={dftkey}
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          {otapproval || allOt ? (
            <Tab eventKey="OtApproval" title="OT Approval">
              <OTApproval
                approvalId={approvalId}
                setApprovalId={setApprovalId}
              />
            </Tab>
          ) : null}
        </Tabs>
      );
      setBody(element);
    } else if (localStorage.getItem("userType") === "SiteEngineer") {
      var element = (
        <Tabs
          defaultActiveKey={dftkey}
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          {createot || allOt ? (
            <Tab eventKey="OtSelection" title="Create OT">
              <OTSelection
                approvalId={approvalId}
                setApprovalId={setApprovalId}
              />
            </Tab>
          ) : null}

          {otapproval || allOt ? (
            <Tab eventKey="OtApproval" title="OT Approval">
              <OTApproval
                approvalId={approvalId}
                setApprovalId={setApprovalId}
              />
            </Tab>
          ) : null}
        </Tabs>
      );
      setBody(element);
    } else {
      var element = (
        <Tabs
          defaultActiveKey={dftkey}
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          {allOt || createot ? (
            <Tab eventKey="OtSelection" title="Create OT">
              <OTSelection
                approvalId={approvalId}
                setApprovalId={setApprovalId}
              />
            </Tab>
          ) : null}

          {otapproval || allOt ? (
            <Tab eventKey="OtApproval" title="OT Approval">
              <OTApproval
                approvalId={approvalId}
                setApprovalId={setApprovalId}
              />
            </Tab>
          ) : null}

          {otauth || allOt ? (
            <Tab eventKey="OtAuthorization" title="OT Authorization">
              <OTAuthorization />
            </Tab>
          ) : null}
          {otreport || allOt ? (
            <Tab eventKey="OtReports" title="OT Reports">
              <Reports />
            </Tab>
          ) : null}
        </Tabs>
      );

      if (tempapprovalid != approvalId) {
        settempapprovalid(approvalId);
      }
      setBody(element);
    }
  }, [tempapprovalid]);

  //different revalidating function
  return (
    <div className="subSectionContainer">
      <div className="title">
        <span>Labour OT</span>
        <hr className="seperationLine" />
      </div>
      <div className="subContent p-5" style={{ backgroundColor: "white" }}>
        {body}
      </div>
    </div>
  );
};

export default LabourOT;
