const initialState = {
  users: [],
  groups: [],
  payments:[],
  visitorTypes: [],
};

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ALL_DATA":
      return {
        ...state,
        users: action.payload[0],
        groups: action.payload[1],
        payments:action.payload[2],
        visitorTypes: action.payload[3],
      };
    case "ADD_GROUP":
      return { ...state, groups: [...state.groups, action.payload] };
    case "SET_GAURD":
      return {...state,users:[...state.users,action.payload],groups:state.groups.map(e=>{
        if(e._id===action.payload.group)
        return {...e,gaurd:action.payload}
      else return {...e}
      })}
    case "CHANGE_GROUP_STATUS": {
      const groups = [...state.groups].map((e) => {
        if (e._id === action.payload._id) {
          e.status = action.payload.status;
          return { ...e };
        } else return { ...e };
      });
      return {...state,groups}
    }
    default:
      return { ...state };
  }
};
