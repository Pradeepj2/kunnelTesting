import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { site_edit_modal } from "../../redux/actions/fetchActions";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSnackbar } from "notistack";

const EditSiteData = ({
  site_edit_modal,
  siteAccounts,
  modalSiteEdit,
  siteEditData,
  salaryCodes,
  revalidate,
}) => {
  const { register, handleSubmit, errors } = useForm({
    mode: "onTouched",
  });

  // const [specificRatio,setSpecificRatio] = useState('1:')
  const [deletion, setDeletion] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [startDate, setStartDate] = useState(siteEditData.start_date);
  const [endDate, setEndDate] = useState(siteEditData.end_date);
  const [aplhaError, setAlphaError] = useState(true);
  const [deletesite, setdeletesite] = useState(false);
  const [editsite, seteditsite] = useState(false);
  const [allsite, setallsite] = useState(false);

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== ",") {
        temp += str[i];
      } else {
        if (temp === "editsite") seteditsite(true);
        else if (temp === "Allsite") setallsite(true);
        else if (temp === "deletesite") setdeletesite(true);
        temp = "";
      }
    }

    if (temp === "editsite") seteditsite(true);
    else if (temp === "Allsite") setallsite(true);
    else if (temp === "deletesite") setdeletesite(true);
  }, []);

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const onSubmit = (data) => {
    const Data = {
      id: siteEditData.id,
      site_id: siteEditData.site_id,
      name: data.name,
      address: data.address,
      client_name: data.client_name,
      compensation_cr_account: data.compensation_cr_account,
      compensation_dr_account: data.compensation_dr_account,
      //end_buffer: data.end_buffer.slice(0, 5) + ':00',
      end_date: data.end_date,
      end_time: data.end_time.slice(0, 5) + ":00",
      festival_advnc_cr_account: data.festival_advnc_cr_account,
      festival_advnc_dr_account: data.festival_advnc_dr_account,
      lunch_time: data.lunch_time.slice(0, 5) + ":00",
      lunch_time_end: data.lunch_time_end.slice(0, 5) + ":00",
      project_manager: data.project_manager,
      project_type: data.project_type,
      retension_cr_account: data.retension_cr_account,
      retension_dr_account: data.retension_dr_account,
      salary_structure: data.salary_structure,
      // site_engineer: data.site_engineer,
      special_advnc_cr_account: data.special_advnc_cr_account,
      special_advnc_dr_account: data.special_advnc_dr_account,
      // start_buffer: data.start_buffer.slice(0, 5) + ':00',
      start_date: data.start_date,
      start_time: data.start_time.slice(0, 5) + ":00",
      wage_cr_account: data.wage_cr_account,
      wage_dr_account: data.wage_dr_account,
      weekly_advnc_cr_account: data.weekly_advnc_cr_account,
      weekly_advnc_dr_account: data.weekly_advnc_dr_account,
      siteEng_id: siteEditData.siteEng_id,
      site_specific_ratio: data.site_specific_ratio,
      site_code: data.site_code,
    };
    if (aplhaError) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/sitemanage/sites/edit`, Data, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          //alert(res.data.message);
          // setShowSuccess(true);
          showsuccErr({ msg: "Site Updated", variant: "success" });
          setTimeout(() => {
            site_edit_modal({ show: false, data: [] });
          }, 1000);
          revalidate();
        })
        .catch((error) => {
          showsuccErr({ msg: error.message, variant: "error" });
        });
    }
  };

  // validation for alphanumneric
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

  //deleting Sites

  const deleteSiteHandler = (e) => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/sitemanage/delete-site/${siteEditData.id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        showsuccErr({ msg: "Site Deleted Successfully", variant: "error" });
        setTimeout(() => {
          //alert(res.data.message);
          site_edit_modal({ show: false, data: [] });
          //e.refreshPage()
          // setShowSuccess(false);
        }, 1500);
        revalidate();
      })
      .catch((err) => {
        showsuccErr({ msg: err.message, variant: "error" });
      });
  };

  return (
    <>
      {/* {deletion ? (
        <Snackbar open={showSuccess} autoHideDuration={1000}>
          <Alert severity="error">Site Deleted</Alert>
        </Snackbar>
      ) : (
        <Snackbar open={showSuccess} autoHideDuration={1000}>
          <Alert severity="success">Site details updated successfully</Alert>
        </Snackbar>
      )} */}
      <Modal
        show={modalSiteEdit}
        onHide={() => {
          site_edit_modal({ show: false, data: [] });
          // setDeletion(false);
          setAlphaError(true);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Site Data</Modal.Title>
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
                  defaultValue={siteEditData.name}
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
                  defaultValue={siteEditData.address}
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
                  defaultValue={siteEditData.client_name}
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
                  defaultValue={siteEditData.project_manager}
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
                  defaultValue={siteEditData.project_type}
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
                  defaultValue={siteEditData.site_engineer}
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
                  defaultValue={siteEditData.site_code}
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
              <Form.Group as={Col} controlId="start_date">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Start Date"
                  name="start_date"
                  onChange={(e) => setStartDate(e.target.value)}
                  defaultValue={siteEditData.start_date}
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
              <Form.Group as={Col} controlId="end_date">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter End Date"
                  name="end_date"
                  onChange={(e) => setEndDate(e.target.value)}
                  defaultValue={siteEditData.end_date}
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
              <Form.Group as={Col} controlId="lunch_time">
                <Form.Label>Lunch Start Time</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Enter Lunch Start Time"
                  name="lunch_time"
                  defaultValue={siteEditData.lunch_time}
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
                  defaultValue={siteEditData.lunch_time_end}
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
              <Form.Group as={Col} controlId="start_time">
                <Form.Label>Shift Start Time</Form.Label>
                <Form.Control
                  type="time"
                  name="start_time"
                  defaultValue={siteEditData.start_time}
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
              <Form.Group as={Col} controlId="end_time">
                <Form.Label>Shift End Time</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Enter End Time"
                  name="end_time"
                  defaultValue={siteEditData.end_time}
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
                <Form.Control
                  type="time"
                  placeholder="Enter Buffer Start Time"
                  name="start_buffer"
                  defaultValue={siteEditData.start_buffer}
                  ref={register({
                    required: true,
                  })}
                /> */}
              {/* {errors.start_buffer?.type === 'required' && (
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
                <Form.Control
                  type="text"
                  placeholder="Site Specific Ratio"
                  name="site_specific_ratio"
                  defaultValue={siteEditData.site_specific_ratio}
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

              {/* <Form.Group as={Col} controlId="end_buffer">
                <Form.Label>Buffer End Time</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Enter Buffer End Time"
                  name="end_buffer"
                  defaultValue={siteEditData.end_buffer}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.end_buffer?.type === 'required' && ( */}
              {/* <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
               */}

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
                  defaultValue={siteEditData.wage_cr_account}
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
                  defaultValue={siteEditData.wage_dr_account}
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
                  defaultValue={siteEditData.festival_advnc_cr_account}
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
                  defaultValue={siteEditData.festival_advnc_dr_account}
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
                  defaultValue={siteEditData.special_advnc_cr_account}
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
                  defaultValue={siteEditData.special_advnc_dr_account}
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
                  defaultValue={siteEditData.weekly_advnc_cr_account}
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
                  defaultValue={siteEditData.weekly_advnc_dr_account}
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
                  defaultValue={siteEditData.compensation_cr_account}
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
                  defaultValue={siteEditData.compensation_dr_account}
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
                  defaultValue={siteEditData.retension_cr_account}
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
                  defaultValue={siteEditData.retension_dr_account}
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
            {/* <Form.Row>
            <Form.Group as={Col} controlId="site_specific_ratio">
                <Form.Label>Site Specific Ratio</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Site Specific Ratio"
                  name="site_specific_ratio"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.name?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row> */}

            {editsite || allsite ? (
              <Button type="submit" style={{ border: "blue" }}>
                Update Site
              </Button>
            ) : null}

            {deletesite || allsite ? (
              <Button
                style={{
                  backgroundColor: "red",
                  border: "red",
                  marginLeft: "20px",
                }}
                onClick={(e) => deleteSiteHandler(e)}
              >
                Delete Site
              </Button>
            ) : null}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  modalSiteEdit: state.modalSiteEdit,
  siteAccounts: state.siteAccounts,
  siteEditData: state.siteEditData,
  salaryCodes: state.salaryCodes,
});
export default connect(mapStateToProps, { site_edit_modal })(EditSiteData);
