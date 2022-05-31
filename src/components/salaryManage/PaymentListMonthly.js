import React, {useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  payment_list,
  payment_list_view,
} from '../../redux/actions/fetchActions';
import PaymentListTable from './PaymentListTable';
import SiteModal from '../utilModals/siteModal';

const PaymentListMonthly = ({ sites, payment_list, payment_list_view }) => {
  const { register, handleSubmit, errors } = useForm({ mode: 'onTouched' });

  //decalaring states
  const [show, setShow] = useState(false)
  const [siteid, setSiteid] = useState("")

  const onSubmit = (data) => {

    let Data = {...data,
      siteid:siteid
    }

    axios
      .post(
//`${process.env.REACT_APP_API_URL}/wagemanage/wages/mark_payments/?siteid=` +
`${process.env.REACT_APP_API_URL}/wagemanage/weekWage`,Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        if(res.data.status){
          payment_list(res.data.data);
          payment_list_view({
            site: data.site,
            from_date: data.from_date,
            to_date: data.to_date,
          });
        }
        else{
          alert(res.data.message)
        }
        
      })
      .catch((error) => {
        alert(error);
      });
  };

  const viewHandler = ()=>{
    setShow(true)
  }

  return (
    <>
       <SiteModal 
        //query={props.query}
        sites={sites} 
        show={show} 
        setShow={setShow}
        setSiteid={setSiteid}/>
      <Form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <Form.Row>
          <Form.Group as={Col} controlId="siteid">
            <Form.Label>Site Id</Form.Label>
            <div style={{display:"flex"}}>
              <div>
            <Form.Control  style={{width:'300px'}}
              type="text"
              name="siteid"
              value={siteid}
              disabled={true}
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
            {errors.siteid?.type === 'required' && (
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
            {errors.fromdate?.type === 'required' && (
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
            {errors.todate?.type === 'required' && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
          </Form.Group>
        </Form.Row>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
      <br />
      <PaymentListTable />
    </>
  );
};
const mapStateToProps = (state) => ({
  sites: state.sites,
});
export default connect(mapStateToProps, { payment_list, payment_list_view })(
  PaymentListMonthly
);
