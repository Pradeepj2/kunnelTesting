import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as MdIcons from "react-icons/md";
import { connect } from "react-redux";
import { SnackbarProvider, useSnackbar } from "notistack";

import {
  site_list,
  salary_codes,
  wage_list,
  toggle_reg_labour_model,
  labours_list,
  users_list,
} from "../../redux/actions/siteActions";
import RegisterLabour from "./RegisterLabour";
import LaboursList from "./LaboursList";
import EditLabourData from "./EditLabourData";
const LabourManage = ({
  site_list,
  salary_codes,
  wage_list,
  toggle_reg_labour_model,
  labours_list,
  users_list,
}) => {
  //DECLARING STATES
  const [query, setQuery] = useState("");
  const [totalLabours, setTotalLabours] = useState([]);
  const [creatnewlabour, setcreatenewlabour] = useState(false);
  const [allLabour, setallLabour] = useState(false);
  const [editlabour, seteditlabour] = useState(false);
  const [deletelabour, setdeletelabour] = useState(false);

  useEffect(() => {
    axios
      .all([
        axios.get(
          `${process.env.REACT_APP_API_URL}/SalaryStrutManage/salarycode`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        ),
        axios.get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/wagemanage/wagelist`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/labourermanage/labourer/`, {
          headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
          },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/app1/user`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          salary_codes(responses[0].data.data);
          site_list(responses[1].data.data);
          wage_list(responses[2].data.data);
          labours_list(responses[3].data.data);
          setTotalLabours(responses[3].data.data.length);
          users_list(responses[4].data.data);
        })
      )
      .catch((error) => {
        // alert(error);
        console.log(error);
      });
  }, [site_list, salary_codes, wage_list, labours_list, users_list]);

  useEffect(() => {
    setTotalLabours([]);
  }, [labours_list]);

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] != ",") {
        temp += str[i];
      } else {
        if (temp === "createlabour") setcreatenewlabour(true);
        else if (temp === "AllLabour") setallLabour(true);
        else if (temp === "editlabour") seteditlabour(true);
        else if (temp === "deletelabour") setdeletelabour(true);
        temp = "";
      }
    }
    if (temp === "createlabour") setcreatenewlabour(true);
    else if (temp === "AllLabour") setallLabour(true);
    else if (temp === "editlabour") seteditlabour(true);
    else if (temp === "deletelabour") setdeletelabour(true);
  }, []);

  const revalidate = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/labourermanage/labourer/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.status === true) {
          labours_list(response.data);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => alert(error));
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <div className="subSectionContainer">
        <div className="title">
          <span>Labour Management</span>
          <hr className="seperationLine" />
        </div>
        <div className="subContent">
          <div className="subContentHeader">
            <span className="contentTitle">{`Total Labours: ${totalLabours}`}</span>
            <div style={{ width: "50%" }}>
              <Form.Control
                className="Inputresponse"
                style={{ textAlign: "center" }}
                type="text"
                placeholder="Search"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <span>
              {creatnewlabour || allLabour ? (
                <Button
                  className="btn btn-sm"
                  onClick={() => toggle_reg_labour_model(true)}
                >
                  <MdIcons.MdAddToPhotos />
                  Register New Labour
                </Button>
              ) : null}
            </span>
          </div>
          <hr className="seperationLine" />
          <LaboursList query={query} edit={editlabour} del={deletelabour} />
        </div>
      </div>
      <RegisterLabour
        setTotalLabours={setTotalLabours}
        revalidate={revalidate}
      />
      <EditLabourData revalidate={revalidate} />
    </SnackbarProvider>
  );
};

export default connect(null, {
  site_list,
  salary_codes,
  wage_list,
  toggle_reg_labour_model,
  labours_list,
  users_list,
})(LabourManage);
