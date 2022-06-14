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
import Dropdown from "react-bootstrap/Dropdown";
import { useSnackbar } from "notistack";
import { salary_codes } from "../../redux/actions/siteActions";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const Arre = ({ sites, salaryCodes }) => {
  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const column = [
    { id: "id", lable: "Id" },
    { id: "name", lable: "Name" },
    { id: "total", lable: "Total" },
    { id: "daily_rate", lable: "Daily Rate" },
    { id: "ot_hrs", lable: "OT Hrs" },
    { id: "ot_amt", lable: "OT Amt" },
    { id: "new_rate", lable: "New Rate" },
    { id: "new_ot", lable: "New OT" },
    { id: "new_total", lable: "New Total" },
    { id: "arrears", lable: "Arrears" },
  ];

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
  const [list, setList] = useState([]);

  const [totalArrears, setTotalArrears] = useState("");

  //################## local states ##################//\
  const [showAttendance, setShowAttendance] = useState(false);
  const [siteid, setSiteid] = useState(sites.length ? sites[0].site_code : "");
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [query, setQuery] = useState();
  const [wageCode, setWageCode] = useState("");
  useEffect(() => {
    setSiteid(sites.length ? sites[0].site_code : "");
  }, [sites]);

  const onSubmit = () => {
    var Data = {
      siteid: siteid,
      fromdate: fromdate,
      todate: todate,
      wagecode: wageCode,
      category: category,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/wagemanage/arrears`, Data, {
        headers: {
          Authorization: `token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.status) {
          if (res.data.data.length) {
            setList(res.data.data);
            setTotalArrears(res.data.total_arrear);
            showsuccErr({ msg: res.data.message, variant: "success" });
          } else {
            showsuccErr({ msg: "empty", variant: "error" });
          }
          setSiteCode("");
          setSiteid("");
          setFromdate("");
          setTodate("");
          setWageCode("");
          setCategory("");
        } else {
          showsuccErr({ msg: res.data.message, variant: "error" });
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
    <div className="subContent">
      <div className="subContentHeader" style={{ marginTop: "2%" }}>
        <span style={{ fontSize: "1.3rem" }} className="contentTitle">
          Arrears
        </span>
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
          <Form.Group style={{ margin: "0px 20px 0px 20px" }} controlId="site">
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
          <Form.Group
            style={{ margin: "0px 20px 0px 20px" }}
            controlId="wagecode"
          >
            <Form.Label>Wage Code</Form.Label>
            <div style={{ display: "flex" }}>
              <div>
                <Form.Control
                  style={{ width: "250px" }}
                  as="select"
                  name="wagecode"
                  value={wageCode}
                  onChange={(e) => setWageCode(e.target.value)}
                  ref={register({
                    required: true,
                  })}
                >
                  {/* for (var i=0; i<salarycode.length; i++) {
                    var name = "Option "+i.wagecode;
                    var sel = document.getElementById("list");
                    sel.options[sel.options.length] = new Option(name,i); */}

                  <option key="0" value="">
                    Select
                  </option>
                  {!(salaryCodes.length === 0)
                    ? salaryCodes.map((site, idx) => {
                        {
                          return site.wagecode != null ? (
                            <option key={idx} value={site.wagecode}>
                              {site.wagecode}
                            </option>
                          ) : null;
                        }
                      })
                    : null}
                </Form.Control>
                {errors.wagecode?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </div>
            </div>
          </Form.Group>
          <Form.Group style={{ marginLeft: "5px", marginTop: "25px" }}>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                {category ? category : "Choose Category"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setCategory("Kunnel");
                  }}
                >
                  Kunnel
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setCategory("Union");
                  }}
                >
                  Union
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setCategory("Casual");
                  }}
                >
                  Casual
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="from_date">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              name="from_date"
              value={fromdate}
              onChange={(e) => setFromdate(e.target.value)}
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
              value={todate}
              onChange={(e) => setTodate(e.target.value)}
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
          <Form.Group as={Col}>
            {/* style={{ display: "flex", justifyContent: "space-between" }} */}
            <Button
              variant="primary"
              type="submit"
              style={{ margin: "25px 0px 0px 8px" }}
            >
              Get Report
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>

      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <colgroup>
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
                {column.map((obj) => {
                  return (
                    <TableCell
                      key={obj.id}
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                      }}
                    >
                      {obj.lable}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {list.length != 0 ? (
                list
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <>
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={rows.labourerid}
                        >
                          <TableCell>
                            {row.labourerid[0] === "L"
                              ? row.labourerid.split("LAB00")[1]
                              : row.labourerid}
                          </TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.total_daily_wage_amount}</TableCell>
                          <TableCell>{row.daily_rate}</TableCell>
                          <TableCell>{row.ot_hour}</TableCell>
                          <TableCell>{row.ot_amount}</TableCell>
                          <TableCell>{row.new_daily_rate}</TableCell>
                          <TableCell>{row.new_ot_rate}</TableCell>
                          <TableCell>{row.new_total}</TableCell>
                          <TableCell>{row.arrears}</TableCell>
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
          <h6
            style={{
              fontWeight: "400",
              display: "flex",
              flexDirection: "row-reverse",
              padding: "14px",
            }}
          >
            TOTAL : {totalArrears} Rs.{" "}
          </h6>
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
};

const mapStateToProps = (state) => ({
  sites: state.sites,
  salaryCodes: state.salaryCodes,
});

export default connect(mapStateToProps, salary_codes)(Arre);
