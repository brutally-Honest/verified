//Reducer function for useReducer Hook
import _ from "lodash";
export const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_ADMIN":
      return { ...state, user: action.payload, isLoggedIn: true };
    case "SET_USER":
      return {
        ...state,
        user: action.payload[0],
        group: action.payload[1],
        visitorTypes: action.payload[2],
        isLoggedIn: true,
      }; //Login
    case "REMOVE_USER":
      return { ...state, user: {}, group: {}, isLoggedIn: false }; //Logout
    case "SET_PROFILE": {
      if (state.user.userAuthId)
        return {
          ...state,
          user: { ...state.user, userAuthId: action.payload },
        };
      else return { ...state, user: action.payload };
    }
    case "SET_USER'S_GROUP":
      return { ...state, group: action.payload };
    case "SET_GAURD":
      return { ...state, group: { ...state.group, gaurd: action.payload } };
    case "SET_GROUP_ADMIN'S_UNIT":
      return {
        ...state,
        user: { ...state.user, property: action.payload.property },
      };
    case "ACCEPT_MEMBER":
      return {
        ...state,
        group: {
          ...state.group,
          members: state.group.members.map((e) => {
            if (e.memberId._id === action.payload._id)
              return {
                memberId: { ...e.memberId, status: action.payload.status },
              };
            else return { ...e };
          }),
        },
      };
    case "SET_MEMBER'S_UNIT":
      return {
        ...state,
        user: {
          ...state.user,
          property: action.payload.property,
          status: action.payload.status,
        },
      };
    case "APPROVE_MEMBER":
      return {
        ...state,
        group: {
          ...state.group,
          members: state.group.members.map((e) => {
            if (e.memberId._id === action.payload.member._id)
              return {
                memberId: {
                  ...e.memberId,
                  status: action.payload.member.status,
                },
              };
            else return { ...e };
          }),
          blocks: state.group.blocks.map((e) => {
            if (e.blockId._id === action.payload.unit.block)
              return {
                blockId: {
                  ...e.blockId,
                  units: e.blockId.units.map((ele) => {
                    if (
                      ele.unitId.unitNumber === action.payload.unit.unitNumber
                    )
                      return {
                        ...ele,
                        unitId: {
                          ...ele.unitId,
                          members: action.payload.unit.members,
                        },
                      };
                    else return { ...ele };
                  }),
                },
              };
            else return { ...e };
          }),
        },
      };

    case "CURRENT_VISITOR":
      return { ...state, visitorPermission: { ...action.payload } };
    case "CLEAR_CURRENT_VISITOR":
      return { ...state, visitorPermission: {} };
    default:
      return { ...state };
  }
};
