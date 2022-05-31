import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Form, Col } from "react-bootstrap";
import * as MdIcons from "react-icons/md";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

const ConcreteType = () => {
  const [categoryArr, setCategoryArr] = useState([]);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concretecategory/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setCategoryArr(res.data);
        } else {
          showsuccErr({ msg: "Error Occured", variant: "error" });
          // alert("Error Occured")
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  const typeHandler = () => {
    let Data = {
      concrete_categoryname: category,
      load_capacity: type,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concreteload/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          // alert(res.data.Message)
          showsuccErr({ msg: res.data.Message, variant: "success" });
          setCategory("");
          setType("");
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
          <Form.Group controlId="concrete_category" as={Col}>
            <Form.Label>Select Category</Form.Label>
            <Form.Control
              as="select"
              name="concrete_category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              ref={register({
                required: true,
              })}
            >
              <option value="">Please Select</option>
              {categoryArr.map((obj, idx) => {
                return <option key={obj.id}>{obj.categoryname}</option>;
              })}
            </Form.Control>
            {errors.concrete_category?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group controlId="concrete_type" as={Col}>
            <Form.Label>Concrete Type</Form.Label>
            <Form.Control
              type="text"
              name="concrete_type"
              value={type}
              placeholder="Enter Concrete Type"
              onChange={(e) => setType(e.target.value)}
              ref={register({
                required: true,
              })}
            />
            {errors.concrete_type?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
        </Form.Row>
        <Button
          className="btn btn-sm"
          type="submit"
          // onClick={()=>designationHandler()}
        >
          <MdIcons.MdAddToPhotos />
          Create Concrete Type
        </Button>
      </Form>
    </div>
  );
};

export default ConcreteType;
