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
  { id: "name", label: "Name" },
  { id: "labourer_category", label: "Category" },
  { id: "designation", label: "Designation" },
  { id: "festival_advance", label: "Festival Adv" },
  { id: "special_advance", label: "Specail Adv" },
  { id: "weekly_advance", label: "Weekly Adv" },
  { id: "wagecode", label: "Wage Code" },
  { id: "skillType", label: "Skill Type" },
  { id: "labourer_class", label: "Labour Class" },
  { id: "Grade", label: "Grade" },
  { id: "daily_rate", label: "daily_rate" },
  { id: "basic_pay", label: "Basic Pay" },
  { id: "daily_allowance", label: "daily_allowance" },
  { id: "ot_rate", label: "OT Rate" },
  { id: "ot_type", label: "OT Type" },
  { id: "sunday_wage", label: "Sunday Wage" },
  { id: "sunday_rate1", label: "Sunday Rate1" },
  { id: "sunday_rate2", label: "Sunday Rate2" },
  { id: "retention", label: "Retention" },
  { id: "holiday_wage", label: "Holiday Wage" },
  { id: "IFSCNumber", label: "IFSC Number" },
  { id: "ACNumber", label: "A/C Number" },
  { id: "bankName", label: "Bank Name" },
  { id: "branchName", label: "Branch Name" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = ({ labourMaster }) => {
  const rows = labourMaster;
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
              <TableCell
                key="slNo"
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
                      <TableCell key={rows.indexOf(row)}>
                        {rows.indexOf(row) + 1}
                      </TableCell>
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
                <TableCell colSpan="16" className="text-center text-danger p-5">
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
  labourMaster: state.labourMaster,
});

export default connect(mapStateToProps)(StickyHeadTable);
