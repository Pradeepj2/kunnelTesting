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

const columns = [
  { id: "labourerid", label: "Labour Id" },
  { id: "labourername", label: "Name" },
  { id: "labourer_category", label: "Category" },
  { id: "labourer_class", label: "Labour Class" },
  { id: "attendance", label: "Attendance" },
  { id: "OThour", label: "OT hour" },
  { id: "concrete", label: "Concrete" },
  { id: "holydayWage", label: "Holiday Wage" },
  { id: "sundaymanday", label: "Sunday Manday" },
  { id: "weeklyadv_deduct", label: "Weekly Ded" },
  { id: "specialadv_deduct", label: "Special Adv Ded" },
  { id: "festivaladv_deduct", label: "Festival Adv Ded" },
  { id: "adjamout", label: "Adj. Amount" },
  { id: "retention", label: "Retention" },
  { id: "designation", label: "Designation" },
  { id: "skillset", label: "Skill Type" },
  { id: "Basic", label: "Basic" },
  { id: "DA", label: "DA" },
  { id: "Daily_Rate", label: "Daily Rate" },
  { id: "OTType", label: "OT Type" },
  { id: "weekwagetotal", label: "Week Wage Total" },
  { id: "OTrate", label: "OT Rate" },
  { id: "OTAmount", label: "OT Amount" },
  { id: "sundaywage", label: "Sunday Wage" },
  { id: "grosswage", label: "Gross Wage" },
  { id: "totaldetect", label: "Total Deduction" },
  { id: "netwage", label: "Net Wage" },
];
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = ({ wagesheet }) => {
  const rows = wagesheet;
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

  return (
    <Paper className={classes.root} style={{ marginTop: "20px" }}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
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
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "applied_date"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan="15" className="text-center text-danger p-5">
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
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  wagesheet: state.wagesheet,
});

export default connect(mapStateToProps)(StickyHeadTable);
