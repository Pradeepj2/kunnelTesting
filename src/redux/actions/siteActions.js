import axios from "axios";
export const toggle_site_create_modal = (data) => async (dispatch) => {
  dispatch({
    type: "TOGGLE_SITE_CREATE_MODAL",
    payload: data,
  });
};

export const site_accounts = (data) => async (dispatch) => {
  dispatch({
    type: "SITE_ACCOUNTS",
    payload: data,
  });
};

export const users_list = (data) => async (dispatch) => {
  dispatch({
    type: "USERS_LIST",
    payload: data,
  });
};
export const site_list = (data) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      if (res.data.status === true) {
        dispatch({
          type: "SITE_LIST",
          payload: res.data.data,
        });
      }
    })
    .catch((error) => console.log(error));
};

export const salary_codes = (data) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_API_URL}/SalaryStrutManage/salarycode`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.data.status === true) {
        dispatch({
          type: "SALARY_CODE",
          payload: response.data.data,
        });
      } else {
        alert(response.data.message + "!");
      }
    })
    .catch((error) => alert(error));
};
export const wage_list = (data) => async (dispatch) => {
  dispatch({
    type: "WAGE_LIST",
    payload: data,
  });
};
export const toggle_reg_labour_model = (data) => async (dispatch) => {
  dispatch({
    type: "TOGGLE_REG_LABOUR_MODAL",
    payload: data,
  });
};
export const labours_list = (data) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_API_URL}/labourermanage/labourer/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.data.status === true) {
        dispatch({
          type: "LABOURS_LIST",
          payload: response.data.data,
        });
      } else {
        alert(response.data.message);
      }
    })
    .catch((error) => alert(error));
};
