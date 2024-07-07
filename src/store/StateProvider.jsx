import React ,{ createContext, useContext, useReducer} from "react";


// create a empty context object or we can say a DataLayer

 const StateContext = createContext();

// Now create contextProvider : allow the data to share amongs the components
// Wrap our app and provide the Data Layer

 const StateProvider =({ reducer,initialState, children}) => (

    <StateContext.Provider value={ useReducer(reducer, initialState)}>

        {children}

    </StateContext.Provider>
);

// Pull information or use the information from the data layer
// In this way we use Consume data
const useStateValue = () => useContext(StateContext)


export {StateContext, StateProvider, useStateValue}