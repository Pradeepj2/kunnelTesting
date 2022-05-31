import React from "react";
import "./HeaderSection.css";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineLogin } from "react-icons/ai";
import { useHistory } from "react-router-dom";
const HeaderSection = () => {
  const history = useHistory();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    history.push("/");
  };

  var userType = "";
  if (localStorage.getItem("role") === "admin") {
    userType = "admin";
  } else if (localStorage.getItem("role") === "superadmin") {
    userType = "superadmin";
  } else {
    userType = localStorage.getItem("userType");
  }

  return (
    <div className="headerSection">
      <div className="user">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            {" "}
            <FaUserCircle />
          </div>
          <div style={{ marginTop: "4px", marginLeft: "2px" }}>
            {localStorage.getItem("user")}
          </div>
          <div
            style={{
              marginTop: "6px",
              marginLeft: "4px",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >{`(${userType})`}</div>
        </div>
      </div>
      <div className="exit">
        <span onClick={handleLogout}>
          <AiOutlineLogin />
        </span>
      </div>
    </div>
  );
};

export default HeaderSection;
