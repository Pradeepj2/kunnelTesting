import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import SiteModal from "../../utilModals/siteModal";
import { connect } from "react-redux";
import LabourWithFilter from "./LabourWithFilterData";
import { useSnackbar } from "notistack";

const EditAdjustment = (props) => {
  //##############################declaring states####################//
  const [show, setShow] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [showLabour, setShowLabour] = useState(false);
  const [fromdate, setFrom] = useState();
  const [todate, setTo] = useState();
  const [labourerId, setLabourerId] = useState(
    props ? props.id.labourer_id : ""
  );

  const [amount, setAmount] = useState(props ? props.id.adjustment_amount : "");
  const [sites, setSites] = useState([]);
  const [code, setSiteCode] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  useEffect(() => {
    setSiteid(props.id.site_code);
    setSiteCode(props.id.site_code);
    setLabourerId(props.id.labourer_id);
    setAmount(props.id.adjustment_amount);
    setFrom(props.id.from_date);
    setTo(props.id.to_date);
  }, [props]);

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

  //handling form submit
  const { register, errors } = useForm({
    mode: "onTouched",
  });
  const Update = () => {
    // var site = "";
    // var labour = "";

    // if (siteid.toString().split("0") != siteid)
    //   site = siteid.toString().split("site00")[1];
    // else site = siteid;

    // if (labourerId.toString().split("0") != labourerId)
    //   labour = labourerId.toString().split("LAB00")[1];
    // else labour = labourerId;

    let Data = {
      // site_id: code,
      // labourer_id: `LAB00${labourerId}`,
      // adjustment_amount: amount,
      // from_date: fromdate,
      // to_date: todate,
      site_id: siteid.split("site00")[1],
      // site_id: 14,
      site_code: code,
      labourer_id: labourerId,
      adjustment_amount: amount,
      from_date: new Date(fromdate).toISOString().split("T")[0],
      to_date: new Date(todate).toISOString().split("T")[0],
    };
    // console.log(Data);

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/wagemanage/edit_delete_credits/${props.id.id}/  `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status) {
          showsuccErr({ msg: "updated..", variant: "success" });
          props.showEditModal(false);
          setLabourerId("");
          setSiteid("");
          props.revalidate();
          // window.location.reload();
        } else {
          showsuccErr({ msg: res.data.Message, variant: "success" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Delete = () => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/wagemanage/edit_delete_credits/${props.id.id}/  `,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status) {
          showsuccErr({ msg: "Deleted", variant: "error" });
          props.showEditModal(false);
          setLabourerId("");
          setSiteid("");
          props.revalidate();
        } else {
          showsuccErr({ msg: res?.data?.Message, variant: "error" });
        }
      })
      .catch((error) => {
        showsuccErr({ msg: error.Message, variant: "error" });
        // console.log(error);
      });
  };

  const viewHandler = () => {
    setShow(true);
    setLabourerId("");
  };

  const labourHandler = () => {
    setShowLabour(true);
  };

  return (
    <>
      <Modal
        show={props.editModal}
        onHide={() => {
          props.showEditModal(false);
          setLabourerId("");
          setSiteid("");
        }}
      >
        <SiteModal
          query={props.query}
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
          />
        ) : null}

        <Modal.Header closeButton>
          <Modal.Title>Update Adjustment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
                      defaultValue={code}
                      ref={register({
                        required: true,
                      })}
                    ></Form.Control>
                    {errors.siteid?.type === "required" && (
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
                      defaultValue={props.id.labourer_id}
                      ref={register({
                        required: true,
                      })}
                    ></Form.Control>
                    {errors.labourer_id?.type === "required" && (
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
              <Form.Group as={Col} controlId="adjustment_amount">
                <Form.Label>Adjustment Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Amount"
                  name="adjustment_amount"
                  defaultValue={props.id.adjustment_amount}
                  onChange={(e) => setAmount(e.target.value)}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.adjustment_amount?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="from_date">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  name="from_date"
                  onChange={(e) => setTo(e.target.value)}
                  defaultValue={props.id.from_date}
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
                  onChange={(e) => setTo(e.target.value)}
                  defaultValue={props.id.to_date}
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
            <Button
              style={{
                backgroundColor: "navy",
                border: "none",
                marginRight: "10px",
              }}
              onClick={() => Update()}
            >
              Update
            </Button>
            <Button
              style={{ backgroundColor: "red", border: "none" }}
              onClick={() => Delete()}
            >
              Delete
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  sites: state.sites,
});

export default connect(mapStateToProps)(EditAdjustment);
