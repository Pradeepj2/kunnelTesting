import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import { useSnackbar } from "notistack";
import SiteModal from "../utilModals/siteModal";

const CreateHoliday = (props) => {
  //##############################declaring states####################//
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();
  const [show, setShow] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [siteCode, setSiteCode] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };
  //handling form submit
  const { register, handleSubmit, errors } = useForm({
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    let Data = {
      description: data.description,
      siteid: siteid,
      from_date: startDate,
      to_date: endDate,
    };

    //api call for creating holiday
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/sitemanage/create_multipleholiday/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res?.data?.status) {
          showsuccErr({
            msg: "New Holiday added successfully",
            variant: "success",
          });
          props.revalidateList();
          //  setShowSuccess(true);
          setTimeout(() => {
            //  setShowSuccess(false);
            props.showModal(false);
          }, 1000);
        } else {
          showsuccErr({ msg: res?.data?.message, variant: "error" });

          // setError(res?.data?.message);
        }
      })
      .catch((error) => {
        showsuccErr({ msg: JSON.stringify(error), variant: "error" });
        // setError();
      });
  };

  const viewHandler = () => {
    setShow(true);
  };

  return (
    <>
      <Modal
        show={props.modal}
        onHide={() => {
          props.showModal(false);
        }}
      >
        <SiteModal
          query={props.query}
          sites={props.siteDetail}
          show={show}
          setShow={setShow}
          setSiteid={setSiteid}
          setSiteCode={setSiteCode}
        />
        <Modal.Header closeButton>
          <Modal.Title>Create New Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col} controlId="description">
                <Form.Label>Holiday Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Description"
                  name="description"
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
              <Form.Group as={Col} controlId="siteid">
                <Form.Label>Site</Form.Label>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <Form.Control
                      style={{ width: "300px" }}
                      type="text"
                      name="siteid"
                      disabled={true}
                      value={siteCode}
                      ref={register({
                        required: true,
                      })}
                    >
                      {/* <option key="0" value="">
                    Choose...
                  </option>
                  {!(props.siteDetail.length === 0)
                    ? props.siteDetail.map((site) => {
                        console.log(site)
                        return (
                          <>
                          <option key={props.siteDetail.indexOf(site) + 1} value={site.id}>
                          {`ID:${site.site_id} 
                             NAME:${site.name} PROJECT MANAGER:${site.project_manager}
                            PROJECT TYPE:${site.project_type}`}
                          </option>
                          </>
                        );
                      })
                    : null} */}
                    </Form.Control>
                    {errors.siteDetail?.type === "required" && (
                      <p className="text-danger">
                        <small>
                          <i>This field is required</i>
                        </small>
                      </p>
                    )}
                  </div>
                  <div>
                    <Button
                      style={{ backgroundColor: "navy" }}
                      onClick={(e) => viewHandler()}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Form.Group>
            </Form.Row>
            <Form.Row></Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="from_date">
                <Form.Label>From Date</Form.Label>

                <DatePicker
                  inputClass="form-control"
                  placeholder="From Date"
                  minDate={new Date()}
                  onChange={(e) => {
                    setStartDate(`${e.year}-${e.month}-${e.day}`);
                  }}
                  multiple={false}
                />
                {errors.start_date?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="to_date">
                <Form.Label>To Date</Form.Label>

                <DatePicker
                  inputClass="form-control"
                  placeholder="To Date"
                  minDate={startDate}
                  onChange={(e) => {
                    setEndDate(`${e.year}-${e.month}-${e.day}`);
                  }}
                  multiple={false}
                />
                {errors.start_date?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
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

export default CreateHoliday;
