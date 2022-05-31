//some comments are actually code written previously and are kept that way so that they can be used in future

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./Approvals.css";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import axios from "axios";
import fileSaver from "file-saver";
import ApprovalListModal from "./ApprovalListModal";

// id,type,labourer_id,amount,deduction_percent,status,applied_date

const columns = [
  { id: "labourerid", label: "Labour Id" },
  { id: "name", label: "Labour Name" },
  { id: "designation", label: "Designation" },
  { id: "category", label: "Labour Category" },
  { id: "fromdate", label: "From Date" },
  { id: "todate", label: "To Date" },

  {
    id: "total_ot_hours",
    label: "Total OT Hours",
    minWidth: 170,
    format: (value) => value.slice(0, 10).split("-").reverse().join("-"),
  },
  { id: "total_ot_amount", label: "Total OT Amount" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = (props) => {
  const rows = props.list;

  const classes = useStyles();

  //##############decalaring states#####################
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [show, setShow] = React.useState(false);
  const [labourerid, setLabourerid] = React.useState();
  const [selected, setSelected] = React.useState(false);

  // const approve = (data) => {
  //   let Data = {
  //     approved_list: [data],
  //   };
  //   if (localStorage.getItem('role') === 'ProjectManager') {
  //     axios
  //       .post(
  //         `${process.env.REACT_APP_API_URL}/approvals/otapproval/project_manager_ot_approval/`,
  //         Data,
  //         {
  //           headers: {
  //             Authorization: `Token ${localStorage.getItem('token')}`,
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         if (response.data.status === true) {
  //           alert(response.data.message);
  //           window.location.reload();
  //         } else {
  //           alert(response.data.message);
  //         }
  //       })
  //       .catch((error) => {
  //         alert(`${error}`);
  //       });
  //   } else {
  //     axios
  //       .post(
  //         `${process.env.REACT_APP_API_URL}/approvals/otapproval/site_engineer_ot_approval/`,
  //         Data,
  //         {
  //           headers: {
  //             Authorization: `Token ${localStorage.getItem('token')}`,
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         if (response.data.status === true) {
  //           alert(response.data.message);
  //           window.location.reload();
  //         } else {
  //           alert(response.data.message);
  //         }
  //       })
  //       .catch((error) => {
  //         alert(`${error}`);
  //       });
  //   }
  // };
  // const nonOt = (data) => {
  //   let Data = {
  //     nonot_list: [data],
  //   };

  //   axios
  //     .post(
  //       `${process.env.REACT_APP_API_URL}/approvals/otapproval/non_ot_list_update/`,
  //       Data,
  //       {
  //         headers: {
  //           Authorization: `Token ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       if (response.data.status === true) {
  //         alert(response.data.message);
  //         window.location.reload();
  //       } else {
  //         alert(response.data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       alert(`${error}`);
  //     });
  // };
  // const secondShift = (data) => {
  //   let Data = {
  //     secondshift: [data],
  //   };

  //   axios
  //     .post(
  //       `${process.env.REACT_APP_API_URL}/approvals/otapproval/secondshift_update/`,
  //       Data,
  //       {
  //         headers: {
  //           Authorization: `Token ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       if (response.data.status === true) {
  //         alert(response.data.message);
  //         window.location.reload();
  //       } else {
  //         alert(response.data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       alert(`${error}`);
  //     });
  // };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //exporting to excel
  const exportHandler = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/wagemanage/wages/total_ot/?fromdate=${props.start}&todate=${props.end}&siteid=${props.siteid}`,
        { responseType: "arraybuffer" }
      )
      .then((response) => {
        var blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "otapproval.xlsx");
      });
  };

  //handling approval
  const approvalHandler = (id) => {
    const Data = {
      approved_list: id,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/approvals/otapproval/project_manager_ot_approval/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === true) {
          alert(response.data.message);
          setSelected(false);
          props.revalidate();
        } else {
          alert(response.data.message);
          setSelected(true);
        }
      })
      .catch((error) => {
        alert(`${error}`);
        setSelected(true);
      });
  };

  return (
    <>
      <ApprovalListModal
        show={show}
        setShow={setShow}
        Data={props.Data}
        labourerid={labourerid}
        start={props.start}
        end={props.end}
        siteid={props.siteid}
        revalidate={props.revalidate}
      />
      <div className="title" style={{ fontSize: "15px", marginTop: "1.5em" }}>
        <span>OT Approvals</span>
        <hr className="seperationLine" />
      </div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            aria-label="sticky table"
            size="small"
            className="mt-3"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  key="sl.no"
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Sl.No
                </TableCell>
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
                <TableCell
                  key="status"
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                    textAlign: "center",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  key="options"
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Options
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!(rows.length === 0) ? (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                        <TableCell key="sl.no">
                          {rows.indexOf(row) + 1}
                        </TableCell>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align="center">
                              {column.id === "applied_date"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <select
                            className="select"
                            onChange={() =>
                              approvalHandler(row.id_for_approval)
                            }
                          >
                            <option
                              value="approved"
                              selected={row.status === "approved"}
                            >
                              Approved
                            </option>
                            <option
                              value="disapproved"
                              selected={
                                row.status === "disapproved" || selected
                              }
                              disabled
                            >
                              Disapproved
                            </option>
                          </select>
                        </TableCell>
                        <TableCell
                          key="options"
                          style={{ color: "darkblue" }}
                          onClick={() => {
                            setLabourerid(row.labourerid);
                            setShow(true);
                          }}
                        >
                          {/* <Button onClick={() => approve(row.id)}>Approve</Button>
                        <Button onClick={() => nonOt(row.id)}>
                          Non OT
                        </Button>{' '}
                        <Button onClick={() => secondShift(row.id)}>
                          Second shift
                        </Button>
                      */}
                          View
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="8"
                    className="text-center text-danger p-5"
                  >
                    No Data Available!
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
      <Button
        style={{ marginTop: "2em" }}
        onClick={() => (props.list.length ? exportHandler() : null)}
      >
        Export To Excel
      </Button>
    </>
  );
};

const mapStateToProps = (state) => ({
  otList: state.otList,
});

export default connect(mapStateToProps)(StickyHeadTable);
