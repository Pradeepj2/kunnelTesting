import React from 'react';
import { NavLink } from 'react-router-dom';
import './TopBar.css';

import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import * as RiIcons from 'react-icons/ri';
import * as GoIcons from 'react-icons/go';
import * as MdIcons from 'react-icons/md';
import * as HiIcons from 'react-icons/hi';
import * as GiIcons from 'react-icons/gi';
import * as ImIcons from 'react-icons/im';

const TopbarData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <AiIcons.AiFillAppstore />,
    name: 'nav-text',
  },
  {
    title: 'User Management',
    path: '/usermanage',
    icon: <FaIcons.FaUsersCog />,
    name: 'nav-text',
  },
  {
    title: 'Site Management',
    path: '/sitemanage',
    icon: <RiIcons.RiBuildingFill />,
    name: 'nav-text',
  },
  {
    title: 'Labour Management',
    path: '/labourmanage',
    icon: <ImIcons.ImUsers />,
    name: 'nav-text',
  },
  {
    title: 'Attendance',
    path: '/attendance',
    icon: <GoIcons.GoChecklist />,
    name: 'nav-text',
  },
  {
    title: 'Salary Management',
    path: '/salarymanage',
    icon: <FaIcons.FaMoneyBillWave />,
    name: 'nav-text',
  },
  {
    title: 'Finance',
    path: '/finance',
    icon: <MdIcons.MdWork />,
    name: 'nav-text',
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: <HiIcons.HiDocumentDownload />,
    name: 'nav-text',
  },
  {
    title: 'Approvals',
    path: '/approvals',
    icon: <FaIcons.FaCheckSquare />,
    name: 'nav-text',
  },
  {
    title: 'Concrete',
    path: '/concrete',
    icon: <GiIcons.GiConcreteBag />,
    name: 'nav-text',
  },
];

// import KunnelLogoColor from '../../utilities/logo/KunnelLogoColor.png'
const TopBar = () => {
  const handleChange = () => {
    document.querySelector('.menu').classList.toggle('isActive');
  };
  return (
    <div className="ntopNavBar">
      <div className="company">
        <span>
          {/*<img className="logo" src={KunnelLogoColor} alt="companyLogo"/> */}
          <b className="name">KUNNEL</b>
        </span>
      </div>
      <div className="toggleLogo" onClick={handleChange}>
        <HiIcons.HiMenu />
      </div>
      <div className="menu">
        <ul className="menuItems">
          {TopbarData.map((item, index) => {
            return (
              <li key={index} className={item.name}>
                <NavLink to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TopBar;
