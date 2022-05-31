import React from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { toggle_tally_modal } from "../../redux/actions/fetchActions.js";
import axios from "axios";

const CreateAccount = ({ tallyModal, toggle_tally_modal }) => {
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  const onSubmit = (data) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/tally/accounts/`, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          alert(
            `Account created Successfully! \n ID : ${response.data.id} \n Account : ${response.data.account}`
          );
        } else {
          alert(response.statusText);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <>
      <Modal show={tallyModal} onHide={() => toggle_tally_modal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form key={1} onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="account">
              <Form.Label>Account Name</Form.Label>
              <Form.Control
                type="text"
                name="account"
                placeholder="Enter the account name"
                ref={register({
                  required: true,
                })}
              ></Form.Control>
            </Form.Group>
            {errors.account?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
            <Button type="submit" className="btn btn-sm">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  tallyModal: state.tallyModal,
});
export default connect(mapStateToProps, { toggle_tally_modal })(CreateAccount);
