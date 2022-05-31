import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as MdIcons from "react-icons/md";
import { connect } from "react-redux";
import {
  site_accounts,
  site_list,
  toggle_site_create_modal,
} from "../../redux/actions/siteActions";
import CreateSite from "./CreateSite";
import EditSiteData from "./EditSiteData";
import SiteLIst from "./SiteLIst";

const SiteManage = ({ toggle_site_create_modal, site_accounts, site_list }) => {
  const [totalSites, setTotalSites] = useState("");
  const [createnewsite, setcreatenewsite] = useState(false);
  const [allsite, setallsite] = useState(false);

  useEffect(() => {
    axios
      .all([
        axios.get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/tally/accounts/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          if (responses[0].status === 200) {
            site_list(responses[0].data.data);
            setTotalSites(responses[0].data.data);
          } else {
            alert(responses[0].data);
          }
          if (responses[1].status === 200) {
            site_accounts(responses[1].data);
          } else {
            alert(responses[1].data);
          }
        })
      )
      .catch((error) => {
        alert(error);
      });
  }, [site_accounts, site_list]);

  useEffect(() => {
    let str = localStorage.getItem("permissions");
    let temp = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== ",") {
        temp += str[i];
      } else {
        if (temp === "createsite") {
          setcreatenewsite(true);
        } else if (temp === "Allsite") {
          setallsite(true);
        }
        temp = "";
      }
    }
    if (temp === "createsite") {
      setcreatenewsite(true);
      return;
    } else if (temp === "Allsite") {
      setallsite(true);
      return;
    }
  }, []);

  function revalidate() {
    axios
      .all([
        axios.get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/tally/accounts/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          if (responses[0].status === 200) {
            site_list(responses[0].data.data);
          } else {
            alert(responses[0].data);
          }
          if (responses[1].status === 200) {
            site_accounts(responses[1].data);
          } else {
            alert(responses[1].data);
          }
        })
      )
      .catch((error) => {
        // alert(error);
      });
  }

  //######################declaring states here#########################//
  const [query, setQuery] = React.useState("");

  return (
    <>
      <Fragment>
        <div className="subSectionContainer">
          <div className="title">
            <span>Sites Management</span>
            <hr className="seperationLine" />
          </div>
          <div className="subContent">
            <div className="subContentHeader">
              <span className="contentTitle">{`Total Sites: ${totalSites.length}`}</span>
              <div style={{ width: "50%" }}>
                <Form.Control
                  className="Inputresponse"
                  style={{ textAlign: "center" }}
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <span
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {createnewsite || allsite ? (
                  <div>
                    <Button
                      className="btn btn-sm"
                      onClick={() => toggle_site_create_modal(true)}
                    >
                      <MdIcons.MdAddToPhotos />
                      Create Site
                    </Button>
                  </div>
                ) : null}
              </span>
            </div>
            <hr className="seperationLine" />
            <SiteLIst query={query} revalidate={revalidate} />
          </div>
        </div>
        <CreateSite revalidate={revalidate} />
        <EditSiteData revalidate={revalidate} />
      </Fragment>
    </>
  );
};

export default connect(null, {
  toggle_site_create_modal,
  site_accounts,
  site_list,
})(SiteManage);
