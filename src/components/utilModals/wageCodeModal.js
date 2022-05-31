
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const WageCodeModal = (props) => {
    
  //##############################declaring states####################//
    const [code,setCode] = useState("")
    const [query,setQuery] = useState("")
    const [selected,setSelected] = useState([])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

  //handling form submit

  const columns = [
    { id: 'id', label: 'code', minWidth: 100 },
    // { id: 'labourer_class', label: 'Labourer Class', minWidth: 100 },
     { id: 'labourer_class', label: 'Designation', minWidth: 100 },
     { id: 'labourer_category', label: 'Labour Category', minWidth: 170 },
     { id: 'gender', label: 'Gender', minWidth: 100 },
     { id: 'Skill_set', label: 'Skill Type', minWidth: 100 },
     { id: 'Grade', label: 'Grade', minWidth: 100 },
     { id: 'daily_rate', label: 'Daily Rate', minWidth: 100 },
     { id: 'basic_pay', label: 'Basic Pay', Width: 100 },
     { id: 'daily_allowence', label: 'Daily Allowence', minWidth: 100 },
     { id: 'Site', label: 'Site', minWidth: 100 },
  ];

  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 500,
    },
  });

  const rows = props.wageCode;
  
  //const query = props.query
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const submitHandler = ()=>{
        props.setWagecode(code)
        setTimeout(()=>{
            props.setWageShow(false)
        },0)
        
  }

const checkHandler = (e,idx)=>{
  var selected = []

  var n = rows
  .filter((obj) =>
             JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
        ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  for(var i=0;i<n.length;i++)
      {
        if(i===idx)
        {
          selected.push(n[i])
        }
        else{
          selected.push('')
        }
        
      }

  setSelected(selected)
 }
 
  
  return (
    <>
      <Modal
        //show={props.modal}
        style={{zIndex:"9999999999999999999999999999999"}}
        show={props.wageShow}
        onHide={() =>{
        //props.showModal(false)
            props.setWageShow(false)
        
        }
        } 
      >
        
        <Modal.Header closeButton>
          <Modal.Title>Select Wage Code</Modal.Title>
          <div style={{width:'50%', transform:'translateX(30%)', marginTop:'5px'}}>
               <Form.Control
                style={{textAlign:'center'}}
                type="text"
                placeholder="Search"
                onChange={(e)=>setQuery(e.target.value)}
      />
      </div>
        </Modal.Header>
        <Modal.Body>

    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table
          style={{ minWidth: '1600px' }}
          stickyHeader
          aria-label="sticky table"
          size="small"
        >
          <TableHead>
            <TableRow>
            <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
                key="Sl.No"
              >
                Sl.No.
              </TableCell>
            <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
                key="select"
              >
                select
              </TableCell>
              {columns.map((column, idx) => (
                <TableCell
                  key={idx}
                  align={column.align}
                  style={{
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: 'navy',
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
               JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
          )
                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                        <TableCell key="Sl.No">
                          {rows.indexOf(row) + 1}
                        </TableCell>
                        <TableCell>
                            <input
                            checked={selected.some((ele)=>ele.id === row.id )}
                            onChange={(e)=>{
                              checkHandler(e,idx)
                              setCode(row.id)}}
                            type="checkbox"/>
                        </TableCell>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align} >
                              <div>
                              {column.format && typeof value === 'number'
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
        {/* {!rows.filter((obj) => JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())).obj.length?(
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    <Button style={{backgroundColor:'navy',marginTop:"10px"}} onClick={(e)=>submitHandler()}>Submit</Button>
        </Modal.Body>
      </Modal>
     
    </>
  );
};

export default WageCodeModal;
