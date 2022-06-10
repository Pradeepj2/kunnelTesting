import React, { useEffect, useState } from "react";
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
import { connect } from "react-redux";
import SiteModal from "../utilModals/siteModal";
import axios from "axios";
import { Form, Button, Col } from "react-bootstrap";
import CurrentAttendanceModal from "./CurrentAttendanceModal";
import Dropdown from "react-bootstrap/Dropdown";
import { useSnackbar } from "notistack";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = ({ sites }) => {
  const date = new Date();

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [labourerId, setLabourerId] = React.useState();
  const [siteCode, setSiteCode] = useState("");
  const [category, setCategory] = useState("");
  const [subcontractorShow, setSubContractoreShow] = useState(false);

  //################## local states ##################//\
  const [showAttendance, setShowAttendance] = useState(false);
  const [siteid, setSiteid] = useState(sites.length ? sites[0].site_code : "");
  const [fromdate, setFromdate] = useState(date.toISOString().split("T")[0]);
  const [todate, setTodate] = useState(date.toISOString().split("T")[0]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSiteid(sites.length ? sites[0].site_code : "");
  }, [sites]);

  const onSubmit = (data) => {
    const yourDate = new Date();

    var Data = {
      siteid: siteid,
      fromdate: yourDate.toISOString().split("T")[0],
      todate: yourDate.toISOString().split("T")[0],
      current_time: yourDate.toLocaleTimeString(undefined, { hour12: false }),
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/attendancemanage/attendance_active_hours`,
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const viewHandler = () => {
    setShow(true);
  };

  return (
    <>
      <div className="subContentHeader" style={{ marginTop: "2%" }}>
        <span className="contentTitle">Current Report</span>
      </div>
      <hr className="seperationLine" />

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
              disabled={true}
              value={date.toISOString().split("T")[0]}
              defaultValue={date.toISOString().split("T")[0]}
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
              value={date.toISOString().split("T")[0]}
              disabled={true}
              defaultValue={date.toISOString().split("T")[0]}
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
          {/* <Button variant="primary" type="submit">
            Export to Excel
          </Button> */}
        </div>
      </Form>
      <CurrentAttendanceModal
        siteid={siteid}
        fromdate={fromdate}
        todate={todate}
        labourerId={labourerId}
        showAttendance={showAttendance}
        setShowAttendance={setShowAttendance}
      />
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <colgroup>
              <col style={{ width: "2%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
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
                  Date
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
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Active Hours
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!(Object.entries(rows).length === 0) ? (
                rows
                  .filter((row) =>
                    category === "subcontractor"
                      ? row.subcontractor != null
                      : category === ""
                      ? true
                      : category != "subcontractor" && category != ""
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
                    const { labourerid, labourer_name, site_name } = row;
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
                          <TableCell>{site_name}</TableCell>
                          <TableCell
                            onClick={() => {
                              setLabourerId(labourerid);
                              setShowAttendance(true);
                            }}
                          >
                            {/* {info.indexOf(item) === 0 ? labourerid : null} */}
                            {labourerid}
                          </TableCell>
                          <TableCell>{labourer_name}</TableCell>
                          <TableCell>{row.designation}</TableCell>
                          <TableCell>{row.class}</TableCell>
                          <TableCell>{row.from_date}</TableCell>
                          {subcontractorShow ? (
                            <TableCell>
                              {row.subcontractor ? row.subcontractor : ""}
                            </TableCell>
                          ) : null}
                          <TableCell>{row.active_hours}</TableCell>
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
    </>
  );
};

const mapStateToProps = (state) => ({
  sites: state.sites,
});

export default connect(mapStateToProps)(StickyHeadTable);
