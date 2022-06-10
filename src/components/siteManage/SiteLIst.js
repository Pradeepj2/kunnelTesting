import { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@mui/material/Checkbox";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
//import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { Button } from "react-bootstrap";
import * as RiIcons from "react-icons/ri";
import { connect } from "react-redux";
import { site_edit_modal } from "../../redux/actions/fetchActions";
import { useSnackbar } from "notistack";

const columns = [
  { id: "site_code", label: "Site Code" },
  { id: "created", label: "Creation Date" },
  // { id: 'site_id', label: 'Site Id' },
  { id: "name", label: "Name" },
  { id: "client_name", label: "Client Name" },
  // { id: 'site_engineer', label: 'Site Engineer' },
  { id: "project_type", label: "Project Type" },
  { id: "project_manager", label: "Project Manager" },
  //{ id: 'start_buffer', label: 'Start Buffer' },
  { id: "start_time", label: "Start Time" },
  { id: "lunch_time", label: "Lunch Start time" },
  { id: "lunch_time_end", label: "Lunch End time" },
  { id: "end_time", label: "End time" },
  //{ id: 'end_buffer', label: 'End Buffer' },
  { id: "site_specific_ratio", label: "Site Specific Ratio" },
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
  const site_edit_modal = props.site_edit_modal;
  const rows = props.sites;
  const query = props.query;
  const classes = useStyles();
  //const [page, setPage] = React.useState(0);
  //const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [delarr, setDelarr] = useState([]);
  const [deletesite, setdeletesite] = useState(false);
  const [allsite, setallsite] = useState(false);
  const [editesite, seteditesite] = useState(false);

  useEffect(() => {
    let temp = "";
    let str = localStorage.getItem("permissions");
    for (let i = 0; i < str.length; i++) {
      if (str[i] != ",") {
        temp += str[i];
      } else {
        if (temp === "deletesite") setdeletesite(true);
        else if (temp === "Allsite") setallsite(true);
        else if (temp === "editsite") seteditesite(true);
        temp = "";
      }
    }
    if (temp === "deletesite") setdeletesite(true);
    else if (temp === "Allsite") setallsite(true);
    else if (temp === "editsite") seteditesite(true);
  }, []);

  // const handleChangePage = (_event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const deleteArray = (row) => {
    var del = delarr;

    if (del.some((ele) => ele === row.id))
      del = del.filter((ele) => ele != row.id);
    else {
      del.push(row.id);
    }

    setDelarr(del);
  };

  // const handler = (rows)=>{
  //   var del = []

  //   if(delarr.length<rows.length)
  //   {
  //   for(var i=0;i<rows.length;i++)
  //   {
  //     del.push(rows[i].id)
  //   }
  // }

  //   setDelarr(del)

  // }

  const { enqueueSnackbar } = useSnackbar();

  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const checker = (row) => {
    setTimeout(() => {
      return delarr.some((ele) => ele === row.id);
    }, 500);
  };

  const deleteHandler = () => {
    var Data = {
      id: delarr,
    };

    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/sitemanage/multiple_sites_deletion/`,
        {
          data: Data,
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          showsuccErr({ msg: res.data.message, variant: "success" });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      })
      .catch((error) => showsuccErr({ msg: error.message, variant: "error" }));
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table
          style={{ minWidth: "1600px" }}
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

              {/* <div><Checkbox
                checked={checked}
                onClick={()=>{
                  handler(rows)
                  setTimeout(()=>{
                    setChecked(!checked)
                  },500)
                }}
                /></div> */}

              {columns.map((column, idx) => (
                <TableCell
                  key={idx}
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
              {editesite || allsite ? (
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

              {deletesite || allsite ? (
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                  key="Select"
                >
                  <div style={{ display: "flex" }}>
                    <div>Select Site</div>
                  </div>
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {!(rows.length === 0)
              ? rows
                  .filter((obj) =>
                    JSON.stringify(obj)
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                        <TableCell key="Sl.No">
                          {rows.indexOf(row) + 1}
                        </TableCell>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <div>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </div>
                            </TableCell>
                          );
                        })}
                        {editesite || allsite ? (
                          <TableCell key="Options">
                            <span
                              onClick={() =>
                                site_edit_modal({ show: true, data: row })
                              }
                            >
                              <RiIcons.RiEdit2Fill />
                            </span>
                          </TableCell>
                        ) : null}

                        {deletesite || allsite ? (
                          <TableCell
                            key="delete"
                            align="center"
                            style={{ fontSize: "20px" }}
                          >
                            <Checkbox
                              onChange={(e) => {
                                deleteArray(row);
                              }}
                              checked={checker(row)}
                              color="primary"
                            />
                          </TableCell>
                        ) : null}
                      </TableRow>
                    );
                  })
              : null}
          </TableBody>
        </Table>
        {!rows.filter((obj) =>
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
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      {deletesite || allsite ? (
        <Button
          className="btn btn-sm"
          style={{ backgroundColor: "red", border: "none", margin: "10px" }}
          onClick={() =>
            delarr.length ? deleteHandler() : alert("please select sites")
          }
        >
          Delete Sites
        </Button>
      ) : null}
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  sites: state.sites,
});

export default connect(mapStateToProps, { site_edit_modal })(StickyHeadTable);
