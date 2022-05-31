import "./siteModal.css";
import React, { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import { makeStyles } from "@material-ui/core/styles";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const SiteModal = (props) => {
  //##############################declaring states####################//
  const [code, setCode] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [site, setSite] = useState("");

  const columns = [
    //   { id: 'created',label:'Creation Date'},
    { id: "site_code", label: "Site Code" },
    //   { id: 'site_id', label: 'Site Id' },
    { id: "name", label: "Name" },
    //   { id: 'client_name', label: 'Client Name' },
    //   { id: 'site_engineer', label: 'Site Engineer' },
    { id: "project_type", label: "Project Type" },
    { id: "project_manager", label: "Project Manager" },
    //{ id: 'start_buffer', label: 'Start Buffer' },
    //   { id: 'start_time', label: 'Start Time' },
    //   { id: 'lunch_time', label: 'Lunch time' },
    //   { id: 'end_time', label: 'End time' },
    //{ id: 'end_buffer', label: 'End Buffer' },
    //   { id: 'site_specific_ratio',label:'Site Specific Ratio'}
  ];

  const useStyles = makeStyles({
    root: {
      width: "100%",
    },
    container: {
      maxHeight: 500,
    },
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = props.sites;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const [loading, setLoading] = useState(false)
  // const [checked,setChecked] = useState(false)

  const submitHandler = () => {
    props.setSiteid(site);
    if (props.setSiteCode) props.setSiteCode(code);
    setTimeout(() => {
      props.setShow(false);
    }, 0);
  };

  const checkHandler = (e, idx) => {
    var selected = [];
    var n = rows
      .filter((obj) =>
        JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
      )
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    for (var i = 0; i < n.length; i++) {
      if (i === idx) {
        selected.push(n[i]);
      }
    }
    setSelected(selected);
  };

  return (
    <>
      <Modal
        //show={props.modal}
        style={{ zIndex: "99999999999999999" }}
        show={props.show}
        onHide={() => {
          //props.showModal(false)
          props.setShow(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Site</Modal.Title>
          <div style={{ width: "50%", transform: "translateX(30%)" }}>
            <Form.Control
              style={{ textAlign: "center" }}
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          {!props.sites.length ? (
            <Spinner
              animation="border"
              role="status"
              className="loadingSiteModal"
            ></Spinner>
          ) : null}
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table
                style={{ minWidth: "600px" }}
                stickyHeader
                aria-label="sticky table"
                size="small"
              >
                <colgroup>
                  <col style={{ width: "2%" }} />
                  <col style={{ width: "1%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                      }}
                      key="select"
                    >
                      select
                    </TableCell>
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
                    {/* <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
                key="Options"
              >
                Options
              </TableCell> */}
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
                              <TableCell>
                                <input
                                  checked={selected.some(
                                    (ele) => ele.id === row.id
                                  )}
                                  onChange={(e) => {
                                    checkHandler(e, idx);
                                    setCode(row.site_code);
                                    setSite(row.site_id);
                                  }}
                                  type="checkbox"
                                />
                              </TableCell>
                              <TableCell key="Sl.No">
                                {rows.indexOf(row) + 1}
                              </TableCell>
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    <div>
                                      {column.format &&
                                      typeof value === "number"
                                        ? column.format(value)
                                        : value}
                                    </div>
                                  </TableCell>
                                );
                              })}
                              {/* <TableCell key="Options">
                          <span
                            //onClick={() =>
                            //  site_edit_modal({ show: true, data: row })
                            //}
                          >
                            <RiIcons.RiEdit2Fill />
                          </span>
                        </TableCell> */}
                            </TableRow>
                          );
                        })
                    : null}
                </TableBody>
              </Table>
              {!rows.filter((obj) =>
                JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
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
                      {props.sites.length ? "No result found" : ""}
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
          <Button
            style={{ backgroundColor: "navy", marginTop: "10px" }}
            onClick={(e) => submitHandler()}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SiteModal;
