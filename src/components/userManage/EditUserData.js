import {
  Checkbox,
  FormControl,
  FormControlLabel,
  makeStyles,
  RadioGroup,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { edit_user_modal } from "../../redux/actions/fetchActions";
import { user_roles } from "../../redux/actions/userManageActions";
import SiteModal from "../utilModals/siteModal";
import { useSnackbar } from "notistack";

const EditUserData = ({
  edit_user_modal,
  user_roles,
  roles,
  editUserModal,
  editUserData,
  revalidate,

  sites,
}) => {
  //##################################DECLARING STATES HERE########################//
  const [userType, setUserType] = useState(editUserData.role);
  const [siteCode, setSiteCode] = useState();
  const [showSite, setShowSite] = React.useState(false);
  const [siteid, setSiteid] = useState("");
  const [element, setElement] = useState();
  const [allPermission, setAllPermission] = useState([]);

  const [Alluser, setAlluser] = useState();
  const [createuser, setcreateuser] = useState(false);
  const [edituser, setedituser] = useState(false);
  const [deleteuser, setdeleteuser] = useState(false);

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";

    for (let i = 0; i < str.length; i++) {
      if (str[i] != ",") {
        temp += str[i];
      } else {
        if (temp === "Alluser") setAlluser(true);
        else if (temp === "createuser") setcreateuser(true);
        else if (temp === "edituser") setedituser(true);
        else if (temp === "deleteuser") setdeleteuser(true);
        temp = "";
      }
    }
    if (temp === "Alluser") setAlluser(true);
    else if (temp === "createuser") setcreateuser(true);
    else if (temp === "edituser") setedituser(true);
    else if (temp === "deleteuser") setdeleteuser(true);
  });

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  useEffect(() => {
    // console.log(editUserData.permissions);
    if (editUserData.permissions) setAllPermission(editUserData.permissions);
    let tempRadio = [...RadioButton];
    tempRadio.map((data) => {
      data.Option.map((val) => {
        if (
          editUserData.permissions &&
          editUserData.permissions.some((pre) => pre === val.value)
        ) {
          val.isChecked = true;
        }
      });
    });
    setRadioButton(tempRadio);
    // console.log(typeof Object.values(editUserData.permissions), "initial");
  }, [editUserData.permissions]);

  const viewHandler = () => {
    setShowSite(true);
  };
  const useStyle = makeStyles({
    root: {
      marginRight: "50px",
    },
    choise: {
      fontWeight: "lighter",
    },
    Obj: {
      marginLeft: "18px",
    },
  });
  const classes = useStyle();

  //*****************************PPERMISSION ************************************* */
  const [RadioButton, setRadioButton] = useState([
    {
      lable: "Site Management",
      Option: [
        { value: "Allsite", title: "All" },
        { value: "createsite", title: "Create" },
        { value: "editsite", title: "Edit" },
        { value: "deletesite", title: "Delete" },
        { value: "viewsite", title: "View" },
      ],
    },
    {
      lable: " User Management",
      Option: [
        { value: "Alluser", title: "All" },
        { value: "createuser", title: "Create" },
        { value: "edituser", title: "Edit" },
        { value: "deleteuser", title: "Delete" },
        { value: "viewuser", title: "View" },
      ],
    },
    {
      lable: "Labour Management",
      Option: [
        { value: "AllLabour", title: "All" },
        { value: "createlabour", title: "Create" },
        { value: "editlabour", title: "Edit" },
        { value: "deletelabour", title: "Delete" },
        { value: "viewlabour", title: "View" },
      ],
    },
    {
      lable: "Attendence",
      Option: [
        { value: "Allattendence", title: "All" },
        { value: "currentattendence", title: "Current Attendence" },
        { value: "pastattendence", title: "Past Attendence" },
      ],
    },
    {
      lable: "Salary Managment",
      Option: [
        { value: "Allsalary", title: "All" },
        { value: "wagecodecreation", title: "Manage wage code" },
        { value: "weeklywage", title: "Weekly payment" },
        { value: "monthlywage", title: "Monthly payment" },
        {
          value: "WeeklyPaymentTaskCode",
          title: "Weekly payment-Task code wise",
        },
      ],
    },
    {
      lable: "Task",
      Option: [{ value: "task", title: "show" }],
    },
    {
      lable: "Labour Benefits",
      Option: [
        { value: "Allbenefits", title: "All" },
        { value: "advance", title: "Advance" },
        { value: "adjustmentcredits", title: "Adjustment credit" },
        { value: "miscellenousdebits", title: "Miscellenous Debit" },
      ],
    },
    {
      lable: "Compensation",
      Option: [{ value: "compensation", title: "show" }],
    },
    {
      lable: "Retention",
      Option: [{ value: "retention", title: "show" }],
    },
    {
      lable: "Arrears",
      Option: [{ value: "arrears", title: "show" }],
    },
    {
      lable: "OT",
      Option: [
        { value: "Allot", title: "All" },
        { value: "createot", title: "Create OT" },
        { value: "otapproval", title: "OT Approvals" },
        { value: "otauthorization", title: "OT Authorization" },
        { value: "otreport", title: "OT Reports" },
      ],
    },
    {
      lable: "Concrete",
      Option: [
        { value: "Allconcrete", title: "All" },
        { value: "createconcrete", title: "Create concrete" },
        { value: "concreteapproval", title: "Concrete Approval" },
        { value: "concreteauthorization", title: "Concrete Authorization" },
        { value: "concretereport", title: "Concrete Report" },
      ],
    },
    {
      lable: "Holiday",
      Option: [
        { value: "Allholiday", title: "All" },
        { value: "createholiday", title: "Create" },
        { value: "editholiday", title: "Edit" },
        { value: "deleteholiday", title: "Delete" },
        { value: "viewholiday", title: "View" },
      ],
    },
    {
      lable: "Setting",
      Option: [
        { value: "Allsetting", title: "All" },
        { value: "grade", title: "Create Designation & Grade" },
        { value: "type", title: "Create Conctrete Category & Type" },
        { value: "task", title: "Create Task" },
      ],
    },
  ]);

  // ************************************************************************************

  useEffect(() => {
    var element;
    if (userType === "admin") {
      element = (
        <Form.Control
          type="text"
          value="admin"
          name="user_type"
          ref={register({
            required: true,
          })}
        />
      );
    } else if (userType === "superadmin") {
      element = (
        <Form.Control
          type="text"
          value="superadmin"
          name="user_type"
          ref={register({
            required: true,
          })}
        />
      );
    } else if (userType === "Finance") {
      element = (
        <Form.Control
          type="text"
          value="Finance"
          placeholder="Enter usertype"
          name="user_type"
          ref={register({
            required: true,
          })}
        />
      );
    } else {
      element = (
        <Form.Control
          as="select"
          name="user_type"
          ref={register({
            required: true,
          })}
        >
          {!(roles.length === 0) ? (
            roles
              .filter((obj) => obj.id === 8 || obj.id === 2 || obj.id === 7)
              .map((role) => {
                return (
                  <option key={role.id} value={role.role}>
                    {role.role}
                  </option>
                );
              })
          ) : (
            <option></option>
          )}
        </Form.Control>
      );
    }
    setElement(element);
  }, [userType]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/app1/permission`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        user_roles(res.data);
      })
      .catch((error) => {
        alert("Error occured:", error);
      });

    if (editUserData) {
      setUserType(editUserData.role);
      setSiteCode(editUserData.site_code);
    }
  }, [user_roles, editUserData]);

  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  //deleting users
  const deleteUserHandler = (e) => {
    // setDeletion(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/app1/deleteuser/${editUserData.id}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        showsuccErr({ msg: "User Deleted", variant: "error" });
      });
  };

  // const changeHandler = (e) => {
  //   let temp = [];
  //   let flag = 0;
  //   if (allPermission.length != 0) {
  //     for (let i = 0; i < allPermission.length; i++) {
  //       // console.log(temp[i]);
  //       if (allPermission[i] != e.target.value) {
  //         temp = [...temp, allPermission[i]];
  //       } else {
  //         flag = 1;
  //       }
  //     }
  //     if (flag === 1) {
  //       setAllPermission(temp);
  //     } else {
  //       temp = [...temp, e.target.value];
  //       setAllPermission(temp);
  //     }
  //     // console.log(temp);
  //   }
  // };

  const clearCheckBox = () => {
    let tempobj = [...RadioButton];
    const temp = tempobj.map((obj) => {
      obj.Option.map((val) => (val?.isChecked ? (val.isChecked = false) : val));
    });
    // console.log(tempobj);
    setRadioButton(tempobj);
  };

  const changeHandler = ({ e, obj }) => {
    let temp = [];
    let flag = 0;
    if (allPermission.length != 0) {
      for (let i = 0; i < allPermission.length; i++) {
        if (allPermission[i] != e.target.value) {
          temp = [...temp, allPermission[i]];
        } else {
          flag = 1;
        }
      }
    }
    let example = [...RadioButton];
    example.map((data) => {
      if (data.lable === obj.lable) {
        if (data.Option[0].value === e.target.value) {
          data.Option.map((inner) => {
            inner.isChecked = e.target.checked;
            if (e.target.checked) {
              temp = [...temp, inner.value];
            } else {
              temp = temp.filter((v) => v != inner.value);
            }
          });
          setAllPermission(temp);
          return;
        } else {
          if (e.target.checked === false) {
            data.Option[0].isChecked = false;
            temp = temp.filter((val) => val != data.Option[0].value);
          }
          data.Option.map((inner) =>
            inner.value === e.target.value
              ? (inner.isChecked = e.target.checked)
              : inner
          );
        }
      }
    });
    setRadioButton(example);
    if (flag === 1) {
      setAllPermission(temp);
    } else {
      temp = [...temp, e.target.value];
      setAllPermission(temp);
    }
  };

  const onSubmit = (data) => {
    const role = {
      password: data.password,
      lastlogin: null,
      is_superuser: true,
      username: editUserData.username,
      first_name: data.first_name,
      last_name: data.last_name,
      email: "",
      is_staff: true,
      is_active: true,
      date_joined: new Date().toISOString(),
      user_type: data.user_type,
      emailid: data.emailid,
      active: true,
      role: data.role,
      site_code: siteCode,
      permissions: [...new Set(allPermission)],
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/app1/userupdate`, role, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res?.data?.status) {
          if (localStorage.getItem("user") === role.username) {
            localStorage.setItem("permissions", role.permissions);
          }
          showsuccErr({ msg: "User Updated", variant: "success" });

          setTimeout(() => {
            setSiteCode("");
            edit_user_modal({ show: false, data: [] });
          }, 1000);
          revalidate();
        } else {
          showsuccErr({ msg: res?.data?.message, variant: "error" });
        }
      })
      .catch((error) => {
        showsuccErr({ msg: JSON.stringify(error), variant: "error" });
      });
  };

  return (
    <>
      <SiteModal
        sites={sites}
        show={showSite}
        setShow={setShowSite}
        setSiteid={setSiteid}
        setSiteCode={setSiteCode}
      />

      <Modal
        show={editUserModal}
        onHide={() => {
          edit_user_modal({ show: false, data: [] });
          setUserType("");
          setSiteCode("");
          clearCheckBox();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col} controlId="first_name">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter firstname"
                  name="first_name"
                  defaultValue={editUserData.first_name}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.first_name?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="last_name">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter lastname"
                  name="last_name"
                  defaultValue={editUserData.last_name}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.last_name?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  disabled={true}
                  defaultValue={editUserData.username}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.username?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="emailid">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="emailid"
                  defaultValue={editUserData.emailid}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.emailid?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="role">
                <Form.Label>User Role</Form.Label>
                <Form.Control
                  onChange={(e) => setUserType(e.target.value)}
                  as="select"
                  name="role"
                  defaultValue={editUserData.role}
                  ref={register({
                    required: true,
                  })}
                >
                  {/* {!(roles.length === 0) ? (
                    roles
                      .filter((obj) => obj.id === 9 || obj.id === 5)
                      .map((role) => {
                        return (
                          <option key={role.id} value={role.role}>
                            {role.role}
                          </option>
                        );
                      })
                  ) : (
                    <option></option>
                  )} */}
                  {!(roles.length === 0) ? (
                    roles
                      .filter(
                        (obj) => obj.id === 9 || obj.id === 5 || obj.id === 1
                      )
                      .map((role) => {
                        return (
                          <option key={role.id} value={role.role}>
                            {role.role}
                          </option>
                        );
                      })
                  ) : (
                    <option></option>
                  )}
                </Form.Control>
                {errors.role?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="user_type">
                <Form.Label>User type</Form.Label>
                {userType === "admin" ||
                userType === "Finance" ||
                userType === "superadmin" ? (
                  <Form.Control
                    type="text"
                    placeholder="Enter usertype"
                    name="user_type"
                    value={userType}
                    ref={register({
                      required: true,
                    })}
                  />
                ) : (
                  <Form.Control
                    as="select"
                    name="user_type"
                    defaultValue={editUserData.user_type}
                    ref={register({
                      required: true,
                    })}
                  >
                    {!(roles.length === 0) ? (
                      roles
                        .filter(
                          (obj) => obj.id === 8 || obj.id === 2 || obj.id === 7
                        )
                        .map((role) => {
                          return (
                            <option key={role.id} value={role.role}>
                              {role.role}
                            </option>
                          );
                        })
                    ) : (
                      <option></option>
                    )}
                  </Form.Control>
                )}

                {errors.user_type?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>

            {/* <Form.Group as={Col} controlId="user_type">
                <Form.Label>User type</Form.Label>
                {element}
                {errors.user_type?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
            <Form.Row>
              <Form.Group as={Col} controlId="site">
                <Form.Label>Site Code</Form.Label>
                <div style={{ display: "flex" }}>
                  <div>
                    <Form.Control
                      style={{ width: "320px" }}
                      type="text"
                      name="site"
                      value={siteCode ? siteCode : editUserData.site_code}
                      disabled={true}
                      ref={register({
                        required: true,
                      })}
                    ></Form.Control>
                    {errors.site?.type === "required" && (
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
                      onClick={(e) => viewHandler()}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label> Permission Setting </Form.Label>
              </Form.Group>
            </Form.Row>
            {RadioButton.map((obj, idx) => {
              return (
                <div>
                  <FormControl className={classes.Obj}>
                    <Form.Label className={classes.lable}>
                      {obj.lable}
                    </Form.Label>
                    <RadioGroup row>
                      {obj.Option.map((opt, id) => {
                        return (
                          <FormControlLabel
                            className={classes.root}
                            onChange={(e) => changeHandler({ e: e, obj: obj })}
                            control={
                              <Checkbox
                                color="primary"
                                checked={opt.isChecked || false}
                                style={{ transform: "scale(0.8)" }}
                              />
                            }
                            label={
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  color: "gray",
                                }}
                              >
                                {opt.title}
                              </span>
                            }
                            value={opt.value}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                </div>
              );
            })}
            <Form.Row style={{ marginTop: "10px", marginLeft: "16px" }}>
              {edituser || Alluser ? (
                <Button type="submit" style={{ border: "blue" }}>
                  Update User
                </Button>
              ) : null}

              {deleteuser || Alluser ? (
                <Button
                  type="btn"
                  style={{
                    backgroundColor: "red",
                    border: "red",
                    marginLeft: "20px",
                  }}
                  onClick={(e) => deleteUserHandler(e)}
                >
                  Delete User
                </Button>
              ) : null}
            </Form.Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  editUserModal: state.editUserModal,
  editUserData: state.editUserData,
  roles: state.roles,
  sites: state.sites,
});
export default connect(mapStateToProps, { edit_user_modal, user_roles })(
  EditUserData
);
