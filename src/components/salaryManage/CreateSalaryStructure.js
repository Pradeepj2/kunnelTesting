import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { create_salary_structure_modal } from "../../redux/actions/fetchActions";
import SiteModal from "../utilModals/siteModal";
//import Alert from '../Shared/Alert.jsx'
//import { Snackbar } from '@material-ui/core';
import { useSnackbar } from "notistack";

const CreateSalaryStructure = ({
  create_salary_structure_modal,
  createSalaryStructure,
  sites,
}) => {
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });
  const [designation, setDesignation] = useState([]);
  const [pre, Setpre] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  // const [tempdesignation, setDesignation] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_class/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setDesignation(res.data);
      });

    if (pre !== designation) Setpre(designation);
  }, [pre]);

  ///########################declaring states######################//

  const [basicPay, setBasicPay] = useState(null);
  const [dailyAllowance, setDailyAllowance] = useState(null);
  const [category, setCategory] = useState("");
  const [show, setShow] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [siteCode, setSiteCode] = useState("");

  const onSubmit = (data) => {
    let Data = {
      ...data,
      daily_rate: String(total),
      OTtype: category === "Union" ? "double" : "fixed",
      Site: siteid,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/salarycode`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status === true) {
          //create_salary_structure_modal(false)
          showsuccErr({ msg: "Created succesfully", variant: "success" });
          // alert("Created succesfully");
          // window.location.reload();
          setBasicPay();
          setDailyAllowance();
          setCategory("");
        } else {
          create_salary_structure_modal(false);
          // for (let item in res.data.message) {
          //   alert(`${item}: ${res.data.message[item]}`);
          // }
          showsuccErr({ msg: res.data.message, variant: "error" });
        }
      })
      .catch((error) => {
        showsuccErr({ msg: error.message, variant: "error" });
      });
  };

  const total = parseInt(basicPay) + parseInt(dailyAllowance);

  const viewHandler = () => {
    setShow(true);
  };

  return (
    <>
      <Modal
        show={createSalaryStructure}
        onHide={() => {
          create_salary_structure_modal(false);
          setBasicPay(null);
          setDailyAllowance(null);
          setCategory("");
        }}
      >
        <SiteModal
          sites={sites}
          setSiteCode={setSiteCode}
          show={show}
          setShow={setShow}
          setSiteid={setSiteid}
        />
        <Modal.Header closeButton>
          {/* <Modal.Title>Create New Salary Structure</Modal.Title> */}
          <Modal.Title>Create New Wage Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col} controlId="labourer_class">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  as="select"
                  name="labourer_class"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Please Select...</option>
                  {designation.map((obj) => {
                    return (
                      <option value={obj.laboourerclass} key={obj.id}>
                        {obj.laboourerclass}
                      </option>
                    );
                  })}
                  {/* <option value="" key="4">

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
                  </option>  */}
                </Form.Control>
                {errors.gender?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* <Form.Group as={Col} controlId="labourer_class">
                <Form.Label>Labour Class</Form.Label>
                <Form.Control
                  as="select"
                  name="labourer_class"
                  ref={register({
                    required: true,
                  })}
                >
                   <option value="">Please Select</option>
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
                {errors.labourer_class?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              <Form.Group as={Col} controlId="labourer_category">
                <Form.Label>Labourer Category</Form.Label>
                <Form.Control
                  as="select"
                  name="labourer_category"
                  ref={register({
                    required: true,
                  })}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                >
                  <option value="">Please Select</option>
                  <option value="Kunnel" key="1">
                    Kunnel
                  </option>
                  <option value="Casual" key="2">
                    Casual
                  </option>
                  <option value="Union" key="3">
                    Union
                  </option>
                  {/* <option value="Hindi labour" key="4">
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
                  </option> */}
                  {/* <option value="Operator" key="8">
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
                  </option> */}
                </Form.Control>
                {errors.labourer_category?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Please Select</option>
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
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Please Select</option>
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
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Please Select</option>
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
                  placeholder={total}
                  disabled={true}
                  value={total}
                  name="daily_rate"
                  ref={register({
                    required: true,
                  })}
                />
                {/*  <button style={{border:'none', backgroundColor:'#212529',color:'white',padding:'3px',marginTop:'3px',borderRadius:'3px'}}
                onClick={(e)=>setDailyRate(+basicPay + +dailyAllowance)}>get Daily Rate</button>*/}
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
                  onChange={(e) => {
                    setBasicPay(e.target.value);
                    // setDailyRate(+basicPay + +dailyAllowance)
                  }}
                  name="basic_pay"
                  ref={register({
                    required: true,
                  })}
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
                  placeholder="Enter daily Allowance"
                  name="daily_allowence"
                  onChange={(e) => {
                    setDailyAllowance(e.target.value);
                    // setDailyRate(+dailyAllowance + +basicPay)
                    //console.log(dailyRate)
                  }}
                  ref={register({
                    required: true,
                  })}
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
                <Form.Label>Site Code</Form.Label>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <Form.Control
                      style={{ width: "200px" }}
                      type="type"
                      name="Site"
                      disabled={true}
                      value={siteCode}
                      ref={register({
                        required: true,
                      })}
                    >
                      {/* <option key="0" value="">
                    Please Select
                  </option>
                  {!(sites.length === 0)
                    ? sites.map((site) => {
                        const { site_id } = site;
                        return (
                          <> */}
                      {/* <option key={sites.indexOf(site) + 1} value={site_id} style={{margin:'5px',padding:'2px'}}>
                            {`ID:${site_id}
                             NAME:${site.name} PROJECT MANAGER:${site.project_manager}
                            PROJECT TYPE:${site.project_type}`}
                          </option> */}
                      {/* <option>

                          </option>
                          </>
                        );
                      })
                    : null} */}
                    </Form.Control>
                    {errors.site_code?.type === "required" && (
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
              <Form.Group as={Col} controlId="OTrate">
                <Form.Label>OT Rate</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the OT rate"
                  name="OTrate"
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
              {/* <Form.Group as={Col} controlId="sunday_wage">
                <Form.Label>Sunday Wage</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Sunday Wage"
                  name="sunday_wage"
                  ref={register({
                    required: true,
                  })}
                > */}
              {/* <option value="">Please Select</option>
                  <option value="T" key="29">
                    True
                  </option>
                  <option value="F" key="30">
                    False
                  </option> */}
              {/* </Form.Control>
                {errors.sunday_wage?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              <Form.Group as={Col} controlId="pf">
                <Form.Label>PF</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter the PF"
                  name="pf"
                  step="any"
                  // step="any"
                  ref={register({
                    required: true,
                  })}
                />
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
              <Form.Group as={Col} controlId="holiday_wage">
                <Form.Label>Holiday Wage</Form.Label>
                <Form.Control
                  type="text"
                  name="holiday_wage"
                  placeholder="Enter Holiday Wage"
                  ref={register({
                    required: true,
                  })}
                >
                  {/* <option value="">Please Select</option>
                    <option value="T" key="31">
                      True
                    </option>
                    <option value="F" key="32">
                      False
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
              {category === "Union" ? (
                <>
                  <Form.Group as={Col} controlId="SW">
                    <Form.Label>SW</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter here"
                      name="SW"
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
                  <Form.Group as={Col} controlId="SW_C1">
                    <Form.Label>SW-C1</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter here"
                      name="SW_C1"
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
                </>
              ) : null}

              {/* <Form.Group as={Col} controlId="OTtype">
                <Form.Label>OT Type</Form.Label>
                <Form.Control
                  type="text"
                  disabled={true}
                  placeholder={(category==="Union")?"double":"fixed"}
                  value={(category==="Union")?"double":"fixed"}
                  name="OTtype"
                  ref={register({
                    required: true,
                  })}
                > */}
              {/* <option value="">Please Select</option>
                  <option value="Fixed" key="33">
                    Fixed
                  </option>
                  <option value="Double" key="34">
                    Double
                  </option> */}
              {/* </Form.Control>
                {errors.OTtype?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="rent">
                <Form.Label>Rent Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter here"
                  name="rent"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.rent?.type === "required" && (
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
                    placeholder="Enter Here"
                    ref={register({
                      required: true,
                    })}
                  >
                    {/* <option value="">Please Select</option>
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
              {/* <Form.Group as={Col} controlId="compenratio">
                <Form.Label>Compensation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter here"
                  name="compenratio"
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
              <Form.Group as={Col} controlId="esi">
                <Form.Label>ESI</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter the PF"
                  name="esi"
                  step="any"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.esi?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="wagecode">
                <Form.Label>Wage Code</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Wage Code"
                  name="wagecode"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.wagecode?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  createSalaryStructure: state.createSalaryStructure,
  sites: state.sites,
});
export default connect(mapStateToProps, { create_salary_structure_modal })(
  CreateSalaryStructure
);
