import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { Spinner, Form, Col, Button } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
import fileSaver from "file-saver";

const columns = [
  { id: "sitecode", label: "Site Code" },
  { id: "labourerid", label: "Labour Id" },
  { id: "date", label: "Date" },
  { id: "totalhour", label: "Total Hours" },
  { id: "othours", label: "OT Hours" },
  { id: "selector_name", label: "Selector Name" },
  { id: "approver_name", label: "Approver Name" },
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
  const { register, handleSubmit, errors } = useForm({ mode: "onTouched" });

  const [rows, setRows] = React.useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [fromdate, setFromdate] = React.useState();
  const [todate, setTodate] = React.useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onSubmit = (data) => {
    setFromdate(data.fromdate);
    setTodate(data.todate);

    let Data = {
      fromdate: data.fromdate,
      todate: data.todate,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/attendancemanage/ot_reports `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          let finaldata = response.data.map((data, id) => {
            return {
              ...data,
              labourerid: data.labourerid.split("LAB00")[1],
            };
          });
          setRows(finaldata);
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const exportHandler = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/wagemanage/wages/labour_ot_report/?fromdate=${fromdate}&todate=${todate} `,
        { responseType: "arraybuffer" }
      )
      .then((response) => {
        var blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "otreport.xlsx");
      });
  };
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <Form.Row>
          <Form.Group as={Col} controlId="fromdate">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              name="fromdate"
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
          <Button variant="primary" onClick={(e) => exportHandler()}>
            OT Report
          </Button>
        </div>
      </Form>
      <Paper className={classes.root} style={{ marginTop: "5%" }}>
        <TableContainer className={classes.container}>
          {false ? (
            <Spinner
              animation="border"
              role="status"
              className="loading"
              style={{ left: "120vh" }}
            ></Spinner>
          ) : null}
          <Table
            style={{ minWidth: "1400px" }}
            stickyHeader
            aria-label="sticky table"
            size="small"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                  key="Sl.No"
                >
                  Sl.No.
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
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
              {!(Object.entries(rows).length === 0) ? (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                        <TableCell key="Sl.No">
                          {rows.indexOf(row) + 1}
                        </TableCell>
                        {columns.map((column, idx) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={idx} align={column.align}>
                              {column.id === "date_joined"
                                ? column.format(value)
                                : column.id === "first_name"
                                ? value + " " + row.last_name
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow></TableRow>
              )}
            </TableBody>
          </Table>
          {!rows.length ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ margin: "100px", fontSize: "17px" }}>
                  {"No Results Found"}
                </div>
              </div>
            </>
          ) : null}
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

export default StickyHeadTable;
