import {
  Checkbox,
  FormControl,
  FormControlLabel,
  makeStyles,
  RadioGroup,
  // Snackbar,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import {
  toggle_user_create_model,
  user_roles,
} from "../../redux/actions/userManageActions.js";
import { site_list } from "../../redux/actions/siteActions";
// import Alert from "../Shared/Alert";
import SiteModal from "../utilModals/siteModal";

const useStyle = makeStyles({
  root: {
    marginRight: "47px",
  },
  choise: {
    fontWeight: "lighter",
  },
  Obj: {
    marginLeft: "14px",
  },
});
const CreateUser = ({
  toggle_user_create_model,
  user_roles,
  roles,
  modelUserCreate,
  revalidate,
  users,
  show,
  setShow,
  sites,
  site_list,
}) => {
  //##################################DECLARING STATES HERE########################//
  const [userType, setUserType] = useState("admin");
  const [matchError, setMatchError] = useState(false);
  const [showSite, setShowSite] = React.useState(false);
  const [siteCode, setSiteCode] = useState();
  const [siteid, setSiteid] = useState("");
  const [element, setElement] = useState();
  const [allPermission, setAllPermission] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const classes = useStyle();

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

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
      lable: "Labour Benefits",
      Option: [
        { value: "Allbenefits", title: "All" },
        { value: "advance", title: "Advance" },
        { value: "adjustmentcredits", title: "Adjustment credit" },
        { value: "miscellenousdebits", title: "Miscellenous Debit" },
      ],
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

  const viewHandler = () => {
    setShowSite(true);
  };

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
    } else if (userType === "admin") {
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
    // ************* here i have removed element dependency cause of infinite rendering ****************
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
        // alert("Error occured:", error);
        showsuccErr({ msg: error.message, variant: "error" });
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((responses) => {
        if (responses.status === 200) {
          site_list(responses.data.data);
        } else {
          alert(responses.data);
        }
      })
      .catch((err) => console.log(err));
  }, [user_roles, site_list]);

  const { register, handleSubmit, errors, control } = useForm({
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    const role = {
      // password: data.password,
      // last_login: null,
      // is_superuser: false,
      // is_staff: false,
      // is_active: true,
      // date_joined: new Date(),
      // username: data.username,
      // user_type: data.user_type,
      // email: data.emailid,
      // role: data.role,
      // emailid: data.emailid,
      // active: true,
      // first_name:
      //   data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1),
      // last_name:
      //   data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1),
      // site_code: siteCode,
      // permission: [],

      password: data.password,
      lastlogin: null,
      is_superuser: true,
      username: data.username,
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
      permissions: permissions,
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/app1/user`, role, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res?.data?.status) {
          showsuccErr({ msg: "User Created", variant: "success" });
          // setShowSuccess(true);
          setUserType("admin");
          setTimeout(() => {
            // setShowSuccess(false);
            toggle_user_create_model(false);
            setSiteCode("");
          }, 1000);
          revalidate();
        } else {
          showsuccErr({ msg: res?.data?.message, variant: "success" });
          // setError(res?.data?.message);
        }
      })
      .catch((error) => {
        showsuccErr({ msg: JSON.stringify(error), variant: "success" });

        // setError(JSON.stringify(error));
      });
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
    if (allPermission && allPermission.length > 0) {
      let tempArr = [];
      allPermission.map((item) => {
        let isItemExist = tempArr.includes(item);
        // console.log(isItemExist, item)
        if (!isItemExist) {
          tempArr.push(item);
        }
      });
      // console.log(tempArr)
      setPermissions(tempArr);
    }
  };

  const HideHandler = () => {
    toggle_user_create_model(false);
    setUserType("Finance");
  };

  const clearCheckBox = () => {
    let tempobj = [...RadioButton];
    const temp = tempobj.map((obj) => {
      obj.Option.map((val) => (val?.isChecked ? (val.isChecked = false) : val));
    });
    // console.log(tempobj);
    setRadioButton(tempobj);
  };

  const emailHandler = (e) => {
    setMatchError(users.some((ele) => ele.emailid === e.target.value));
  };
  // console.log(allPermission);
  return (
    <>
      <SiteModal
        sites={sites}
        show={showSite}
        setShow={setShowSite}
        setSiteid={setSiteid}
        setSiteCode={setSiteCode}
        // siteId={siteid}
      />
      <Modal
        show={modelUserCreate}
        onHide={() => {
          HideHandler();
          setSiteCode("");
          clearCheckBox();
        }}
        style={{ overflow: "auto" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
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
                  ref={register({
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors.username?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {errors.username?.type === "minLength" && (
                  <p className="text-danger">
                    <small>
                      <i>Username must be atleast of 6 characters</i>
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
                  onChange={(e) => emailHandler(e)}
                  ref={register({
                    required: true,
                    match: true,
                  })}
                />
                {errors.emailid?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {matchError && (
                  <p className="text-danger">
                    <small>
                      <i>Mail id already exists</i>
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
                  ref={register({
                    required: true,
                  })}
                >
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
                {element}
                {errors.user_type?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="password">
                <Form.Label>Create password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  ref={register({
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors.password?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-danger">
                    <small>
                      <i>Password Length must be atleast 6</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Controller
                as={
                  <Form.Group as={Col} controlId="site">
                    <Form.Label>Site Code</Form.Label>
                    <div style={{ display: "flex" }}>
                      <div>
                        <Form.Control
                          style={{ width: "320px" }}
                          type="text"
                          name="site"
                          value={siteCode}
                          disabled={true}
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
                }
                name="site"
                control={control}
                defaultValue=""
              />
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label> Permission Setting </Form.Label>
              </Form.Group>
            </Form.Row>

            {RadioButton.map((obj, idx) => {
              return (
                <FormControl className={classes.Obj} key={idx}>
                  <Form.Label className={classes.lable}>{obj.lable}</Form.Label>
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
                              style={{
                                transform: "scale(0.8)",
                              }}
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
              );
            })}
            <Form.Row>
              <Button type="submit">Create User</Button>
            </Form.Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  modelUserCreate: state.modelUserCreate,
  roles: state.roles,
  users: state.users,
  sites: state.sites,
});
export default connect(mapStateToProps, {
  toggle_user_create_model,
  user_roles,
  site_list,
})(CreateUser);
