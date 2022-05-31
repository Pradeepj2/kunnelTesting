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
//import PaymentDetails from './PaymentDetails';
//import PaymentTransactionForm from './PaymentTransactionForm'
import PaymentTransactionListDeduction from "./PaymentTransactionListDeduction";
//import PaymentTransactionListPaid from './PaymentTransactionListPaid'
import axios from "axios";
import { useSnackbar } from "notistack";
// id,from_date,to_date,site,paid_on

const columns = [
  { id: "labourerid", label: "Labourer Id" },
  { id: "name", label: "Labour name" },
  { id: "category", label: "Category" },
  { id: "desigination", label: "Designation" },
  { id: "daily_rate", label: "Daily Rate" },
  { id: "Sunday_wage", label: "Sunday Wage" },
  { id: "Sunday_wage1", label: "Sunday Wage 1" },
  { id: "Sunday_wage2", label: "Sunday Wage 2" },
  { id: "holiday_wage", label: "Holiday Wage" },
  { id: "rent", label: "Rent" },
  { id: "workingdays", label: "Working Days" },
  { id: "total_payment", label: "Total Pay" },
  { id: "attendance", label: "Attendance" },
  { id: "ot_amount", label: "OT" },
  { id: "adjustment_credit", label: "Adjustment Credit" },
  { id: "advance", label: "Advance" },
  { id: "gross_pay", label: "Gross Pay" },
  { id: "total_deduction", label: "Deduction" },
  { id: "net_pay", label: "Net Pay" },
  { id: "paid_date", label: "Date" },
  { id: "status", label: "Status" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = ({
  paymentTransactionList,
  payment_details_modal,
  revalidate,
  query,
  transactions,
  deductions,
  siteid,
  toDate,
  fromDate,
}) => {
  const rows = transactions;
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

  const { enqueueSnackbar } = useSnackbar();

  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  //handling approval
  const approvalHandler = (id, net_pay, labourerid) => {
    const Data = {
      weekly_payment: id,
      from_date: fromDate,
      to_date: toDate,
      netpay: net_pay,
      labourerid,
      paid_date: new Date().toISOString().split("T")[0],
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/wagemanage/monthly/payment`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === true) {
          revalidate();
          showsuccErr({ msg: response.data.message, variant: "success" });
        } else {
          showsuccErr({ msg: response.data.message, variant: "error" });
          // alert(response.data.message);
          window.location.reload();
        }
      })
      .catch((error) => {
        showsuccErr({ msg: `${error}`, variant: "error" });
      });
  };

  return (
    <>
      <Paper className={classes.root} style={{ marginTop: "20px" }}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  key="Sl.No"
                  align="center"
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
              {rows
                .filter((obj) =>
                  JSON.stringify(obj)
                    .toLowerCase()
                    .includes(query.toLowerCase())
                )
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
                        var value;
                        if (column.id !== "status") value = row[column.id];
                        if (
                          column.id === "attendance" ||
                          column.id === "advance"
                        )
                          value = row[column.id].toFixed(2);
                        if (column.id === "status") {
                          return (
                            <TableCell>
                              <select
                                className="select"
                                onChange={() =>
                                  approvalHandler(
                                    row.id_for_worktime_payment,
                                    row.net_pay,
                                    row.labourerid
                                  )
                                }
                                style={{ border: "none" }}
                              >
                                <option value="" selected={row.status === true}>
                                  Paid
                                </option>
                                <option
                                  value=""
                                  selected={row.status === false}
                                  disabled
                                >
                                  Unpaid
                                </option>
                              </select>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                      {/* <TableCell>
                        <span
                          id={row.id}
                          onClick={() =>
                            payment_details_modal({ show: true, id: row.id })
                          }
                        >
                          View
                        </span>
                      </TableCell> */}
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
      <PaymentTransactionListDeduction
        deductions={deductions}
        siteid={siteid}
        fromDate={fromDate}
        toDate={toDate}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  paymentTransactionList: state.paymentTransactionList,
});

export default connect(mapStateToProps, { payment_details_modal })(
  StickyHeadTable
);
