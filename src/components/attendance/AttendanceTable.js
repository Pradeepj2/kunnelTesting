import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { site_list } from "../../redux/actions/siteActions";
import fileSaver from "file-saver";
import { connect } from "react-redux";
import AttendanceModal from "./AttendanceModal";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Autocomplete } from "@mui/material";
import TextField from "@material-ui/core/TextField";
import SiteModal from "../utilModals/siteModal";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import { useSnackbar } from "notistack";
import { RiSurroundSoundLine } from "react-icons/ri";

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
    // textAlign: "center",
    // padding: "15px",
  },
});

const StickyHeadTable = ({ sites, site_list }) => {
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [show, setShow] = React.useState(false);
  const [labourerId, setLabourerId] = useState();
  const [siteCode, setSiteCode] = useState("");
  const [category, setCategory] = useState("");
  const [subcontractorShow, setSubContractoreShow] = useState(false);
  const [task, Settask] = useState([]);
  const [taskCode, SettaskCode] = useState();

  const date = new Date();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        site_list(response.data.data);
        setSiteid(response.data.data[0].site_code);
      })
      .catch((error) => console.log(error));
  }, [site_list]);

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const onSubmit = (data) => {
    setFromdate(data.from_date);
    setTodate(data.to_date);

    const Data1 = {
      siteid: siteid,
      fromdate: data.from_date,
      todate: data.to_date,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/attendancemanage/attendance_total_no_of_days`,
        Data1,
        {
          headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === true) {
          let finaldata = response.data.data.map((data, id) => {
            return {
              ...data,
              labourerid: data.labourerid.split("LAB00")[1],
            };
          });
          setAttendance(finaldata);
        } else {
          showsuccErr({ msg: response.data.message, variant: "error" });
        }
      })
      .catch((error) => showsuccErr({ msg: error, variant: "error" }));

    let Data2 = {
      from_date: data.from_date,
      to_date: data.to_date,
      task: taskCode,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/labourermanage/task_labour/`,
        Data2,
        {
          headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === true) {
          let finaldata = response.data.data.map((data, id) => {
            return {
              ...data,
              labourerid: data.labourerid.split("LAB00")[1],
            };
          });
          setAttendance(finaldata);
        } else {
          showsuccErr({ msg: response.data.message, variant: "error" });
        }
      })
      .catch((error) => alert(error));
  };

  //################## local states ##################//\
  const [showAttendance, setShowAttendance] = useState(false);
  const [siteid, setSiteid] = useState(sites.length ? sites[0].site_code : "");
  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [attendance, setAttendance] = useState([]);
  const [query, setQuery] = useState("");

  const viewHandler = () => {
    setShow(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const taskManger = (e) => {
    var str = e.target.innerText;
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== " ") {
        temp += str[i];
      } else {
        break;
      }
    }
    SettaskCode(parseInt(temp));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
            arr.push([val.task_code, val.task_name].join(" , "));
          });
          Settask(arr);
        } else {
          showsuccErr({ msg: "error Occured", variant: "error" });
        }
      })
      .catch((error) => {
        showsuccErr({ msg: error.messages, variant: "error" });
      });
  }, []);

  const exportHandler = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/wagemanage/wages/attendence_all_no_of_days/?siteid=${siteid}&fromdate=${fromdate}&todate=${todate}`,
        { responseType: "arraybuffer" }
      )
      .then((response) => {
        var blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "attendance.xlsx");
      });
  };

  const dateHandler = (fromdate) => {
    const date = new Date(fromdate);

    Date.prototype.removeDays = function (days) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() - days);
      return date;
    };

    const dateString = date.removeDays(1);

    var datee = new Date(dateString);

    let day = datee.getDate();
    if (day < 10) day = "0" + day;
    let month = datee.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let year = datee.getFullYear();

    return year + "-" + month + "-" + day;
  };

  // console.log(task);
  return (
    <>
      <AttendanceModal
        siteid={siteid}
        fromdate={fromdate}
        todate={todate}
        labourerId={labourerId}
        showAttendance={showAttendance}
        setShowAttendance={setShowAttendance}
      />
      <div className="subContentHeader" style={{ marginTop: "2%" }}>
        <span className="contentTitle">Past Report</span>
      </div>
      <hr className="seperationLine" />
      <SiteModal
        sites={sites}
        show={show}
        setShow={setShow}
        setSiteid={setSiteid}
        setSiteCode={setSiteCode}
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
                >
                  {/* <option key="0" value="">
                  Select
                </option>
                {!(Object.keys(sites).length === 0)
                  ? sites.map((site) => {
                      const { id, site_id } = site;
                      return (
                        <option key={id} value={site_id}>
                          {site_id}
                        </option>
                      );
                    })
                  : null} */}
                </Form.Control>
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

          <Form.Group as={Col} controlId="from_date">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              name="from_date"
              max={dateHandler(date.toISOString().split("T")[0])}
              ref={register({
                required: true,
              })}
            ></Form.Control>
            {errors.from_date?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
          <Form.Group as={Col} controlId="to_date">
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              name="to_date"
              max={dateHandler(date.toISOString().split("T")[0])}
              ref={register({
                required: true,
              })}
            ></Form.Control>
            {errors.to_date?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
          <Form.Group style={{ marginLeft: "5px", marginTop: "25px" }}>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                {category ? category : "Choose Category"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setCategory("");
                    setSubContractoreShow(false);
                  }}
                >
                  All
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setCategory("Kunnel");
                    setSubContractoreShow(false);
                  }}
                >
                  Kunnel
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setCategory("Union");
                    setSubContractoreShow(false);
                  }}
                >
                  Union
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setCategory("Casual");
                    setSubContractoreShow(false);
                  }}
                >
                  Casual
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setCategory("subcontractor");
                    setSubContractoreShow(true);
                  }}
                >
                  Sub Contractor
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Form.Row>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="primary" type="submit">
            Get Report
          </Button>
          <div style={{ width: "50%", marginRight: "10%" }}>
            <Form.Control
              className="Inputresponse"
              style={{ textAlign: "center" }}
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            type="submit"
            onClick={() => exportHandler()}
          >
            Export to Excel
          </Button>
        </div>
      </Form>

      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <colgroup>
              <col style={{ width: "4%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell className={classes.table}>Sl.No.</TableCell>
                <TableCell className={classes.table}>Site Name</TableCell>
                <TableCell className={classes.table}>Labour Id</TableCell>
                <TableCell className={classes.table}>Labour Name</TableCell>
                <TableCell className={classes.table}>Designation</TableCell>
                <TableCell className={classes.table}>Labour Category</TableCell>
                {/* <TableCell className={classes.table}>Task</TableCell> */}
                <TableCell className={classes.table}>From Date</TableCell>
                <TableCell className={classes.table}>To Date </TableCell>
                <TableCell className={classes.table}>Present Days</TableCell>
                {subcontractorShow ? (
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "navy",
                    }}
                  >
                    Subcontractor
                  </TableCell>
                ) : null}
                {/* <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >Total OT Hours
               
              </TableCell> */}
                <TableCell className={classes.table}>
                  Gross Work Hours
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!(Object.entries(attendance).length === 0) ? (
                attendance
                  .filter((row) =>
                    category === "subcontractor"
                      ? row.subcontractor !== null
                      : category === ""
                      ? true
                      : category !== "subcontractor" && category !== ""
                      ? row.category === category
                      : true
                  ) // filtering through different labour categories and sub contractor
                  .filter((obj) =>
                    JSON.stringify(obj)
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { labourerid, labourer_name, site_name } = row;
                    //  return info.map((item) => {
                    return (
                      <>
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={attendance.labourerid}
                        >
                          <TableCell>
                            {/* {row.indexOf(item) === 0
                              ? rows.indexOf(row) + 1
                              : null} */}
                            {attendance.indexOf(row) + 1}
                          </TableCell>
                          <TableCell>{site_name}</TableCell>
                          <TableCell
                            style={{ color: "navy" }}
                            onClick={() => {
                              setLabourerId(labourerid);
                              setShowAttendance(true);
                            }}
                          >
                            {labourerid}
                          </TableCell>
                          <TableCell>{labourer_name}</TableCell>
                          <TableCell>{row.desigination}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          {/* <TableCell>
                            <Autocomplete
                              disablePortal
                              onChange={(e) => taskManger(e)}
                              id="combo-box-demo"
                              options={task}
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
                          </TableCell> */}
                          {/* -------------------------------------------------------------------------------------------------------- */}

                          {/* <Form.Control name="PPP"></Form.Control> */}
                          <TableCell>{row.from_date}</TableCell>
                          <TableCell>{row.to_date}</TableCell>
                          {subcontractorShow ? (
                            <TableCell>{row.subcontractor}</TableCell>
                          ) : null}
                          <TableCell>{row.present_days}</TableCell>
                          {/* <TableCell>{row.total_ot_hours}</TableCell> */}
                          <TableCell>{row.total_working_hours}</TableCell>
                        </TableRow>
                      </>
                    );
                  })
              ) : (
                <TableRow>
                  {!attendance.length ||
                  !attendance.filter((obj) =>
                    JSON.stringify(obj)
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  ).length ? (
                    <TableCell
                      colSpan="8"
                      className="text-center text-danger p-5"
                    >
                      No Data Available!
                    </TableCell>
                  ) : null}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={attendance.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

const mapStateToProps = (state) => ({
  sites: state.sites,
});

export default connect(mapStateToProps, { site_list })(StickyHeadTable);
