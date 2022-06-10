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
import TimePicker from "react-time-picker";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const ApprovalListModal = (props) => {
  const classes = useStyles();

  //###############declaring states####################
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [list, setList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [value, onChange] = React.useState();

  const fetching = () => {
    let Data = { ...props.Data, labourer_id: props.labourerid };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/approvals/otapproval/project_manager_approval_list/`,
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
          setList(res.data.data);
          onChange(res.data.data[0].othours);
          setLoading(false);
        }
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    let Data = { ...props.Data, labourer_id: props.labourerid };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/approvals/otapproval/project_manager_approval_list/`,
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
          if (res.data.data.length) {
            setList(res.data.data);
          }
          setLoading(false);
        }
      });
  }, [props]);

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
        `${process.env.REACT_APP_API_URL}/wagemanage/wages/total_ot_detailed/?labourerid=${props.labourerid}&siteid=${props.siteid}&fromdate=${props.start}&todate=${props.end}`,
        { responseType: "arraybuffer" }
      )
      .then((response) => {
        var blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, `ot_${props.labourerid}_detail_approval.xlsx`);
      });
  };

  //edit Handling
  const editHandler = (id) => {
    const Data = {
      id: id,
      time: value,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/approvals/otapproval/edit_ot_list/`,
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
          fetching();
          props.revalidate();
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        alert(`${error}`);
      });
  };

  //delete Handling
  const deleteHandler = (id) => {
    const Data = {
      nonot_list: [id],
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/approvals/otapproval/non_ot_list_update/`,
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
          fetching();
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        alert(`${error}`);
      });
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          props.setShow(false);
          setList([]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{`Labourer Id:${props.labourerid}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Spinner
              animation="border"
              role="status"
              className="loadingSiteModal"
            ></Spinner>
          ) : null}
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
                      Labourer Id
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
                      OT hour
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                      }}
                    >
                      OT Amount
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
                      Option
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.length != 0 ? (
                    list
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, idx) => {
                        const { labourerid, date } = row;
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
                                {/* {row.indexOf(item) === 0
                              ? rows.indexOf(row) + 1
                              : null} */}
                                {list.indexOf(row) + 1}
                              </TableCell>
                              <TableCell>
                                {/* {info.indexOf(item) === 0 ? labourerid : null} */}
                                {labourerid}
                              </TableCell>
                              <TableCell>{date}</TableCell>
                              <TableCell>
                                <TimePicker
                                  value={row.othours}
                                  disableClock={true}
                                  format="hh:mm:ss"
                                  onChange={onChange}
                                  clearIcon={null}
                                />
                              </TableCell>
                              <TableCell>{row.ot_amount.toFixed(2)}</TableCell>
                              <TableCell>
                                {row.project_manager_ot_approval
                                  ? "Approved"
                                  : "Disapproved"}
                              </TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <div>
                                    {!row.project_manager_ot_approval ? (
                                      <Button
                                        style={{
                                          marginRight: "1em",
                                          backgroundColor: "darkblue",
                                          border: "none",
                                        }}
                                        onClick={() => editHandler(row.id)}
                                      >
                                        Update
                                      </Button>
                                    ) : null}
                                  </div>
                                  <div>
                                    <Button
                                      style={{
                                        backgroundColor: "red",
                                        border: "none",
                                      }}
                                      onClick={() => deleteHandler(row.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
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
                        {list ? "No Data Available" : ""}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={list.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
          <Button
            style={{ marginTop: "2em" }}
            onClick={() => (list.length ? exportHandler() : null)}
          >
            Export To Excel
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ApprovalListModal;
