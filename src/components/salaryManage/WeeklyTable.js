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

const columns = [
  { id: "labourerid", label: "Labour Id" },
  { id: "name", label: "Labour Name", minWidth: 100 },
  { id: "category", label: "Labour Category" },
  { id: "desigination", label: "Designation" },
  { id: "retention", label: "Retention" },
  { id: "advance", label: "Advance" },
  { id: "misellanous_debit", label: "Miscellaenous Debit" },
  { id: "total_deductions", label: "Total Deductions" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = ({
  paymentList,
  paymentListView,
  query,
  revalidate,
  loading,
  setLoading,
}) => {
  const rows = paymentList;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const approve_payment = (data) => {
  //   axios
  //     .post(
  //       `${process.env.REACT_APP_API_URL}/wagemanage/wages/mark_payments/?siteid=` +
  //         paymentListView.site +
  //         '&&fromdate=' +
  //         paymentListView.from_date +
  //         '&&todate=' +
  //         paymentListView.to_date,
  //       {
  //         from_date: paymentListView.from_date,
  //         to_date: paymentListView.to_date,
  //         site: paymentListView.site,
  //         labourers: [data],
  //       },
  //       {
  //         headers: {
  //           Authorization: `Token ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       alert(res.data.data);
  //     })
  //     .catch((error) => {
  //       console.log('Error :', error);
  //     });
  // };

  // const reject_advance=(data)=>{
  //     let Data = {
  //       "advances": {"advance_id" : [data],"status" : 'R'}
  //     }
  //     axios.post('http://ec2-3-6-51-90.ap-south-1.compute.amazonaws.com/advance/advance_list/approval_change/',(Data)
  //     ,{
  //       headers: {
  //           'Authorization': `Token ${localStorage.getItem('token')}`
  //       }
  //   }).then(response=>{
  //     if(response.data.status===true){
  //       alert(response.data.data);
  //       window.location.reload()
  //     }
  //     else{
  //       alert(response.data.data)
  //     }
  //   }).catch(error=>{
  //     alert(`${error}`)
  //   })

  //   }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <div className="title">
        <span>Deductions</span>
        <hr className="seperationLine" />
      </div>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
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
              {/* <TableCell
                key="options"
                align="center"
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Paid
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {!(Object.entries(rows).length === 0) ? (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter((obj) =>
                  JSON.stringify(obj)
                    .toLowerCase()
                    .includes(query.toLowerCase())
                )
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.labourerid}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "attendance" ||
                            column.id === "weekwagetotal"
                              ? value.toFixed(2)
                              : value}
                          </TableCell>
                        );
                      })}
                      {/* <TableCell
                        key="options"
                        align="center"
                        style={{ fontSize: '20px' }}
                      >
                          {/* <FcIcons.FcOk /> */}
                      {/* <Checkbox  checked={row.status === "Paid"} disabled={(row.status === "Paid")?true:false} color="success" onClick={()=>paidHandler(row.id_for_approval)} /> */}
                      {/*<span onClick={()=>reject_advance(row.id)}><FcIcons.FcCancel/></span>*/}
                      {/* </TableCell>  */}
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan="14" className="text-center text-danger p-5">
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
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  paymentList: state.paymentList,
  paymentListView: state.paymentListView,
});

export default connect(mapStateToProps)(StickyHeadTable);
