import React, { useEffect, useState } from "react";
import "./SalaryManage.css";
import axios from "axios";
import { Button, Tab, Tabs, Form } from "react-bootstrap";
import * as MdIcons from "react-icons/md";
import PaymentList from "./PaymentList";
import PaymentTransactionForm from "./PaymentTransactionForm";
//import AdvanceList from './AdvanceList';
//import AdvanceTotalList from './AdvanceTotalList';
import { connect } from "react-redux";
import { salary_codes, site_list } from "../../redux/actions/siteActions";
import WeeklyPaymentTaskCode from "./WeeklyPaymentTaskCode";
import {
  advance_pending_list,
  advance_total_list,
  payment_transaction_list,
  create_salary_structure_modal,
  apply_advance_modal,
} from "../../redux/actions/fetchActions";
import SalaryList from "./SalaryList";
import CreateSalaryStructure from "./CreateSalaryStructure";
import EditSalaryStructure from "./EditSalaryStructure";
import ApplyAdvance from "./applyAdvance/ApplyAdvance";
//import PaymentListMonthly from './PaymentListMonthly';
const SalaryManage = ({
  apply_advance_modal,
  salary_codes,
  advance_pending_list,
  advance_total_list,
  payment_transaction_list,
  create_salary_structure_modal,
  site_list,
}) => {
  useEffect(() => {
    salary_codes();
    advance_pending_list();
    advance_total_list();
    payment_transaction_list();
    site_list();
  }, [
    salary_codes,
    advance_pending_list,
    advance_total_list,
    payment_transaction_list,
    site_list,
  ]);

  const [wagecode, setwagecode] = useState(false);
  const [weeklypayment, setweeklypayment] = useState(false);
  const [monthlypayment, setmonthlypayment] = useState(false);
  const [allsalerymanage, setallsalerymanage] = useState(false);
  const [taskCodeofSalaryStructure, settaskCodeofSalaryStructure] =
    useState(false);
  const [dftkey, setdftkey] = useState();

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== ",") {
        temp += str[i];
      } else {
        if (temp === "wagecodecreation") {
          setwagecode(true);
          setdftkey("salaryList");
        } else if (temp === "weeklywage") {
          setdftkey("paymentList");
          setweeklypayment(true);
        } else if (temp === "monthlywage") {
          setdftkey("paymentTransactionList");
          setmonthlypayment(true);
        } else if (temp === "Allsalary") {
          setdftkey("salaryList");
          setallsalerymanage(true);
        } else if (temp === "WeeklyPaymentTaskCode") {
          setdftkey("taskCodePayments");
          settaskCodeofSalaryStructure(true);
        }
        temp = "";
      }
    }
    if (temp === "wagecodecreation") {
      setwagecode(true);
      setdftkey("salaryList");
    } else if (temp === "weeklywage") {
      setdftkey("paymentList");
      setweeklypayment(true);
    } else if (temp === "monthlywage") {
      setdftkey("paymentTransactionList");
      setmonthlypayment(true);
    } else if (temp === "Allsalary") {
      setdftkey("salaryList");
      setallsalerymanage(true);
    } else if (temp === "WeeklyPaymentTaskCode") {
      setdftkey("taskCodePayments");
      settaskCodeofSalaryStructure(true);
    }
  }, []);

  const revalidate = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/SalaryStrutManage/salarycode`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        salary_codes(response.data.data);
      })
      .catch((error) => alert(error));
  };

  const [query, setQuery] = useState("");

  return (
    <div className="subSectionContainer">
      <div className="title">
        <span>Salary Management</span>
        <hr className="seperationLine" />
      </div>
      <div className="subContent p-5" style={{ backgroundColor: "white" }}>
        <Tabs
          defaultActiveKey={dftkey}
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          {wagecode || allsalerymanage ? (
            <Tab eventKey="salaryList" title="Wage Code List">
              <div style={{ display: "flex" }} className="salaryresponse">
                <div style={{ alignItems: "left" }}>
                  <Button
                    className="m-3"
                    onClick={() => create_salary_structure_modal(true)}
                  >
                    <MdIcons.MdAddToPhotos />
                    {/* Create Salary Structure */}
                    Create Wage Code
                  </Button>
                </div>
                <div style={{ width: "50%", marginTop: "14px" }}>
                  <Form.Control
                    style={{ textAlign: "center" }}
                    className="Inputresponse"
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <SalaryList query={query} />
            </Tab>
          ) : null}

          {/* <Tab eventKey="advanceLIst" title="Advance List">
            <Button
              className="m-3"
              onClick={() => apply_advance_modal({ show: true })}
            >
              <MdIcons.MdAddToPhotos />
              Apply advance
            </Button>
            <AdvanceList />
          </Tab> */}
          {/* <Tab eventKey="totalAdvanceList" title="Total Advance List">
            <AdvanceTotalList />
          </Tab> */}
          {/* <Tab eventKey="MonthlyPaymentList" title="Monthly Payment">
            <PaymentListMonthly />
          </Tab>*/}

          {weeklypayment || allsalerymanage ? (
            <Tab eventKey="paymentList" title="Weekly Payment">
              <PaymentList />
            </Tab>
          ) : null}
          {monthlypayment || allsalerymanage ? (
            <Tab
              eventKey="paymentTransactionList"
              title="Monthly Transaction List"
            >
              <PaymentTransactionForm />
            </Tab>
          ) : null}
          {taskCodeofSalaryStructure || allsalerymanage ? (
            <Tab
              eventKey="taskCodePayments"
              title="Weekly payment-Task code wise"
            >
              <WeeklyPaymentTaskCode />
            </Tab>
          ) : null}
        </Tabs>
      </div>

      <CreateSalaryStructure />
      <EditSalaryStructure revalidate={revalidate} />
      <ApplyAdvance />
    </div>
  );
};

export default connect(null, {
  site_list,
  salary_codes,
  advance_pending_list,
  advance_total_list,
  payment_transaction_list,
  create_salary_structure_modal,
  apply_advance_modal,
})(SalaryManage);
