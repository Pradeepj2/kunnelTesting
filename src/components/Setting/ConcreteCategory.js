import axios from "axios";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as MdIcons from "react-icons/md";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

const ConcreteCategory = () => {
  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const [category, setCategory] = useState("");

  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  const categoryHandler = () => {
    let Data = {
      categoryname: category,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concretecategory/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          showsuccErr({ msg: res.data.Message, variant: "success" });

          // alert(res.data.Message)
          setCategory("");
        } else {
          showsuccErr({ msg: res.data.Message, variant: "error" });
          // alert(res.data.Message)
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Form className="mt-3" onSubmit={handleSubmit(categoryHandler)}>
        <Form.Group controlId="grade">
          <Form.Label>Concrete Category</Form.Label>
          <Form.Control
            type="text"
            name="grade"
            value={category}
            placeholder="Enter Concrete Category"
            onChange={(e) => setCategory(e.target.value)}
            ref={register({
              required: true,
            })}
          ></Form.Control>
        </Form.Group>
        {errors.grade?.type === "required" && (
          <p className="text-danger">
            <small>
              <i>This field is required</i>
            </small>
          </p>
        )}
        <Button
          className="btn btn-sm"
          type="submit"
          // onClick={()=>designationHandler()}
        >
          <MdIcons.MdAddToPhotos />
          Create Concrete Category
        </Button>
      </Form>
    </div>
  );
};

export default ConcreteCategory;
