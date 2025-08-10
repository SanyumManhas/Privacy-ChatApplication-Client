import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from "../App";

function MyModal(props) {
    const {userdata,trigger,settrigger} = useContext(UserContext);
    const [query,setquery] = useState("");
    const [FoundUsers,setFoundUsers] = useState([]);

    const handleQuery = async()=>{
        try{        
            const result = await axios.post(`${process.env.REACT_APP_API_URL}/findUsers`, {query});
            if(result.status === 200)
            {
                setFoundUsers([...result.data.users]);
            }
            else
            {
                toast.info("No User Found");
            }
        }       
        catch(e)
        {
            console.log("Error Finding Users!");
        }
    }

    const CreateConn = async(otherMember)=>{
        try{
          const members = {memberone: userdata._id, membertwo: otherMember};
          const result = await axios.post(`${process.env.REACT_APP_API_URL}/createConnection`,members);
          if(result.data.success)
          {
            toast.success(result.data.msg);
            props.onHide()
          }
          else if(!result.data.success)
          {
            toast.info(result.data.msg);
          }
        }
        catch(e)
        {
          toast.info("Couldnt Establish Connection");
          console.log(e.message);
        }
        finally{
          settrigger(!trigger)
        }
    }

    useEffect(()=>{
        if(query !== "")
        {
            handleQuery();
        }
    },[query])

    return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className='bg-gray-400 border-none' closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add New Contact
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-gray-400 border-none'>
        <h4>Search User</h4>
        <input type="text" onChange={(e)=>setquery(e.target.value)} className="w-100 bg-gray-200 mt-2 p-2 rounded" placeholder='Enter Username'/>
        {FoundUsers.map((user,i)=>
         <div className='flex flex-row items-center justify-between border p-2 mt-2 bg-white'>
            <p>{user.username}</p>
            <Button onClick={()=>CreateConn(user._id)}>Add User</Button>
        </div>
        )}
       
      </Modal.Body>
      <Modal.Footer className='bg-gray-400 border-none'>
        <Button className='border-none bg-black hover:bg-indigo-800' onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyModal