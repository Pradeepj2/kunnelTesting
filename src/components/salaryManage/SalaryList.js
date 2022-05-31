import React, { useEffect } from "react";
import axios from "axios";
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
import * as RiIcons from "react-icons/ri";
import { salary_codes } from "../../redux/actions/siteActions";
import { edit_salary_struct_modal } from "../../redux/actions/fetchActions";
//id,labourer_class,labourer_category,gender,Skill_set,Grade,daily_rate,basic_pay,daily_allowence,Site,OTrate,sunday_wage,SW_C1,SW_C2,holiday_wage,OTtype,rentation

const columns = [
  { id: "wagecode", label: "Wagecode", minWidth: 100 },
  { id: "labourer_class", label: "Labourer Class", minWidth: 100 },
  { id: "labourer_class", label: "Designation", minWidth: 100 },
  { id: "labourer_category", label: "Labour Category", minWidth: 170 },
  { id: "gender", label: "Gender", minWidth: 100 },
  { id: "Skill_set", label: "Skill Type", minWidth: 100 },
  { id: "Grade", label: "Grade", minWidth: 100 },
  { id: "daily_rate", label: "Daily Rate", minWidth: 100 },
  { id: "basic_pay", label: "Basic Pay", Width: 100 },
  { id: "daily_allowence", label: "Daily Allowence", minWidth: 100 },
  { id: "OTrate", label: "OT Rate", minWidth: 100 },
  { id: "rent", label: "Rent Amount" },
  {
    id: "sunday_wage",
    label: "Sunday Wage",
    minWidth: 100,
    format: (value) => (value ? "Yes" : "No"),
  },
  // { id: "SW", label: "SW", minWidth: 100 },
  { id: "SW_C1", label: "SW_C1", minWidth: 100 },
  { id: "SW_C2", label: "SW_C2", minWidth: 100 },
  {
    id: "holiday_wage",
    label: "Holiday Wage",
    minWidth: 100,
    format: (value) => (value ? "Yes" : "No"),
  },
  // { id: 'OTtype', label: 'OT Type', minWidth: 100 },
  {
    id: "rentation",
    label: "Retension",
    minWidth: 100,
    format: (value) => (value ? "Yes" : "No"),
  },
  { id: "site_code", label: "Site Code" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = ({ salaryCodes, edit_salary_struct_modal, query }) => {
  const rows = salaryCodes;
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
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead style={{ color: "white", backgroundColor: "navy" }}>
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
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "navy",
                }}
                key="Options"
              >
                Options
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .filter((obj) =>
                JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    <TableCell key="Sl.No">{rows.indexOf(row) + 1}</TableCell>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "boolean"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell key="Options">
                      <span
                        onClick={() =>
                          edit_salary_struct_modal({ show: true, data: row })
                        }
                      >
                        <RiIcons.RiEdit2Fill />
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {!rows.filter((obj) =>
          JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
        ).length || !rows.length ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ margin: "100px", fontSize: "17px" }}>
                {rows.length ? "No result Found" : ""}
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
  );
};

const mapStateToProps = (state) => ({
  salaryCodes: state.salaryCodes,
});

export default connect(mapStateToProps, {
  edit_salary_struct_modal,
  salary_codes,
})(StickyHeadTable);
