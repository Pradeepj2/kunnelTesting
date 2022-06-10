import { Snackbar } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

import {
  salary_codes,
  toggle_site_create_modal,
} from "../../redux/actions/siteActions";
import Alert from "../Shared/Alert";

const CreateSite = ({
  toggle_site_create_modal,
  modalSiteCreate,
  siteAccounts,
  salaryCodes,
  salary_codes,
  revalidate,
}) => {
  //##############################declaring states####################//
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [startDate, setStartDate] = useState();
  //const [endBuffer,setEndBuffer] = useState()
  //const [startBuffer,setStartBuffer] = useState()
  const [endDate, setEndDate] = useState();
  //const [endTime,setEndTime] = useState()
  //const [lunchTime,setLunchTime] = useState()
  //const [startTime,setStartTime] = useState()
  const [specificRatio, setSpecificRatio] = useState();
  const [aplhaError, setAlphaError] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  useEffect(() => {
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
  }, [salary_codes]);

  const { register, handleSubmit, errors } = useForm({
    mode: "onTouched",
  });

  function isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (
        !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)
      ) {
        // lower alpha (a-z)
        return false;
      }
    }
    return true;
  }

  const onSubmit = (data) => {
    let Data = {
      name: data.name,
      address: data.address,
      client_name: data.client_name,
      // compensation_cr_account: data.compensation_cr_account,
      // compensation_dr_account: data.compensation_dr_account,

      //end_buffer: data.end_buffer + ':00',
      //end_buffer:endBuffer + ':00',

      end_date: data.end_date,
      // end_date: endDate,

      // end_time: data.end_time + ':00',
      //end_time: endTime + ':00',
      end_time: data.end_time.slice(0, 5) + ":00",

      // festival_advnc_cr_account: data.festival_advnc_cr_account,

      // festival_advnc_dr_account: data.festival_advnc_dr_account,

      //lunch_time: data.lunch_time + ':00',
      lunch_time: data.lunch_time.slice(0, 5) + ":00",
      lunch_time_end: data.lunch_time_end.slice(0, 5) + ":00",
      //lunch_time :lunchTime+':00',

      project_manager: data.project_manager,
      project_type: data.project_type,
      // retension_cr_account: data.retension_cr_account,

      // retension_dr_account: data.retension_dr_account,

      // salary_structure: data.salary_structure,

      // site_engineer: data.site_engineer,
      site_code: data.site_code,
      //  special_advnc_cr_account: data.special_advnc_cr_account,

      //  special_advnc_dr_account: data.special_advnc_dr_account,

      //start_buffer: data.start_buffer + ':00',
      //start_buffer: startBuffer + ':00',

      start_date: data.start_date,
      // start_date: startDate,
      site_specific_ratio: specificRatio + ":1",

      // start_time: data.start_time + ':00',
      //start_time: startTime+':00',
      start_time: data.start_time.slice(0, 5) + ":00",

      // wage_cr_account: data.wage_cr_account,
      // wage_dr_account: data.wage_dr_account,
      // weekly_advnc_cr_account: data.weekly_advnc_cr_account,
      // weekly_advnc_dr_account: data.weekly_advnc_dr_account,
    };

    if (aplhaError) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/sitemanage/create/`, Data, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            showsuccErr({
              msg: "Site Created Successfully",
              variant: "success",
            });
            revalidate();
            // setShowSuccess(true);
            setSpecificRatio("");
            setTimeout(() => {
              // setShowSuccess(false);
              toggle_site_create_modal(false);
            }, 1000);
          } else {
            // for (let item in res.data.message) {
            //   alert(`${item}: ${res.data.message[item]}`);
            // }
            showsuccErr({ msg: "Error", variant: "error" });
          }
        })
        .catch((error) => {
          showsuccErr({ msg: JSON.stringify(error), variant: "error" });
          // setError(JSON.stringify(error));
        });
    }
  };

  return (
    <>
      {/* <Snackbar open={showSuccess} autoHideDuration={1000}>
        <Alert severity="success">New site added successfully</Alert>
      </Snackbar>
      <Snackbar
        open={error != null}
        autoHideDuration={1000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar> */}
      <Modal
        show={modalSiteCreate}
        onHide={() => {
          toggle_site_create_modal(false);
          setSpecificRatio();
          setAlphaError(true);
        }}
        style={{ overflow: "auto" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col} controlId="name">
                <Form.Label>Site Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.name?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Address"
                  name="address"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.address?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="client_name">
                <Form.Label>Client Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Client Name"
                  name="client_name"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.client_name?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="project_manager">
                <Form.Label>Project Manger</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Project Manger"
                  name="project_manager"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.project_manager?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="project_type">
                <Form.Label>Type Of Project</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Project Type"
                  name="project_type"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.project_type?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* <Form.Group as={Col} controlId="site_engineer">
                <Form.Label>Site Engineer</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Site Engineer"
                  name="site_engineer"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.site_engineer?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              <Form.Group as={Col} controlId="site_code">
                <Form.Label>Site Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Site Code"
                  onChange={(e) =>
                    setAlphaError(isAlphaNumeric(e.target.value))
                  }
                  name="site_code"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.site_code?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {!aplhaError && (
                  <p className="text-danger">
                    <small>
                      <i>Should be alphanumeric</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              {/* <Form.Group as={Col} controlId="start_date" >
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  inputClass="form-control"
                  placeholder="Select Start Date"
                  onChange={(e) => {
                    console.log(e)
                   setStartDate(`${e.year}-${e.month}-${e.day}`)
                  }}
                  multiple={false}
                />
                {/* {errors.start_date?.type === 'required' && ( */}
              {/* {errors.start_date?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>  */}
              <Form.Group as={Col} controlId="start_date">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Start Date"
                  name="start_date"
                  onChange={(e) => setStartDate(e.target.value)}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.start_date?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* <Form.Group as={Col} controlId="end_date">
                <Form.Label>End Date</Form.Label>

                <DatePicker
                  placeholder="Select End Date"
                  inputClass="form-control"
                  onChange={(e) => {
                   // setValue('end_date', `${e.year}-${e.month}-${e.day}`);
                   setEndDate(`${e.year}-${e.month}-${e.day}`);
                  }}
                  multiple={false}
                />
                {errors.end_date?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              <Form.Group as={Col} controlId="end_date">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter End Date"
                  name="end_date"
                  onChange={(e) => setEndDate(e.target.value)}
                  //defaultValue={siteEditData.end_date}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.end_date?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {startDate > endDate ? (
                  <p className="text-danger">
                    <small>
                      <i>end date should be greater than start date</i>
                    </small>
                  </p>
                ) : null}
              </Form.Group>
              {/* <Form.Group as={Col} controlId="lunch_time">
                <Form.Label>Lunch Time</Form.Label>

                <DatePicker
                  inputClass="form-control"
                  disableDayPicker
                  format="HH:mm"
                  placeholder="Select lunch time"
                  onChange={(e) => {
                  //  setValue('lunch_time', `${e.hour}:${e.minute}`);
                    setLunchTime(`${e.hour}:${e.minute}`);
                }}
                  plugins={[<TimePicker hideSeconds />]}
                />
                {errors.lunch_time?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              <Form.Group as={Col} controlId="lunch_time">
                <Form.Label>Lunch Start Time</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Enter Lunch Start Time"
                  name="lunch_time"
                  //defaultValue={siteEditData.lunch_time}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.lunch_time?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="lunch_time_end">
                <Form.Label>Lunch End Time</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Enter Lunch End Time"
                  name="lunch_time_end"
                  //defaultValue={siteEditData.lunch_time}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.lunch_time_end?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* <Form.Group as={Col} controlId="start_time">
                <Form.Label>Shift Start Time</Form.Label>
                  <br/>
                <DatePicker
                  inputClass="form-control"
                  disableDayPicker
                  format="HH:mm"
                  placeholder="Select Shift Start time"
                  onChange={(e) => {
                   // setValue('start_time', `${e.hour}:${e.minute}`);
                   setStartTime(`${e.hour}:${e.minute}`)
                  }}
                  plugins={[<TimePicker hideSeconds />]}
                />
                {errors.start_time?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              <Form.Group as={Col} controlId="start_time">
                <Form.Label>Shift Start Time</Form.Label>
                <Form.Control
                  type="time"
                  name="start_time"
                  //defaultValue={siteEditData.start_time}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.start_time?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* <Form.Group as={Col} controlId="end_time">
              
                <Form.Label>Shift End Time</Form.Label>
                <br/>
                <DatePicker
                  inputClass="form-control"
                  disableDayPicker
                  format="HH:mm"
                  placeholder="Select Shift End time"
                  onChange={(e) => {
                  //  setValue('end_time', `${e.hour}:${e.minute}`);
                 // console.log(e);
                  setEndTime( `${e.hour}:${e.minute}`)
                  }}
                  plugins={[<TimePicker hideSeconds />]}
                />
                {errors.end_time?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              <Form.Group as={Col} controlId="end_time">
                <Form.Label>Shift End Time</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Enter End Time"
                  name="end_time"
                  // defaultValue={siteEditData.end_time}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.end_time?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* <Form.Group as={Col} controlId="start_buffer">
                <Form.Label>Buffer Start Time</Form.Label>

                <DatePicker
                  inputClass="form-control"
                  disableDayPicker
                  format="HH:mm"
                  placeholder="Select Buffer Start time"
                  onChange={(e) => {
                   // setValue('start_buffer', `${e.hour}:${e.minute}`);
                   setStartBuffer(`${e.hour}:${e.minute}`)
                  }}
                  plugins={[<TimePicker hideSeconds />]}
                />
                {errors.start_buffer?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="site_specific_ratio">
                <Form.Label>Site Specific Ratio</Form.Label>
                <div style={{ display: "flex" }}>
                  <div>
                    <Form.Control
                      style={{ marignTop: "5px", width: "300px" }}
                      type="text"
                      placeholder={specificRatio}
                      value={specificRatio}
                      name="site_specific_ratio"
                      onChange={(e) => setSpecificRatio(`${e.target.value}`)}
                      ref={register({
                        required: true,
                      })}
                    />
                  </div>

                  <div>
                    <Form.Control
                      style={{ marignTop: "5px", width: "50px" }}
                      type="text"
                      placeholder=":1"
                      disabled
                    />
                  </div>
                </div>
                {errors.name?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>

              {/* <Form.Group as={Col} controlId="end_buffer" style={{marginTop:'18px'}}>
                <Form.Label>Buffer End Time</Form.Label>

                <DatePicker
                  inputClass="form-control"
                  disableDayPicker
                  format="HH:mm"
                  placeholder="Select Buffer End time"
                  onChange={(e) => {
                    setEndBuffer(`${e.hour}:${e.minute}`)
                  }}
                  plugins={[<TimePicker hideSeconds />]}
                />
                {errors.end_buffer?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}

              {/* <Form.Group as={Col} controlId="salary_structure">
                <Form.Label>Salary day structure</Form.Label>
                <Form.Control
                  as="select"
                  name="salary_structure"
                  ref={register({
                    required: true,
                  })}
                > */}
              {/* <option value="">Select salary code</option>
                  {!(salaryCodes.length === 0)
                    ? salaryCodes.map((item) => {
                        const { id } = item;
                        return (
                          <option key={id} value={id}>
                            {id}
                          </option>
                        );
                      })
                    : null}
                </Form.Control> */}
              {/* {errors.salary_structure?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              {/* <Form.Group as={Col} controlId="wage_cr_account">
                <Form.Label>Wage Credit Account</Form.Label>
                <Form.Control
                  as="select"
                  name="wage_cr_account"
                  ref={register({
                    required: true,
                  })}
                > */}
              {/* <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control> */}
              {/* {errors.wage_cr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
            </Form.Row>
            {/* <Form.Row>
              <Form.Group as={Col} controlId="wage_dr_account">
                <Form.Label>Wage Debit Account</Form.Label>
                <Form.Control
                  as="select"
                  name="wage_dr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.wage_dr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="festival_advnc_cr_account">
                <Form.Label>Festival Advance Credit Account</Form.Label>
                <Form.Control
                  as="select"
                  name="festival_advnc_cr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.festival_advnc_cr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="festival_advnc_dr_account">
                <Form.Label>Festival Advance Debit Account</Form.Label>
                <Form.Control
                  as="select"
                  name="festival_advnc_dr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.festival_advnc_dr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="special_advnc_cr_account">
                <Form.Label>Special Advance Credit Account</Form.Label>
                <Form.Control
                  as="select"
                  name="special_advnc_cr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.special_advnc_cr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="special_advnc_dr_account">
                <Form.Label>Special Advance Debit Account</Form.Label>
                <Form.Control
                  as="select"
                  name="special_advnc_dr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.special_advnc_dr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="weekly_advnc_cr_account">
                <Form.Label>Weekly Advance Credit Account</Form.Label>
                <Form.Control
                  as="select"
                  name="weekly_advnc_cr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.weekly_advnc_cr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="weekly_advnc_dr_account">
                <Form.Label>Weekly Advance Debit Account</Form.Label>
                <Form.Control
                  as="select"
                  name="weekly_advnc_dr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.weekly_advnc_dr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="compensation_cr_account">
                <Form.Label>Compensation Credit Account</Form.Label>
                <Form.Control
                  as="select"
                  name="compensation_cr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.compensation_cr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="compensation_dr_account">
                <Form.Label>Compensation debit account</Form.Label>
                <Form.Control
                  as="select"
                  name="compensation_dr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.compensation_dr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="retension_cr_account">
                <Form.Label>Retension credit account</Form.Label>
                <Form.Control
                  as="select"
                  name="retension_cr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.retension_cr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="retension_dr_account">
                <Form.Label>Retension debit account</Form.Label>
                <Form.Control
                  as="select"
                  name="retension_dr_account"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Select any account</option>
                  {!(siteAccounts.length === 0)
                    ? siteAccounts.map((item) => {
                        const { id, account } = item;
                        return (
                          <option key={id} value={id}>
                            {account}
                          </option>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.retension_dr_account?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row> */}
            <Form.Row></Form.Row>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  modalSiteCreate: state.modalSiteCreate,
  siteAccounts: state.siteAccounts,
  salaryCodes: state.salaryCodes,
});
export default connect(mapStateToProps, {
  toggle_site_create_modal,
  salary_codes,
})(CreateSite);
