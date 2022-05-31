import { Snackbar } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

const EditHoliday = (props) => {
  //##############################declaring states####################//
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  //handling form submit
  const { register, handleSubmit, errors } = useForm({
    mode: "onTouched",
  });
  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const onSubmit = (data) => {
    let Data = {
      description: data.description,
      siteid: parseInt(props.editData.siteid),
      date: data.from_date,
      //to_date:endDate,
      id: parseInt(props.editData.id),
    };

    //api call for creating holiday
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/sitemanage/edit_delete_holiday/${props.editData.id}/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        showsuccErr({ msg: "Updated successfully", variant: "success" });
        props.revalidateList();
        // setShowSuccess(true);
        props.setShowModal(false);
        // setTimeout(() => {
        //   // setShowSuccess(false);
        //   window.location.reload();
        // }, 1000);
      })
      .catch((error) => {
        // setError(JSON.stringify(error));
        showsuccErr({ msg: JSON.stringify(error), variant: "error" });
      });
  };

  if (props.editData === undefined) {
    return <div>.</div>;
  } else {
    return (
      <>
        <Modal
          style={{ zIndex: "99999999999999999999999999999999999" }}
          show={props.showModal}
          onHide={() => {
            props.setShowModal(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Holiday</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Row>
                <Form.Group as={Col} controlId="description">
                  <Form.Label>Holiday Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    defaultValue={props.editData.description}
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
                {/* <Form.Group as={Col} controlId="siteid">
                <Form.Label>Site</Form.Label>
                <Form.Control
                  as="select"
                  name="siteid"

                  ref={register({
                    required: true,
                  })}
                >
                  <option key="0" value="">
                    Choose...
                  </option>
                  {!(props.sites.length === 0)
                    ? props.sites.map((site) => {

                        return (
                          <>
                          <option key={props.sites.indexOf(site) + 1} value={site.siteid}>
                            {site.sitename}
                          </option>
                          </>
                        );
                      })
                    : null}
                </Form.Control>
                {errors.Site?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}

              </Form.Group> */}
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="from_date">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Enter From Date"
                    name="from_date"
                    defaultValue={props.editData.date}
                    // onChange={(e) => {
                    //   console.log(e)
                    // setStartDate(`${e.year}-${e.month}-${e.day}`)
                    // }}
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
                {/* <Form.Group as={Col} controlId="to_date">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter From Date"
                  name="to_date"
                  minDate={props.editData.date}
                  defaultValue={props.editData.date}
                  // onChange={(e) => {
                  //   console.log(e)
                  // setStartDate(`${e.year}-${e.month}-${e.day}`)
                  // }}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.start_date?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
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
  }
};

export default EditHoliday;
