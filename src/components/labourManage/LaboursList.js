import React, { useCallback, useEffect } from "react";
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
import { edit_labour_modal } from "../../redux/actions/fetchActions";
import { Spinner } from "react-bootstrap";

const columns = [
  // { id: "employeeCode", label: "Labour Code" },
  { id: "labourerid", label: "Labourer Id" },
  { id: "monitorDate", label: "Date Of Creation" },
  { id: "name", label: "Name" },
  // { id: 'department', label: 'Department' },
  // { id: 'designation', label: 'Designation' },
  // { id: 'labourer_category', label: 'Labour Category' },
  // { id: 'skillType', label: 'Skill Type' },
  // { id: 'site_id', label: 'Site Id' },
  { id: "site_code", label: "Site Code" },
  { id: "salary_id", label: "Wage Code" },
  // { id: 'wagecode', label: 'Wage Code' },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

let maxId = 0;
const StickyHeadTable = ({
  laboursData,
  edit_labour_modal,
  query,
  del,
  edit,
}) => {
  const sortedData = laboursData.sort(function (a, b) {
    return new Date(b.compnDate) - new Date(a.compnDate);
  });

  const rowsss = sortedData.map((data) => {
    return { ...data, labourerid: data.id };
  });

  const rows = rowsss;
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

  //#############console logs for testing purpose##########//
  //console.log(laboursData)

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        {!sortedData.length ? (
          <Spinner
            animation="border"
            role="status"
            className="loading"
            style={{ left: "120vh" }}
          ></Spinner>
        ) : null}
        <Table stickyHeader aria-label="sticky table" size="small">
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
              <TableCell
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "navy",
                }}
                key="Report_To"
              >
                Report_To
              </TableCell>
              {edit || del ? (
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
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .filter((obj) =>
                JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                if (!query) maxId = Math.max(maxId, row.labourerid);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={rows.indexOf(row) + 1}
                  >
                    <TableCell key="Sl.No">{rows.indexOf(row) + 1}</TableCell>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell key="report_to">{row.report_to}</TableCell>
                    {edit || del ? (
                      <TableCell key="Options">
                        <span
                          onClick={() =>
                            edit_labour_modal({ show: true, data: row })
                          }
                        >
                          <RiIcons.RiEdit2Fill />
                        </span>
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {!rows.filter((obj) =>
          JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
        ).length || !sortedData.length ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ margin: "100px", fontSize: "17px" }}>
                {sortedData.length ? "No result Found" : ""}
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
      {!query ? localStorage.setItem("MAXID", maxId) : null}
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  laboursData: state.laboursData,
});

export default connect(mapStateToProps, { edit_labour_modal })(StickyHeadTable);
