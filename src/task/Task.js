import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import SiteModal from "../components/utilModals/siteModal";
import { Form } from "react-bootstrap";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import { makeStyles } from "@material-ui/core";
import { Autocomplete } from "@mui/material";
import { TextField } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Button, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

function Task({ sites }) {
  let date = new Date();
  const [siteCode, setSiteCode] = useState("");
  const [show, setShow] = React.useState(false);
  const [siteid, setSiteid] = useState(sites.length ? sites[0].site_code : "");
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [message, setMessage] = React.useState("");
  const [labourerId, setLabourerId] = React.useState();
  const [category, setCategory] = useState("");
  const [subcontractorShow, setSubContractoreShow] = useState(false);
  const [taskOptions, SettaskOptions] = useState([]);
  const [allTasksData, setAllTasksData] = useState([]);
  const [showAttendance, setShowAttendance] = useState(false);
  const [query, setQuery] = useState("");
  const useStyles = makeStyles({
    root: {
      width: "100%",
    },
    container: {
      maxHeight: 500,
    },
    table: {
      fontWeight: "bold",
      color: "white",
      backgroundColor: "navy",
    },
    "&. MuiAutocomplete-endAdornment": {
      right: "-17px",
      top: "calc(50% - 27px)",
    },
  });

  const classes = useStyles;

  useEffect(() => {
    setSiteid(sites.length ? sites[0].site_code : "");
  }, [sites]);

  const viewHandler = () => {
    setShow(true);
    setRows([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const onSubmit = (data) => {
    const Data = {
      siteid: siteid,
      date: data.dateValue,
      // fromdate: data.dateValue,
      // current_time: new Date().toLocaleTimeString(undefined, { hour12: false }),
    };
    axios
      .post(
        // `http://127.0.0.1:8000/attendancemanage/labour_task`,
        `${process.env.REACT_APP_API_URL}/attendancemanage/labour_task`,
        // `${process.env.REACT_APP_API_URL}/attendancemanage/attendance_active_hours`,
        Data,
        {
          headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          let finaldata = res.data.data.map((data, id) => {
            return {
              ...data,
              labourerid: data.labourerid.split("LAB00")[1],
            };
          });
          setRows(finaldata);
        } else {
          showsuccErr({ msg: res.data.message, variant: "error" });
          setRows([]);
        }
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/labourermanage/multipletask/ `, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status) {
          let arr = [];

          res.data.map((val) => {
            console.log(val);
            arr.push([val.task_code, val.task_name].join(" , "));
          });
          SettaskOptions(arr);
          setAllTasksData(res.data);
        } else {
          showsuccErr({ msg: "error Occured", variant: "error" });
        }
      })
      .catch((error) => {
        showsuccErr({ msg: error.messages, variant: "error" });
      });
  }, []);

  const taskManger = (e, obj) => {
    var str = e.target.innerText;
    let temp = "";
    if (str && str.length > 0) {
      for (let i = 0; i < str.length; i++) {
        if (str[i] !== " ") {
          temp += str[i];
        } else {
          break;
        }
      }
    }

    const dummyObj = { ...obj, task_code: parseInt(temp) };
    let tsk_id;
    if (str && str.length > 0) {
      if (allTasksData) {
        allTasksData.map((item) => {
          if (item.task_code === parseInt(e.target.innerText.split(",")[0])) {
            tsk_id = item.id;
          }
        });
      }
    }
    const data = { id: obj.id, taskid: tsk_id };

    // const finalData
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/attendancemanage/labour_task `,
        data,
        {
          headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status === true) {
          showsuccErr({ msg: "Saved", variant: "success" });
        } else if (res.data.status === false) {
          showsuccErr({ msg: res.data.message, variant: "error" });
        }
      });

    // SettaskCode(parseInt(temp));
  };
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });
  return (
    <div className="subContent">
      <div className="subContentHeader" style={{ marginTop: "2%" }}>
        <span className="contentTitle" style={{ fontSize: "1.3rem" }}>
          Task code and Task name
        </span>
      </div>
      <hr className="seperationLine" />
      {/* {console.log(sites, "SITES")} */}
      <SiteModal
        sites={sites}
        show={show}
        setShow={setShow}
        setSiteCode={setSiteCode}
        setSiteid={setSiteid}
      />
      <Form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "2%" }}>
        <Form.Row>
          <Form.Group as={Col} controlId="site">
            <Form.Label>Site Code</Form.Label>
            <div style={{ display: "flex" }}>
              <div>
                <Form.Control
                  style={{ width: "250px" }}
                  type="text"
                  name="site"
                  value={siteCode}
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
          <Form.Group as={Col} controlId="dateValue">
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="Date"
              name="dateValue"
              defaultValue={date.toISOString().split("T")[0]}
              max={date.toISOString().split("T")[0]}
              ref={register({
                required: true,
              })}
            />
          </Form.Group>
          <Form.Group as={Col} style={{ marginLeft: "5px", marginTop: "25px" }}>
            <Button type="submit" variant="primary">
              Generate
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>

      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <colgroup>
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
              {/* <col style={{ width: "2%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} /> */}
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Sl.No.
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Site Name
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Labour Id
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Labour Name
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Designation
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Labour Category
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Task
                </TableCell>
                {subcontractorShow ? (
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "navy",
                    }}
                  >
                    Sub Contractor
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {!(Object.entries(rows).length === 0) ? (
                rows
                  .filter((row) =>
                    category === "subcontractor"
                      ? row.subcontractor !== null
                      : category === ""
                      ? true
                      : category !== "subcontractor" && category !== ""
                      ? row.class === category
                      : true
                  ) // filtering through different labour categories and sub contractor
                  .filter((obj) =>
                    JSON.stringify(obj)
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    //  return info.map((item) => {
                    return (
                      <>
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={rows.labourerid}
                        >
                          <TableCell>
                            {/* {row.indexOf(item) === 0
                              ? rows.indexOf(row) + 1
                              : null} */}
                            {rows.indexOf(row) + 1}
                          </TableCell>
                          <TableCell>{row.sitename}</TableCell>
                          <TableCell
                            onClick={() => {
                              setLabourerId(row.labourerid);
                              setShowAttendance(true);
                            }}
                          >
                            {row.labourerid}
                          </TableCell>
                          <TableCell>{row.labourname}</TableCell>
                          <TableCell>{row.labour_category}</TableCell>
                          <TableCell>{row.labour_class}</TableCell>
                          <TableCell>
                            <Autocomplete
                              disablePortal
                              onChange={(e) => taskManger(e, row)}
                              id="combo-box-demo"
                              options={taskOptions}
                              defaultValue={
                                row.taskid !== null
                                  ? `${row.task_code}, ${row.task_name}`
                                  : ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  style={{
                                    width: "200px",
                                    textAlign: "center",
                                  }}
                                  {...params}
                                  label="Select Task"
                                />
                              )}
                            />
                          </TableCell>
                          {subcontractorShow ? (
                            <TableCell>
                              {row.subcontractor ? row.subcontractor : ""}
                            </TableCell>
                          ) : null}
                        </TableRow>
                      </>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="8"
                    className="text-center text-danger p-5"
                  >
                    {message ? message : "No data available"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

const mapStateToProps = (state) => ({
  sites: state.sites,
});

export default connect(mapStateToProps)(Task);
