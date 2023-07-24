import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from "./Components/LogInFile/LoginForm";
import LayOutTest from "./Components/SideToolBar";
import MainLayout from "./Components/MainLayout";


function App(){
  
  const [currentForm, setCurrentForm] = useState('loginform');
  const [active, setActive] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const toggleForm = (formName, userInfo = null) => {
    setActive(!active);
    setCurrentForm(formName)

    if (userInfo) { 
      setUserInfo(userInfo);
    }
  };
  
  return (
     <div className={classNames({ "page-transition": !active })}>
        {currentForm === "loginform" ? (
         <LoginForm onFormSwitch={toggleForm} active={active}/>
       ) : (
        <MainLayout userInfo={userInfo}/>

       )} 
     </div>
    /*<MainLayout/>*/
  );
}
export default App;


