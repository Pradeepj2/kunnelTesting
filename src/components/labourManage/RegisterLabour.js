import axios from "axios";
import "../utilModals/siteModal.css";
import React, { useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { toggle_reg_labour_model } from "../../redux/actions/siteActions";
import SiteModal from "../utilModals/siteModal";
import { useSnackbar } from "notistack";
import WageCodeModal from "../utilModals/wageCodeModal";

const RegisterLabour = ({
  sites,
  salaryCodes,
  modalRegLabour,
  toggle_reg_labour_model,
  laboursData,
  users,
  revalidate,
}) => {
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [query, setQuery] = useState("");
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });
  const [accountError, setAccountError] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [aadharError, setAadharError] = useState(false);
  const [labourerPhoto, setLabourerPhoto] = useState();
  const [aadharPhoto, setAadharPhoto] = useState();
  const [esiDocument, setEsiDocument] = useState();
  const [show, setShow] = useState(false);
  const [wageShow, setWageShow] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [wagecode, setWagecode] = useState("");
  const [siteCode, setSiteCode] = useState("");
  const [sub, setSub] = useState("NO");
  const [contractor, setContractor] = useState("");
  const [ShowUserModal, setShowUserModal] = useState(false);

  const sortedData = users.sort(function (a, b) {
    return new Date(a.date_of_creation) - new Date(b.date_of_creation);
  });

  const { enqueueSnackbar } = useSnackbar();

  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const rows = sortedData.reverse();

  const onSubmit = (data) => {
    let formData = new FormData();

    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("photo", labourerPhoto);
    formData.append("esi_file", esiDocument);
    formData.append("aadharNumber", data.aadharNumber);
    formData.append("aadhrPhoto", data.aadharPhoto[0]);
    // formData.append("aadhrPhoto", aadharPhoto);
    // formData.append("department", data.department);
    // formData.append("department", null);
    formData.append("fatherName", data.fatherName);
    formData.append("ACNumber", data.ACNumber);
    formData.append("branchName", data.branchName);
    formData.append("bankName", null);
    formData.append("IFSCNumber", data.IFSCNumber);
    formData.append("contact", data.contact);
    formData.append("bloodGroup", data.bloodGroup);
    //formData.append('employeeCode', data.employeeCode);
    formData.append("salary_id", wagecode.toString());
    formData.append("report_to", data.Report_To);
    formData.append("wifeName", data.wifeName);
    //formData.append('site_code', siteCode)
    formData.append("children_number", parseInt(data.children_number));
    formData.append("sub_contractor", contractor ? contractor : null);
    formData.append("site_id", siteid);
    formData.append("site_code", siteCode);
    // formData.append("employeeCode", data.labour_code);
    //formData.append('bankName', data.bankname);
    // formData.append("DOB", data.DOB.toISOString());
    formData.append("DOB", data.DOB);
    formData.append("pf", Boolean(data.pf));
    formData.append("esi", Boolean(data.esi));
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/labourermanage/labourer/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          revalidate();
          // showscc("success");
          showsuccErr({
            msg: (
              <div>
                User Successfully Resistered...
                <br></br>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Labour Id : {parseFloat(localStorage.getItem("MAXID")) + 1}
                </span>
              </div>
            ),
            variant: "success",
          });

          // setTimeout(() => {
          //   window.location.reload();
          // }, 1500);
        } else {
          showsuccErr({ msg: res.data.message, variant: "error" });
        }
      })
      .catch((e) => {
        setError(JSON.stringify(e));
      });
  };

  const viewHandler = () => {
    setShow(true);
  };

  const wageHandler = () => {
    setWageShow(true);
  };

  const handleValid = (e) => {
    if (e.target.id === "ACNumber") {
      const result = laboursData.some(
        (item) => item.ACNumber === e.target.value
      );
      if (result) {
        setAccountError(true);
      } else if (!result) {
        setAccountError(false);
      }
    }
    if (e.target.id === "aadharNumber") {
      const result = laboursData.some(
        (item) => item.aadharNumber === e.target.value
      );
      if (result) {
        setAadharError(true);
      } else if (!result) {
        setAadharError(false);
      }
    }
    if (e.target.id === "contact") {
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

  const photoPrievew = (e) => {
    e.preventDefault();
    window.open(URL.createObjectURL(labourerPhoto));
  };

  return (
    <>
      <Modal
        show={modalRegLabour}
        onHide={() => {
          toggle_reg_labour_model(false);
          setLabourerPhoto(null);
          setEsiDocument(null);
          setAadharPhoto(null);
          setSub("NO");
          setSiteCode("");
          setWagecode("");
        }}
      >
        <SiteModal
          sites={sites}
          show={show}
          setShow={setShow}
          setSiteid={setSiteid}
          setSiteCode={setSiteCode}
        />

        {/* <SiteModal
        sites={sites}
        show={showSite}
        setShow={setShowSite}
        setSiteid={setSiteid}
        setSiteCode={setSiteCode}
        // siteId={siteid}
      /> */}

        <WageCodeModal
          wageCode={salaryCodes}
          wageShow={wageShow}
          setWageShow={setWageShow}
          setWagecode={setWagecode}
        />

        {/* <Snackbar open={showSuccess}>
          <Alert severity="success">
            Registering New Labour...
            <br />
            <span style={{ color: "white", fontWeight: "bold" }}>
              Labour Id : {localStorage.getItem("MAXID") + 1}
            </span>
          </Alert>
        </Snackbar>
        <Snackbar
          open={error != null}
          autoHideDuration={1000}
          onClose={() => setError(null)}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar> */}

        <Modal.Header closeButton>
          <Modal.Title>Register New Labour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col} controlId="name">
                <Form.Label>Labourer Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
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
              {/* <Form.Group as={Col} controlId="labour_code">
                <Form.Label>Labourer Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Labourer Code"
                  name="labour_code"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.labour_code?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              <Form.Group as={Col} controlId="DOB">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="DOB"
                  ref={register({
                    required: true,
                    min: 2003,
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
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="fatherName">
                <Form.Label>Name Of Father</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name of Father"
                  name="fatherName"
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
                  type="text"
                  //  id="aadharNumber"
                  placeholder="Enter aadhar number"
                  name="aadharNumber"
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
              {/* <img src={file}/> */}
              <Form.Group as={Col} controlId="wifeName">
                <Form.Label>Next Of Kin</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter next Of Kin"
                  name="wifeName"
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
                  placeholder="Enter Bank account number"
                  name="ACNumber"
                  id="ACnumber"
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
              <Form.Group as={Col} controlId="photo">
                <Form.Label>Labourer Photo</Form.Label>
                <div style={{ display: "flex" }}>
                  <div>
                    <Form.Control
                      id="custom-file"
                      label="Choose Photo"
                      custom
                      type="file"
                      name="photo"
                      onChange={(e) => {
                        // (document.getElementsByClassName(
                        //   'custom-file-label'
                        // )[0].innerText = e.target.files[0].name)
                        setLabourerPhoto(e.target.files[0]);
                      }}
                      ref={register({
                        required: true,
                      })}
                    />
                    {errors.photo?.type === "required" && (
                      <p className="text-danger">
                        <small>
                          <i>This field is required</i>
                        </small>
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={(e) => (labourerPhoto ? photoPrievew(e) : null)}
                      style={{
                        border: "none",
                        backgroundColor: "navy",
                        color: "white",
                        padding: "5px",
                        borderRadius: "2px",
                      }}
                    >
                      preview
                    </button>
                  </div>
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="aadharPhoto">
                <Form.Label>Aadhar Card Photo</Form.Label>
                <div style={{ display: "flex" }}>
                  <div>
                    <Form.Control
                      id="custom"
                      label="Choose Photo"
                      custom
                      type="file"
                      name="aadharPhoto"
                      onChange={(e) =>
                        //   (document.getElementsByClassName(
                        //     'custom-file-label'
                        //   )[1].innerText = e.target.files[0].name)
                        {
                          setAadharPhoto(e.target.files[0]);
                          //setFile(URL.createObjectURL(event.target.files[0]))
                        }
                      }
                      ref={register({
                        required: true,
                      })}
                    />
                    {errors.aadharPhoto?.type === "required" && (
                      <p className="text-danger">
                        <small>
                          <i>This field is required</i>
                        </small>
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={(e) =>
                        aadharPhoto
                          ? window.open(URL.createObjectURL(aadharPhoto))
                          : null
                      }
                      style={{
                        border: "none",
                        backgroundColor: "navy",
                        color: "white",
                        padding: "5px",
                        borderRadius: "2px",
                      }}
                    >
                      preview
                    </button>
                  </div>
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="esi_file">
                <Form.Label>PF Document</Form.Label>
                <div style={{ display: "flex" }}>
                  <div>
                    <Form.Control
                      id="custom"
                      label="Choose PF Document"
                      custom
                      type="file"
                      name="esi_file"
                      onChange={(e) =>
                        //   (document.getElementsByClassName(
                        //     'custom-file-label'
                        //   )[1].innerText = e.target.files[0].name)
                        setEsiDocument(e.target.files[0])
                      }
                      ref={register({
                        required: true,
                      })}
                    />
                    {errors.esi_file?.type === "required" && (
                      <p className="text-danger">
                        <small>
                          <i>This field is required</i>
                        </small>
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={(e) =>
                        esiDocument
                          ? window.open(URL.createObjectURL(esiDocument))
                          : null
                      }
                      style={{
                        border: "none",
                        backgroundColor: "navy",
                        color: "white",
                        padding: "5px",
                        borderRadius: "2px",
                      }}
                    >
                      preview
                    </button>
                  </div>
                </div>
              </Form.Group>
            </Form.Row>
            <Form.Row></Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="branchName">
                <Form.Label>Branch Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Branch Name"
                  name="branchName"
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
                  //   id="contact"
                  placeholder="Enter Mobile number"
                  name="contact"
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
            <Form.Row>
              <Form.Group as={Col} controlId="bloodGroup">
                <Form.Label>Blood Group</Form.Label>
                <Form.Control
                  as="select"
                  name="bloodGroup"
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

              <Form.Group as={Col} controlId="salary_id">
                <Form.Label>Wage Code</Form.Label>
                <div style={{ display: "flex" }}>
                  <div>
                    <Form.Control
                      style={{ width: "200px" }}
                      type="text"
                      disabled={true}
                      value={wagecode}
                      name="salary_id"
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
                      onClick={(e) => {
                        wageHandler();
                      }}
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
                      style={{ width: "200px" }}
                      type="text"
                      name="site_id"
                      disabled={true}
                      value={siteCode}
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
                    <Button
                      style={{ backgroundColor: "navy" }}
                      onClick={(e) => {
                        viewHandler();
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="monitorDate">
                <Form.Label>Joining Date</Form.Label>
                <Form.Control
                  type="date"
                  name="monitorDate"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.monitorDate?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="esi">
                <Form.Label>ESI</Form.Label>
                <Form.Control
                  as="select"
                  name="esi"
                  ref={register({
                    required: true,
                  })}
                >
                  <option key="0" value="">
                    Choose...
                  </option>
                  <option key="YES" value={true}>
                    YES
                  </option>
                  <option key="NO" value={false}>
                    NO
                  </option>
                </Form.Control>
                {errors.esi?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="pf">
                <Form.Label>PF</Form.Label>
                <Form.Control as="select" name="pf">
                  <option key="0" value="">
                    Choose...
                  </option>
                  <option key="YES" value={true}>
                    YES
                  </option>
                  <option key="NO" value={false}>
                    NO
                  </option>
                </Form.Control>
                {errors.pf?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="subContractorSelect">
                <Form.Label>Sub contractor Select</Form.Label>
                <Form.Control
                  as="select"
                  name="subContractorSelect"
                  ref={register()}
                  onChange={(e) => setSub(e.target.value)}
                >
                  <option key="0" value="">
                    Choose...
                  </option>
                  <option key="YES" value="YES">
                    YES
                  </option>
                  <option key="NO" value="NO">
                    NO
                  </option>
                </Form.Control>
                {errors.pf?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="sub_contractor">
                <Form.Label>Sub Contractor</Form.Label>
                <Form.Control
                  placeholder="Enter Sub Contractor"
                  name="sub_contractor"
                  disabled={sub === "NO" || sub === ""}
                  onChange={(e) => setContractor(e.target.value)}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="Report_To">
                <Form.Label>Report To</Form.Label>
                <Form.Control as="select" name="Report_To" ref={register()}>
                  <option key="0" value="">
                    Choose...
                  </option>
                  {rows.map((data, idx) => {
                    if (data.site_code === siteCode)
                      return (
                        <option key={idx} value={data.username}>
                          {data.username} , {data.user_type}
                        </option>
                      );
                  })}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  sites: state.sites,
  users: state.users,
  salaryCodes: state.salaryCodes,
  wageList: state.wageList,
  modalRegLabour: state.modalRegLabour,
  laboursData: state.laboursData,
});
export default connect(mapStateToProps, { toggle_reg_labour_model })(
  RegisterLabour
);
