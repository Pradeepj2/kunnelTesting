import React,{ useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import axios from 'axios';
import { Form, Button, Col } from 'react-bootstrap';
import { labour_work_report } from '../../redux/actions/fetchActions';
import LabourReportTable from './LabourReportTable';
import SiteModal from '../utilModals/siteModal'

const LabourWorkReport = ({ labour_work_report, sites }) => {
  const { register, handleSubmit, errors } = useForm({ mode: 'onTouched' });

  //##############declaring states###########//
  const [show, setShow] = useState(false)
  const [siteid, setSiteid] = useState("")
  const [siteCode,setSiteCode] = useState("")

  const onSubmit = (data) => {


    axios
      .get(
        `${process.env.REACT_APP_API_URL}/attendancemanage/report/?siteid=` +
          data.site +
          '&from_date=' +
          data.from_date +
          '&to_date=' +
          data.to_date,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          labour_work_report(res.data.data);
        }
      })
      .catch((error) => alert(error));
  };

  const viewHandler = ()=>{
    setShow(true)
  }


  return (
    <>
      <div className="subContentHeader">
      <SiteModal 
        sites={sites} 
        show={show} 
        setShow={setShow}
        setSiteCode={setSiteCode}
        setSiteid={setSiteid}/>
        <span className="contentTitle">Labour Work Reports</span>
      </div>
      <hr className="seperationLine" />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Row>
          <Form.Group as={Col} controlId="site">
            <Form.Label>Site Code</Form.Label>
            <div style={{display:"flex"}}>
              <div>
            <Form.Control  style={{width:'250px'}}
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
            {errors.siteId?.type === 'required' && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
            </div>
            <div> <Button style={{backgroundColor:'navy'}} onClick={(e)=>viewHandler()}>View</Button></div>
            </div>
          </Form.Group>

          <Form.Group as={Col} controlId="from_date">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              name="from_date"
              ref={register({
                required: true,
              })}
            ></Form.Control>
            {errors.fromDate?.type === 'required' && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
          <Form.Group as={Col} controlId="to_date">
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              name="to_date"
              ref={register({
                required: true,
              })}
            ></Form.Control>
            {errors.toDate?.type === 'required' && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
        </Form.Row>
        <Button variant="primary" type="submit">
          Get Report
        </Button>
      </Form>
      <div className="mt-5">
        <LabourReportTable />
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  sites: state.sites,
});
export default connect(mapStateToProps, { labour_work_report })(
  LabourWorkReport
);
