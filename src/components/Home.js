import NavBar from "./NavBar";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import {io} from 'socket.io-client';
import { TailSpin } from 'react-loading-icons'

export default function Home()
{  
    const {userdata,trigger} = useContext(UserContext);
    const [receiver, setreceiver] = useState(null);
    const [connID, setconnID] = useState(null);
    const [socket, setSocket] = useState(null);
    const [messages,setmessages] = useState([]);
    const [activeUsers, setactiveUsers]= useState([]);
    const [loading,setloading] = useState(false);
    

    const lastMsgRef = useRef(null);

    const [msg,setmsg] = useState("");


    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const headers = isIOS?{Authorization: `Bearer ${localStorage.getItem("token")}`}:{}


    const handleMsg = async(e)=>{
      try {
        socket?.emit('sendMessage',{
          receiverId: receiver?._id,
          senderId: userdata?._id,
          msg: msg,
        })
        const message = {
          connectionId: connID,
          msg: msg,
        }
        
        const result = await axios.post(`${process.env.REACT_APP_API_URL}/sendMsg`, message,{withCredentials: !isIOS,headers});
        if(result.data.success)
        {
          console.log("Msg stored in db")
        }
        else
        {
          toast.info("Couldnt save msg in backend")
        }
      } catch (e) {
          toast.warn("Server Error")
          console.log("Server Error")
      }
      finally{
        setmsg("");
      }
    }

    const FetchMsgs = async()=>{
      try
      {
        setloading(true);
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/getMsgs?connid=${connID}`);
        if(result.data.success)
        {
          setmessages(result.data.msgs)
        }
        else
        {
          setmessages([]);
        }
      } 
      catch (e) {
        console.log(e.message)
        toast.warn("Server Error")
      }
      finally{
        setloading(false);
      }
    }
    
    useEffect(()=>{
      if(localStorage.getItem("selectedConn"))
      {
        const strg = JSON.parse(localStorage.getItem("selectedConn"));
        setconnID(strg.connID);
        setreceiver(strg.receiver);
      }
    },[trigger]);

    useEffect(()=>{
      //call to retrieve messages
      if(connID)
      {
        FetchMsgs()
      }
    },[connID]);

    //Initialize socket for the localhost port.
     useEffect(()=>{
        if(userdata)
        {
          setSocket(io("https://privacy-chatapplication-server.onrender.com"))
        }
      },[userdata])
    
      //Calling Socket functions to establish frontend port as a socket
      const SocketInit = ()=>{
        socket?.emit('addUser', userdata?._id);
        socket?.on('getUsers',users=>{
          console.log("Active users", users);
          setactiveUsers(users);  
        })
        socket?.on('getMessage', data=>{
          setmessages(prev=>[...prev, data]);
        })
      }

      useEffect(()=>{
        SocketInit()
        },[socket])

        useEffect(()=>{
          lastMsgRef.current?.scrollIntoView({behavior: 'smooth'})
        },[messages])

    return(
    <>
    <NavBar activeUsers = {activeUsers}/>
    {receiver && connID?<div className="h-screen overflow-hidden flex items-center justify-center" style={{'background': '#edf2f7'}}>
    <div className="flex h-screen antialiased text-gray-800">    
    <div className="flex flex-row h-full w-full overflow-x-hidden">
      <div className="flex flex-col flex-auto h-full w-screen p-6 bg-gray-500">
        <div
          className="flex flex-col flex-auto flex-shrink-0 bg-gray-300 h-full"
        >
        <div className="bg-transparent h-fit">
            <div className="flex flex-row pb-2 items-center bg-gray-800 p-2">
                <div className="flex flex-row items-center relative text-sm py-2 px-2">
                    <div className="flex items-center justify-contents-center rounded-full bg-indigo-500 flex-shrink-0">
                       <img
                        alt="User"
                        src={receiver?.profilepic}
                        className="mx-auto h-[70px] w-[70px] rounded-full"
                      />
                    </div>
                    <div className="ml-2 h-fit text-white text-[20px]">
                       {receiver?.username} <br/>
                       <p className="ml-1 mt-1 text-gray-400 text-[10px]">{activeUsers.find(user=> user.userId === receiver._id)? "online": "offline"}</p>
                    </div>
                </div>
            </div>
        </div>
          <div className="flex flex-col h-full overflow-x-auto">
            <div className="flex flex-col h-full">
              {loading? <div className="flex w-full h-full align-items-center justify-content-center">
                <TailSpin fill="blue"/>
              </div>:messages.length > 0 ? <div className="grid grid-cols-12 gap-y-2">
                {messages.map((msg,i)=>
                  {
                    if(msg.senderId === userdata?._id)
                    {
                      return <div key={i} ref={i === messages.length - 1 ? lastMsgRef: null} className="col-start-6 col-end-13 p-3 rounded-lg">
                                <div className="flex items-center justify-start flex-row-reverse">
                                  <div
                                    className="flex items-center justify-center pt-4 rounded-full bg-transparent flex-shrink-0"
                                  >
                                    <img
                                      alt="User"
                                      src={userdata?.profilepic}
                                      className="mx-auto h-[30px] w-[30px] rounded-full"
                                    />
                                  </div>
                                  <div
                                    className="relative mr-1 text-sm bg-white py-2 px-3 shadow rounded-xl"
                                  >
                                    <div>{msg.message}</div>
                                    {/* <div
                                      className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500"
                                    >
                                      Seen
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                    }
                    else
                    {
                      return <div key={i} ref={i === messages.length - 1 ? lastMsgRef: null} className="col-start-1 col-end-8 p-3 rounded-lg">
                                <div className="flex flex-row items-center">
                                  <div
                                    className="flex items-center justify-center h-7 w-7 pt-4 rounded-full bg-transparent flex-shrink-0"
                                  >
                                    <img
                                      alt="User"
                                      src={receiver?.profilepic}
                                      className="mx-auto h-[30px] w-[30px] rounded-full"
                                    />
                                  </div>
                                  <div
                                    className="relative ml-1 text-sm bg-white py-2 px-3 shadow rounded-xl"
                                  >
                                    <div>{msg.message}</div>
                                  </div>
                                </div>
                              </div>
                    }
                  }
                )}
              </div>: <div className="flex w-full h-full justify-content-center align-items-center">
                  Send a Message to Start Conversation
                </div>}
            </div>
          </div>
          <div
            className="flex flex-row items-center  h-16  bg-gray-900 w-full p-2"
          >
            <div className="w-full">
              <div className="relative">
                <button
                className="absolute flex items-center justify-center h-full w-12 left-1 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  ></path>
                </svg>
              </button>
                <div className="w-100 bg-white flex justify-center rounded-xl">
                <input
                  type="text"
                  value={msg}
                  onChange={(e)=>setmsg(e.target.value)}
                  className="flex w-100 ml-[50px] mr-[78px] border border-black focus:border-indigo-300 pl-1 h-10"
                />
                </div>
                {/* <button
                  className="absolute flex items-center justify-center h-full w-9 right-20 top-0 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button> */}
                <button
                  onClick={handleMsg}
                  disabled={msg.trim().length > 0? false: true}
                  className="absolute flex items-center p-2 justify-center bg-indigo-500 hover:bg-indigo-600 rounded-r-xl text-white h-100 w-fit flex-shrink-0 top-0 right-0 m-0 "
                >
                  Send
                <span className="ml-2">
                  <svg
                    className="w-4 h-4 transform rotate-45 -mt-px"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </span>
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>:<div className="h-screen w-full border-2 border-black flex justify-center items-center bg-red-400 text-white"><h3>Select A User To Start A Conversation</h3></div>}
    </>
)
}
