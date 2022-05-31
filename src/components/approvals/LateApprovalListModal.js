import React,{ useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios'
import fileSaver from 'file-saver'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 500,
  },
});

const LateApprovalListModal = (props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [list, setList] = React.useState([])
  const [loading,setLoading] = React.useState(false)


  useEffect(()=>{
    let Data = {...props.Data,
      labourer_id:props.labourerid
  }
  

      axios.post(`${process.env.REACT_APP_API_URL}/approvals/otapproval/late_deduction_detail/`,Data,
        {
          headers: {
            Authorization: `token ${localStorage.getItem('token')}`,
          },
        } )
        .then((res)=>{
          setLoading(true)
            if(res.data.status)
            {
               setList(res.data.data)
               setLoading(false)
            }

        })


  },[props])


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //exporting to excel
  const exportHandler  = ()=>{
    axios.get(`${process.env.REACT_APP_API_URL}/wagemanage/wages/total_late_detailed/?fromdate=${props.start}&todate=${props.end}&siteid=${props.siteid}&labourerid=${props.labourerid}`
    , { responseType: 'arraybuffer' })
        .then((response) => {
          var blob = new Blob([response.data], 
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fileSaver.saveAs(blob, `late_${props.labourerid}_approval.xlsx`);
        });
    

}

  return (
    <>
    <Modal
    show={props.show}
    onHide={() =>{
            props.setShow(false)
            setList([])
        }
    }
    >
    <Modal.Header closeButton>
     <Modal.Title>{`Labourer Id:${props.labourerid}`}</Modal.Title>
    </Modal.Header>
       <Modal.Body>
       {(loading)?( <Spinner animation="border" role="status" className="loadingSiteModal">
        </Spinner>):null}
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Sl.No.
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Labourer Id
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Date
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Late Time
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Option
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {((list).length !== 0) ? (
              list
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row,idx) => {
                   const { labourerid, date} = row;
                  //  return info.map((item) => {
                    return (
                      <>
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={idx}
                        >
                          <TableCell>
                            {/* {row.indexOf(item) === 0
                              ? rows.indexOf(row) + 1
                              : null} */}
                              {list.indexOf(row) + 1}
                          </TableCell>
                          <TableCell>
                            {/* {info.indexOf(item) === 0 ? labourerid : null} */}
                            {labourerid}
                          </TableCell>
                          <TableCell>
                            {date}
                          </TableCell>
                          <TableCell>
                            {row.late_time}
                          </TableCell>
                          <TableCell style={{color:'red'}}>Options</TableCell>
                        </TableRow>
                      </>
                    );
                  
                })
            ) : (
              <TableRow>
                <TableCell colSpan="8" className="text-center text-danger p-5">
                  {(list.length)?"No Data Available!":""}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={list.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        nRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    <Button style={{marginTop:'2em'}}  onClick={()=>(list.length)?exportHandler():null}>Export To Excel</Button>
     </Modal.Body>
    </Modal>
    </>
  );
};


export default LateApprovalListModal;
