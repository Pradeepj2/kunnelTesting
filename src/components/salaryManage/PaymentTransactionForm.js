import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import fileSaver from "file-saver";
import {
  payment_list,
  payment_list_view,
} from "../../redux/actions/fetchActions";
import PaymentTransactionList from "./PaymentTransactionList";
import SiteModal from "../utilModals/siteModal";

const PaymentList = ({ sites, payment_list, payment_list_view }) => {
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  //decalaring states
  const [show, setShow] = useState(false);
  const [showLabour, setShowLabour] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  //const [paidDate,setPaidDate] = useState();
  const [transactions, setTransactions] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [query, setQuery] = useState("");
  const [siteCode, setSiteCode] = useState("");

  const onSubmit = (data) => {
    // setPaidDate(data.paiddate)

    let Data = {
      siteid: siteid,
      fromdate: fromDate,
      todate: toDate,
    };

    axios
      .post(
        //`${process.env.REACT_APP_API_URL}/wagemanage/wages/mark_payments/?siteid=` +
        `${process.env.REACT_APP_API_URL}/wagemanage/monthlywage`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.data) {
          setTransactions(res.data.data);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error);
      });

    //api for second table
    axios
      .post(
        //`${process.env.REACT_APP_API_URL}/wagemanage/wages/mark_payments/?siteid=` +
        `${process.env.REACT_APP_API_URL}/wagemanage/month_pf_esi_list `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.data) {
          setDeductions(res.data.data);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const viewHandler = () => {
    setShow(true);
  };

  //revalidate
  const revalidate = () => {
    let Data = {
      siteid: siteid,
      fromdate: fromDate,
      todate: toDate,
    };

    axios
      .post(
        //`${process.env.REACT_APP_API_URL}/wagemanage/wages/mark_payments/?siteid=` +
        `${process.env.REACT_APP_API_URL}/wagemanage/monthlywage`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.data) {
          setTransactions(res.data.data);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  //handling end date
  const dateHandler = (data) => {
    var month = data.split("-")[1];
    setFromDate(data + "-1");
    if (month === 2) {
      setToDate(data + "-28");
    } else if (month < 7) {
      if (month % 2 === 0) setToDate(data + "-30");
      else setToDate(data + "-31");
    } else {
      if (month > 7) {
        if (month % 2 === 0) setToDate(data + "-31");
        else setToDate(data + "-30");
      }
    }
  };

  const exportHandler = () => {
    if (toDate) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/wagemanage/wages/monthlywage_report/?siteid=${siteid}&fromdate=${fromDate}&todate=${toDate}`,
          { responseType: "arraybuffer" }
        )
        .then((response) => {
          var blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          fileSaver.saveAs(blob, "monthlyTransaction.xlsx");
        });
    } else {
      alert("Enter Site and Dates First");
    }
  };

  return (
    <>
      <SiteModal
        //query={props.query}
        sites={sites}
        show={show}
        setShow={setShow}
        setSiteid={setSiteid}
        setSiteCode={setSiteCode}
      />
      {/* <LabourDetailModal
        siteid={siteid}
        fromdate={fromDate}
        todate={toDate}
        paidDate={paidDate}
        showLabour={showLabour}
        setShowLabour={setShowLabour}
        /> */}
      <Form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <Form.Row>
          <Form.Group as={Col} controlId="siteid">
            <Form.Label>Site Code</Form.Label>
            <div style={{ display: "flex" }}>
              <div>
                <Form.Control
                  style={{ width: "250px" }}
                  type="text"
                  name="siteid"
                  value={siteCode}
                  disabled={true}
                  ref={register({
                    required: true,
                  })}
                >
                  {/* <option key="0" value="">
                Select
              </option>
              {!(Object.keys(sites).length === 0)
                ? sites.map((site) => {
                    const { id, site_id } = site;
                    return (
                      <option key={id} value={site_id}>
                        {site_id}
                      </option>
                    );
                  })
                : null} */}
                </Form.Control>
                {errors.siteid?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </div>
              <div>
                {" "}
                <Button
                  style={{ backgroundColor: "navy" }}
                  onClick={(e) => viewHandler()}
                >
                  View
                </Button>
              </div>
            </div>
          </Form.Group>

          <Form.Group as={Col} controlId="fromdate">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Form.Label>Year&Month</Form.Label>
              {/* <Form.Control
              type="date"
              name="fromdate"
              onChange={(e)=>setFromDate(e.target.value)}
              ref={register({
                required: true,
              })}
            ></Form.Control> */}
              <input
                style={{
                  border: "none",
                  marginTop: ".3em",
                  borderBottom: "1px solid grey",
                  height: "2.5em",
                }}
                type="month"
                id="from_date"
                name="from_date"
                required={true}
                onChange={(e) => {
                  dateHandler(e.target.value);
                }}
              />
            </div>
            {errors.fromdate?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
          {/* <Form.Group as={Col} controlId="todate">
          <div style={{display:'flex', flexDirection:'column'}}> */}
          {/* <Form.Control
              type="date"
              name="todate"
              onChange={(e)=>setToDate(e.target.value)}
              ref={register({
                required: true,
              })}
            ></Form.Control> */}
          {/* <input 
                style={{border:'none',marginTop:"2.5em", borderBottom:"1px solid grey", height:"2.5em"}}
                type="month" 
                id="to_date" 
                name="to_date"
                required={true}
                onChange={(e)=>{
                  endHandler(e.target.value)
                }}
                />
            </div> */}
          {/* {errors.todate?.type === 'required' && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group> */}
          {/* <Form.Group as={Col} controlId="paiddate">
            <Form.Label>Paid Date</Form.Label>
            <Form.Control
              style={{borderBottom:'1px solid grey'}}
              type="date"
              name="paiddate"
              ref={register({

                required: true,
              })}
            ></Form.Control> */}
          {/* {errors.paiddate?.type === 'required' && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )} */}
          {/* </Form.Group> */}
        </Form.Row>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="primary"
            type="submit"
            onClick={() => (siteid ? setShowLabour(true) : null)}
          >
            Generate
          </Button>
          <div style={{ width: "50%", marginTop: "14px" }}>
            <Form.Control
              style={{ textAlign: "center" }}
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            type="submit"
            onClick={() => exportHandler()}
          >
            Export To Excel
          </Button>
        </div>
      </Form>
      <br />
      <PaymentTransactionList
        query={query}
        revalidate={revalidate}
        transactions={transactions}
        siteid={siteid}
        fromDate={fromDate}
        toDate={toDate}
        deductions={deductions}
      />
    </>
  );
};
const mapStateToProps = (state) => ({
  sites: state.sites,
});
export default connect(mapStateToProps, { payment_list, payment_list_view })(
  PaymentList
);
