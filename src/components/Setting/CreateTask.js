import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Form } from "react-bootstrap";
import RemoveButton from "@material-ui/icons/Remove";
import AddButton from "@material-ui/icons/Add";
import { useSnackbar } from "notistack";
import axios from "axios";

const CreateTask = () => {
  const [inp, setInpt] = useState([
    {
      task_name: "",
      task_code: "",
      tasknameError: false,
      taskcodeError: false,
    },
  ]);
  const [dis, setDis] = useState(true);
  const [task, Settask] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const useStyle = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
      },
    },
    btn: {
      margin: theme.spacing(1),
      marginTop: theme.spacing(2),
    },
    container: {
      display: "flex",
      flexDirection: "row",
    },
    danger: {
      marginLeft: "0.6rem",
      color: "red",
    },
  }));

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/labourermanage/multipletask/ `, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status) {
          Settask(res.data);
        } else {
          showsuccErr({ msg: "error Occured", variant: "error" });
        }
      })
      .catch((error) => {
        showsuccErr({ msg: error.messages, variant: "error" });
      });
  }, []);

  const SubmitHandle = (e) => {
    e.preventDefault();

    let obj = {};
    let data = [];
    inp.map((val) => {
      val.task_code = parseInt(val.task_code);
      data.push(val);
    });

    obj = { data };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/labourermanage/multipletask/ `,
        obj,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res?.data?.status) {
          showsuccErr({ msg: "Task Created", variant: "success" });
        } else {
          showsuccErr({ msg: "error Occured", variant: "error" });
        }
      })
      .catch((error) => {
        showsuccErr({ msg: error.messages, variant: "error" });
      });

    setInpt([{ task_name: "", task_code: "" }]);
  };
  const changeHandlerEvent = (e, idx) => {
    let arr = [...inp];
    arr[idx][e.target.name] = e.target.value;
    setInpt(arr);
  };

  const increseField = () => {
    let arr = [
      ...inp,
      {
        task_name: "",
        task_code: "",
        tasknameError: false,
        taskcodeError: false,
      },
    ];
    setInpt(arr);
  };
  const removeField = (idx) => {
    let arr = [...inp];
    arr.splice(idx, 1);
    setInpt(arr);
  };

  useEffect(() => {
    let flag = 0;
    inp.map((data, id) => {
      if (data.task_code === "" || data.task_name === "") flag = 1;
    });
    if (flag === 0) setDis(false);
    else if (flag === 1) setDis(true);
  });
  const classes = useStyle();

  const taskCodeValidation = (e, idx) => {
    let check = task.some((ele) => ele.task_code === parseInt(e.target.value));
    let arr = [...inp];

    if (check) {
      arr[idx].taskcodeError = true;
    } else {
      arr[idx].taskcodeError = false;
    }
    setInpt(arr);
  };

  const taskNameValidation = (e, idx) => {
    let check = task.some((ele) => ele.task_name === e.target.value);
    let arr = [...inp];
    if (check) {
      arr[idx].tasknameError = true;
    } else {
      arr[idx].tasknameError = false;
    }
    setInpt(arr);
  };
  return (
    <>
      <h3 style={{ padding: "10px", marginTop: "10px" }}>Create New Task</h3>
      <Form className={classes.root} onSubmit={SubmitHandle}>
        {inp.map((data, idx) => {
          return (
            <div key={idx} className={classes.container}>
              <div style={{ width: "200px" }}>
                <TextField
                  label="Add Task code"
                  autoComplete="off"
                  variant="filled"
                  name="task_code"
                  value={data.task_code}
                  onChange={(e) => {
                    changeHandlerEvent(e, idx);
                    taskCodeValidation(e, idx);
                  }}
                />
                {data.taskcodeError && (
                  <span className={classes.danger}>
                    <small>
                      <i>Task code already exists</i>
                    </small>
                  </span>
                )}
              </div>
              <div style={{ width: "200px" }}>
                <TextField
                  label="Add Task name"
                  name="task_name"
                  autoComplete="off"
                  value={data.task_name}
                  variant="filled"
                  onChange={(e) => {
                    changeHandlerEvent(e, idx);
                    taskNameValidation(e, idx);
                  }}
                />
                {data.tasknameError && (
                  <span className={classes.danger}>
                    <small>
                      <i>Task name already exists</i>
                    </small>
                  </span>
                )}
              </div>
              <div>
                <IconButton>
                  <AddButton onClick={increseField} />
                </IconButton>
                <IconButton>
                  <RemoveButton onClick={() => removeField(idx)} />
                </IconButton>
              </div>
            </div>
          );
        })}
        <Button
          variant="primary"
          disabled={dis}
          className={classes.btn}
          type="submit"
        >
          Create
        </Button>
      </Form>
    </>
  );
};

export default CreateTask;
