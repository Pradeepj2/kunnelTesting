import React, { useState, Fragment, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
//import * as RiIcons from 'react-icons/ri';
//import * as MdIcons from 'react-icons/md';
import { Form, Modal } from "react-bootstrap";
//import CreateHoliday from './createHoliday';
import axios from "axios";
//import {Layout} from '../../Layout'
import DatePicker from "react-multi-date-picker";
import EditHoliday from "./editHoliday";
import { useSnackbar } from "notistack";

const columns = [
  { id: "description", label: "Description" },
  { id: "date", label: "Date" },
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

const SpecificHolidayModal = (props) => {
  //const users = props.users
  //const edit_user_modal = props.edit_user_modal
  //const sortedData = users.sort(function (a, b) {
  // return new Date(a.date_joined) - new Date(b.date_joined);
  //});
  //const rows = sortedData.reverse();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showModal, setShowModal] = useState(false);
  const [holiday, setHoliday] = useState();
  // const [query,setQuery] = useState("")
  // const [startDate,setStartDate] = useState()
  // const [endDate,setEndDate] = useState()

  const [allholiday, setallholiday] = useState(false);
  const [editholiday, seteditholiday] = useState(false);
  const [deleteholiday, setdeleteholiday] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
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
        `${process.env.REACT_APP_API_URL}/sitemanage/edit_delete_holiday/${id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        props.revalidateList();
        showsuccErr({ msg: "Holiday Deleted..", variant: "error" });
      })
      .catch((err) => console.log(err));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //############################console logs for testing purpose#######################//
  //console.log("inside user List", rows, props.query)
  //console.log(rows.filter((obj) =>JSON.stringify(obj).toLowerCase().includes(props.query.toLowerCase())).length)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Modal
        style={{ zIndex: "99999999999" }}
        show={props.show}
        onHide={() => {
          //props.showModal(false)
          props.setShow(false);
        }}
      >
        {props.holidays ? (
          <EditHoliday
            showModal={showModal}
            setShowModal={setShowModal}
            editData={holiday}
            revalidateList={props.revalidateList}
          />
        ) : null}
        <Modal.Header closeButton>
          <Modal.Title>Edit/Delete Holidays</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <div className="subSectionContainer">
              <div className="subContent">
                <div className="subContentHeader">
                  <div style={{ display: "flex" }}>
                    {/* <Form.Control
      style={{textAlign:'center'}}
      type="text"
      placeholder="Search"
      onChange={(e)=>setQuery(e.target.value)}
      /> */}
                    <Form.Group>
                      <Form.Label>From Date</Form.Label>

                      <DatePicker
                        inputClass="form-control"
                        placeholder="From Date"
                        onChange={(e) => {
                          // var startDate = new Date(`${e.year}-${e.month}-${e.day}`);
                          // setStartDate(startDate);
                        }}
                        multiple={false}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>To Date</Form.Label>

                      <DatePicker
                        inputClass="form-control"
                        placeholder="To Date"
                        onChange={(e) => {
                          //  var endDate = new Date(`${e.year}-${e.month}-${e.day}`);
                          //  setEndDate(endDate)
                        }}
                        multiple={false}
                      />
                    </Form.Group>
                  </div>
                </div>

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
                          {editholiday || allholiday ? (
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                color: "white",
                                backgroundColor: "navy",
                              }}
                              key="Options"
                            >
                              View
                            </TableCell>
                          ) : null}

                          {deleteholiday || allholiday ? (
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                color: "white",
                                backgroundColor: "navy",
                              }}
                            >
                              Delete
                            </TableCell>
                          ) : null}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!(props.holidays === []) ? (
                          props.holidays
                            .filter((d) => {
                              var dates = new Date(d.date);
                              return (
                                props.startDate <= dates &&
                                dates <= props.endDate
                              );
                            })
                            //      .filter((obj) =>
                            //      JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
                            //  )
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, idx) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={idx}
                                >
                                  <TableCell key="Sl.No">
                                    {props.holidays.indexOf(row) + 1}
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
                                  {editholiday || allholiday ? (
                                    <TableCell key="View">
                                      <span
                                        style={{ color: "navy" }}
                                        onClick={() => {
                                          // setTimeout(()=>{
                                          setShowModal(true);
                                          setHoliday(row);
                                        }}
                                      >
                                        {/* <RiIcons.RiEdit2Fill /> */}
                                        Edit
                                      </span>
                                    </TableCell>
                                  ) : null}

                                  {deleteholiday || allholiday ? (
                                    <TableCell key="Delete">
                                      <span
                                        style={{ color: "red" }}
                                        onClick={() => deleteHandler(row.id)}
                                      >
                                        {/* <RiIcons.RiEdit2Fill /> */}
                                        Delete
                                      </span>
                                    </TableCell>
                                  ) : null}
                                </TableRow>
                              );
                            })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan="8"
                              className="text-center text-danger p-5"
                            >
                              No Data Available!
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {/* {!rows.filter((obj) =>JSON.stringify(obj).toLowerCase().includes(props.query.toLowerCase())).length?(
        <>
        <div style={{display:'flex',justifyContent:"center",alignItems:'center'}}>
        <div style={{ margin:'100px', fontSize:'17px' }}>No result Found</div>
        </div>
        </>
      ):(null)} */}
                    {!(
                      //.filter((obj) =>JSON.stringify(obj).toLowerCase().includes(query.toLowerCase()))
                      props.holidays.filter((d) => {
                        var dates = new Date(d.date);
                        return (
                          props.startDate <= dates && dates <= props.endDate
                        );
                      }).length
                    ) ? (
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
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={props.holidays.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </div>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SpecificHolidayModal;
