import React, { useState, useEffect } from "react";
import SiteModal from "../utilModals/siteModal";
import { Form } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
import LabourWithFilter from "../salaryManage/retensionCompensation/LabourWithFilterData";
// import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import { makeStyles } from "@material-ui/core";
// import { Autocomplete } from "@mui/material";
// import { TextField } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
// import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Button, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
const columns = [
  { id: "sl", lable: "SL", minWidth: 100 },
  { id: "week_from", lable: "Week From" },
  { id: "week_to", lable: "Week To" },
  { id: "amount", lable: "Amount" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const Retention = (props) => {
  const [show, setShow] = React.useState(false);
  const [sites, setSites] = useState([]);
  const [code, setSiteCode] = useState("");
  const [showLabour, setShowLabour] = useState(false);
  const [siteid, setSiteid] = useState(sites.length ? sites[0].site_code : "");
  const [labourerId, setLabourerId] = React.useState();
  const [labourName, setLabourName] = useState("");
  const [totalRetention, settotalRetention] = useState("");
  const [arr, setArr] = useState([]);

  const viewHandler = () => {
    setLabourerId("");
    setShow(true);
  };
  const labourHandler = () => {
    setShowLabour(true);
  };
  const { register, handleSubmit, errors } = useForm({
    mode: "onTouched",
  });

  const { enqueueSnackbar } = useSnackbar();
  const showsuccErr = ({ msg, variant }) => {
    enqueueSnackbar(msg, { variant });
  };

  const onSubmit = () => {
    let Data = {
      siteid: siteid,
      labourerid: labourerId[0] === "L" ? labourerId : "LAB00" + labourerId,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/wagemanage/labour_retention`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          setArr(res.data.data);
          if (res.data.data.length === 0)
            showsuccErr({ msg: "Empty", variant: "error" });
          settotalRetention(res.data.total_retention);
        } else {
          showsuccErr({ msg: res.data.message, variant: "error" });
          setArr([]);
        }
      })
      .catch((err) => showsuccErr({ msg: err, variant: "error" }));
  };
  const classes = useStyles();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.data) setSites(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="subContent">
      <div className="subContentHeader" style={{ marginTop: "2%" }}>
        <span className="contentTitle" style={{ fontSize: "1.3rem" }}>
          Retention
        </span>
      </div>
      <hr className="seperationLine" />
      <SiteModal
        query={props.query}
        sites={sites}
        show={show}
        setShow={setShow}
        setSiteid={setSiteid}
        setSiteCode={setSiteCode}
      />
      {code ? (
        <LabourWithFilter
          showLabour={showLabour}
          setShowLabour={setShowLabour}
          setLabourerId={setLabourerId}
          filterParameter={code}
          setLabourName={setLabourName}
        />
      ) : null}
      <Form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "2%" }}>
        <Form.Row
          style={{
            width: "100",
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "800px",
          }}
        >
          <Form.Group as={Col} controlId="site">
            <Form.Label>Site Code</Form.Label>
            <div style={{ display: "flex" }}>
              <div>
                <Form.Control
                  style={{ width: "220px" }}
                  type="text"
                  name="site"
                  value={code}
                  disabled={true}
                  ref={register({
                    required: true,
                  })}
                ></Form.Control>
                {errors.site?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </div>
              <div>
                {" "}
                <Button
                  style={{ backgroundColor: "navy" }}
                  onClick={(e) => viewHandler()}
                >
                  View
                </Button>
              </div>
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="labourer_id">
            <Form.Label>Labourer ID</Form.Label>
            <div style={{ display: "flex" }}>
              <div>
                <Form.Control
                  style={{ width: "220px" }}
                  type="text"
                  name="labourer_id"
                  disabled={true}
                  value={labourerId}
                  ref={register({
                    required: true,
                  })}
                ></Form.Control>
                {errors.labourer_id?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </div>
              <div>
                {" "}
                <Button
                  style={{ backgroundColor: "navy" }}
                  onClick={(e) => labourHandler()}
                >
                  View
                </Button>
              </div>
            </div>
          </Form.Group>

          <Form.Group controlId="generate">
            <Button
              style={{ marginLeft: "5px", marginTop: "25px" }}
              type="submit"
              variant="primary"
            >
              generate
            </Button>
          </Form.Group>
        </Form.Row>
        <Form.Row
          style={{
            fontSize: "0.85rem",
            padding: "5px",
            display: "flex",
            width: "65%",
            justifyContent: "space-between",
            maxWidth: "800px",
            marginTop: "15px",
          }}
        >
          <Form.Group>
            <div>
              Labour Id :{" "}
              <span style={{ fontWeight: "bolder" }}>{labourerId}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div>
              Labour Name :{" "}
              <span style={{ fontWeight: "bolder" }}>{labourName}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div>
              Total Retention :{" "}
              <span style={{ fontWeight: "bolder" }}>
                <strong>{totalRetention} Rs.</strong>
              </span>
            </div>
          </Form.Group>
        </Form.Row>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow style={{ width: "100%" }}>
                {columns.map((data) => {
                  return (
                    <TableCell
                      key={columns.id}
                      align={columns.align}
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "navy",
                        textAlign: "center",
                      }}
                    >
                      {data.lable}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {arr.length != 0
                ? arr.map((data, id) => (
                    <TableRow hover>
                      <TableCell style={{ textAlign: "center" }}>
                        {id + 1}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data.from_date}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data.to_date}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data.amount}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Form>
      {arr.length ? (
        <div
          style={{
            fontSize: "0.9rem",
            marginTop: "15px",
            padding: "8px",
            lineHeight: "0.5",
            display: "flex",
            flexDirection: "row-reverse",
            background: "navy",
            color: "white",
          }}
        >
          <p style={{ margin: "0px", padding: "5px" }}>
            Total Retention <strong>{totalRetention} Rs.</strong>
          </p>
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  sites: state.sites,
});

export default connect(mapStateToProps)(Retention);
