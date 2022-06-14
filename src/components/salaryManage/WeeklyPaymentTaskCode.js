import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import TaskCodeModal from "../utilModals/taskCodeModal";
import {
  payment_list,
  payment_list_view,
} from "../../redux/actions/fetchActions";
import PaymentListTable from "./PaymentListTable";
import SiteModal from "../utilModals/siteModal";
import { Spinner } from "react-bootstrap";
import WeeklyTable from "./WeeklyTable";
import { useSnackbar } from "notistack";

const columns = [
  { id: "task", label: "Task" },
  { id: "labourerid", label: "Labourer Id" },
  { id: "name", label: "Labour Name" },
  { id: "category", label: "Labour Category" },
  { id: "desigination", label: "Designation" },
  { id: "gross_pay", label: "Gross Wage" },
];

const WeeklyPaymentTaskCode = ({
  sites,
  payment_list,
  payment_list_view,
  paymentList,
}) => {
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  const useStyles = makeStyles({
    root: {
      width: "100%",
    },
    container: {
      maxHeight: 500,
    },
  });

  const classes = useStyles;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  //decalaring states
  const [show, setShow] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [siteid, setSiteid] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [query, setQuery] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [siteCode, setSiteCode] = useState("");
  const [labourerId, setLabourerId] = useState("");
  const [labourTaskList, setLabourTaskList] = useState([]);
  const [labourInfo, setLabourInfo] = useState(null);
  const [responce, setResponce] = useState([]);
  const [visited, setVisited] = useState(false);
  const [wage, setWage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    let tempwage = 0;
    responce &&
      responce
        .filter((obj) =>
          JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
        )
        ?.map((item, id) => {
          tempwage += parseInt(item.daily_rate);
        });

    setWage(tempwage);
  });

  const onSubmit = (data) => {
    let Data = {
      fromdate: fromDate,
      todate: dateHandler(fromDate),
      siteid: siteid,
    };

    if (data != Data) {
      setVisited(false);
      setResponce([]);
    }

    setData(Data);
    var arr = [];
    if (!visited) setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/wagemanage/weeksitecode_grosswage`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.data.length > 0 && res.data.status) {
          payment_list(res.data.data);
          payment_list_view({
            site: data.site,
            from_date: data.from_date,
            to_date: data.to_date,
          });

          // if (!visited) {
          let n = res.data.data.length;
          res.data.data.map((obj, id) => {
            let dataApi = { ...Data, labourerid: obj.labourerid };
            axios
              .post(
                `${process.env.REACT_APP_API_URL}/wagemanage/weeksitecode_grosswage_detail`,
                dataApi,
                {
                  headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then((res) => {
                if (res.data.status) {
                  arr.push(res.data);
                } else {
                  alert(res.message);
                }
              })
              .then((res) => {
                n--;
                if (n === 0) {
                  setVisited(true);
                  showsuccErr({
                    msg: "data fetch successfully",
                    variant: "success",
                  });
                  setLoading(false);
                  setResponce(arr);
                  arr = [];
                }
              })
              .catch((error) => {
                showsuccErr({ msg: error, variant: "error" });
              });
          });
          // }
        } else {
          if (!res.data.data.length)
            showsuccErr({ msg: "No responce", variant: "error" });
          else showsuccErr({ msg: res.data.message, variant: "error" });
          setLoading(false);
        }
      })
      .catch((error) => {
        showsuccErr({ msg: error, variant: "error" });
      });
  };

  // useEffect(() => {
  //   var arr = [...responce];
  //   paymentList.map((obj, id) => {
  //     let dataApi = { ...data, labourerid: obj.labourerid };
  //     axios
  //       .post(
  //         `${process.env.REACT_APP_API_URL}/wagemanage/weeksitecode_grosswage_detail`,
  //         dataApi,
  //         {
  //           headers: {
  //             Authorization: `Token ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         if (res.data.status) {
  //           arr.push(res.data);
  //         } else {
  //           alert(res.message);
  //         }
  //       })
  //       .catch((error) => {
  //         alert(error);
  //       });
  //   });
  //   setResponce(arr);
  // }, [paymentList]);

  const revalidate = () => {
    let Data = { ...data, siteid: siteid };
    axios
      .post(
        //`${process.env.REACT_APP_API_URL}/wagemanage/wages/mark_payments/?siteid=` +
        `${process.env.REACT_APP_API_URL}/wagemanage/weekWage`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          payment_list(res.data.data);
          payment_list_view({
            site: data.site,
            from_date: data.from_date,
            to_date: data.to_date,
          });
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const viewHandler = () => {
    setShow(true);
  };

  //handling max date
  const dateHandler = (fromdate) => {
    const date = new Date(fromdate);

    Date.prototype.addDays = function (days) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    const dateString = date.addDays(6);

    var datee = new Date(dateString);

    let day = datee.getDate();
    if (day < 10) day = "0" + day;
    let month = datee.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let year = datee.getFullYear();
    return year + "-" + month + "-" + day;
  };

  //   const exportHandler = () => {
  //     axios
  //       .get(
  //         `${
  //           process.env.REACT_APP_API_URL
  //         }/wagemanage/wages/weekwagereport/?siteid=${siteid}&fromdate=${fromDate}&todate=${dateHandler(
  //           fromDate
  //         )}`,
  //         { responseType: "arraybuffer" }
  //       )
  //       .then((response) => {
  //         var blob = new Blob([response.data], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });
  //         fileSaver.saveAs(blob, "weekwagereport.xlsx");
  //       });
  //   };

  const onView = (labourerid) => {
    getlabourDetails(labourerid);
    setShowTask(true);
  };

  const getlabourDetails = (labourerId) => {
    const Data = {
      labourerid: labourerId,
      siteid: siteid,
      fromdate: fromDate,
      todate: dateHandler(fromDate),
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/wagemanage/weeksitecode_grosswage_detail`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          setLabourTaskList(res.data.data);
          setLabourInfo(res.data);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <>
      <SiteModal
        //query={props.query}
        sites={sites}
        show={show}
        setShow={setShow}
        setSiteid={setSiteid}
        setSiteCode={setSiteCode}
      />
      <TaskCodeModal
        //query={props.query}
        show={showTask}
        labourerid="Pradeep"
        setShowTask={setShowTask}
        setSiteid={setSiteid}
        labourInfo={labourInfo}
        labourTaskList={labourTaskList}
      />
      {loading ? (
        <Spinner
          style={{ left: "50vw" }}
          animation="border"
          role="status"
          className="loading"
        ></Spinner>
      ) : null}
      <Form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <Form.Row>
          <Form.Group as={Col} controlId="siteid">
            <Form.Label>Site Code</Form.Label>
            <div style={{ display: "flex" }}>
              <div>
                <Form.Control
                  style={{ width: "250px" }}
                  type="text"
                  name="siteid"
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
                {errors.siteid?.type === "required" && (
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

          <Form.Group as={Col} controlId="fromdate">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              name="fromdate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              ref={register({
                required: true,
              })}
            ></Form.Control>
            {errors.fromdate?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
          <Form.Group as={Col} controlId="todate">
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              name="todate"
              value={dateHandler(fromDate)}
              ref={register({
                required: true,
              })}
            ></Form.Control>
            {errors.todate?.type === "required" && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
        </Form.Row>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button variant="primary" type="submit">
            Generate
          </Button>
          <div style={{ width: "50%", marginTop: "14px" }}>
            <Form.Control
              style={{ textAlign: "center" }}
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </Form>
      <br />
      {/* <PaymentListTable
        query={query}
        revalidate={revalidate}
        loading={loading}
        setLoading={setLoading}
      /> */}
      {/* <WeeklyTable query={query} /> */}
      <Paper className={classes.root} style={{ marginTop: "20px" }}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "navy",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {responce &&
                responce
                  .filter((obj) =>
                    JSON.stringify(obj)
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((item, id) => {
                    return (
                      <TableRow key={id}>
                        <TableCell style={{ textAlign: "center" }}>
                          <Button onClick={() => onView(item.labourerid)}>
                            {" "}
                            View
                          </Button>
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {item.labourerid}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {item.labourer_name}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {item.category}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {item.designation}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {item.daily_rate}
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
            {/* <TableBody>
              {paymentList &&
                paymentList.map((item) => {
                  return (
                    <TableRow>
                      <TableCell style={{ textAlign: "center" }}>
                        <Button onClick={() => onView(item.labourerid)}>
                          {" "}
                          View
                        </Button>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.labourerid}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.name}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.category}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.desigination}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.gross_wage}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody> */}
          </Table>
          {responce.length ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "19px 47px 0px 20px",
              }}
            >
              <h3 style={{ fontWeight: "330", fontSize: "1.33rem" }}>
                Grand Total
              </h3>
              <h3 style={{ fontWeight: "430", fontSize: "1.33rem" }}>{wage}</h3>
            </div>
          ) : null}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={responce.length}
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
  paymentList: state.paymentList,
});
export default connect(mapStateToProps, { payment_list, payment_list_view })(
  WeeklyPaymentTaskCode
);
