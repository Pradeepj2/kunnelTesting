// comment code represent previous code which has not been removed for future work, if any

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./Approvals.css";
import axios from "axios";
import { connect } from "react-redux";
import { ot_list } from "../../redux/actions/fetchActions";
import ApprovalList from "./ApprovalList";
import { Form, Button, Col, Spinner } from "react-bootstrap";
import { site_list } from "../../redux/actions/siteActions";
import SiteModal from "../utilModals/siteModal";
import LateApprovalList from "./LateApprovalList";

const Approvals = ({ ot_list, sites, site_list }) => {
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  //###########decalaring states#############//
  const [show, setShow] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [laList, setLaList] = useState([]);
  const [Data, setData] = useState();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [siteCode, setSiteCode] = useState("");

  useEffect(() => {
    site_list();
  }, [site_list]);

  //on submitting form
  const onSubmit = (data) => {
    setLoading(true);

    setStart(data.from_date);
    setEnd(data.to_date);

    let Data = {
      site_id: siteid,
      from_date: data.from_date,
      to_date: data.to_date,
    };

    setData(Data);

    // if (localStorage.getItem('role') === 'ProjectManager') {

    //posting form data to get ot approval list
    axios
      .post(
        // `${process.env.REACT_APP_API_URL}/approvals/otapproval/project_manager_approval_list/`,
        `${process.env.REACT_APP_API_URL}/approvals/otapproval/total_ot_hour_list/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoading(true);
        if (res.data.status) {
          if (res.data.data) setList(res.data.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));

    //for late approval
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/approvals/otapproval/late_deduction/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.data) setLaList(res.data.data);
      })
      .catch((error) => console.log(error));

    // } else {
    //   axios
    //     .post(
    //       `${process.env.REACT_APP_API_URL}/approvals/otapproval/site_engineer_approval_list/`,
    //       data,
    //       {
    //         headers: {
    //           Authorization: `Token ${localStorage.getItem('token')}`,
    //         },
    //       }
    //     )
    //     .then((res) => {
    //       ot_list(res.data.data);
    //     })
    //     .catch((error) => alert(error));
    // }
  };

  const viewHandler = () => {
    setShow(true);
  };

  const revalidate = () => {
    setLoading(true);

    let Data = {
      site_id: siteid,
      from_date: start,
      to_date: end,
    };

    setData(Data);

    // if (localStorage.getItem('role') === 'ProjectManager') {

    //posting form data to get ot approval list
    axios
      .post(
        // `${process.env.REACT_APP_API_URL}/approvals/otapproval/project_manager_approval_list/`,
        `${process.env.REACT_APP_API_URL}/approvals/otapproval/total_ot_hour_list/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoading(true);
        if (res.data.status) {
          setList(res.data.data);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));

    //for late approval
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/approvals/otapproval/late_deduction/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLaList(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  //handling end date
  // const endHandler = (data)=>{
  //     var end = data.split("-")[1];
  //     if(end > 7)
  //     {
  //         if(end%2===0)
  //         {
  //           setEnd(data+"-31")
  //         }
  //         else{
  //           setEnd(data+"-30")
  //         }
  //     }
  //     else{
  //         if(end!=2)
  //         {
  //           if(end%2===0)
  //           {
  //             setEnd(data+"-30")
  //           }
  //           else{
  //             setEnd(data+"-31")
  //           }
  //         }
  //         else{
  //           setEnd(data+"-28")
  //         }
  //     }
  // }

  return (
    <div className="subSectionContainer">
      {loading ? (
        <Spinner animation="border" role="status" className="loading"></Spinner>
      ) : null}
      <SiteModal
        sites={sites}
        show={show}
        setShow={setShow}
        setSiteCode={setSiteCode}
        setSiteid={setSiteid}
      />
      <div className="title">
        <span>Approvals</span>
        <hr className="seperationLine" />
      </div>
      <div className="subContent">
        <div className="subContentHeader">
          <span className="contentTitle">Labours OT List</span>
        </div>
        <hr className="seperationLine" />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Form.Group as={Col} controlId="site_id">
              <Form.Label>Site Code</Form.Label>
              <div style={{ display: "flex" }}>
                <div>
                  <Form.Control
                    style={{ width: "250px" }}
                    type="text"
                    name="site_id"
                    disabled={true}
                    value={siteCode}
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
                  {errors.siteId?.type === "required" && (
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

            <Form.Group as={Col} controlId="from_date">
              {/* <div style={{display:'flex', flexDirection:'column'}}> */}
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                name="from_date"
                ref={register({
                  required: true,
                })}
              ></Form.Control>
              {/* <input 
                style={{border:'none',marginTop:".2em", borderBottom:"1px solid grey", height:"2.5em"}}
                type="month" 
                id="from_date" 
                name="from_date"
                required={true}
                onChange={(e)=>{
                  setStart(e.target.value + "-1")
                }}
                /> */}
              {/* </div> */}
              {errors.from_date?.type === "required" && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="to_date">
              {/* <div style={{display:'flex', flexDirection:'column'}}> */}
              <Form.Label>To Date</Form.Label>
              {/* <input 
                style={{border:'none',marginTop:".2em", borderBottom:"1px solid grey", height:"2.5em"}}
                type="month" 
                id="to_date" 
                name="to_date"
                required={true}
                onChange={(e)=>{
                  endHandler(e.target.value)
                }}
                />
                </div> */}
              <Form.Control
                type="date"
                name="to_date"
                ref={register({
                  required: true,
                })}
              ></Form.Control>
              {errors.to_date?.type === "required" && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit">
            Get OT List
          </Button>
        </Form>
        <ApprovalList
          Data={Data}
          list={list}
          start={start}
          end={end}
          siteid={siteid}
          revalidate={revalidate}
        />
        {/* <LateApprovalList laList={laList} Data={Data} start={start} end={end} siteid={siteid}/> */}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  sites: state.sites,
});
export default connect(mapStateToProps, { ot_list, site_list })(Approvals);
