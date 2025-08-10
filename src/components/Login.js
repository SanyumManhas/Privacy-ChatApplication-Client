import axios from 'axios';
import { useContext, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';
import { UserContext } from '../App';

import { TailSpin } from 'react-loading-icons'

export default function Login()
{
  const [username,setusername] = useState();
  const [password,setpassword] = useState();
  const {setuserdata} = useContext(UserContext);
  const [loading,setloading] = useState(false);

  const nav = useNavigate();

  const handlelogin = async(e)=>{
    e.preventDefault();
    try{
      setloading(true);
      const userdata = {
        username,password
      }
      const result = await axios.post(`${process.env.REACT_APP_API_URL}/login`,userdata,{ withCredentials: true });
      if(result.data.success)
      {
        setuserdata(result.data.userdetails);
        nav("/home");
      }
      else
      {
        toast.warn("Incorrect Password, Please Try Again..")
      }
    }
    catch(e)
    {
      toast.warn("Couldnt login!, Please Try Again..")
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
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handlelogin} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
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
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading? <TailSpin fill="black"/>: "Sign In"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create Account
            </Link>
          </p>
        </div>
      </div>
        </>

    )
}