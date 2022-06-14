import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Approvals from "./components/approvals/Approvals";
import Attendance from "./components/attendance/Attendance";
import Concrete from "./components/concrete/Concrete";
import Finance from "./components/finance/Finance";
import { Layout } from "./Layout";
import LabourManage from "./components/labourManage/LabourManage";
import Reports from "./components/reports/Reports";
import Retension from "./components/salaryManage/retensionCompensation/Retension";
import SalaryManage from "./components/salaryManage/SalaryManage";
import HolidayManage from "./components/Holidays/holidayManage";
import SignIn from "./components/signIn/SignIn";
import SiteManage from "./components/siteManage/SiteManage";
import UserManage from "./components/userManage/UserManage";
import SpecificHolidayList from "./components/Holidays/specificHolidayList";
import Setting from "./components/Setting/setting";
import LabourOT from "./components/LabourOT/LabourOT";
import Task from "./components/task/Task";
import Conpensation from "./components/compensation/Conpensation";
import Retention from "./components/retention/Retention";
import { SnackbarProvider } from "notistack";
import Arrears from "./components/arrears/Arrears";

const App = () => {
  const [token, setToken] = React.useState(localStorage.getItem("token"));

  React.useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [setToken]);

  return (
    <>
      <SnackbarProvider>
        <BrowserRouter>
          <Route
            render={({ location }) => (
              <Switch location={location}>
                <Route path="/" exact={token ? true : false}>
                  <SignIn setToken={setToken} />
                </Route>

                <Route path="/usermanage">
                  <Layout>
                    <UserManage />
                  </Layout>
                </Route>
                <Route path="/labourot" exact>
                  <Layout>
                    <LabourOT />
                  </Layout>
                </Route>
                <Route path="/holidays" exact>
                  <Layout>
                    <HolidayManage />
                  </Layout>
                </Route>
                <Route path="/sitemanage">
                  <Layout>
                    <SiteManage />
                  </Layout>
                </Route>
                <Route path="/labourmanage">
                  <Layout>
                    <LabourManage />
                  </Layout>
                </Route>
                <Route path="/attendance">
                  <Layout>
                    <Attendance />
                  </Layout>
                </Route>
                <Route
                  path="/holidays/:siteId"
                  exact
                  component={SpecificHolidayList}
                />
                <Route path="/salarymanage">
                  <Layout>
                    <SalaryManage />
                  </Layout>
                </Route>
                <Route path="/tasks">
                  <Layout>
                    <Task />
                  </Layout>
                </Route>
                <Route path="/compensation">
                  <Layout>
                    <Conpensation />
                  </Layout>
                </Route>
                <Route path="/retention">
                  <Layout>
                    <Retention />
                  </Layout>
                </Route>
                <Route path="/arrears">
                  <Layout>
                    <Arrears />
                  </Layout>
                </Route>
                <Route path="/benefits">
                  <Layout>
                    <Retension />
                  </Layout>
                </Route>
                <Route path="/setting">
                  <Layout>
                    <Setting />
                  </Layout>
                </Route>
                <Route path="/finance">
                  <Layout>
                    <Finance />
                  </Layout>
                </Route>
                <Route path="/reports">
                  <Layout>
                    <Reports />
                  </Layout>
                </Route>
                <Route path="/approvals">
                  <Layout>
                    <Approvals />
                  </Layout>
                </Route>
                <Route path="/concrete">
                  <Layout>
                    <Concrete />
                  </Layout>
                </Route>
                <Redirect to="/" />
              </Switch>
            )}
          />
        </BrowserRouter>
      </SnackbarProvider>
    </>
  );
};

export default App;
