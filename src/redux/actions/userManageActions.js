export const toggle_user_create_model = (data) => async (dispatch) => {
  dispatch({
    type: "USER_CREATE_MODEL",
    payload: data,
  });
};

export const user_roles = (data) => async (dispatch) => {
  dispatch({
    type: "USER_ROLE",
    payload: data,
  });
};

export const users_list = (data) => async (dispatch) => {
  dispatch({
    type: "USERS_LIST",
    payload: data,
  });
};
