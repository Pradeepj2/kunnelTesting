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

const LabourModal = (props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [labours, setLabours] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/labourermanage/labourer/`, {
        headers: {
          Authorization: `token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        // console.log(res.data.data);
        if (res.data.data) setLabours(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const submitHandler = (data) => {
    props.setShowLabour(false);
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {labours.length !== 0 ? (
                    labours
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, idx) => {
                        const { labourerid, name } = row;
                        //  return info.map((item) => {
                        return (
                          <>
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={idx}
                            >
                              <TableCell>
                                <input
                                  onChange={() =>
                                    props.setLabourerId(labourerid)
                                  }
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
                                {labourerid.split("LAB00")[1]}
                              </TableCell>
                              <TableCell>{name}</TableCell>
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

export default LabourModal;
