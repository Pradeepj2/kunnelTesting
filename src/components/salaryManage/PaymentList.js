import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import {
  payment_list,
  payment_list_view,
} from "../../redux/actions/fetchActions";
import PaymentListTable from "./PaymentListTable";
import SiteModal from "../utilModals/siteModal";
import { Spinner } from "react-bootstrap";
import WeeklyTable from "./WeeklyTable";
import fileSaver from "file-saver";

const PaymentList = ({
  sites,
  payment_list,
  payment_list_view,
  paymentList,
}) => {
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  //decalaring states
  const [show, setShow] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [fromDate, setFromDate] = useState();
  const [query, setQuery] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [siteCode, setSiteCode] = useState("");

  const onSubmit = (data) => {
    let Data = { ...data, siteid: siteid };

    setData(Data);

    axios
      .post(
        //`${process.env.REACT_APP_API_URL}/wagemanage/wages/mark_payments/?siteid=` +
        `${process.env.REACT_APP_API_URL}/wagemanage/weekWage`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          payment_list(res.data.data);
          payment_list_view({
            site: data.site,
            from_date: data.from_date,
            to_date: data.to_date,
          });
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const revalidate = () => {
    let Data = { ...data, siteid: siteid };
    axios
      .post(
        //`${process.env.REACT_APP_API_URL}/wagemanage/wages/mark_payments/?siteid=` +
        `${process.env.REACT_APP_API_URL}/wagemanage/weekWage`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          payment_list(res.data.data);
          payment_list_view({
            site: data.site,
            from_date: data.from_date,
            to_date: data.to_date,
          });
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

  //handling max date
  const dateHandler = (fromdate) => {
    const date = new Date(fromdate);

    Date.prototype.addDays = function (days) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    const dateString = date.addDays(6);

    var datee = new Date(dateString);

    let day = datee.getDate();
    if (day < 10) day = "0" + day;
    let month = datee.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let year = datee.getFullYear();

    return year + "-" + month + "-" + day;
  };

  const exportHandler = () => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/wagemanage/wages/weekwagereport/?siteid=${siteid}&fromdate=${fromDate}&todate=${dateHandler(
          fromDate
        )}`,
        { responseType: "arraybuffer" }
      )
      .then((response) => {
        var blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "weekwagereport.xlsx");
      });
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
      {loading ? (
        <Spinner animation="border" role="status" className="loading"></Spinner>
      ) : null}
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
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              name="fromdate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              ref={register({
                required: true,
              })}
            ></Form.Control>
            {errors.fromdate?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
          <Form.Group as={Col} controlId="todate">
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              name="todate"
              value={dateHandler(fromDate)}
              ref={register({
                required: true,
              })}
            ></Form.Control>
            {errors.todate?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
        </Form.Row>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button variant="primary" type="submit">
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
          <Button variant="primary" onClick={(e) => exportHandler()}>
            Export Data
          </Button>
        </div>
      </Form>
      <br />
      <PaymentListTable
        query={query}
        revalidate={revalidate}
        loading={loading}
        setLoading={setLoading}
      />
      <WeeklyTable query={query} />
    </>
  );
};
const mapStateToProps = (state) => ({
  sites: state.sites,
  paymentList: state.paymentList,
});
export default connect(mapStateToProps, { payment_list, payment_list_view })(
  PaymentList
);
