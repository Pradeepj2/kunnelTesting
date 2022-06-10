import { useState, useEffect } from "react";
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
//import * as RiIcons from 'react-icons/ri';
import { Link } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";

const columns = [
  { id: "sitename", label: "Site Name" },
  { id: "count", label: "Holiday" },
  //   { id: 'view', label: 'View' },
  //   { id: 'delete', label: 'Delete' },
  //   {
  //     id: 'date_joined',
  //     label: 'Date of Join',
  //     minWidth: 170,
  //     format: (value) => value.slice(0, 10).split('-').reverse().join('-'),
  //   },
  //   { id: 'user_type', label: 'User Type' },
  //   { id: 'role', label: 'Role' },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const HolidayList = (props) => {
  //const users = props.users
  //const edit_user_modal = props.edit_user_modal
  //const sortedData = users.sort(function (a, b) {
  // return new Date(a.date_joined) - new Date(b.date_joined);
  //});
  //const rows = sortedData.reverse();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [allholiday, setallholiday] = useState(false);
  const [editholiday, seteditholiday] = useState(false);
  const [deleteholiday, setdeleteholiday] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  //############################console logs for testing purpose#######################//
  //console.log("inside user List", rows, props.query)
  //console.log(rows.filter((obj) =>JSON.stringify(obj).toLowerCase().includes(props.query.toLowerCase())).length)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] != ",") {
        temp += str[i];
      } else {
        if (temp === "editholiday") seteditholiday(true);
        else if (temp === "Allholiday") setallholiday(true);
        else if (temp === "deleteholiday") setdeleteholiday(true);
        temp = "";
      }
    }
    if (temp === "editholiday") seteditholiday(true);
    else if (temp === "Allholiday") setallholiday(true);
    else if (temp === "deleteholiday") setdeleteholiday(true);
  }, []);

  const deleteHandler = (id) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/sitemanage/delete_multipleholiday/${id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        showsuccErr({ msg: "Deleted", variant: "error" });
        props.revalidateList();
      });
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table
          style={{ maxWidth: "1200px" }}
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
                  width: "70px",
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
                    width: "70px",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {!props.sa ? (
                <>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "navy",
                      width: "70px",
                    }}
                    key="Options"
                  >
                    View
                  </TableCell>
                  {deleteholiday || allholiday ? (
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                        width: "70px",
                      }}
                    >
                      Delete
                    </TableCell>
                  ) : null}
                </>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {!(props.sites === []) ? (
              props.sites
                .filter((obj) =>
                  JSON.stringify(obj)
                    .toLowerCase()
                    .includes(props.query.toLowerCase())
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={props.sites.indexOf(row) + 1}
                    >
                      <TableCell key="Sl.No">
                        {props.sites.indexOf(row) + 1}
                      </TableCell>
                      {columns.map((column, idx) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={idx} align={column.align}>
                            {column.id === "date_joined"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      {!props.sa ? (
                        <>
                          <TableCell key="View">
                            <span style={{ color: "navy" }}>
                              <Link
                                to={{
                                  pathname: `holidays/${row.siteid}/`,
                                  param1: row.name,
                                  param2: row.name,
                                }}
                              >
                                View
                              </Link>
                            </span>
                          </TableCell>
                          <TableCell key="Delete">
                            {deleteholiday || allholiday ? (
                              <span
                                style={{ color: "red" }}
                                onClick={() => deleteHandler(row.siteid)}
                              >
                                Delete
                              </span>
                            ) : null}
                          </TableCell>
                        </>
                      ) : null}
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
        {!props.sites.filter((obj) =>
          JSON.stringify(obj).toLowerCase().includes(props.query.toLowerCase())
        ).length ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ margin: "100px", fontSize: "17px" }}>
                No result Found
              </div>
            </div>
          </>
        ) : null}
        {/* {!rows.filter((obj) =>JSON.stringify(obj).toLowerCase().includes(props.query.toLowerCase())).length?(
        <>
        <div style={{display:'flex',justifyContent:"center",alignItems:'center'}}>
        <div style={{ margin:'100px', fontSize:'17px' }}>No result Found</div>
        </div>
        </>
      ):(null)} */}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.sites.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default HolidayList;
