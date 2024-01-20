import { axiosInstance } from "../config/axios";
export const startGetAllData = () => {
  return async (dispatch) => {
    try {
      const responses = await Promise.all([
        await axiosInstance.get("/users/all"),
        await axiosInstance.get("/groups/all"),
        await axiosInstance.get("/payments/all"),
        await axiosInstance.get("/visitors/types"),
      ]);
      dispatch(setAllData(responses.map((e) => e.data)));
    } catch (e) {
      console.log(e);
    }
  };
};

const setAllData = (data) => {
  return { type: "SET_ALL_DATA", payload: data };
};

export const startCreateGroup = (
  groupData,
  setServerErrors,
  // resetForm,
  navigate
) => {
  return async (dispatch) => {
    try {
      const groupResponse = await axiosInstance.post(
        "/groups/register",
        groupData
      );
      console.log(groupResponse.data);
      dispatch(addGroup(groupResponse.data));
      // resetForm();
      navigate("/dashboard");
    } catch (e) {
      console.log(e.response.data);
      setServerErrors(e.response.data.errors);
    }
  };
};

const addGroup = (group) => {
  return { type: "ADD_GROUP", payload: group };
};

export const startCreateGaurd = (
  gaurdData,
  resetForm,
  navigate,
  setServerError
) => {
  return async (dispatch) => {
    try {
      console.log("inside action");
      const gaurdResponse = await axiosInstance.post("/groups/createGaurd", gaurdData);
      dispatch(setGaurd(gaurdResponse.data));
      resetForm();
      navigate("/groups/all");
    } catch (e) {
      console.log(e.response?.data.errors[0].msg);
      setServerError(e.response.data?.errors[0]?.msg);
    }
  };
};

const setGaurd = (gaurd) => {
  return { type: "SET_GAURD", payload: gaurd };
};

export const startChangeGroupStatus = (groupData,toast) => {
  console.log(groupData);
  return async (dispatch) => {
    try {
      const group=await axiosInstance.put('/groups/status',groupData)
      dispatch(changeGroupStatus(group.data))
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.errors[0].msg)
    }
  };
};

const changeGroupStatus = (groupId) => {
  return { type: "CHANGE_GROUP_STATUS", payload: groupId };
};
