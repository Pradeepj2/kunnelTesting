import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Col, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { labours_list } from "../../../redux/actions/siteActions";
import SiteModal from "../../utilModals/siteModal";
import LabourWithFilter from "../retensionCompensation/LabourWithFilterData";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {
  advance_types,
  apply_advance_modal,
} from "../../../redux/actions/fetchActions";
import axios from "axios";
const ApplyAdvance = ({
  labours_list,
  advance_types,
  advanceTypes,
  laboursData,
  revalidate,
  apply_advance_modal,
  applyAdvanceModal,
}) => {
  const [show, setShow] = useState(false);
  const [code, setSiteCode] = useState("");
  const [labourerId, setLabourerId] = React.useState("");
  const [showLabour, setShowLabour] = useState(false);
  const [sites, setSites] = useState([]);
  const [Siteid, setSiteid] = useState([]);
  const [installment, setInstallment] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [festivalList, setFestivalList] = useState([]);
  const [occasionList, setOccasionList] = useState([]);
  const [fromDate, setfromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [amount, setamount] = useState(0);
  const [deduction, setDeduction] = useState(100);
  const [isamountHided, setHideamount] = useState(false);
  const [selectType, setSelectType] = useState();
  const [labourName, setLabourName] = useState("");
  const [wage, setWage] = useState("0");

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  const DiductAmountButton = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
      "&:before, &:after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 16,
        height: 16,
      },
      "&:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      "&:after": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 16,
      height: 16,
      margin: 2,
    },
  }));

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/labourermanage/labourer/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        labours_list(res.data.data);
      })
      .catch((error) => {
        console.log("Error :", error);
      });
  }, [labours_list]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.data) setSites(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // const docome = useCallback(() => {
  //   if (fromDate && toDate && Siteid && labourerId) {
  //     let data = {
  //       siteid: Siteid,
  //       fromdate: fromDate,
  //       todate: toDate,
  //       labourerid: labourerId[0] === "L" ? labourerId : "LAB00" + labourerId,
  //     };
  //     axios
  //       .post(
  //         `${process.env.REACT_APP_API_URL}/advance/weekWage_labour/`,
  //         data,
  //         {
  //           headers: {
  //             Authorization: `Token ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         if (res.data.status) setWage(res.data.eligible_wage);
  //         else setWage("0");
  //       })
  //       .catch((error) => {
  //         setWage("0");
  //         console.log("Error :", error);
  //       });
  //   }
  // }, [fromDate, toDate, Siteid, labourerId]);

  useEffect(() => {
    if (fromDate && toDate && Siteid && labourerId) {
      let data = {
        siteid: Siteid,
        fromdate: fromDate,
        todate: toDate,
        labourerid: labourerId[0] === "L" ? labourerId : "LAB00" + labourerId,
      };
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/advance/weekWage_labour/`,
          data,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.data.status) setWage(res.data.eligible_wage);
          else setWage("0");
        })
        .catch((error) => {
          setWage("0");
          console.log("Error :", error);
        });
    }
  }, [fromDate, toDate, Siteid, labourerId]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/advance/create_festival/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data) setFestivalList(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get(`${process.env.REACT_APP_API_URL}/advance/create_occassion/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data) setOccasionList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const [name, setName] = useState("");
  const showOption = (e) => {
    if (e.target.value === "F") {
      setHideamount(false);
      setName("Festival Name");
      setSelectType("F");
    } else if (e.target.value === "S") {
      setHideamount(false);
      setSelectType("S");
      setName("Occasion Name");
    } else {
      setHideamount(true);
      setSelectType("W");
      setName("");
    }
  };

  const viewHandler = () => {
    setShow(true);
    setLabourerId("");
  };
  const labourHandler = () => {
    setShowLabour(true);
  };

  const persentageHandler = (e) => {
    setDeduction(e.target.value);
  };

  const amountHandler = (e) => {
    setamount(e.target.value);
  };

  const onSubmit = (data) => {
    let Data = null;
    if (selectType === "F") {
      Data = {
        labourer_id: labourerId,
        type: data.type,
        amount: parseInt(amount),
        site_id: Siteid,
        id: Siteid.split("site00")[1],
        festival_name: name ? data.name : null,
        from_date: new Date(data.from_date).toISOString().split("T")[0],
        no_of_installment: data.no_of_installment,
        installment_amount: parseInt(amount / installment),
        // applied_data: new Date().toISOString(),
        // labourer_id: `LAB00${labourerId}`,
        // deduction_percent: parseFloat(data.deduction_percent),
        // amount_calculated_acc_per: parseInt(data.issue_amount),
        // to_date: new Date(data.to_date).toISOString().split("T")[0],
      };
    } else if (selectType === "S") {
      if (isChecked) {
        Data = {
          labourer_id: labourerId,
          type: data.type,
          amount: parseInt(amount),
          id: Siteid.split("site00")[1],
          site_id: Siteid,
          occasion_name: name ? data.name : null,
          from_date: new Date(data.from_date).toISOString().split("T")[0],
          no_of_installment: data.no_of_installment,
          installment_amount: parseInt(amount / installment),
          // applied_data: new Date().toISOString(),
          deduct_special_advance: isChecked,
          // labourer_id: `LAB00${labourerId}`,
          // deduction_percent: parseFloat(data.deduction_percent),
          // amount_calculated_acc_per: parseInt(data.issue_amount),
          // to_date: new Date(data.to_date).toISOString().split("T")[0],
        };
      } else {
        Data = {
          labourer_id: labourerId,
          type: data.type,
          amount: parseInt(amount),
          id: Siteid.split("site00")[1],
          site_id: Siteid,
          occasion_name: name ? data.name : null,
          deduct_special_advance: isChecked,
        };
      }
    } else {
      Data = {
        eligible_wages: data.eligible_Wages,
        labourer_id: labourerId,
        type: data.type,
        amount: parseInt(amount),
        deduction_percent: parseFloat(data.deduction_percent),
        id: Siteid.split("site00")[1],
        site_id: Siteid,
        // festival_name: name ? data.name : null,
        from_date: new Date(data.from_date).toISOString().split("T")[0],
        to_date: new Date(data.to_date).toISOString().split("T")[0],
        issue_amount: data.issue_amount,
        // no_of_installment: data.no_of_installment,
        // installment_amount: parseInt(amount / installment),
        applied_data: new Date().toISOString(),
        // labourer_id: `LAB00${labourerId}`,
        // amount_calculated_acc_per: parseInt(data.issue_amount),
        // to_date: new Date(data.to_date).toISOString().split("T")[0],
      };
    }

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/advance/advance_create_type/  `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          showsuccErr({ msg: "Advance Created", variant: "success" });
          apply_advance_modal({ show: false });
          revalidate();
          setToDate("");
          setfromDate("");
          setSelectType("");
          setDeduction(100);
          setSiteCode("");
          setSiteid("");
          setLabourerId("");
          setamount("");
          setIsChecked(false);
          setWage("0");
        } else {
          showsuccErr({ msg: "Error Occured", variant: "error" });
        }
      })
      .catch((error) => {
        console.log("Error :", error);
      });
  };

  const NOOfInstallmentHandler = (e) => {
    setInstallment(e.target.value);
  };

  return (
    <Modal
      show={applyAdvanceModal}
      onHide={() => {
        apply_advance_modal({ show: false });
        setToDate("");
        setfromDate("");
        setSelectType("");
        setDeduction(100);
        setSiteCode("");
        setSiteid("");
        setLabourerId("");
        setamount("");
        setIsChecked(false);
        setWage("0");
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Apply For Advance</Modal.Title>
      </Modal.Header>
      <SiteModal
        // query={query}
        sites={sites}
        show={show}
        setShow={setShow}
        setSiteid={setSiteid}
        setSiteCode={setSiteCode}
      />
      {code ? (
        <LabourWithFilter
          showLabour={showLabour}
          setShowLabour={setShowLabour}
          setLabourerId={setLabourerId}
          filterParameter={code}
          setLabourName={setLabourName}
        />
      ) : null}
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Form.Group as={Col} controlId="siteid">
              <Form.Label>Site</Form.Label>
              <div style={{ display: "flex" }}>
                <div>
                  <Form.Control
                    style={{ width: "300px" }}
                    type="text"
                    name="siteid"
                    disabled={true}
                    value={code}
                    ref={register({
                      required: true,
                    })}
                  ></Form.Control>
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
            <Form.Group as={Col} controlId="labourer_id">
              <Form.Label>Labourer ID</Form.Label>
              <div style={{ display: "flex" }}>
                <div>
                  <Form.Control
                    style={{ width: "300px" }}
                    type="text"
                    name="labourer_id"
                    disabled={true}
                    value={labourerId}
                    ref={register({
                      required: true,
                    })}
                  ></Form.Control>
                  {errors.start_date?.type === "required" && (
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
                    onClick={(e) => labourHandler()}
                  >
                    View
                  </Button>
                </div>
              </div>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                onChange={(e) => showOption(e)}
                ref={register({
                  required: true,
                })}
              >
                <option key="0" value="">
                  Select
                </option>

                <option key="F" value="F">
                  Festival Advance
                </option>
                <option key="S" value="S">
                  Special Advance
                </option>
                <option key="W" value="W">
                  weekly Advance
                </option>
              </Form.Control>
              {errors.type?.type === "required" && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
            </Form.Group>
            {name ? (
              <Form.Group as={Col} controlId="name">
                <Form.Label>{name}</Form.Label>
                <Form.Control
                  as="select"
                  name="name"
                  ref={register({
                    required: true,
                  })}
                >
                  <option key="" value="">
                    Select
                  </option>
                  {festivalList.length != 0 && selectType === "F"
                    ? festivalList.map((val) => {
                        return (
                          <option key={val.id}>{val.festival_name}</option>
                        );
                      })
                    : null}
                  {occasionList.length != 0 && selectType === "S"
                    ? occasionList.map((val) => {
                        return (
                          <option key={val.id}>{val.occasion_name}</option>
                        );
                      })
                    : null}
                </Form.Control>
                {/* {errors.name?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )} */}
              </Form.Group>
            ) : null}

            {selectType === "F" || selectType === "S" ? (
              <Form.Group as={Col} controlId="advance_amount">
                <Form.Label>Advance Amount</Form.Label>
                <Form.Control
                  type="text"
                  name="advance_amount"
                  placeholder="Enter Amount"
                  onChange={(e) => amountHandler(e)}
                  ref={register({
                    required: true,
                  })}
                ></Form.Control>
                {errors.advanced_amount?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            ) : null}
          </Form.Row>
          {selectType === "S" ? (
            <Form.Group>
              <FormControlLabel
                control={
                  <DiductAmountButton
                    defaultChecked={isChecked}
                    onClick={(e) => {
                      setIsChecked(!isChecked);
                    }}
                  />
                }
                label="Deduct Amount"
              />
            </Form.Group>
          ) : null}
          {selectType === "F" ? (
            <div>
              <Form.Row>
                <Form.Group as={Col} controlId="from_date">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="from_date"
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.from_date?.type === "required" && (
                    <p className="text-danger">
                      <small>
                        <i>This field is required</i>
                      </small>
                    </p>
                  )}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="no_of_installment">
                  <Form.Label>No of Installment</Form.Label>
                  <Form.Control
                    as="select"
                    name="no_of_installment"
                    onChange={(e) => NOOfInstallmentHandler(e)}
                    ref={register({
                      required: true,
                    })}
                  >
                    <option key="" value="">
                      Select
                    </option>
                    <option key="1" value="1">
                      1
                    </option>
                    <option key="2" value="2">
                      2
                    </option>
                    <option key="3" value="3">
                      3
                    </option>
                    <option key="4" value="4">
                      4
                    </option>
                    <option key="5" value="5">
                      5
                    </option>
                    <option key="6" value="6">
                      6
                    </option>
                    <option key="7" value="7">
                      7
                    </option>
                    <option key="8" value="8">
                      8
                    </option>
                    <option key="9" value="9">
                      9
                    </option>
                    <option key="10" value="10">
                      10
                    </option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              {/* <Form.Row>
                {isamountHided && (
                  <Form.Group as={Col} controlId="issue_amount">
                    <Form.Label>Issue amount</Form.Label>
                    <Form.Control
                      type="text"
                      name="issue_amount"
                      placeholder="Enter Amount"
                      value={(amount * parseFloat(deduction)) / 100}
                      ref={register({
                        required: true,
                      })}
                    ></Form.Control>
                    {errors.issue_amount?.type === "required" && (
                      <p className="text-danger">
                        <small>
                          <i>This field is required</i>
                        </small>
                      </p>
                    )}
                  </Form.Group>
                )}
              </Form.Row> */}
              <Form.Row>
                <Form.Group as={Col} controlId="installment_amount">
                  <Form.Label>Installment Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="installment_amount"
                    value={
                      parseInt(amount / installment)
                        ? parseInt(amount / installment)
                        : 0
                    }
                    ref={register({
                      required: true,
                    })}
                  ></Form.Control>
                  {errors.installment_amount?.type === "required" && (
                    <p className="text-danger">
                      <small>
                        <i>This field is required</i>
                      </small>
                    </p>
                  )}
                </Form.Group>
              </Form.Row>
            </div>
          ) : null}
          {selectType === "S" && isChecked ? (
            <div>
              <Form.Row>
                <Form.Group as={Col} controlId="from_date">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="from_date"
                    ref={register({
                      required: true,
                    })}
                  />
                  {/* {errors.from_date?.type === "required" && (
                    <p className="text-danger">
                      <small>
                        <i>This field is required</i>
                      </small>
                    </p>
                  )} */}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="no_of_installment">
                  <Form.Label>No of Installment</Form.Label>
                  <Form.Control
                    as="select"
                    name="no_of_installment"
                    onChange={(e) => NOOfInstallmentHandler(e)}
                    ref={register({
                      required: true,
                    })}
                  >
                    <option key="" value="">
                      Select
                    </option>
                    <option key="1" value="1">
                      1
                    </option>
                    <option key="2" value="2">
                      2
                    </option>
                    <option key="3" value="3">
                      3
                    </option>
                    <option key="4" value="4">
                      4
                    </option>
                    <option key="5" value="5">
                      5
                    </option>
                    <option key="6" value="6">
                      6
                    </option>
                    <option key="7" value="7">
                      7
                    </option>
                    <option key="8" value="8">
                      8
                    </option>
                    <option key="9" value="9">
                      9
                    </option>
                    <option key="10" value="10">
                      10
                    </option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              {/* <Form.Row>
                {isamountHided && (
                  <Form.Group as={Col} controlId="issue_amount">
                    <Form.Label>Issue amount</Form.Label>
                    <Form.Control
                      type="text"
                      name="issue_amount"
                      placeholder="Enter Amount"
                      value={(amount * parseFloat(deduction)) / 100}
                      ref={register({
                        required: true,
                      })}
                    ></Form.Control>
                    {errors.issue_amount?.type === "required" && (
                      <p className="text-danger">
                        <small>
                          <i>This field is required</i>
                        </small>
                      </p>
                    )}
                  </Form.Group>
                )}
              </Form.Row> */}
              <Form.Row>
                <Form.Group as={Col} controlId="installment_amount">
                  <Form.Label>Installment Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="installment_amount"
                    value={
                      parseInt(amount / installment)
                        ? parseInt(amount / installment)
                        : 0
                    }
                    ref={register({
                      required: true,
                    })}
                  ></Form.Control>
                  {/* {errors.installment_amount?.type === "required" && (
                    <p className="text-danger">
                      <small>
                        <i>This field is required</i>
                      </small>
                    </p>
                  )} */}
                </Form.Group>
              </Form.Row>
            </div>
          ) : null}
          {/**************************************************************************************************************************/}
          {selectType === "W" ? (
            <div>
              <Form.Row>
                <Form.Group as={Col} controlId="from_date">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="from_date"
                    onChange={(e) => setfromDate(e.target.value)}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.from_date?.type === "required" && (
                    <p className="text-danger">
                      <small>
                        <i>This field is required</i>
                      </small>
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} controlId="to_date">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="to_date"
                    onChange={(e) => setToDate(e.target.value)}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.to_date?.type === "required" && (
                    <p className="text-danger">
                      <small>
                        <i>This field is required</i>
                      </small>
                    </p>
                  )}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} ControlId="eligible_Wages">
                  <Form.Label>Eligible Wages</Form.Label>
                  <Form.Control
                    type="text"
                    name="eligible_Wages"
                    placeholder="Wage"
                    value={wage}
                    ref={register({
                      required: true,
                    })}
                  ></Form.Control>
                </Form.Group>
                <Form.Group as={Col} ControlId="advance_amount">
                  <Form.Label>Advance Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="advance_amount"
                    placeholder="advance amount"
                    onChange={(e) => amountHandler(e)}
                    ref={register({
                      required: "true",
                    })}
                  ></Form.Control>
                  {errors.advance_amount?.type === "required" && (
                    <p className="text-danger"></p>
                  )}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="deduction_percent">
                  <Form.Label>Deduction Percentage</Form.Label>
                  <Form.Control
                    type="text"
                    name="deduction_percent"
                    placeholder="Enter Percentage"
                    value={deduction}
                    onChange={(e) => persentageHandler(e)}
                    ref={register({
                      required: true,
                    })}
                  ></Form.Control>
                  {errors.deduction_percent?.type === "required" && (
                    <p className="text-danger">
                      <small>
                        <i>This field is required</i>
                      </small>
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} controlId="issue_amount">
                  <Form.Label>Issue Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="issue_amount"
                    placeholder="Enter Amount"
                    value={(amount * deduction) / 100}
                    ref={register({
                      required: true,
                    })}
                  ></Form.Control>
                  {errors.issue_amount?.type === "required" && (
                    <p className="text-danger">
                      <small>
                        <i>This field is required</i>
                      </small>
                    </p>
                  )}
                </Form.Group>
              </Form.Row>
            </div>
          ) : null}
          <Button variant="primary" type="submit">
            Apply
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
const mapStateToProps = (state) => ({
  advanceTypes: state.advanceTypes,
  laboursData: state.laboursData,
  sitesss: state.sites,
  applyAdvanceModal: state.applyAdvanceModal,
});
export default connect(mapStateToProps, {
  labours_list,
  advance_types,
  apply_advance_modal,
})(ApplyAdvance);
