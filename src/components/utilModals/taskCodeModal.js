import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const TaskCodeModal = (props) => {
  const useStyles = makeStyles({
    root: {
      width: "100%",
    },
    container: {
      maxHeight: 500,
    },
  });

  const classes = useStyles;
  console.log(props.labourInfo, props.labourTaskList)
  return (
    <>
      <Modal
        style={{ zIndex: "99999999999999999" }}
        show={props.show}
        onHide={() => {
          props.setShowTask(false);
        }}
      >
        <Modal.Header
          closeButton
          style={{ textAlign: "center" }}
        ></Modal.Header>
        <ModalBody>
          {props.labourInfo && props.labourTaskList &&
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>Tasks For Labour {props.labourInfo.labourer_name}</h3>
                <h5>Labour Id {props.labourInfo.labourerid}</h5>
                <h5>Designation {props.labourInfo.designation}</h5>
              </div>
              <Paper className={classes.root} style={{ marginTop: "20px" }}>
                <TableContainer className={classes.container}>
                  <Table stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>{'Task code & name'}</TableCell>
                        <TableCell>Daily Wage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.labourTaskList && props.labourTaskList.map(item => {
                        return (
                          <TableRow>
                            <TableCell>{item.date}</TableCell>
                            {item.task_code === null && item.task_name === null && <TableCell>{'0'}</TableCell>}
                            {item.task_code !== null && item.task_name !== null && <TableCell>{`${item.task_code}, ${item.task_name}`}</TableCell>}
                            <TableCell>{props.labourInfo.daily_rate}</TableCell>
                          </TableRow>
                        )
                      })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          }
        </ModalBody>
      </Modal>
    </>
  );
};

export default TaskCodeModal;
