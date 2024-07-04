export const initialState = {
    // basket: [],
    // user: null,

    userInfo: JSON.parse(localStorage.getItem("userInfo")) || "",
    objective: JSON.parse(localStorage.getItem("objective")) || "",
    skills: JSON.parse(localStorage.getItem("skill")) || [],
    certification: JSON.parse(localStorage.getItem("certificate")) || [],
    project: JSON.parse(localStorage.getItem("project")) || [],
    educational: JSON.parse(localStorage.getItem("educational")) || [],
};

// use state = initialState ,if error
const reducer = (state, action) => {
    console.log("reducer action : ", action);
    switch (action.type) {
        case "ADD_USER_INFO":
            console.log("reducer WORKING : ", action.payload);

            localStorage.setItem("userInfo", JSON.stringify(action.payload));
           
            return {
                ...state, // holds previous states
                userInfo: action.payload, // update the basket,
                // copies everything from state.basket into a new array, then adds action.item to the last index !
            };

        case "ADD_USER_OBJECTIVE":
           
            localStorage.setItem("objective", JSON.stringify(action.payload));
            return {
                ...state,
                objective: action.payload,
            };

        case "ADD_USER_QUALIFICATION":

            localStorage.setItem("educational", JSON.stringify(action.payload));
            return {
                ...state,
                educational: [action.payload],
            };

        case "REMOVE_USER_QUALIFICATION":
          
            // const index = action.payload.id

            // const values = state.educational.splice(index,1)
            // console.log("########### temove vale ######",values)
            // values.splice(index, 1)
           
            localStorage.setItem("educational", JSON.stringify(action.payload));
            return {
                ...state,
                educational: [action.payload],
            };

        case "ADD_USER_PROJECT":
          
            localStorage.setItem("project", JSON.stringify(action.payload));
            return {
                ...state,
                project: [action.payload],

            };

        case "ADD_USER_CERTIFICATION":
          
            localStorage.setItem("certificate", JSON.stringify(action.payload));
            return {
                ...state,
                certification: [action.payload],
            };

        case "ADD_USER_SKILL":
           
            localStorage.setItem("skill", JSON.stringify(action.payload));
            return {
                ...state,
                skills: [action.payload],
            };

        default:
            return state;
    }
};

export default reducer;
