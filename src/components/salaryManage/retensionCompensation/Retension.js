import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import {
  retention_pending,
  retention_approved,
  compensation_pending,
  compensation_approved,
  toggle_comp_modal,
  toggle_retention_modal,
} from "../../../redux/actions/fetchActions";
import { labours_list } from "../../../redux/actions/siteActions";
import CreateCompensation from "./CreateCompensation";
import CreateRetention from "./CreateRetention";
import AdjustmentCredit from "./AdjustmentCredits";
import AdvanceList from "../AdvanceList";
import MiscellaneousDebit from "./MiscellaneousDebit/MiscellaneousDebit";

const Retension = ({
  retention_pending,
  retention_approved,
  compensation_pending,
  compensation_approved,
  toggle_comp_modal,
  toggle_retention_modal,
  labours_list,
}) => {
  useEffect(() => {
    axios
      .all([
        axios.get(
          `${process.env.REACT_APP_API_URL}/wagemanage/retention/?status=P`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL}/wagemanage/retention/?status=A`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL}/wagemanage/compensation/?status=P`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL}/wagemanage/compensation/?status=A`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        ),
      ])
      .then(
        axios.spread((...responses) => {
          retention_pending(responses[0].data.data);
          retention_approved(responses[1].data.data);
          compensation_pending(responses[2].data.data);
          compensation_approved(responses[3].data.data);
          labours_list();
        })
      );
  }, [
    retention_pending,
    retention_approved,
    compensation_pending,
    compensation_approved,
    labours_list,
  ]);

  const [adjustment, setadjustment] = useState(false);
  const [advance, setadvance] = useState(false);
  const [miscellaneous, setmiscellaneous] = useState(false);
  const [allbenifits, setallbenifits] = useState(false);
  const [dftkey, setdftkey] = useState();

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== ",") {
        temp += str[i];
      } else {
        if (temp === "adjustmentcredits") {
          setdftkey("AdjustCredits");
          setadjustment(true);
        } else if (temp === "advance") {
          setdftkey("ApplyAdvance");
          setadvance(true);
        } else if (temp === "miscellenousdebits") {
          setdftkey("MiscellaneousDebit");
          setmiscellaneous(true);
        } else if (temp === "Allbenefits") {
          setdftkey("AdjustCredits");
          setallbenifits(true);
        }
        temp = "";
      }
    }
    if (temp === "adjustmentcredits") {
      setdftkey("AdjustCredits");
      setadjustment(true);
    } else if (temp === "advance") {
      setdftkey("ApplyAdvance");
      setadvance(true);
    } else if (temp === "miscellenousdebits") {
      setdftkey("MiscellaneousDebit");
      setmiscellaneous(true);
    } else if (temp === "Allbenefits") {
      setdftkey("AdjustCredits");
      setallbenifits(true);
    }
  }, []);

  return (
    <div className="subSectionContainer">
      <div className="title">
        <span>Labour Benefits</span>
        <hr className="seperationLine" />
      </div>
      <div className="subContent">
        {/* <div className="subContentHeader">
          <span className="contentTitle">Retension / Compensation</span>
          <span>
            <Button
              className="btn btn-sm"
              onClick={() => toggle_retention_modal(true)}
            >
              <MdIcons.MdAddToPhotos />
              Create Retention
            </Button>
            <Button
              className="btn btn-sm ml-3"
              onClick={() => toggle_comp_modal(true)}
            >
              <MdIcons.MdAddToPhotos />
              Create Compensation
            </Button>
          </span>
        </div> */}
        <hr className="seperationLine" />
        <Tabs
          defaultActiveKey={dftkey}
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          {/* <Tab eventKey="pendingRetension" title="Pending Retension">
            <PendingRetensions />
          </Tab> */}
          {/* <Tab eventKey="approvedRetensions" title="Approved Retensions">
            <ApprovedRetensions />
          </Tab> */}
          {/* <Tab eventKey="pendingCompensations" title="Pending Compensations">
            <PendingCompensation />
          </Tab> */}
          {/* <Tab eventKey="approvedCompensations" title="Approved Compensations">
            <ApprovedCompensation />
          </Tab> */}
          {adjustment || allbenifits ? (
            <Tab eventKey="AdjustCredits" title="Adjustment Credits">
              <AdjustmentCredit />
            </Tab>
          ) : null}
          {advance || allbenifits ? (
            <Tab eventKey="ApplyAdvance" title="Advance">
              <AdvanceList />
            </Tab>
          ) : null}
          {miscellaneous || allbenifits ? (
            <Tab eventKey="MiscellaneousDebit" title="Miscellaneous Debit">
              <MiscellaneousDebit />
            </Tab>
          ) : null}
        </Tabs>
        <CreateCompensation />
        <CreateRetention />
      </div>
    </div>
  );
};

export default connect(null, {
  retention_pending,
  retention_approved,
  compensation_pending,
  compensation_approved,
  toggle_comp_modal,
  toggle_retention_modal,
  labours_list,
})(Retension);
