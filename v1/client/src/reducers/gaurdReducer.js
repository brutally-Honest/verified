export const gaurdReducer=(state,action)=>{
switch(action.type){
    case "NEW_VISITOR":
      return { ...state, visitors: [...state.visitors,action.payload]  };
    case "SET_VISITORS":
        return {...state,visitors:action.payload}
    default:
        return {...state}
}
}