import React, { useEffect } from 'react';
import './Finance.css';
import axios from 'axios';
import TallyData from './TallyData';

import { connect } from 'react-redux';
import { tally_data } from '../../redux/actions/financeActions.js';
import * as MdIcons from 'react-icons/md';
import { Button } from 'react-bootstrap';
import { toggle_tally_modal } from '../../redux/actions/fetchActions';
import CreateAccount from './CreateAccount';

const Finance = ({ tally_data, toggle_tally_modal }) => {
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/tally/tally/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        tally_data(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
  }, [tally_data]);

  return (
    <div className="subSectionContainer">
      <div className="title">
        <span>Finance</span>
        <hr className="seperationLine" />
      </div>
      <div className="subContent">
        <div className="subContentHeader">
          <span className="contentTitle">Tally Data</span>
        </div>
        <span>
          {' '}
          <Button
            className="btn btn-sm"
            onClick={() => toggle_tally_modal(true)}
          >
            <MdIcons.MdAddToPhotos />
            Create Account
          </Button>
        </span>
        <hr className="seperationLine" />

        <TallyData />
      </div>
      <CreateAccount />
    </div>
  );
};

export default connect(null, { tally_data, toggle_tally_modal })(Finance);
