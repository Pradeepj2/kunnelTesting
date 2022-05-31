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
import axios from "axios";
import * as FcIcons from "react-icons/fc";
import { useSnackbar } from "notistack";

// id,type,labourer_id,amount,deduction_percent,status,applied_date

const columns = [
  { id: "id", label: "Id" },
  { id: "labourer_id", label: "Labourer Id" },
  { id: "amount", label: "Amount" },
  { id: "applied_date", label: "Applied Date" },
  { id: "retention", label: "Retention" },
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

const StickyHeadTable = ({ retentionPendingList }) => {
  const rows = retentionPendingList;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const { enqueueSnackbar } = useSnackbar();

  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const approve = (data) => {
    let Data = {
      retention_list: [data],
      status: "A",
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/wagemanage/retention/approval_change/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === true) {
          showsuccErr({ msg: response.data.data, variant: "success" });
          window.location.reload();
        } else {
          showsuccErr({ msg: response.data.data, variant: "error" });
        }
      })
      .catch((error) => {
        showsuccErr({ msg: `${error}`, variant: "error" });
      });
  };
  const reject = (data) => {
    let Data = {
      retention_list: [data],
      status: "R",
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/wagemanage/retention/approval_change/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === true) {
          showsuccErr({ msg: response.data.data, variant: "success" });
          window.location.reload();
        } else {
          showsuccErr({ msg: response.data.data, variant: "error" });
        }
      })
      .catch((error) => {
        showsuccErr({ msg: `${error}`, variant: "error" });
      });
  };
  return (
    <Paper className={classes.root} style={{ marginTop: "20px" }}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {/* <TableCell><Checkbox id='all'></Checkbox></TableCell> */}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
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
                key="options"
                align="center"
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "navy",
                }}
              >
                Options
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!(Object.keys(rows).length === 0) ? (
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
                      {/* <TableCell><Checkbox id={row.id}></Checkbox></TableCell>   */}
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "applied_date"
                              ? value
                                  .slice(0, 10)
                                  .split("-")
                                  .reverse()
                                  .join("-")
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell
                        key="options"
                        align="center"
                        style={{ fontSize: "20px" }}
                      >
                        <span className="m-4" onClick={() => approve(row.id)}>
                          <FcIcons.FcOk />
                        </span>
                        <span onClick={() => reject(row.id)}>
                          <FcIcons.FcCancel />
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan="8" className="text-center text-danger p-5">
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
  retentionPendingList: state.retentionPendingList,
});

export default connect(mapStateToProps)(StickyHeadTable);
