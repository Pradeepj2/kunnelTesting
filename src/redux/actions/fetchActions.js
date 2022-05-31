import axios from "axios";

export const toggle_concrete_model = (data) => async (dispatch) => {
  dispatch({
    type: "TOGGLE_CONCRETE_MODEL",
    payload: data,
  });
};
export const toggle_labour_model = (data) => async (dispatch) => {
  dispatch({
    type: "TOGGLE_LABOUR_MODEL",
    payload: data,
  });
};
export const advance_pending_list = (data) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_API_URL}/advance/create_advance `, {
      // .get(`${process.env.REACT_APP_API_URL}/advance/advance_create_type`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        dispatch({
          type: "ADVANCE_PENDING",
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      error?.response?.data?.message
        ? alert(error?.response?.data?.message)
        : alert("Something went wrong");
    });
};

export const advance_total_list = (data) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_API_URL}/advance/advance_list/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data, "FINSL");
        dispatch({
          type: "ADVANCE_TOTAL_LIST",
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      error?.response?.data?.message
        ? alert(error?.response?.data?.message)
        : alert("Something went wrong");
    });
};
export const apply_advance_modal = (data) => async (dispatch) => {
  dispatch({
    type: "ADVANCE_MODAL",
    payload: data,
  });
};
export const payment_transaction_list = (data) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_API_URL}/wagemanage/wages/payments_list/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.data.status === true) {
        dispatch({
          type: "PAYMENT_TRANSACTION_LIST",
          payload: response.data.data,
        });
      } else {
        alert(response.data.message);
      }
    })
    .catch((error) => {
      error?.response?.data?.message
        ? alert(error?.response?.data?.message)
        : alert("Something went wrong");
    });
};
export const payment_details_modal = (data) => async (dispatch) => {
  dispatch({
    type: "PAYMENT_DETAILS_MODAL",
    payload: data,
  });
};
export const retention_pending = (data) => async (dispatch) => {
  dispatch({
    type: "RETENTION_PENDING",
    payload: data,
  });
};
export const retention_approved = (data) => async (dispatch) => {
  dispatch({
    type: "RETENTION_APPROVED",
    payload: data,
  });
};
export const compensation_pending = (data) => async (dispatch) => {
  dispatch({
    type: "COMPENSATION_PENDING",
    payload: data,
  });
};
export const compensation_approved = (data) => async (dispatch) => {
  dispatch({
    type: "COMPENSATION_APPROVED",
    payload: data,
  });
};
export const create_salary_structure_modal = (data) => async (dispacth) => {
  dispacth({
    type: "CREATE_SALARY_STRUCTURE_MODAL",
    payload: data,
  });
};
export const edit_salary_struct_modal = (data) => async (dispatch) => {
  dispatch({
    type: "EDIT_SALARY_STRUCTURE_MODAL",
    payload: data,
  });
};
export const advance_types = (data) => async (dispatch) => {
  dispatch({
    type: "ADVANCE_TYPES",
    payload: data,
  });
};
export const payment_list = (data) => async (dispatch) => {
  dispatch({
    type: "PAYMENT_LIST",
    payload: data,
  });
};
export const payment_list_view = (data) => async (dispatch) => {
  dispatch({
    type: "PAYMENT_LIST_VIEW",
    payload: data,
  });
};
export const labourer_master_data = (data) => async (dispatch) => {
  axios
    //  .get(
    //    `${process.env.REACT_APP_API_URL}/wagemanage/wages/labour_master_tab/?siteid=${data.site}&&fromdate=${data.from_date}&&todate=${data.to_date}`,
    .post(
      `${process.env.REACT_APP_API_URL}/wagemanage/weekWage`,
      // {
      //     headers: {
      //       Authorization: `Token ${localStorage.getItem('token')}`,
      //     },
      //   }
      {
        input: {
          siteid: data.site,
          fromdate: data.from_date,
          todate: data.to_date,
        },
      }
    )
    .then((response) => {
      if (response.data.status === true) {
        dispatch({
          type: "LABOUR_MASTER_DATA",
          payload: response.data.data,
        });
      } else {
        alert(response.data.message + "!");
      }
    })
    .catch((error) => {
      error?.response?.data?.message
        ? alert(error?.response?.data?.message)
        : alert("Something went wrong");
    });
};
export const salary_master_data = (data) => async (dispatch) => {
  axios
    .get(
      `${process.env.REACT_APP_API_URL}/wagemanage/wages/salary_master_tab/?siteid=${data.site}&&fromdate=${data.from_date}&&todate=${data.to_date}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((response) => {
      if (response.data.status === true) {
        dispatch({
          type: "SALARY_MASTER_DATA",
          payload: response.data.data,
        });
      } else {
        alert(response.data.message + "!");
      }
    })
    .catch((error) => {
      error?.response?.data?.message
        ? alert(error?.response?.data?.message)
        : alert("Something went wrong");
    });
};
export const wage_sheet_data = (data) => async (dispatch) => {
  axios
    .get(
      `${process.env.REACT_APP_API_URL}/wagemanage/wages/wages_sheet_tab/?siteid=${data.site}&&fromdate=${data.from_date}&&todate=${data.to_date}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((response) => {
      if (response.data.status === true) {
        dispatch({
          type: "WAGE_SHEET_DATA",
          payload: response.data.data,
        });
      } else {
        alert(response.data.message + "!");
      }
    })
    .catch((error) => {
      error?.response?.data?.message
        ? alert(error?.response?.data?.message)
        : alert("Something went wrong");
    });
};
export const register_of_wages_data = (data) => async (dispatch) => {
  axios
    .get(
      `${process.env.REACT_APP_API_URL}/wagemanage/wages/register_of_wages_tab/?siteid=${data.site}&&fromdate=${data.from_date}&&todate=${data.to_date}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((response) => {
      if (response.data.status === true) {
        dispatch({
          type: "REGISTER_OF_WAGES_DATA",
          payload: response.data.data,
        });
      } else {
        alert(response.data.message + "!");
      }
    })
    .catch((error) => {
      error?.response?.data?.message
        ? alert(error?.response?.data?.message)
        : alert("Something went wrong");
    });
};
export const wages_summary_data = (data) => async (dispatch) => {
  axios
    .get(
      `${process.env.REACT_APP_API_URL}/wagemanage/wages/wages_summary_tab/?siteid=${data.site}&&fromdate=${data.from_date}&&todate=${data.to_date}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((response) => {
      if (response.data.status === true) {
        dispatch({
          type: "WAGES_SUMMARY_DATA",
          payload: response.data.data,
        });
      } else {
        alert(response.data.message + "!");
      }
    })
    .catch((error) => {
      error?.response?.data?.message
        ? alert(error?.response?.data?.message)
        : alert("Something went wrong");
    });
};
export const labour_work_report = (data) => async (dispatch) => {
  dispatch({
    type: "LABOUR_WORK_REPORT",
    payload: data,
  });
};
export const concrete_cats = (data) => async (dispatch) => {
  dispatch({
    type: "CONCRETE_CATS",
    payload: data,
  });
};
export const labour_types = (data) => async (dispatch) => {
  dispatch({
    type: "LABOUR_TYPES",
    payload: data,
  });
};
export const ot_list = (data) => async (dispatch) => {
  dispatch({
    type: "OT_LIST",
    payload: data,
  });
};
export const toggle_comp_modal = (data) => async (dispatch) => {
  dispatch({
    type: "COMP_MODAL",
    payload: data,
  });
};
export const toggle_retention_modal = (data) => async (dispatch) => {
  dispatch({
    type: "RET_MODAL",
    payload: data,
  });
};
export const attendance = (data) => async (dispatch) => {
  dispatch({
    type: "ATTENDANCE",
    payload: data,
  });
};
export const edit_user_modal = (data) => async (dispacth) => {
  dispacth({
    type: "EDIT_USER_MODAL",
    payload: data,
  });
};
export const site_edit_modal = (data) => async (dispatch) => {
  dispatch({
    type: "EDIT_SITE_MODAL",
    payload: data,
  });
};
export const set_input_data = (data) => async (dispatch) => {
  dispatch({
    type: "INPUT_DATA",
    payload: data,
  });
};
export const toggle_tally_modal = (data) => async (dispatch) => {
  dispatch({
    type: "TALLY_MODAL",
    payload: data,
  });
};
export const edit_labour_modal = (data) => async (dispatch) => {
  dispatch({
    type: "EDIT_LABOUR_MODAL",
    payload: data,
  });
};
