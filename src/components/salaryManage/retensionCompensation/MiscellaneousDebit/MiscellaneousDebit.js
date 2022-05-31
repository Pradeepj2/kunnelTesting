import React, { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Button } from "react-bootstrap";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import CreateMiscellaneous from "./CreateMiscellaneous";
import EditMiscellaneous from "./EditMiscellaneous";

const columns = [
  { id: "id", label: "ID" },
  { id: "labourer_id", label: "Labourer Id" },
  { id: "designation", label: "Designation" },
  { id: "category", label: "Labour Category" },
  { id: "from_date", label: "From" },
  { id: "to_date", label: "To" },
  { id: "site_code", label: "Site Code" },
  { id: "debit_amount", label: "Miscellaneous Debit" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const MiscellaneousDebit = () => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [modal, showModal] = React.useState(false);
  const [editModal, showEditModal] = React.useState(false);
  const [id, setId] = React.useState("");
  const [amount, setAmount] = React.useState([]);
  const rows = amount;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/wagemanage/miscellaneous_debit`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAmount(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const revalidate = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/wagemanage/miscellaneous_debit`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAmount(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <CreateMiscellaneous
        modal={modal}
        showModal={showModal}
        revalidate={revalidate}
      />
      <EditMiscellaneous
        editModal={editModal}
        revalidate={revalidate}
        showEditModal={showEditModal}
        id={id}
      />
      <Paper className={classes.root} style={{ marginTop: "20px" }}>
        <Button
          style={{ marginBottom: "10px" }}
          onClick={() => showModal(true)}
        >
          Create Miscellaneous Debit
        </Button>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
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
                  key="View"
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                >
                  Option
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
                          style={{ color: "navy" }}
                          onClick={() => {
                            showEditModal(true);
                            setId(row);
                          }}
                        >
                          View
                        </TableCell>
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
    </>
  );
};

export default MiscellaneousDebit;
