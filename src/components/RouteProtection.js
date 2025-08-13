import { useContext, useEffect } from "react"
import { UserContext } from "../App"
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RouteProtection({Component})
{
    const {userdata,setuserdata} = useContext(UserContext);
    const nav = useNavigate();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const headers = isIOS?{Authorization: `Bearer ${localStorage.getItem("token")}`}:{}
    
    const GetUserDetails = async()=>{
    try{
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/getUser`,{withCredentials: !isIOS,
        headers});
      if(result.status === 200)
      {
        setuserdata(result.data.user);
      }
    }
    catch(e)
    {
      console.log("Cookie Login failed")
      nav("/login");
    }
  }


    useEffect(()=>{
        if(userdata === null)
        {
            GetUserDetails()
        }
    },[]);

    return(
        <>
            <Component/>
        </>
    )
}
