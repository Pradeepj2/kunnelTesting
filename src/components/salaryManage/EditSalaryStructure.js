import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { edit_salary_struct_modal } from "../../redux/actions/fetchActions";
import SiteModal from "../utilModals/siteModal";
import { useSnackbar } from "notistack";

const EditSalaryStructure = ({
  edit_salary_struct_modal,
  editSalaryStructureModal,
  sites,
  salaryCodeEdit,
  salaryCodes,
  revalidate,
}) => {
  const { register, handleSubmit, errors } = useForm({
    mode: "onTouched",
  });

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  ///########################declaring states######################//
  //const [dailyRate,setDailyRate] = useState();

  const [basicPay, setBasicPay] = useState(salaryCodeEdit.basic_pay);
  const [dailyAllowance, setDailyAllowance] = useState(
    salaryCodeEdit.daily_allowence
  );
  const [category, setCategory] = useState(salaryCodeEdit.labourer_category);
  const [designation, setDesignation] = useState([]);
  const [total, setTotal] = useState("");
  const [show, setShow] = useState(false);
  const [siteid, setSiteid] = useState(salaryCodeEdit.Site);
  const [siteCode, setSiteCode] = useState(salaryCodeEdit.site_code);
  const [pre, Setpre] = useState([]);

  useEffect(() => {
    setSiteid(salaryCodeEdit.Site);
    setTotal(salaryCodeEdit.daily_rate);
    setCategory(salaryCodeEdit.labourer_category);
    setSiteCode(salaryCodeEdit.site_code);
    // console.log(salaryCodeEdit);
  }, [salaryCodeEdit]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_class/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res, "UP");
        setDesignation(res.data);
      });

    if (pre != designation) {
      console.log(designation, "DOWN");
      Setpre(designation);
    }
  }, [pre]);

  const dailyRateCalculation = () => {
    if (basicPay && !dailyAllowance) {
      return Number(basicPay) + Number(salaryCodeEdit.daily_allowence);
    }
    if (!basicPay && dailyAllowance) {
      return Number(dailyAllowance) + Number(salaryCodeEdit.basic_pay);
    }
    if (basicPay && dailyAllowance) {
      return Number(dailyAllowance) + Number(basicPay);
    }

    return +salaryCodeEdit.basic_pay + +salaryCodeEdit.daily_allowence;
  };

  const onSubmit = (data) => {
    // ***********************************************************************************
    let newformData = new FormData();
    newformData.append("rent", data.rent);
    newformData.append("id", salaryCodeEdit.id);
    newformData.append("Grade", data.Grade);
    newformData.append("OTrate", data.OTrate);
    newformData.append("labourer_category", data.labourer_category);
    newformData.append(
      "SW_C1",
      data.labourer_category === "Union" ? data.SW_C1 : ""
    );
    newformData.append(
      "SW_C2",
      data.labourer_category === "Union" ? data.SW_C2 : ""
    );
    newformData.append("SW", data.labourer_category === "Union" ? data.SW : "");

    newformData.append("Site", siteid);
    newformData.append("Skill_set", data.Skill_set);
    newformData.append("basic_pay", data.basic_pay);
    newformData.append("daily_allowence", data.daily_allowence);
    newformData.append("daily_rate", dailyRateCalculation());
    newformData.append("esi", salaryCodeEdit.esi);
    newformData.append("gender", data.gender);
    newformData.append("holiday_wage", data.holiday_wage);
    newformData.append("labourer_class", data.designation);
    newformData.append("pf", salaryCodeEdit.pf);
    newformData.append(
      "rentation",
      data.labourer_category === "Kunnel" ? data.rentation : 0
    );
    // newformData.append("sunday_wage" ,  null)
    newformData.append("wagecode", salaryCodeEdit.wagecode);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/salarycode/edit`,
        newformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status === true) {
          edit_salary_struct_modal({ show: false, data: [] });
          showsuccErr({ msg: res.data.messgae, variant: "success" });
          revalidate();
        } else {
          showsuccErr({ msg: res.data.messgae, variant: "error" });
        }
      })
      .catch((error) => {
        showsuccErr({ msg: error.messgae, variant: "error" });
      });
  };

  const deleteSalaryHandler = () => {
    const form = new FormData();
    form.append("id", salaryCodeEdit.id);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/salarycode/delete/ `,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        showsuccErr({
          msg:
            res.data.Message.charAt(0).toUpperCase() +
            res.data.Message.slice(1),
          variant: "error",
        });
        if (res.data.status) revalidate();
        edit_salary_struct_modal({ show: false, data: [] });
      })
      .catch((err) => console.log(err));
  };

  const viewHandler = () => {
    setShow(true);
  };

  return (
    <>
      <Modal
        show={editSalaryStructureModal}
        onHide={() => {
          edit_salary_struct_modal({ show: false, data: [] });
          // setDailyRate(null)
          setBasicPay(null);
          setDailyAllowance(null);
          setCategory("");
          setSiteid("");
        }}
      >
        <SiteModal
          // query={props.query}
          sites={sites}
          setSiteCode={setSiteCode}
          show={show}
          setShow={setShow}
          setSiteid={setSiteid}
        />
        <Modal.Header closeButton>
          <Modal.Title>Edit Wage Code</Modal.Title>
          <h5 style={{ margin: "auto", fontWeight: "initial" }}>
            Current Wage Code : {[, salaryCodeEdit.wagecode].join(" ")}
          </h5>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col} controlId="designation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  as="select"
                  name="designation"
                  defaultValue={salaryCodeEdit.labourer_class}
                  ref={register({
                    required: true,
                  })}
                >
                  {designation.map((obj) => {
                    return (
                      <option value={obj.laboourerclass} key={obj.id}>
                        {obj.laboourerclass}
                      </option>
                    );
                  })}
                </Form.Control>
                {errors.gender?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="labourer_category">
                <Form.Label>Labourer Category</Form.Label>
                <Form.Control
                  as="select"
                  name="labourer_category"
                  defaultValue={salaryCodeEdit.labourer_category}
                  ref={register({
                    required: true,
                  })}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                >
                  <option value="">Choose...</option>
                  <option value="Kunnel" key="1">
                    Kunnel
                  </option>
                  <option value="Casual" key="2">
                    Casual
                  </option>
                  <option value="Union" key="3">
                    Union
                  </option>
                </Form.Control>
                {errors.labourer_category?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* <Form.Group as={Col} controlId="labourer_category">
                <Form.Label>Labour Category</Form.Label>
                <Form.Control
                  as="select"
                  name="labourer_category"
                  defaultValue={salaryCodeEdit.labourer_category}
                  ref={register({
                    required: true,
                  })}
                > */}
              {/* <option value="">Choose...</option>
                  <option value="Hindi labour" key="4">
                    Hindi Labour
                  </option>
                  <option value="Malayalee Labour" key="5">
                    Malayalee Labour
                  </option>
                  <option value="Union Labour" key="6">
                    Union Labour
                  </option>
                  <option value="Tamil Labour" key="7">
                    Tamil Labour
                  </option>
                  <option value="Operator" key="8">
                    Operator
                  </option>
                  <option value="Town crane Driver / Skilled operator" key="9">
                    Tower Crane Driver / Skilled operator
                  </option>
                  <option value="Bobcat Driver" key="10">
                    Bobcat Driver
                  </option>
                  <option value="Batching Plant Operator" key="11">
                    Batching Plant Operator
                  </option>
                  <option value="Foreman" key="12">
                    Foreman
                  </option>
                </Form.Control> */}
              {/* {errors.labourer_category?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              <Form.Group as={Col} controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  defaultValue={salaryCodeEdit.gender}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Choose...</option>
                  <option value="Female" key="13">
                    Female
                  </option>
                  <option value="Male" key="14">
                    Male
                  </option>
                </Form.Control>
                {errors.gender?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="Skill_set">
                <Form.Label>Skill Type</Form.Label>
                <Form.Control
                  as="select"
                  name="Skill_set"
                  defaultValue={salaryCodeEdit.Skill_set}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Choose...</option>
                  <option value="Skilled" key="15">
                    Skilled
                  </option>
                  <option value="Unskilled" key="16">
                    Unskilled
                  </option>
                  {/* <option value="Semiskilled" key="17">
                    Semiskilled
                  </option>
                  <option value="Foreman" key="18">
                    Foreman
                  </option> */}
                </Form.Control>
                {errors.Skill_set?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="Grade">
                <Form.Label>Grade</Form.Label>
                <Form.Control
                  as="select"
                  name="Grade"
                  defaultValue={salaryCodeEdit.Grade}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Choose...</option>
                  <option value="1" key="19">
                    1
                  </option>
                  <option value="2" key="20">
                    2
                  </option>
                  <option value="3" key="21">
                    3
                  </option>
                  <option value="4" key="22">
                    4
                  </option>
                  <option value="5" key="23">
                    5
                  </option>
                  <option value="6" key="24">
                    6
                  </option>
                  <option value="7" key="25">
                    7
                  </option>
                  <option value="8" key="26">
                    8
                  </option>
                  <option value="9" key="27">
                    9
                  </option>
                  <option value="10" key="28">
                    10
                  </option>
                </Form.Control>
                {errors.Grade?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="daily_rate">
                <Form.Label>Daily Rate</Form.Label>
                <Form.Control
                  type="text"
                  //placeholder="Enter the amount"
                  //placeholder={salaryCodeEdit.daily_rate}
                  disabled={true}
                  value={
                    basicPay && dailyAllowance
                      ? parseInt(basicPay) + parseInt(dailyAllowance)
                      : "0"
                  }
                  // value={dailyRateCalculation()}
                  name="daily_rate"
                  defaultValue={salaryCodeEdit.daily_rate}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.daily_rate?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="basic_pay">
                <Form.Label>Basic Pay</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the amount"
                  name="basic_pay"
                  defaultValue={salaryCodeEdit.basic_pay}
                  ref={register({
                    required: true,
                  })}
                  onChange={(e) => {
                    setBasicPay(e.target.value);
                  }}
                />
                {errors.basic_pay?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="daily_allowence">
                <Form.Label>Daily Allowance</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the amount"
                  name="daily_allowence"
                  defaultValue={salaryCodeEdit.daily_allowence}
                  ref={register({
                    required: true,
                  })}
                  onChange={(e) => {
                    setDailyAllowance(e.target.value);

                    // setDailyRate(+dailyAllowance + +basicPay)
                    //console.log(dailyRate)
                  }}
                />
                {errors.daily_allowence?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="Site">
                <Form.Label>Site</Form.Label>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <Form.Control
                      style={{ width: "200px" }}
                      type="text"
                      name="Site"
                      value={siteCode}
                      defaultValue={salaryCodeEdit.site_code}
                      disabled={true}
                      ref={register({
                        required: true,
                      })}
                    >
                      {/* <option key="0" value="">
                    Choose...
                  </option>
                  {!(sites.length === 0)
                    ? sites.map((site) => {
                        const { site_id } = site;
                        return (
                          <option key={sites.indexOf(site) + 1} value={site_id}>
                            {site_id}
                          </option>
                        );
                      })
                    : null} */}
                    </Form.Control>
                    {errors.Site?.type === "required" && (
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
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="OTrate">
                <Form.Label>OT Rate</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the OT rate"
                  name="OTrate"
                  defaultValue={salaryCodeEdit.OTrate}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.OTrate?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* {(category==="Union"||salaryCodeEdit.labourer_class==="Union")?(<> */}
              {true ? (
                <>
                  {/* <Form.Group as={Col} controlId="sunday_wage">
                <Form.Label>Sunday Wage</Form.Label>
                <Form.Control
                  type="text"
                  name="sunday_wage"
                  defaultValue={salaryCodeEdit.sunday_wage}
                  ref={register({
                    required: true,
                  })}
                 > */}
                  {/* <option value="">Choose...</option>
                 <option value="true" key="29">
                   true
                 </option>
                 <option value="false" key="30">
                   false
                 </option> */}
                  {/* </Form.Control>{errors.sunday_wage?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
                  <Form.Group as={Col} controlId="holiday_wage">
                    <Form.Label>Holiday Wage</Form.Label>
                    <Form.Control
                      type="text"
                      name="holiday_wage"
                      defaultValue={salaryCodeEdit.holiday_wage}
                      ref={register({
                        required: true,
                      })}
                    >
                      {/* <option value="">Choose...</option>
                  <option value="true" key="31">
                    true
                  </option>
                  <option value="false" key="32">
                    false
                  </option> */}
                    </Form.Control>
                    {errors.holiday_wage?.type === "required" && (
                      <p className="text-danger">
                        <small>
                          <i>This field is required</i>
                        </small>
                      </p>
                    )}
                  </Form.Group>
                </>
              ) : null}
            </Form.Row>
            <Form.Row>
              {category === "Union" ? (
                <>
                  <Form.Group as={Col} controlId="SW_C1">
                    <Form.Label>SW-C1</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter here"
                      name="SW_C1"
                      defaultValue={salaryCodeEdit.SW_C1}
                      ref={register({
                        required: true,
                      })}
                    />
                    {errors.SW_C1?.type === "required" && (
                      <p className="text-danger">
                        <small>
                          <i>This field is required</i>
                        </small>
                      </p>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} controlId="SW_C2">
                    <Form.Label>SW-C2</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter here"
                      name="SW_C2"
                      defaultValue={salaryCodeEdit.SW_C2}
                      ref={register({
                        required: true,
                      })}
                    />
                    {errors.SW_C2?.type === "required" && (
                      <p className="text-danger">
                        <small>
                          <i>This field is required</i>
                        </small>
                      </p>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} controlId="SW">
                    <Form.Label>SW</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter here"
                      name="SW"
                      defaultValue={salaryCodeEdit.SW}
                      ref={register({
                        required: true,
                      })}
                    />
                    {errors.SW?.type === "required" && (
                      <p className="text-danger">
                        <small>
                          <i>This field is required</i>
                        </small>
                      </p>
                    )}
                  </Form.Group>
                  {errors.SW?.type === "required" && (
                    <p className="text-danger">
                      <small>
                        <i>This field is required</i>
                      </small>
                    </p>
                  )}
                </>
              ) : null}
              {/* <Form.Group as={Col} controlId="OTtype">
                <Form.Label>OT Type</Form.Label>
                <Form.Control
                  as="select"
                  disabled={true}
                  value={(category==="Union")?"double":"fixed"}
                  name="OTtype"
                  defaultValue={salaryCodeEdit.OTtype}
                  ref={register({
                    required: true,
                  })}
                > */}
              {/* <option value="">Choose...</option>
                  <option value="Fixed" key="33">
                    Fixed
                  </option>
                  <option value="Double" key="34">
                    Double
                  </option>
                </Form.Control> */}
              {/* {errors.OTtype?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              {/* <Form.Group as={Col} controlId="compenratio">
                <Form.Label>Compensation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter here"
                  name="compenratio"
                  defaultValue={salaryCodeEdit.compenratio}
                  ref={register({
                    required: true,
                  })}
                /> */}
              {/* {errors.compenratio?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
            </Form.Row>
            <Form.Row></Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="rent">
                <Form.Label>Rent Amount</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={salaryCodeEdit.rent}
                  name="rent"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.compenratio?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {category === "Kunnel" ? (
                <Form.Group as={Col} controlId="rentation">
                  <Form.Label>Retension</Form.Label>
                  <Form.Control
                    type="text"
                    name="rentation"
                    defaultValue={salaryCodeEdit.rentation}
                    ref={register({
                      required: true,
                    })}
                  >
                    {/* <option value="">Choose...</option>
                  <option value="true" key="35">
                    true
                  </option>
                  <option value="false" key="36">
                    false
                  </option> */}
                  </Form.Control>
                  {errors.rentation?.type === "required" && (
                    <p className="text-danger">
                      <small>
                        <i>This field is required</i>
                      </small>
                    </p>
                  )}
                </Form.Group>
              ) : null}
            </Form.Row>
            <Form.Row>
              <Button variant="primary" type="submit">
                Save Salary
              </Button>
              <Button
                type="delete"
                style={{
                  backgroundColor: "red",
                  border: "red",
                  marginLeft: "8px",
                }}
                onClick={(e) => deleteSalaryHandler(e)}
              >
                Delete Salary
              </Button>
            </Form.Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  editSalaryStructureModal: state.editSalaryStructureModal,
  sites: state.sites,
  salaryCodes: state.salaryCodes,
  salaryCodeEdit: state.salaryCodeEdit,
});
export default connect(mapStateToProps, { edit_salary_struct_modal })(
  EditSalaryStructure
);
