import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as MdIcons from "react-icons/md";
import { connect } from "react-redux";
import {
  toggle_user_create_model,
  users_list,
} from "../../redux/actions/userManageActions.js";
import CreateUser from "./CreateUser";
import EditUserData from "./EditUserData";
import UserList from "./UserList";
import "./UserManage.css";
const UserManage = ({ toggle_user_create_model, users_list, users }) => {
  const [len, setLen] = useState(0);
  const [Alluser, setAlluser] = useState();
  const [createuser, setcreateuser] = useState(false);

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";

    for (let i = 0; i < str.length; i++) {
      if (str[i] !== ",") {
        temp += str[i];
      } else {
        if (temp === "Alluser") setAlluser(true);
        else if (temp === "createuser") setcreateuser(true);
        temp = "";
      }
    }
    if (temp === "Alluser") setAlluser(true);
    else if (temp === "createuser") setcreateuser(true);
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/app1/user`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.status === true) {
          users_list(res.data.data);
          setLen(res.data.data.length);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert("Error occured:", error);
      });
  }, [users_list]);

  function revalidateList() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/app1/user`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.status === true) {
          users_list(res.data.data);
          setLen(res.data.data.length);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        //   alert('Error occured:', error);
      });
  }

  //######################declaring states here#########################//
  const [query, setQuery] = React.useState("");
  const [show, setShow] = React.useState(false);

  return (
    <Fragment>
      <div className="subSectionContainer">
        <div className="title">
          <span>User Management</span>
          <hr className="seperationLine" />
        </div>
        <div className="subContent">
          <div
            className="subContentHeader"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="contentTitle">{`Users:${len}`}</div>
            <div style={{ width: "50%" }}>
              <Form.Control
                className="Inputresponse"
                style={{ textAlign: "center" }}
                type="text"
                placeholder="Search"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div>
              {createuser || Alluser ? (
                <Button
                  className="btn btn-sm"
                  onClick={() => toggle_user_create_model(true)}
                >
                  <MdIcons.MdAddToPhotos />
                  Add User
                </Button>
              ) : null}
            </div>
          </div>
          <hr className="seperationLine" />
          <UserList query={query} />
        </div>
      </div>
      <CreateUser
        revalidate={revalidateList}
        show={show}
        setShow={setShow}
        users_list={users_list}
      />
      <EditUserData revalidate={revalidateList} />
    </Fragment>
  );
};

export default connect(null, { toggle_user_create_model, users_list })(
  UserManage
);
