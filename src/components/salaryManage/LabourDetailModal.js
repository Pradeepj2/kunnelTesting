import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const LabourDetailModal = (props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [labours, setLabours] = useState([]);
  const [data, setData] = useState();
  useEffect(() => {
    const Data = {
      siteid: props.siteid,
      fromdate: props.fromdate,
      todate: props.todate,
    };
    if (props.todate) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/wagemanage/weekWage`, Data, {
          headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.data.status) {
            setLabours(res.data.data);
          }
        });
    }
  }, [props]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const submitHandler = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/wagemanage/weekly_daily/pay/`,
        data,
        {
          headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          props.setShowLabour(false);
        }
      });
  };

  return (
    <>
      <Modal
        show={props.showLabour}
        onHide={() => {
          props.setShowLabour(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{`Select Labour`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                      }}
                    >
                      Select
                    </TableCell>
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
                      LabourId
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                      }}
                    >
                      Gross Wage
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {labours.length != 0 ? (
                    labours
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        const { labourerid, name } = row;
                        //  return info.map((item) => {
                        return (
                          <>
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.code}
                            >
                              <TableCell>
                                <input
                                  onChange={(e) => {
                                    var data = {
                                      labourer_id:
                                        labourerid.split("0")[
                                          labourerid.split("0").length - 1
                                        ],
                                      from_date: props.fromdate,
                                      to_date: props.todate,
                                      site_id:
                                        props.siteid.split("0")[
                                          props.siteid.split("0").length - 1
                                        ],
                                      name: row.name,
                                      designation: row.desigination,
                                      attendance: row.attendance,
                                      basic_pay: row.basic_pay,
                                      daily_allowence: row.daily_allowence,
                                      gross_wage: row.weekwagetotal,
                                      daily_rate: row.dailyrate,
                                      paid_date: props.paidDate,
                                    };
                                    setData(data);
                                  }}
                                  type="checkbox"
                                />
                              </TableCell>
                              <TableCell>
                                {/* {row.indexOf(item) === 0
                              ? rows.indexOf(row) + 1
                              : null} */}
                                {labours.indexOf(row) + 1}
                              </TableCell>
                              <TableCell>
                                {/* {info.indexOf(item) === 0 ? labourerid : null} */}
                                {labourerid}
                              </TableCell>
                              <TableCell>{name}</TableCell>
                              <TableCell>{row.weekwagetotal}</TableCell>
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
              count={labours.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <Button
            style={{ backgroundColor: "navy", marginTop: "10px" }}
            onClick={(e) => submitHandler()}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LabourDetailModal;
