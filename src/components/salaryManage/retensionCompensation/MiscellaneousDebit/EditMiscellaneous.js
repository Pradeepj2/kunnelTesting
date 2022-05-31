import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import SiteModal from "../../../utilModals/siteModal";
import LabourWithFilter from "../LabourWithFilterData";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

const EditMiscellaneous = (props) => {
  //##############################declaring states####################//
  const [show, setShow] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [showLabour, setShowLabour] = useState(false);
  const [labourerId, setLabourerId] = useState(
    props ? props.id.labourer_id : ""
  );
  const [sites, setSites] = useState([]);
  const [code, setSiteCode] = useState("");
  const [amount, setAmount] = useState(props ? props.id.debit_amount : "");

  const [formdate, setFromdate] = useState();
  const [todate, setTodate] = useState();

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  useEffect(() => {
    setSiteid(props.id.site_code);
    setSiteCode(props.id.site_code);
    setLabourerId(props.id.labourer_id);
    setAmount(props.id.debit_amount);
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
    let Data = {
      site_id: siteid.split("site00")[1],
      labourer_id: labourerId,
      debit_amount: amount,
      from_date: formdate,
      to_date: todate,
    };

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/wagemanage/edit_delete_debit/${props.id.id}/  `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status) {
          showsuccErr({ msg: "Updated...", variant: "success" });
          props.revalidate();
          props.showEditModal(false);
          setLabourerId("");
          setSiteid("");
        } else {
          showsuccErr({ msg: res.data.Message, variant: "error" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Delete = () => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/wagemanage/edit_delete_debit/${props.id.id}/   `,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status) {
          showsuccErr({ msg: "Deleted", variant: "error" });
          props.revalidate();
          props.showEditModal(false);
          setLabourerId("");
          setSiteid("");
        } else {
          showsuccErr({ msg: res?.data?.Message, variant: "error" });
          // alert(res?.data?.Message);
        }
      })
      .catch((error) => {
        console.log(error);
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
          <Modal.Title>Update Miscellaneous Debit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => {}}>
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
                      defaultValue={props.id.labourer_id}
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
              <Form.Group as={Col} controlId="debit_amount">
                <Form.Label>Miscellaneous Debit</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Amount"
                  name="debit_amount"
                  defaultValue={props.id.debit_amount}
                  onChange={(e) => setAmount(e.target.value)}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.adjustmetn_amount?.type === "required" && (
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
                  onChange={(e) => setFromdate(e.target.value)}
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
                  onChange={(e) => setTodate(e.target.value)}
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

export default connect(mapStateToProps)(EditMiscellaneous);
