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
import Checkbox from "@mui/material/Checkbox";

// id,type,labourer_id,amount,deduction_percent,status,applied_date

const columns = [
  { id: "labourerid", label: "Labour Id" },
  { id: "name", label: "Labour Name", minWidth: 100 },
  { id: "category", label: "Labour Category" },
  { id: "desigination", label: "Designation" },
  { id: "working_days", label: "Total Working Days" },
  //  { id: 'labourer_category', label: 'Category' },
  //  { id: 'labourer_class', label: 'Class' },
  { id: "total_work_hour", label: "Total Hours Present" },
  { id: "attendance", label: "Attendance" },
  { id: "daily_rate", label: "Daily Rate" },
  // { id:'weekwagetotal', label:"Week Wage"},
  { id: "Sunday_wage", label: "Sunday Wage" },
  { id: "Sunday_wage1", label: "Sunday Wage 1" },
  { id: "Sunday_wage2", label: "Sunday Wage 2" },
  { id: "Holiday_wage", label: "Hoilday Wage" },
  { id: "ot_hour", label: "OT Hour" },
  { id: "ot_amount", label: "OT Amount" },
  { id: "adjustment_credits", label: "Adj.Amount" },
  { id: "concrete", label: "Concrete" },
  // { id: 'sundaymanday', label: 'Sunday Manday' },
  // { id: 'festivaladv_deduct', label: 'Festival Adv ded.' },
  // { id: 'specialadv_deduct', label: 'Special Adv ded.' },

  // { id: 'weeklyadv_deduct', label: 'Weekly Adv ded.' },
  // { id: 'retention', label: 'Retention' },
  // { id: 'designation', label: 'Designation' },
  // { id: 'skillset', label: 'Skill Type' },
  //{ id: 'daily_allowence', label: 'DA' },
  //{ id: 'dailyrate', label: 'Daily Rate' },
  // { id: 'weekwagetotal', label: 'weekwagetotal' },
  // { id: 'OTType', label: 'OT Type' },
  // { id: 'OTrate', label: 'OT Rate' },
  { id: "gross_wage", label: "Gross Wage" },
  { id: "total_deductions", label: "Deductions" },
  { id: "net_wage", label: "Net Wage" },
  { id: "paid_date", label: "Paid Date" },
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

  //paid handling
  const paidHandler = (row) => {
    setLoading(true);
    var data = {
      approved_list: row.id_for_approval,
      retention: row.retention,
      labourerid: row.labourerid,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/wagemanage/weekwageapproval`,
        data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        revalidate();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "5%" }} />
          </colgroup>
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
              <TableCell
                key="options"
                align="center"
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "navy",
                }}
              >
                Paid
              </TableCell>
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
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "attendance" ? value : value}
                          </TableCell>
                        );
                      })}
                      <TableCell
                        key="options"
                        align="center"
                        style={{ fontSize: "20px" }}
                      >
                        {/* <FcIcons.FcOk /> */}
                        <Checkbox
                          checked={row.status === "Paid"}
                          disabled={row.status === "Paid" ? true : false}
                          color="success"
                          onClick={() => paidHandler(row)}
                        />
                        {/*<span onClick={()=>reject_advance(row.id)}><FcIcons.FcCancel/></span>*/}
                      </TableCell>
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
