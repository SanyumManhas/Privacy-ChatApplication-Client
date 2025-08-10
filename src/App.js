import { createContext, useEffect, useState } from "react";
import AppNavs from "./components/AppNavs";
import {ToastContainer} from 'react-toastify';

const UserContext = createContext();


export default function App() {
  const [userdata,setuserdata] = useState(null);
  const [trigger,settrigger] = useState(false);

  return (
    <>
    <UserContext.Provider value={{userdata,setuserdata,trigger,settrigger}}>
      <AppNavs/>
      <ToastContainer/>
    </UserContext.Provider>
    </>
  );
}

export {UserContext}