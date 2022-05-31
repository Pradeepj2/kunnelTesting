import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import SiteModal from "../../../utilModals/siteModal";
import LabourWithFilter from "../LabourWithFilterData";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
const CreateMiscellaneous = (props) => {
  //##############################declaring states####################//
  const [show, setShow] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [siteCode, setSiteCode] = useState("");
  const [showLabour, setShowLabour] = useState(false);
  const [labourerId, setLabourerId] = useState("");
  const [sites, setSites] = useState([]);
  const [labourName, setLabourName] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.data) {
          setSites(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //handling form submit
  const { register, handleSubmit, errors } = useForm({
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    let Data = {
      site_id: siteid.split("site00")[1],
      labourer_id: labourerId,
      debit_amount: data.debit_amount,
      from_date: data.from_date,
      to_date: data.to_date,
    };

    //api call for creating adjustment amount
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/wagemanage/miscellaneous_debit `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status) {
          showsuccErr({ msg: "Creating...", variant: "success" });
          props.revalidate();
          props.showModal(false);
          setLabourerId("");
          setSiteid("");
          setSiteCode("");
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
        show={props.modal}
        onHide={() => {
          props.showModal(false);
          setLabourerId("");
          setSiteid("");
          setSiteCode("");
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

        {siteCode ? (
          <LabourWithFilter
            showLabour={showLabour}
            setShowLabour={setShowLabour}
            setLabourerId={setLabourerId}
            filterParameter={siteCode}
            setLabourName={setLabourName}
          />
        ) : null}

        <Modal.Header closeButton>
          <Modal.Title>Create New Miscellaneous Debit</Modal.Title>
        </Modal.Header>
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
                      value={siteCode}
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
              <Form.Group as={Col} controlId="debit_amount">
                <Form.Label>Miscellaneous Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Amount"
                  name="debit_amount"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.debit_amount?.type === "required" && (
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
            <Button variant="primary" type="submit">
              Submit
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

export default connect(mapStateToProps)(CreateMiscellaneous);
