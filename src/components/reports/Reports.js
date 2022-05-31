import React, { useEffect,useState } from 'react';
import './Reports.css';
import { useForm } from 'react-hook-form';
import { Tab, Tabs, Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';
import { site_list } from '../../redux/actions/siteActions';
import { connect } from 'react-redux';
import {
  labourer_master_data,
  salary_master_data,
  wage_sheet_data,
  register_of_wages_data,
  wages_summary_data,
  set_input_data,
} from '../../redux/actions/fetchActions';
// import LabourMaster from './LabourMaster';
// import SalaryMaster from './SalaryMaster';
// import WageSheet from './WageSheet';
// import RegisterOfWages from './RegisterOfWages';
import LabourWorkReport from './LabourWorkReport';
import PfEsiReport from './PfEsiReport'
import * as ImIcons from 'react-icons/im';
import SiteModal from '../utilModals/siteModal';
const Reports = ({
  sites,
  site_list,
  labourer_master_data,
  salary_master_data,
  wage_sheet_data,
  register_of_wages_data,
  wages_summary_data,
  set_input_data,
  inputData,
}) => {
  const { register, handleSubmit, errors } = useForm({ mode: 'onChange' });

  const [show, setShow] = useState(false)
  const [siteid, setSiteid] = useState("")
  const [report,setReport] = useState([])
  const [siteCode,setSiteCode] = useState("")

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        if ((res.data.status = true)) {
          site_list(res.data.data);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) =>{
       //alert(error)
      }
       )

  }, [site_list, set_input_data]);

  const onSubmit = (data) => {

    let Data = {...data,
      siteid:siteid
    }

    set_input_data(Data);

    labourer_master_data(Data);

    salary_master_data(Data);

    wage_sheet_data(Data);

    register_of_wages_data(Data);

    wages_summary_data(Data);

    axios
    .post(`${process.env.REACT_APP_API_URL}/wagemanage/month_pf_esi_list`,Data, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => {
         
      if ((res.data.status === true)) {
          setReport(res.data.data)
      } else {
        alert(res.data.message);
      }
    })
    .catch((error) =>{
     //alert(error)
    }
     )


  };

  const viewHandler = ()=>{
    setShow(true)
  }

  return (
    <div className="subSectionContainer">
       <SiteModal 
        sites={sites} 
        show={show} 
        setShow={setShow}
        setSiteCode={setSiteCode}
        setSiteid={setSiteid}/>
      <div className="title">
        <span>Reports</span>
        <hr className="seperationLine" />
      </div>
      <div className="subContent">
        <div className="subContentHeader">
          <span className="contentTitle">Salary Reports</span>
        </div>
        <hr className="seperationLine" />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Form.Group as={Col} controlId="site">
              <Form.Label>Site Code</Form.Label>
              <div  style={{display:"flex"}}>
                <div>
              <Form.Control style={{width:'250px'}}
                type="text"
                name="site"
                disabled={true}
                value={siteCode}
                ref={register({
                  required: true,
                })}
              >
                {/* <option key="0" value="">
                  Select
                </option>
                {!(Object.keys(sites).length === 0)
                  ? sites.map((site) => {
                      const { id, site_id } = site;
                      return (
                        <option key={id} value={site_id}>
                          {site_id}
                        </option>
                      );
                    })
                  : null} */}
              </Form.Control>
              {errors.site?.type === 'required' && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
              </div>
              <div>  <Button style={{backgroundColor:'navy'}} onClick={(e)=>viewHandler()}>View</Button></div>
              </div>
            </Form.Group>

            <Form.Group as={Col} controlId="fromdate">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                name="fromdate"
                ref={register({
                  required: true,
                })}
              ></Form.Control>
              {errors.from_date?.type === 'required' && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="todate">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                name="todate"
                ref={register({
                  required: true,
                })}
              ></Form.Control>
              {errors.to_date?.type === 'required' && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit">
            View
          </Button>
        </Form>

        <Button
          className="btn btn-sm mt-3"
          // href={
          //   `${process.env.REACT_APP_API_URL}/wagemanage/wages/download/?siteid=` +
          //   inputData.site +
          //   '&&fromdate=' +
          //   inputData.from_date +
          //   '&&todate=' +
          //   inputData.to_date
          // }
        >
          <ImIcons.ImDownload2 />
          Download Reports
        </Button>

        <Tabs
          defaultActiveKey="PfEsiReport"
          id="uncontrolled-tab-example"
          style={{ fontSize: '14px', marginTop: '10px' }}
        >
          {/* <Tab eventKey="labourMaster" title="Labour Master">
            <LabourMaster />
          </Tab> */}
          {/* <Tab eventKey="salaryMaster" title="Salary Master">
            <SalaryMaster />
          </Tab> */}
          {/* <Tab eventKey="wageSheet" title="Wage Sheet">
            <WageSheet />
          </Tab>
          <Tab eventKey="redisterOfWages" title="Register Of Wages">
            <RegisterOfWages />
          </Tab> */}
          <Tab eventKey="PfEsiReport" title="PF/ESI">
            <PfEsiReport report={report}/>
          </Tab>
        </Tabs>
      </div>
      <div className="subContent">
        <LabourWorkReport />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  sites: state.sites,
  inputData: state.inputData,
});
export default connect(mapStateToProps, {
  set_input_data,
  site_list,
  labourer_master_data,
  salary_master_data,
  wage_sheet_data,
  register_of_wages_data,
  wages_summary_data,
})(Reports);
