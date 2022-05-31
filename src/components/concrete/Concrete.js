import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tab, Tabs } from "react-bootstrap";
import ConcreteSelection from "./ConcreteSelection";
import ConcreteApproval from "./ConcreteApproval";
import ConcreteAuthorization from "./ConcreteAuthorization";
import Reports from "./Reports";
import { useSnackbar } from "notistack";

const Concrete = () => {
  const [show, setShow] = useState(false);
  const [concrete, setConcrete] = useState([]);
  const [allconcrete, setallconcrete] = useState(false);
  const [approvalconcrete, setapprovalconcrete] = useState(false);
  const [createconcrete, setcreateconcrete] = useState(false);
  const [concreteauth, setconcreteauth] = useState(false);
  const [ConcreteReport, setConcreteReport] = useState(false);
  const [dftkey, setdftkey] = useState();

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };
  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== ",") {
        temp += str[i];
      } else {
        if (temp === "Allconcrete") {
          setallconcrete(true);
          setdftkey("OtSelection");
        } else if (temp === "createconcrete") {
          setcreateconcrete(true);
          setdftkey("OtSelection");
        } else if (temp === "concreteapproval") {
          setapprovalconcrete(true);
          setdftkey("OtApproval");
        } else if (temp === "concreteauthorization") {
          setconcreteauth(true);
          setdftkey("OtAuthorization");
        } else if (temp === "concretereport") {
          setConcreteReport(true);
          setdftkey("OtReports");
        }
        temp = "";
      }
    }
    if (temp === "Allconcrete") {
      setallconcrete(true);
      setdftkey("OtSelection");
    } else if (temp === "createconcrete") {
      setcreateconcrete(true);
      setdftkey("OtSelection");
    } else if (temp === "concreteapproval") {
      setapprovalconcrete(true);
      setdftkey("OtApproval");
    } else if (temp === "concreteauthorization") {
      setconcreteauth(true);
      setdftkey("OtAuthorization");
    } else if (temp === "concretereport") {
      setConcreteReport(true);
      setdftkey("OtReports");
    }
  }, []);

  const viewHandler = (e) => {
    setShow(true);
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concretesection/ `,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setConcrete(res.data);
        } else {
          showsuccErr({ msg: "Cannot Retrieve Concrete", variant: "error" });

          // alert("Cannot Retrieve Concrete");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const revalidate = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concretesection/ `,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setConcrete(res.data);
        } else {
          showsuccErr({ msg: "Cannot Retrieve Concrete", variant: "error" });

          // alert("Cannot Retrieve Concrete");
        }
      })
      .catch((err) => console.log(err));
  };

  const [approvalId, setApprovalId] = useState([]);
  const [body, setBody] = useState(null);
  useEffect(() => {
    var element = (
      <Tabs
        defaultActiveKey={dftkey}
        id="uncontrolled-tab-example"
        style={{ fontSize: "14px" }}
      >
        {createconcrete || allconcrete ? (
          <Tab eventKey="OtSelection" title="Concrete Creation">
            <ConcreteSelection
              approvalId={approvalId}
              setApprovalId={setApprovalId}
              concrete1={concrete}
            />
          </Tab>
        ) : null}
        {approvalconcrete || allconcrete ? (
          <Tab eventKey="OtApproval" title="Concrete Approval">
            <ConcreteApproval
              approvalId={approvalId}
              setApprovalId={setApprovalId}
            />
          </Tab>
        ) : null}
        {concreteauth || allconcrete ? (
          <Tab eventKey="OtAuthorization" title="Concrete Authorize">
            <ConcreteAuthorization />
          </Tab>
        ) : null}
        {ConcreteReport || allconcrete ? (
          <Tab eventKey="OtReports" title="Concrete Reports">
            <Reports />
          </Tab>
        ) : null}
      </Tabs>
    );
    setBody(element);
  }, [
    allconcrete,
    createconcrete,
    approvalconcrete,
    concreteauth,
    ConcreteReport,
  ]);

  return (
    <>
      <div className="subSectionContainer">
        <div className="title">
          <span>Concrete</span>
          <hr className="seperationLine" />
        </div>
        <div className="subContent p-5" style={{ backgroundColor: "white" }}>
          {body}
        </div>
      </div>
    </>
  );
};

export default Concrete;
