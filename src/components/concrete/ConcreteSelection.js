import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import { TextField } from "@material-ui/core";
import { connect, Connect } from "react-redux";
import { labours_list, users_list } from "../../redux/actions/siteActions";
import { concrete_type_modal } from "../../redux/actions/fetchActions";
import { Button } from "react-bootstrap";
import { Autocomplete } from "@mui/material";
import ChooseConcrete from "./ChooseConcrete";
import { useSnackbar } from "notistack";
import createSpacing from "@material-ui/core/styles/createSpacing";
const columns = [
  // { id: "select_site", label: "Select Site" },
  { id: "sitecode", label: "Site Code" },
  // { id: "labourerid", label: "Labour Id" },
  { id: "labourname", label: "Labour Name" },
  // { id: "labour_category", label: "Labour Category" },
  // { id: "choose_concrete", label: "Choose Concrete" },
  // { id: "selector_name_concrete", label: "Selector Name" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& .MuiAutocomplete-root": {
      // backgroundColor: "red",
      marginLeft: "15px",
      // padding: "10px",
    },
    "& .MuiInput-input": {
      fontSize: "1.2rem",
      padding: "5px",
      margin: "10px",
    },
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = (props) => {
  const [rows, setRows] = useState([]);
  const [objectListArray, setObjectListArray] = useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [userList, setUserList] = useState([]);
  const [sitecode, Setsitecode] = useState("");
  const [concrete, setConcrete] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedConcrete, setSelectedConcrete] = useState("");
  // const [userType, setUserType] = useState("");
  const [temprow, setTempRow] = useState([]);
  const role = localStorage.getItem("role");
  const type = localStorage.getItem("userType");
  const name = localStorage.getItem("user");
  const [userType, setUserType] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };
  useEffect(() => {
    const today = ((d) =>
      new Date(d.setDate(d.getDate())).toISOString().split("T")[0])(new Date());
    let Data = {
      current_date: new Date().toISOString().split("T")[0],
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/attendancemanage/concrete_selection_list `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setRows(response.data);
          setTempRow(response.data);
          var arr = response.data.map((ele) => {
            if (ele.approved_ot) {
              return ele.id;
            }
          });
          props.setApprovalId(arr);
        } else {
          showsuccErr({ msg: response.data.Message, variant: "error" });

          // alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    if (role !== "superadmin") setUserType(name);
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/app1/user`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        props.users_list(res.data.data);
      })
      .catch((err) => {
        alert(err);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/labourermanage/labourer/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        props.labours_list(res.data.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  //   const setUserSiteCode = (e) => {
  //     e.preventDefault();
  //     objectListArray.map((res) => {
  //       if (res.name === e.target.innerText) Setsitecode(res.code);
  //     });
  //   };

  //   useEffect(() => {
  //     if (sitecode) {
  //       const obj = [];
  //       props.laboursData.map((res, idx) => {
  //         if (res.site_code === sitecode) {
  //           console.log(res.name, res.site_code, sitecode);
  //           obj.push(...obj, res);
  //         }
  //       });

  //       const newArry = getUnique(obj, "id");
  //       if (newArry.length !== 0) setRows(newArry);
  //     }
  //   }, [sitecode]);

  // useEffect(() => {
  //   const curr_date = new Date();

  //   let Data = {
  //     current_date: curr_date.toISOString().split("T")[0],
  //   };

  //   axios
  //     .post(
  //       `${process.env.REACT_APP_API_URL}/attendancemanage/ot_selection_list `,
  //       Data,
  //       {
  //         headers: {
  //           Authorization: `Token ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       if (response.status === 200) {
  //         console.log(response.data);
  //         setRows(response.data);
  //       } else {
  //         alert(response.data.Message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  //   axios
  //     .post(
  //       `${process.env.REACT_APP_API_URL}/attendancemanage/ot_selection_list`,
  //       Data,
  //       {
  //         headers: {
  //           Authorization: `Token ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       if (response.status === 200) {
  //         setRows(response.data);
  //       } else {
  //         alert(response.data.Message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const tempArry = [];
    const tempObjectArry = [];
    if (props.users) {
      const data = props.users.map((res) => {
        tempObjectArry.push({ lable: res.username, user_type: res.user_type });
        tempArry.push([res.username, res.user_type].join(" , "));
      });
      setUserList(tempArry);
      setObjectListArray(tempObjectArry);
    }
  }, [props.users]);

  useEffect(() => {
    const obj = [];
    if (userType) {
      rows.map((res, idx) => {
        if (res.user_type === userType) {
          obj.push(...obj, res);
        }
      });
    }
    // console.log(obj.length, obj);
    let unique = obj.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );
    setTempRow(unique);
  }, [userType]);

  // *****************************************************

  // useEffect(() => {
  //   if (objectListArray) console.log(objectListArray);
  // }, [objectListArray]);

  // **********************************************************

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const selectHandler = (row) => {
    let Data = {
      selector_name_concrete: localStorage.getItem("user"),
      selected_for_concrete: true,
      concrete: selectedConcrete,
    };
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/attendancemanage/concrete_selector_name_approval_authorized/${row.id}/ `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status) {
          revalidate();
          // window.location.reload();
        } else {
          showsuccErr({ msg: response.data.Message, variant: "error" });

          // alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const revalidate = () => {
    const today = ((d) =>
      new Date(d.setDate(d.getDate())).toISOString().split("T")[0])(new Date());
    let Data = {
      current_date: new Date().toISOString(),
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/attendancemanage/concrete_selection_list `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          let finaldata = response.data.map((data, id) => {
            return {
              ...data,
              labourerid: data.labourerid.split("LAB00")[1],
            };
          });
          setRows(finaldata);
        } else {
          showsuccErr({ msg: response.data.Message, variant: "error" });

          // alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSelectedConcreteType = (concrete) => {
    setSelectedConcrete(concrete);
  };

  const setUser_type = (e) => {
    var str = e.target.innerText;
    if (str === "") {
      setTempRow(rows);
      return;
    }
    var temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] === " ") break;
      temp += str[i];
    }
    let flage = 0;
    objectListArray.map((res) => {
      if (res.lable === temp) {
        flage = 1;
        setUserType(res.lable);
      }
    });

    let obj = [];
    if (flage === 0) {
      setTempRow(obj);
      return;
    }
  };
  const autocomplete =
    role === "superadmin" ? (
      <Autocomplete
        onChange={(e) => setUser_type(e)}
        disablePortal
        id="combo-box-demo"
        options={userList}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            style={{
              fontSize: "1rem",
              marginLeft: "13px",
              width: "100vw",
            }}
            {...params}
            label="Select labour under"
          />
        )}
      />
    ) : (
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            style={{
              fontSize: "1.3rem",
              marginLeft: "13px",
            }}
            spellCheck="false"
            value={[name, type].join(" , ")}
          />
        )}
      />
    );

  return (
    <>
      <Paper
        className={classes.root}
        style={{ marginTop: "5%", borderTop: "0.8px solid black" }}
      >
        <TableContainer className={classes.container}>
          {false ? (
            <Spinner
              animation="border"
              role="status"
              className="loading"
              style={{ left: "120vh" }}
            ></Spinner>
          ) : null}

          {autocomplete}
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
                  key="selector_name"
                >
                  Selector Name
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                  key="Concrete Types"
                >
                  Choose Concrete
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                  key="Options"
                >
                  Concrete Creation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!(temprow.length === 0) ? (
                temprow
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
                        <TableCell key="Sl.No">
                          {localStorage.getItem("user")}
                        </TableCell>
                        <TableCell key="Sl.No">
                          {row.concrete === null ? (
                            <Button
                              onClick={() => {
                                setShow(true);
                                setSelectedConcrete(row.id);
                              }}
                            >
                              View
                            </Button>
                          ) : (
                            `${row.concrete.concrete_categoryname}, ${row.concrete.load_capacity}, ${row.concrete.amount}`
                          )}
                        </TableCell>
                        <TableCell key="Options">
                          <span>
                            <Checkbox
                              onClick={() => selectHandler(row)}
                              checked={row.selected_for_concrete}
                              disabled={props.approvalId.some(
                                (ele) => ele === row.id
                              )}
                            />
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
          {!temprow.length ? (
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
          count={temprow.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ChooseConcrete
        show={show}
        handleClose={() => setShow(false)}
        getSelectedConcreteType={getSelectedConcreteType}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    users: state.users,
    laboursData: state.laboursData,
  };
};

export default connect(mapStateToProps, { users_list, labours_list })(
  StickyHeadTable
);
