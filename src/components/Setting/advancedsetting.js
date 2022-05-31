import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Form, Col } from "react-bootstrap";
import * as MdIcons from "react-icons/md";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

const AdvancedSetting = () => {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [preFes, setPreFes] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/advance/create_festival/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) setPreFes(res.data);
      });
  }, []);

  const typeHandler = () => {
    let Data = null;
    let urlupdate = null;

    if (type === "F") {
      urlupdate = "/advance/create_festival/";
      Data = {
        festival_name: name,
      };
    } else {
      urlupdate = "/advance/create_occassion/";
      Data = {
        occasion_name: name,
      };
    }

    axios
      .post(`${process.env.REACT_APP_API_URL + urlupdate}`, Data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.status) {
          showsuccErr({ msg: res.data.Message, variant: "success" });
          setType("");
          setName("");
        } else {
          // alert(res.data.Message)
          showsuccErr({ msg: res.data.Message, variant: "error" });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Form className="mt-3" onSubmit={handleSubmit(typeHandler)}>
        <Form.Row>
          <Form.Group controlId="select_type" as={Col}>
            <Form.Label>Select Type</Form.Label>
            <Form.Control
              as="select"
              name="select_type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              ref={register({
                required: true,
              })}
            >
              <option value="">Please Select</option>
              <option value="F">Festival Advance</option>
              <option value="S">Special Advance</option>
            </Form.Control>
            {errors.select_type?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group controlId="advance_name" as={Col}>
            <Form.Label>Advance Name</Form.Label>
            <Form.Control
              type="text"
              name="advance_name"
              placeholder="Advance Name"
              value={name}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              ref={register({
                required: true,
              })}
            />
            {preFes.some(
              (data) => name.toLowerCase() === data.festival_name.toLowerCase()
            ) ? (
              <p className="text-danger">
                <small>
                  <i>Already Exist</i>
                </small>
              </p>
            ) : null}
            {errors.advance_name?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
        </Form.Row>
        <Button className="btn btn-sm" type="submit">
          <MdIcons.MdAddToPhotos />
          Create
        </Button>
      </Form>
    </div>
  );
};

export default AdvancedSetting;
