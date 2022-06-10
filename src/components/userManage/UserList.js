import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import React, { useState, useEffect } from "react";
import * as RiIcons from "react-icons/ri";
import { connect } from "react-redux";
import { edit_user_modal } from "../../redux/actions/fetchActions";
import { Spinner } from "react-bootstrap";

const columns = [
  { id: "site_code", label: "Site Code" },
  { id: "username", label: "Username" },
  { id: "first_name", label: "Name" },
  { id: "emailid", label: "Email Address" },
  {
    id: "date_joined",
    label: "Date of Creation",
    minWidth: 170,
    format: (value) => value.slice(0, 10).split("-").reverse().join("-"),
  },
  { id: "user_type", label: "User Type" },
  { id: "role", label: "Role" },
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
  const users = props.users;
  const edit_user_modal = props.edit_user_modal;
  const sortedData = users.sort(function (a, b) {
    return new Date(a.date_joined) - new Date(b.date_joined);
  });
  const rows = sortedData.reverse();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [Alluser, setAlluser] = useState(false);
  const [editeuser, setediteuser] = useState(false);
  const [deleteUser, setdeleteUser] = useState(false);

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";

    for (let i = 0; i < str.length; i++) {
      if (str[i] != ",") {
        temp += str[i];
      } else {
        if (temp === "Alluser") setAlluser(true);
        else if (temp === "edituser") setediteuser(true);
        else if (temp === "deleteuser") setdeleteUser(true);
        temp = "";
      }
    }
    if (temp === "Alluser") setAlluser(true);
    else if (temp === "edituser") setediteuser(true);
    else if (temp === "deleteuser") setdeleteUser(true);
  });

  //############################console logs for testing purpose#######################//

  //console.log(rows.filter((obj) =>JSON.stringify(obj).toLowerCase().includes(props.query.toLowerCase())).length)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        {!users.length ? (
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
              {editeuser || deleteUser || Alluser ? (
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
            {!(Object.entries(rows).length === 0) ? (
              rows
                .filter((obj) =>
                  JSON.stringify(obj)
                    .toLowerCase()
                    .includes(props.query.toLowerCase())
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

                .map((row, idx) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                      <TableCell key="Sl.No">{rows.indexOf(row) + 1}</TableCell>
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
                      {editeuser || deleteUser || Alluser ? (
                        <TableCell key="Options">
                          <span
                            onClick={() =>
                              edit_user_modal({ show: true, data: row })
                            }
                          >
                            <RiIcons.RiEdit2Fill />
                          </span>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  );
                })
            ) : (
              <TableRow></TableRow>
            )}
          </TableBody>
        </Table>
        {!rows.filter((obj) =>
          JSON.stringify(obj).toLowerCase().includes(props.query.toLowerCase())
        ).length || !users.length ? (
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
        count={
          rows.filter((obj) =>
            JSON.stringify(obj)
              .toLowerCase()
              .includes(props.query.toLowerCase())
          ).length
        }
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { edit_user_modal })(StickyHeadTable);
