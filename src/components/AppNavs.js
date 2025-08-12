import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import RouteProtection from "./RouteProtection";
import NotFoundPg from "./NotFoundPg";

export default function AppNavs()
{
    return(
    <>
        <Routes>
            <Route path="/" element={<RouteProtection Component = {Home}/>}/>
            <Route path="/home" element={<RouteProtection Component = {Home}/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/*" element={<NotFoundPg/>}/>
        </Routes>

    </>)
}