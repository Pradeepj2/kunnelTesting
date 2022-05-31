import { Snackbar } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Alert from "../Shared/Alert";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { useSnackbar } from "notistack";

const ChooseConcrete = ({ show, handleClose, getSelectedConcreteType }) => {
  const [data, setData] = useState([]);

  const handleSelectConcreteType = (id) => {
    getSelectedConcreteType(id);
    handleClose();
  };

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concreteload/ `,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setData(response.data);
        } else {
          showsuccErr({ msg: response.data.Message, variant: "error" });
          // alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [show]);

  return (
    <>
      <Modal show={show} onHide={handleClose} style={{ overflow: "auto" }}>
        <Modal.Header closeButton>
          <Modal.Title>Concrete Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                  key="Sl.No"
                ></TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                  key="Sl.No"
                >
                  Concrete Type
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                  key="Sl.No"
                >
                  Concrete load/capacity
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                  key="Options"
                >
                  Concrete Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((concrete, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell key="Options">
                      <span>
                        <Checkbox
                          onClick={() => handleSelectConcreteType(concrete.id)}
                        />
                      </span>
                    </TableCell>
                    <TableCell>{concrete.concrete_categoryname}</TableCell>
                    <TableCell>{concrete.load_capacity}</TableCell>
                    <TableCell>{concrete.amount}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChooseConcrete;
