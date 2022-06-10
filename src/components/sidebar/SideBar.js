import React, { useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as GoIcons from "react-icons/go";
import * as HiIcons from "react-icons/hi";
import * as ImIcons from "react-icons/im";
import * as RiIcons from "react-icons/ri";
import * as BiIcons from "react-icons/bi";
import * as FiIcons from "react-icons/fa";
import * as MdIcon from "react-icons/md";
import { AiFillCalendar } from "react-icons/ai";
import { AiFillSetting } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import KunnelLogoColor from "../../images/KunnelLogoColor.png";
import "./Sidebar.css";

const SidebarData = [
  {
    title: "Site Management",
    path: "/sitemanage",
    icon: <RiIcons.RiBuildingFill />,
    name: "nav-text",
    perTitle: ["Allsite", "createsite", "editsite", "deletesite", "viewsite"],
  },
  {
    title: "User Management",
    path: "/usermanage",
    icon: <FaIcons.FaUsersCog />,
    name: "nav-text",
    perTitle: ["Alluser", "createuser", "edituser", "deleteuser", "viewuser"],
  },
  {
    title: "Labour Management",
    path: "/labourmanage",
    icon: <ImIcons.ImUsers />,
    name: "nav-text",
    perTitle: [
      "AllLabour",
      "createlabour",
      "editlabour",
      "deletelabour",
      "viewlabour",
    ],
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: <GoIcons.GoChecklist />,
    name: "nav-text",
    perTitle: ["Allattendence", "currentattendence", "pastattendence"],
  },
  {
    title: "Salary Management",
    path: "/salarymanage",
    icon: <FaIcons.FaMoneyBillWave />,
    name: "nav-text",
    perTitle: ["Allsalary", "wagecodecreation", "weeklywage", "monthlywage"],
  },
  {
    title: "Task",
    path: "/tasks",
    icon: <BiIcons.BiTask />,
    name: "nav-text",
  },
  {
    title: "Labour Benefits",
    path: "/benefits",
    icon: <GiIcons.GiReceiveMoney />,
    name: "nav-text",
    perTitle: [
      "Allbenefits",
      "advance",
      "adjustmentcredits",
      "miscellenousdebits",
      "wagesummerizedreports",
    ],
  },
  {
    title: "Compensation",
    path: "/compensation",
    icon: <FiIcons.FaCentercode />,
    name: "nav-text",
  },
  {
    title: "Retention",
    path: "/retention",
    icon: <FiIcons.FaCreativeCommonsNd />,
    name: "nav-text",
  },
  {
    title: "Arrears",
    path: "/arrears",
    icon: <MdIcon.MdOutlinePendingActions />,
    name: "nav-text",
  },
  {
    title: "Labour OT",
    path: "/labourot",
    icon: <RiIcons.RiBuildingFill />,
    name: "nav-text",
    perTitle: [
      "Allot",
      "createot",
      "otapproval",
      "otauthorization",
      "otreport",
    ],
  },
  // {
  //   title: 'Reports',
  //   path: '/reports',
  //   icon: <HiIcons.HiDocumentDownload />,
  //   name: 'nav-text',
  // },
  // {
  //   title: 'Approvals',
  //   path: '/approvals',
  //   icon: <FaIcons.FaCheckSquare />,
  //   name: 'nav-text',
  // },
  {
    title: "Concrete",
    path: "/concrete",
    icon: <GiIcons.GiConcreteBag />,
    name: "nav-text",
    perTitle: [
      "Allconcrete",
      "createconcrete",
      "concreteapproval",
      "concreteauthorization",
      "concretereport",
    ],
  },
  {
    title: "Holidays",
    path: "/holidays",
    icon: <AiFillCalendar />,
    name: "nav-text",
    perTitle: [
      "Allholiday",
      "createholiday",
      "editholiday",
      "deleteholiday",
      "viewholiday",
    ],
  },
  {
    title: "Settings",
    path: "/setting",
    icon: <AiFillSetting />,
    name: "nav-text",
    perTitle: ["Allsettings", "grade", "type", "task", "WeeklyPaymentTaskCode"],
  },
];

const SideBar = () => {
  const menuRef = useRef(null);
  const [display, setDisplay] = useState("block");
  var finalData = [];

  const permissions = localStorage.getItem("permissions");
  // console.log("testing>>>>>>>>>", permissions.includes("Alluser"));

  const handleToggle = (menuRef) => {
    menuRef.current.style.display = display;
    if (display === "none") {
      setDisplay("block");
    } else {
      setDisplay("none");
    }
  };

  var role = localStorage.getItem("role");
  var userType = localStorage.getItem("userType");
  if (role === "Finance") {
    finalData = SidebarData.filter(
      (obj) => obj.title != "User Management" && obj.title != "Labour OT"
    );
  } else if (role === "OperationDept") {
    if (userType === "ProjectManager") {
      finalData = SidebarData.filter(
        (obj) => obj.title === "Approvals" || obj.title === "Attendance"
      );
    }
    if (userType === "SiteEngineer") {
      finalData = SidebarData.filter(
        (obj) => obj.title === "Approvals" || obj.title === "Concrete"
      );
    }
    if (userType === "SiteAssitant") {
      finalData = SidebarData.filter(
        (obj) =>
          obj.title === "Attendance" ||
          obj.title === "Task" ||
          obj.title === "Concrete" ||
          obj.title === "Labour Management" ||
          obj.title === "Concrete" ||
          obj.title === "Holidays" ||
          obj.title === "Labour OT"
      );
    }
  } else {
    finalData = [
      {
        title: "Labour Management",
        path: "/labourmanage",
        icon: <ImIcons.ImUsers />,
        name: "nav-text",
      },
    ];
  }
  if (role === "admin" || role === "superadmin") {
    finalData = SidebarData;
  }
  function getPermission(array) {
    let flag = false;
    array.forEach((element) => {
      if (permissions.includes(element)) flag = true;
    });
    return flag;
  }
  //console logs for testing purpose

  //console.log(userType,"user type")

  return (
    <div className="navBar">
      <div className="company">
        <span>
          <img className="logo" src={KunnelLogoColor} alt="companyLogo" />
        </span>
        <span>
          <b className="name">KUNNEL</b>
        </span>
        <span className="toggleIcon" onClick={() => handleToggle(menuRef)}>
          <RiIcons.RiMenuLine />
        </span>
      </div>
      <div className="menu" ref={menuRef}>
        <ul
          className="menuItems"
          style={{ color: "white", backgroundColor: "navy", marginTop: "5%" }}
        >
          {SidebarData.map((item, index) => {
            if (
              role != "superadmin" &&
              !(item.perTitle && getPermission(item.perTitle))
            )
              return null;
            return (
              <li key={index} className={item.name}>
                <NavLink to={item.path} activeClassName="side-bar-active">
                  {item.icon}
                  <span className="navTitles">{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
