import axios from "axios";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as MdIcons from "react-icons/md";
import { useForm } from "react-hook-form";

import { useSnackbar } from "notistack";

const Designation = () => {
  const [designation, setDesignation] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  const designationHandler = (data) => {
    let Data = {
      laboourerclass: designation,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_class/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          setDesignation("");
          showsuccErr({ msg: "Designation Added", variant: "success" });

          // alert("Designation Added")
        }
      });
  };

  return (
    <div>
      <Form className="mt-3" onSubmit={handleSubmit(designationHandler)}>
        <Form.Group controlId="laboourerclass">
          <Form.Label>Designation</Form.Label>
          <Form.Control
            type="text"
            name="laboourerclass"
            placeholder="Enter Designation"
            onChange={(e) => setDesignation(e.target.value)}
            value={designation}
            ref={register({
              required: true,
            })}
          ></Form.Control>
        </Form.Group>
        {errors.laboourerclass?.type === "required" && (
          <p className="text-danger">
            <small>
              <i>Designation is required</i>
            </small>
          </p>
        )}
        <Button
          className="btn btn-sm"
          type="submit"
          // onClick={()=>designationHandler()}
        >
          <MdIcons.MdAddToPhotos />
          Create Designation
        </Button>
      </Form>
    </div>
  );
};

export default Designation;
