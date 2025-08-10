import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { encryptPassword } from "./encryptionUtils";
import {toast} from 'react-toastify';
import axios from 'axios';
import { TailSpin } from 'react-loading-icons'


export default function Signup()
{
  const [username,setusername] = useState();
  const [picture,setpicture] = useState();
  const [password,setpassword] = useState();
  const [confirmPass,setconfirmPass] = useState();
  const [loading,setloading] = useState(false);
  const nav = useNavigate();

  const handleUser = async(e)=>{
    e.preventDefault();
    try{
      setloading(true);
      if(password === confirmPass)
      {
        const {encryptedData,iv} = await encryptPassword(password);
        const formdata = new FormData();
        formdata.append("username",username);
        formdata.append("encryptedData",encryptedData);
        formdata.append("iv",iv);
        formdata.append("picture",picture);
        console.log(formdata);

        const result = await axios.post(`${process.env.REACT_APP_API_URL}/createUser`,formdata);
        if(result.data.success)
        {
          toast.success("User Created!");
          nav("/login");
        }
        else
        {
          toast.warn("Couldnt Create user - Server Side Issue, Please Try Again");
        }
      }
      else
      {
        toast.warn("Passwords Dont Match!");
      }
    }
    catch(e)
    {
      toast.info("Couldnt Create User, Please Try Again")
    }
    finally{
      setloading(false);
    }
  }
  
  return(
      <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleUser} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">
              Username
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="username"
                type="text"
                required
                onChange={(e)=>setusername(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">
              Profile Picture
            </label>
            <div className="mt-2">
              <input
                id="pic"
                name="picture"
                type="file"
                required
                onChange={(e)=>setpicture(e.target.files[0])}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                onChange={(e)=>setpassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-white">
              Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="cpassword"
                name="cpassword"
                type="password"
                required
                onChange={(e)=>setconfirmPass(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading? <TailSpin fill="blue"/>: "Create Account"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already a member?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Go To Login
          </Link>
        </p>
      </div>
    </div>
    </>

    )
}