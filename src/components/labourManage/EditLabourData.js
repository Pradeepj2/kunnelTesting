import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { edit_labour_modal } from "../../redux/actions/fetchActions";
import axios from "axios";
import SiteModal from "../utilModals/siteModal";
import { Snackbar } from "@material-ui/core";
import Alert from "../Shared/Alert";
import WageCodeModal from "../utilModals/wageCodeModal";
import { useSnackbar } from "notistack";
const EditLabourData = ({
  sites,
  salaryCodes,
  wageList,
  editLabourModal,
  edit_labour_modal,
  labourData,
  laboursData,
  users,
  revalidate,
}) => {
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });
  const [accountError, setAccountError] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [aadharError, setAadharError] = useState(false);
  const [labourerId, setLabourerId] = useState("");
  const [show, setShow] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [wagecode, setWagecode] = useState("");
  const [wageShow, setWageShow] = useState(false);
  const [id, setId] = useState("");
  const [siteCode, setSiteCode] = useState();
  const [deletelabour, setdeletelabour] = useState(false);
  const [editlabour, seteditlabour] = useState(false);
  const [allLabour, setallLabour] = useState(false);

  //##################console logs##########################//

  const { enqueueSnackbar } = useSnackbar();

  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  // const click = () => {
  //   showsuccErr({ msg: "success", variant: "success" });
  // };

  useEffect(() => {
    // console.log(labourData);
    setWagecode(labourData.salary_id);
    setSiteid(labourData.site_id);
    setLabourerId(labourData.labourerid);
    setId(labourData.id);
  }, [labourData]);

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] != ",") {
        temp += str[i];
      } else {
        if (temp === "editlabour") seteditlabour(true);
        else if (temp === "deletelabour") setdeletelabour(true);
        else if (temp === "AllLabour") setdeletelabour(true);
        temp = "";
      }
    }

    if (temp === "editlabour") seteditlabour(true);
    else if (temp === "deletelabour") setdeletelabour(true);
    else if (temp === "AllLabour") setdeletelabour(true);
  }, []);

  const sortedData = users.sort(function (a, b) {
    return new Date(a.date_joined) - new Date(b.date_joined);
  });
  const rows = sortedData.reverse();

  const onSubmit = (data) => {
    let formData = new FormData();

    formData.append("name", data.name);
    // formData.append("labourerid", labourData.labourerid);
    formData.append("address", data.address);
    formData.append("aadharNumber", data.aadharNumber);
    formData.append("fatherName", data.fatherName);
    formData.append("children_number", parseInt(data.children_number));
    formData.append("ACNumber", data.ACNumber);
    formData.append("branchName", data.branchName);
    formData.append("IFSCNumber", data.IFSCNumber);
    formData.append("contact", data.contact);
    formData.append("bloodGroup", data.bloodGroup);
    formData.append("report_to", data.Report_To);
    formData.append("salary_id", wagecode.toString());
    formData.append("DOB", data.DOB);
    formData.append("site_code", siteCode);
    formData.append("site_id", siteid);

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/labourermanage/labourer/edit/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(function (response) {
        revalidate();
        showsuccErr({ msg: "Updating user ...", variant: "success" });
        setWagecode(labourData.salary_id);
        edit_labour_modal({ show: false, data: [] });
      })
      .catch(function () {
        showsuccErr({ msg: "Error occured", variant: "error" });
      });
  };

  // const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  // const testExist = async (ACNumber) => {
  //     await wait(1000);
  //     return laboursData.some((item) => item.ACNumber === ACNumber)
  // };

  const handleValid = (e) => {
    if (e.target.id === "ACNumber" && labourData.ACNumber != e.target.value) {
      const result = laboursData.some(
        (item) => item.ACNumber === e.target.value
      );
      if (result) {
        setAccountError(true);
      } else if (!result) {
        setAccountError(false);
      }
    }
    if (
      e.target.id === "aadharNumber" &&
      labourData.aadharNumber != e.target.value
    ) {
      const result = laboursData.some(
        (item) => item.aadharNumber === e.target.value
      );
      if (result) {
        setAadharError(true);
      } else if (!result) {
        setAadharError(false);
      }
    }
    if (e.target.id === "contact" && labourData.contact != e.target.value) {
      const result = laboursData.some(
        (item) => item.contact === e.target.value
      );
      if (result) {
        setContactError(true);
      } else if (!result) {
        setContactError(false);
      }
    }
  };

  const deleteHandler = (id) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/labourermanage/labourer/delete/${id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        revalidate();
        showsuccErr({ msg: "Deleting user ...", variant: "error" });
        setWagecode(labourData.salary_id);
        setTimeout(() => {
          edit_labour_modal({ show: false, data: [] });
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  const viewHandler = () => {
    setShow(true);
  };

  const wageHandler = () => {
    setWageShow(true);
  };

  return (
    <>
      <Modal
        show={editLabourModal}
        onHide={() => {
          edit_labour_modal({ show: false, data: [] });
          setSiteCode("");
        }}
      >
        <SiteModal
          sites={sites}
          show={show}
          setShow={setShow}
          setSiteCode={setSiteCode}
          setSiteid={setSiteid}
        />
        <WageCodeModal
          wageCode={salaryCodes}
          wageShow={wageShow}
          setWageShow={setWageShow}
          setWagecode={setWagecode}
        />

        <Snackbar open={isUpdate} autoHideDuration={3000}>
          <Alert severity="success">Updating...</Alert>
        </Snackbar>
        <Snackbar open={isDelete} autoHideDuration={3000}>
          <Alert severity="error">Deleting Labour...</Alert>
        </Snackbar>
        <Modal.Header closeButton>
          <Modal.Title>Edit Labour Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col} controlId="labourerid">
                <Form.Label>Labourer Id</Form.Label>
                <Form.Control
                  type="text"
                  name="labourerid"
                  defaultValue={labourData.labourerid}
                  readOnly
                />
              </Form.Group>
              <Form.Group as={Col} controlId="name">
                <Form.Label>Labourer Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  defaultValue={labourData.name}
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
              <Form.Group as={Col} controlId="DOB">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="DOB"
                  defaultValue={labourData.DOB}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.DOB?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* <Form.Group as={Col} controlId="photo">
                                <Form.Label>Labourer Photo</Form.Label>
                                <Form.File id="custom-file" label="Choose Photo" custom name="photo"  ref={register({
                                    required: true
                                })} />
                                {errors.photo?.type === 'required' && <p className="text-danger"><small><i>This field is required</i></small></p>}
                            </Form.Group> */}
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="fatherName">
                <Form.Label>Name Of Father</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name of Father"
                  name="fatherName"
                  defaultValue={labourData.fatherName}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.fatherName?.type === "required" && (
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
                  placeholder="Enter your address"
                  name="address"
                  defaultValue={labourData.address}
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
              <Form.Group as={Col} controlId="aadharNumber">
                <Form.Label>Aadhar Number</Form.Label>
                <Form.Control
                  type="number"
                  id="aadharNumber"
                  placeholder="Enter aadhar number"
                  name="aadharNumber"
                  defaultValue={labourData.aadharNumber}
                  onChange={(e) => handleValid(e)}
                  ref={register({
                    required: true,
                    minLength: 12,
                    maxLength: 12,
                  })}
                />
                {errors.aadharNumber?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {errors.aadharNumber &&
                  errors.aadharNumber.type === "maxLength" && (
                    <span role="alert" className="text-danger">
                      <small>
                        <i>Invalid aadhar number</i>
                      </small>
                    </span>
                  )}
                {errors.aadharNumber &&
                  errors.aadharNumber.type === "minLength" && (
                    <span role="alert" className="text-danger">
                      <small>
                        <i>Invalid aadhar number</i>
                      </small>
                    </span>
                  )}
                {aadharError ? (
                  <span role="alert" className="text-danger">
                    <small>
                      <i>Aadhar number already exist!</i>
                    </small>
                  </span>
                ) : null}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              {/* <Form.Group as={Col} controlId="aadharPhoto">
                                <Form.Label>Aadhar Photo</Form.Label>
                                <Form.File id="custom-file" label="Choose Photo" custom name="aadharPhoto" ref={register({
                                    required: true
                                })} />
                                {errors.aadharPhoto?.type === 'required' && <p className="text-danger"><small><i>This field is required</i></small></p>}
                            </Form.Group> */}
              <Form.Group as={Col} controlId="wifeName">
                <Form.Label>Next To Kin</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter next to kin"
                  name="wifeName"
                  defaultValue={labourData.wifeName}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.wifeName?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="children_number">
                <Form.Label>No. of Children</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Number"
                  name="children_number"
                  defaultValue={labourData.children_number}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.children_number?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="ACNumber">
                <Form.Label>Bank account number</Form.Label>
                <Form.Control
                  type="number"
                  id="ACNumber"
                  placeholder="Enter Bank account number"
                  name="ACNumber"
                  defaultValue={labourData.ACNumber}
                  onChange={(e) => handleValid(e)}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.ACNumber?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {accountError ? (
                  <span role="alert" className="text-danger">
                    <small>
                      <i>Account number already exist!</i>
                    </small>
                  </span>
                ) : null}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              {/* <Form.Group as={Col} controlId="depended_father">
                <Form.Label>Depended Father</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="depended_father"
                  defaultValue={labourData.depended_father}
                  ref={register({
                    required: true,
                  })}
                /> */}
              {/* {errors.depended_father?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              {/* <Form.Group as={Col} controlId="depended_mother">
                <Form.Label>Depended Mother</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="depended_mother"
                  defaultValue={labourData.depended_mother}
                  ref={register({
                    required: true,
                  })}
                /> */}
              {/* {errors.depended_mother?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              {/* <Form.Group as={Col} controlId="department">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  as="select"
                  name="department"
                  defaultValue={labourData.department}
                  ref={register({
                    required: true,
                  })}
                > */}
              {/* <option value="">Choose...</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Plumbing">Plumbing</option>
                </Form.Control>
                {errors.department?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
            </Form.Row>
            <Form.Row>
              {/* <Form.Group as={Col} controlId="designation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter designation"
                  name="designation"
                  defaultValue={labourData.designation}
                  ref={register({
                    required: true,
                  })}
                /> */}
              {/* {errors.designation?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              {/* <Form.Group as={Col} controlId="bankName">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Bank name"
                  name="bankName"
                  defaultValue={labourData.bankName}
                  ref={register({
                    required: true,
                  })}
                /> */}
              {/* {errors.bankName?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )} */}
              {/* </Form.Group> */}
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="branchName">
                <Form.Label>Branch Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Branch Name"
                  name="branchName"
                  defaultValue={labourData.branchName}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.branchName?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="IFSCNumber">
                <Form.Label>IFSC Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter IFSC code"
                  name="IFSCNumber"
                  defaultValue={labourData.IFSCNumber}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.IFSCNumber?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="contact">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="number"
                  id="contact"
                  placeholder="Enter Mobile number"
                  name="contact"
                  defaultValue={labourData.contact}
                  onChange={(e) => handleValid(e)}
                  ref={register({
                    required: true,
                    minLength: 10,
                    maxLength: 10,
                  })}
                />
                {errors.contact?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {errors.contact && errors.contact.type === "maxLength" && (
                  <span role="alert" className="text-danger">
                    <small>
                      <i>Invalid mobile number</i>
                    </small>
                  </span>
                )}
                {errors.contact && errors.contact.type === "minLength" && (
                  <span role="alert" className="text-danger">
                    <small>
                      <i>Invalid mobile number</i>
                    </small>
                  </span>
                )}
                {contactError ? (
                  <span role="alert" className="text-danger">
                    <small>
                      <i>Mobile number already exist!</i>
                    </small>
                  </span>
                ) : null}
              </Form.Group>
            </Form.Row>

            {/* <Form.Group as={Col} controlId="employeeCode">
                <Form.Label>Employee Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Employee code"
                  name="employeeCode"
                  defaultValue={labourData.employeeCode}
                  ref={register({
                    required: true,
                  })}
                /> */}
            {/* {errors.employeeCode?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}

            <Form.Row>
              <Form.Group as={Col} controlId="salary_id">
                {/* <Form.Label>salary structure</Form.Label> */}
                <Form.Label>Wage code</Form.Label>
                <div style={{ display: "flex" }}>
                  <div>
                    <Form.Control
                      style={{ width: "320px" }}
                      type="text"
                      name="salary_id"
                      disabled={true}
                      value={wagecode}
                      ref={register({
                        required: true,
                      })}
                    >
                      {/* {!(salaryCodes.length === 0)
                    ? salaryCodes.map((salary) => {
                        const { id } = salary;
                        return (
                          <option key={id} value={id}>
                            {id}
                          </option>
                        );
                      })
                    : null} */}
                    </Form.Control>
                    {errors.salary_id?.type === "required" && (
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
                      onClick={(e) => wageHandler()}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="site_id">
                <Form.Label>Site Code</Form.Label>
                <div style={{ display: "flex" }}>
                  <div>
                    <Form.Control
                      style={{ width: "320px" }}
                      type="text"
                      name="site_id"
                      disabled={true}
                      value={siteCode ? siteCode : labourData.site_code}
                      // defaultValue={labourData.site_code}
                      ref={register({
                        required: true,
                      })}
                    >
                      {/* {!(sites.length === 0)
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
                    {errors.site_id?.type === "required" && (
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
              {/* <Form.Group as={Col} controlId="wagecode">
                <Form.Label>Wage Code</Form.Label>
                <Form.Control
                  as="select"
                  name="wagecode"
                  defaultValue={labourData.wagecode}
                  ref={register({
                    required: true,
                  })}
                > */}
              {/* {!(wageList.length === 0)
                    ? wageList.map((wage) => {
                        const { id, wagecode } = wage;
                        return (
                          <option key={id} value={wagecode}>
                            {wagecode}
                          </option>
                        );
                      })
                    : null}
                </Form.Control> */}
              {/* {errors.wagecode?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              {/* <Form.Group as={Col} controlId="labourer_category">
                <Form.Label>Labourer Category</Form.Label>
                <Form.Control
                  as="select"
                  name="labourer_category"
                  defaultValue={labourData.labourer_category}
                  ref={register({
                    required: true,
                  })}
                > */}
              {/* <option value="">Choose...</option>
                  <option value="Batching Plant operator">
                    Batching Plant Operator
                  </option>
                  <option value="BobCat Driver">Bobcat Driver</option>
                  <option value="Foreman">Foreman</option>
                  <option value="Hindi labourer">Hindi Labour</option>
                  <option value="Malayalee Labourer">Malayalee Labour</option>
                  <option value="Operator">Operator</option>
                  <option value="Tamil Labour">Tamil Labour</option>
                  <option value="Town crane Driver / Skilled operator">
                    Tower Crane Driver / Skilled operator
                  </option>
                  <option value="Union Labourer">Union Labour</option>
                </Form.Control> */}
              {/* {errors.labourer_category?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
            </Form.Row>
            <Form.Row>
              {/* <Form.Group as={Col} controlId="skillType">
                <Form.Label>Skill Type</Form.Label>
                <Form.Control
                  as="select"
                  name="skillType"
                  defaultValue={labourData.skillType}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Choose...</option>
                  <option value="Skilled">Skilled</option>
                  <option value="Unskilled">Unskilled</option>
                  <option value="Semiskilled">Semiskilled</option>
                  <option value="Foreman">Foreman</option>
                </Form.Control>
                {errors.skillType?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              {/* <Form.Group as={Col} controlId="labourer_class">
                <Form.Label>Labourer Class</Form.Label>
                <Form.Control
                  as="select"
                  name="labourer_class"
                  defaultValue={labourData.labourer_class}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Choose...</option>
                  <option value="Casual">Casual</option>
                  <option value="Kunnel">Kunnel</option>
                  <option value="Union">Union</option>
                </Form.Control>
                {errors.labourer_class?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              {/* <Form.Group as={Col} controlId="Grade">
                <Form.Label>Grade</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Grade"
                  name="Grade"
                  defaultValue={labourData.Grade}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.Grade?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="bloodGroup">
                <Form.Label>Blood Group</Form.Label>
                <Form.Control
                  as="select"
                  name="bloodGroup"
                  defaultValue={labourData.bloodGroup}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Choose...</option>
                  <option value="A-">A-</option>
                  <option value="A+">A+</option>
                  <option value="B-">B-</option>
                  <option value="B+">B+</option>
                  <option value="AB-">AB-</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="O+">O+</option>
                </Form.Control>
                {errors.bloodGroup?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="Report_To">
                <Form.Label>Report To</Form.Label>
                <Form.Control
                  as="select"
                  name="Report_To"
                  ref={register()}
                  defaultValue={labourData.report_to}
                >
                  <option key="0" value="">
                    Choose...
                  </option>
                  {rows.map((data, idx) => {
                    let test = siteCode ? siteCode : labourData.site_code;
                    if (data.site_code === test)
                      return (
                        <option key={idx + 1} value={data.username}>
                          {data.username} , {data.user_type}
                        </option>
                      );
                  })}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            {editlabour || allLabour ? (
              <Button
                variant="primary"
                style={{ border: "none" }}
                type="submit"
              >
                Update
              </Button>
            ) : null}
            {deletelabour || allLabour ? (
              <Button
                variant="danger"
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  border: "none",
                }}
                onClick={(e) => deleteHandler(labourData.id)}
              >
                Delete
              </Button>
            ) : null}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  sites: state.sites,
  salaryCodes: state.salaryCodes,
  wageList: state.wageList,
  editLabourModal: state.editLabourModal,
  labourData: state.labourData,
  laboursData: state.laboursData,
  users: state.users,
});
export default connect(mapStateToProps, { edit_labour_modal })(EditLabourData);
