import { BrowserRouter, Routes, Route, useSearchParams } from "react-router";
import Signup from "./components/signup";
import Login from "./components/login";
import ForgotPassword from "./components/forgotPassword";
import { ToastContainer } from 'react-toastify';
import PrivateComponent from "./components/privateComponent";
import AddData from "./data/addData";
import EditData from "./data/editData";
import AllData from "./data/allData";
import Navbar from "./components/navbar";
import { useEffect, useState } from "react";
import Error from "./components/Error";

const App = () => {

  const [mainloader,setMainloader] = useState(true);

  useEffect(()=>{
    setTimeout(()=> {
      setMainloader(false);
    },1500);
  },[]);

  return (
    <div>
    {mainloader?<div className="main-loader"><img src="./images/loader1.gif" alt="" /></div>:""}
      <ToastContainer />
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path={'/'} element={<AllData />} />
            <Route path={'/add'} element={<AddData />} />
            <Route path={'/edit/:id'} element={<EditData />} />
          </Route>
          <Route path={'/signup'} element={<Signup />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/forgot-password'} element={<ForgotPassword />} />
          <Route path={'*'} element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;