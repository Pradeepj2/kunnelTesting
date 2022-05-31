import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import { payment_details_modal } from "../../redux/actions/fetchActions";
import PaymentDetails from "./PaymentDetails";
import { Button } from "react-bootstrap";
import axios from "axios";
import fileSaver from "file-saver";
// id,from_date,to_date,site,paid_on

const columns = [
  { id: "labourerid", label: "Labourer Id" },
  { id: "name", label: "Labour name" },
  { id: "category", label: "Category" },
  { id: "desigination", label: "Designation" },
  { id: "pf", label: "PF" },
  { id: "esi", label: "ESI" },
  { id: "retension", label: "Retention" },
  // { id: 'rent', label: 'Rent' },
  { id: "advance", label: "Advance" },
  // { id: 'late', label: 'Late' },
  { id: "miscellaneousdebit", label: "Miscellaeneous Debit" },
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
  const rows = props.deductions;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const exportHandler = () => {
    if (props.toDate) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/wagemanage/wages/monthly_esi_pf_report/?siteid=${props.siteid}&fromdate=${props.fromDate}&todate=${props.toDate}`,
          { responseType: "arraybuffer" }
        )
        .then((response) => {
          var blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          fileSaver.saveAs(blob, "monthlyTransactiondeductions.xlsx");
        });
    } else {
      alert("Enter Site and Dates First");
    }
  };

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "right", marginTop: "2em" }}
      >
        <Button variant="primary" type="submit" onClick={() => exportHandler()}>
          Export To Excel
        </Button>
      </div>
      <Paper className={classes.root} style={{ marginTop: "20px" }}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  key="Sl.No"
                  align="left"
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      <TableCell>{rows.indexOf(row) + 1}</TableCell>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "paid_on" ||
                            column.id === "from_date" ||
                            column.id === "to_date"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
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
      <PaymentDetails />
    </>
  );
};

const mapStateToProps = (state) => ({
  paymentTransactionList: state.paymentTransactionList,
});

export default connect(mapStateToProps, { payment_details_modal })(
  StickyHeadTable
);
