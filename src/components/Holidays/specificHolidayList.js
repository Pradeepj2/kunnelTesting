import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import React, { Fragment, useEffect, useState } from "react";
//import * as RiIcons from 'react-icons/ri';
//import * as MdIcons from 'react-icons/md';
import { Form } from "react-bootstrap";
//import CreateHoliday from './createHoliday';
import axios from "axios";
import { Layout } from "../../Layout";
import DatePicker from "react-multi-date-picker";
//import EditHoliday from './editHoliday'
import SpecificHolidayModal from "./specificHolidayModal";

const columns = [
  { id: "description", label: "Description" },
  { id: "from_date", label: "From Date" },
  { id: "to_date", label: "To Date" },
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

const SpecificHolidayList = (props) => {
  //const users = props.users
  //const edit_user_modal = props.edit_user_modal
  //const sortedData = users.sort(function (a, b) {
  // return new Date(a.date_joined) - new Date(b.date_joined);
  //});
  //const rows = sortedData.reverse();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [holidays, setHolidays] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/sitemanage/edit_delete_holiday/${props.match.params.siteId}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length) {
          setHolidays(res.data);
        }
        var startDate = new Date(res.data[0].date);
        var endDate = new Date(res.data[res.data.length - 1].date);
        setStartDate(startDate);
        setEndDate(endDate);
      });
  }, [props]);

  //revalidating the list
  const revalidateList = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/sitemanage/edit_delete_holiday/${props.match.params.siteId}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => setHolidays(res.data));
  };

  // const deleteHandler = (id)=>{
  //   axios.delete(`${process.env.REACT_APP_API_URL}/sitemanage/edit_delete_holiday/${id}/`,{
  //     headers:{
  //       Authorization:`Token ${localStorage.getItem('token')}`
  //     }
  //   }).then((res)=>{

  //     revalidateList()
  //   })
  //   .catch((err)=>console.log(err))

  // }

  // logic to make an array of desired objects from holidays array
  const showData = [];
  if (holidays !== []) {
    var n = 0;
    var c = 0;
    var c2 = 0;
    while (n < holidays.length) {
      showData[c] = {
        description: holidays[n].description,
        from_date: holidays[c2].date,
        to_date: holidays[n].date,
      };
      if (n + 1 !== holidays.length) {
        if (holidays[n].description !== holidays[n + 1].description) {
          c++;
          c2 = n + 1;
        }
      }
      n++;
    }
  }

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
    <Layout>
      {holidays ? (
        <SpecificHolidayModal
          show={show}
          setShow={setShow}
          holidays={holidays}
          startDate={startDate}
          endDate={endDate}
          revalidateList={revalidateList}
        />
      ) : null}

      <Fragment>
        <div className="subSectionContainer">
          <div className="title">
            <span>Holiday Management</span>
            <hr className="seperationLine" />
          </div>
          <div className="subContent">
            <div
              className="subContentHeader"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div className="contentTitle">
                {props.match.param2} Site Holiday List
              </div>
              <div style={{ width: "50%", display: "flex" }}>
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
                      var startDate = new Date(`${e.year}-${e.month}-${e.day}`);
                      setStartDate(startDate);
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
                      var endDate = new Date(`${e.year}-${e.month}-${e.day}`);
                      setEndDate(endDate);
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
                      {/* <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
                key="Options"
              >
                Delete
              </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!(showData === []) ? (
                      showData
                        .filter((d) => {
                          var dates = new Date(d.from_date);
                          return startDate <= dates && dates <= endDate;
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
                                {showData.indexOf(row) + 1}
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
                              <TableCell key="View">
                                <span
                                  style={{ color: "navy" }}
                                  onClick={() => {
                                    // setTimeout(()=>{
                                    setShow(true);
                                    // setHoliday(row)
                                  }}
                                >
                                  {/* <RiIcons.RiEdit2Fill /> */}
                                  View
                                </span>
                              </TableCell>
                              {/* <TableCell key="Delete">
                        <span style={{color:'red'}}
                           onClick={() =>
                          deleteHandler(row.id)
                           }
                        > */}
                              {/* <RiIcons.RiEdit2Fill /> */}
                              {/* Delete
                        </span>
                      </TableCell> */}
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
                  // .filter((obj) =>JSON.stringify(obj).toLowerCase().includes(query.toLowerCase()))
                  showData.filter((d) => {
                    var dates = new Date(d.from_date);
                    return startDate <= dates && dates <= endDate;
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
                count={holidays.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </div>
      </Fragment>
    </Layout>
  );
};

export default SpecificHolidayList;
