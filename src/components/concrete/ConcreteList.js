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
import * as RiIcons from "react-icons/ri";
import { Spinner } from "react-bootstrap";
import EditConcrete from "./EditConcrete";

const columns = [
  { id: "site_code", label: "Site Code" },
  { id: "labour_id", label: "Labour Id" },
  { id: "labour_category", label: "Labour Category" },
  { id: "labour_designation", label: "Labour Designation" },
  {
    id: "concrete_categoryname",
    label: "Concrete Type",
    minWidth: 170,
    format: (value) => value.slice(0, 10).split("-").reverse().join("-"),
  },
  { id: "concrete_load", label: "Concret Load/Capacity" },
  { id: "amount", label: "Amount" },
  { id: "date", label: "Date" },
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
  const rows = props.concrete;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showEdit, setShowEdit] = React.useState(false);
  const [row, setRow] = React.useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <EditConcrete
        show={showEdit}
        setShow={setShowEdit}
        revalidate={props.revalidate}
        row={row}
      />
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          {!rows.length ? (
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
                        <TableCell key="Options">
                          <span
                            onClick={() => {
                              setRow(row);
                              setShowEdit(true);
                            }}
                          >
                            <RiIcons.RiEdit2Fill />
                          </span>
                        </TableCell>
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
