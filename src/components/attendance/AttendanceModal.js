import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import fileSaver from "file-saver";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const AttendanceModal = (props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [attendance, setAttendance] = React.useState([]);
  const [labourer, setLabourer] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const Data = {
      siteid: props.siteid,
      labourerid: props.labourerId,
      fromdate: props.fromdate,
      todate: props.todate,
    };
    setLabourer(props.labourerId);
    if (props.labourerId != undefined) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/attendancemanage/attendance_detail`,
          Data,
          {
            headers: {
              Authorization: `token ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setLoading(true);
          if (res.data.status) {
            setAttendance(res.data.data);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    }
  }, [props]);

  const exportHandler = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/wagemanage/wages/attendence_detail/?labourerid=${props.labourerId}&siteid=${props.siteid}&fromdate=${props.fromdate}&todate=${props.todate}`,
        { responseType: "arraybuffer" }
      )
      .then((response) => {
        var blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "attendance.xlsx");
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Modal
        show={props.showAttendance}
        onHide={() => {
          props.setShowAttendance(false);
          setAttendance([]);
          setLabourer("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{`Labourer Id:${labourer}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Spinner
              animation="border"
              role="status"
              className="loadingSiteModal"
            ></Spinner>
          ) : null}
          <Button
            onClick={() => exportHandler()}
            style={{ marginBottom: "20px" }}
          >
            Export To Excel
          </Button>
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
                      Sl.No.
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
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                      }}
                    >
                      Check In
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                      }}
                    >
                      Check Out
                    </TableCell>
                    {/* <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                OT hours             </TableCell> */}
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
                  {attendance.length != 0 ? (
                    attendance
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        const { date, check_in } = row;
                        //  return info.map((item) => {
                        return (
                          <>
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={attendance.indexOf(row) + 1}
                            >
                              <TableCell>
                                {/* {row.indexOf(item) === 0
                              ? rows.indexOf(row) + 1
                              : null} */}
                                {attendance.indexOf(row) + 1}
                              </TableCell>
                              <TableCell>
                                {/* {info.indexOf(item) === 0 ? labourerid : null} */}
                                {date}
                              </TableCell>
                              <TableCell>{row.attendance}</TableCell>
                              <TableCell>{check_in}</TableCell>
                              <TableCell>{row.check_out}</TableCell>
                              {/* <TableCell>{row.ot_hours}</TableCell> */}
                              <TableCell>{row.work_hours}</TableCell>
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
                        {!loading ? "No Data Available" : ""}
                      </TableCell>
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AttendanceModal;
