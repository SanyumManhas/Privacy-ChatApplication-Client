import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';
import MyModal from './Modal';
import { TailSpin } from 'react-loading-icons'

const NavBar = (props) => {
  const [sidebarOpen,setSidebarOpen] = useState(false)
  const {userdata,setuserdata,settrigger,trigger} = useContext(UserContext);
  const [contacts, setcontacts] = useState([]);
  const nav = useNavigate();
  const activeUsers = props.activeUsers;
  
  const [modalShow, setModalShow] = useState(false);
  const [loading,setloading] = useState(false);

  const handlelogout = async()=>{
    try{
      const result = await axios.post(`${process.env.REACT_APP_API_URL}/logout`,{},{withCredentials: true});
          if(result.data.success)
          {
            setuserdata(null);
            nav("/login");
            localStorage.clear();
          }
          else
          {
            toast.info("Log out unsuccessful..")
          }
    }
    catch(e)
    {
      console.log('error while logout', e.message)
    }
        
  }

  const getContacts = async()=>{
    try{
      setloading(true);
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/getConnections`, {withCredentials: true});
      if(result.data.success)
      {
        setcontacts(result.data.connections);
        console.log(result.data.connections)
      }
    }
    catch(e)
    {
      console.log(e.message);
    }
    finally{
      setloading(false)
    }
  }

  const SetConnection = (connId, receiver)=>{
    if(!receiver)
    {
        localStorage.setItem("selectedConn",JSON.stringify({
        connID: connId,
        receiver:userdata
      }))
      settrigger(!trigger);
    }
    else{
      localStorage.setItem("selectedConn",JSON.stringify({
        connID: connId,
        receiver:receiver
      }))
      settrigger(!trigger);
    }
    setSidebarOpen(false);
    
  }

  useEffect(()=>{
    getContacts();
  },[sidebarOpen,trigger]);


  return (
    <>
    
      {/* Top Navbar */}
      <nav className="bg-gray-800  border-gray-200 px-4 py-3 flex items-center">

        {/* Mobile Hamburger */}
        <div>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div
            className="flex items-center justify-center rounded-2xl text-indigo-700 ml-3 h-10 w-10"
          >
            <img
            alt="Your Company"
            src="./Privacy-Icon.png"
            className="h-10 w-auto"
          />
          </div>
          <div className="ml-2 font-bold text-2xl text-white">Privacy</div>
      </nav>


      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow transform transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex flex-row items-center justify-center h-12 w-full">
          <div
            className="flex items-center justify-center rounded-2xl text-indigo-700 h-10 w-10"
          >
            <img
            alt="Your Company"
            src="./Privacy-Icon.png"
            className="mx-auto h-auto w-10"
          />
          </div>
          <div className="ml-1 font-bold text-2xl text-white">Privacy</div>
        </div>
          
          
          <button onClick={() => setSidebarOpen(false)} className="text-gray-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col py-8 pl-2 pr-2 w-64 bg-gray-800 flex-shrink-0">
          <button onClick={handlelogout}
            className="flex flex-row flex-wrap justify-between items-center bg-indigo-400 border border-gray-900 w-100 py-1.5 px-2 rounded-lg hover:bg-indigo-500"
          >
          <div className='flex flex-row items-center'>
            <div className="flex border-2 h-20 border-indigo-400 mr-1 rounded-full overflow-hidden">
              <img
                src={userdata?.profilepic}
                alt="Avatar"
                className="h-auto w-20"
              />
            </div>
            <div className="text-sm font-semibold mt-0">{userdata?.username}</div>
          </div>
          <div className="text-sm font-semibold mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
          </div>
        </button>
        <div className="flex flex-col mt-8">
          <div className="flex flex-row items-center justify-between text-xs">
            <span className="font-bold text-white">Contacts</span>
            
           <button onClick={() => setModalShow(true)} type="button" className="p-1 text-white border-none bg-indigo-600 rounded hover:bg-gray-700 focus:outline-none">
            Add New Contact
           </button>

            <MyModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              sidebar = {setSidebarOpen}
            />

          </div>
          {loading?  <TailSpin fill="blue"/>:<div className="flex flex-col space-y-1 mt-2 h-fit overflow-y-auto bg-gray-500 m-0 rounded-xl">
            {contacts.map((contact,i)=>{
              return(
              <button
                key={i}
                onClick={()=>SetConnection(contact.connectionId, contact.receiver)}
                className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
              >
                {activeUsers.find(user=> {
                    const receiver = !contact.receiver? userdata :contact.receiver;
                    return user.userId === receiver?._id})? <div
                  className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full border-2 border-green-500"
                >
                  {!contact.receiver? userdata?.username[0] :contact.receiver.username[0]}
                </div>:<div
                  className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full border-2 border-red-500"
                >
                  {!contact.receiver? userdata?.username[0] :contact.receiver.username[0]}
                </div>}
                <div className="ml-2 text-sm  text-gray font-semibold">
                  {!contact.receiver? userdata?.username :contact.receiver.username}</div>
              </button>)}
            )}
        </div>}
    </div>
    </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" />
      )}
    </>
  );
};

export default NavBar;
