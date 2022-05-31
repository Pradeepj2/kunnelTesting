import React, { useState } from "react";
import "./SignIn.css";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useHistory } from "react-router-dom";

const SignIn = (props) => {
  const [message, setMessage] = useState("");
  const history = useHistory();

  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  const onSubmit = (data) => {
    const url = process.env.REACT_APP_API_URL + "/app1/login";

    axios
      .post(url, data, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === true) {
          setMessage("");
          localStorage.setItem("user", response.data.user);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("permissions", response.data.permissions);
          // console.log(response.data.permissions);
          props.setToken(response.data.token);
          localStorage.setItem("userType", response.data.usertype);
          localStorage.setItem("role", response.data.role); //stores the user role in local storage
          //conditional redirecting to the pages accn to the user role/ user types
          if (
            response.data.role === "admin" ||
            response.data.role === "superadmin"
          )
            history.push("/usermanage");
          if (response.data.role === "Finance") history.push("/sitemanage");
          if (response.data.role === "OperationDept") {
            if (response.data.usertype === "ProjectManager") {
              history.push("/attendance");
            } else if (response.data.usertype === "SiteAssitant") {
              history.push("/labourmanage");
            } else if (response.data.usertype === "SiteEngineer") {
              history.push("/approvals");
            }
          }
        } else {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <section className="homeContainer">
        <div className="homeBodyContainer">
          <div className="homeLeftSection">
            <h1>
              <b>BUILD SOLID</b>
            </h1>
            <h5>
              <b>with men,materials and machines with tandem</b>
            </h5>
          </div>
          <div className="homeRightSection">
            <div className="signInForm">
              <div className="signInFormHead">
                <div className="logo"></div>
                <span>Kunnel Engineers & Contractors (P) Ltd.</span>
              </div>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formBasicUserName">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    ref={register({
                      required: true,
                    })}
                    name="username"
                  />
                </Form.Group>
                {errors.username?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>Username is required</i>
                    </small>
                  </p>
                )}
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    ref={register({
                      required: true,
                      minLength: 6,
                    })}
                    name="password"
                  />
                </Form.Group>
                {errors.password?.type === "minLength" && (
                  <p className="text-danger">
                    <small>
                      <i>Password Length must be atleast 6</i>
                    </small>
                  </p>
                )}
                <Button variant="primary" type="submit">
                  SignIn
                </Button>
                <p className="text-danger">
                  <small>
                    <i>{message}</i>
                  </small>
                </p>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
