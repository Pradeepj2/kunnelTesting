import SideBar from './components/sidebar/SideBar';
import FooterSection from './components/footerSection/FooterSection';
import HeaderSection from './components/headerSection/HeaderSection';

export const Layout = ({ children }) => {
    return (
      <div className="container-fluid p-0 m-0" id="layout">
        <div className="sideBar">
          <SideBar />
        </div>
        <div className="rightSection">
          <HeaderSection />
          <div className="main">{children}</div>
          <FooterSection />
        </div>
      </div>
    );
  };

