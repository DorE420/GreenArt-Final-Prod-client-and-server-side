import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../LogInFile/LoginForm.css"
import ReactCardFlip from "react-card-flip";
import emailjs from "@emailjs/browser";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const urllogin='https://proj.ruppin.ac.il/cgroup96/prod/api/employee/login';

const username1 = 'cgroup96';
const password1= 'your_password';
const headers = new Headers();
headers.append('Authorization', 'Basic ' + btoa(username1 + ':' + password1));



export const LoginForm = ({onFormSwitch, onLogIn}) => {

  const [usernameInput, setUsernameInput] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);  
  const [randomPassword, setRandomPassword] = useState("");
  const [users, setUsers] = useState([]);

  let notify = "";
  const notifyHandler = (e) => {
    notify = e;
    toast.warning(notify);
  };


  useEffect(() => {
    fetch("https://proj.ruppin.ac.il/cgroup96/prod/api/employee/get")
    .then(response => response.json())
    .then(json => setUsers(json))
  }, []);


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  function usernameInputHandler(e) {
    const inputUsername = e.target.value;
    const isValidUsername = /^[0-9]{0,9}$/.test(inputUsername);
    if (inputUsername.length > 9) {
      notifyHandler("ניתן להכניס עד 9 ספרות");
    } if (!isValidUsername) {
      notifyHandler("תעודת הזהות מכילה ספרות בלבד");
    } else {
      setUsernameInput(inputUsername);
    }
    return inputUsername;
  };
  const passwordInputHandler = (e) => {
    setPassword(e.target.value);
  };
  const emailInputHandler = (e) => {
    setEmail(e.target.value);
  }
  const resetTextHandler = () => {
    setUsernameInput("");
    setPassword("");
    setEmail("");
  };
  const loginHandler = (e) => {

    e.preventDefault();
    const inputInfo = {
      username: usernameInput,
      password: password,
    };

    fetch(urllogin,{
      method: 'POST',
      headers: {
        ...headers,
        'Content-type':'application/json; charset=UTF-8',
        'Accept':'application/json; charset=UTF-8'
      },
      body: JSON.stringify(inputInfo)
    })
    .then((response) => {
      if (response.ok) {
        console.log('Fetch response:', response);
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then((data) => {
      console.log('Data:', data);
      if (data === 'User Authenticated Successfully') {
        console.log("Authentication succeeded, switching to Layout");
        toast.success("!ברוך הבא");
        onFormSwitch('MainLayout', inputInfo);
        resetTextHandler();
      } else {
      }
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
      toast.error("שם משתמש או סיסמא לא נכונים, אנא נסה שנית");
    });
  };
  function updateEmployeePassword (employeeID, randomPassword) {

    const employeeItemPW = {
      employee_pw: randomPassword,
    };
    fetch(`https://proj.ruppin.ac.il/cgroup96/prod/api/employee/updatepassword`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...employeeItemPW, employee_id : employeeID}),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then((data) => {
        console.log('Data:', data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };


  const handleClickFlip = () => {
  setIsFlipped(!isFlipped);
  resetTextHandler();
  };
  function generateRandomChar() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  };
  function randomPasswordInput(length) {
    let randomPasswordTemp = '';
    for (let i = 0; i < length; i++) {
      randomPasswordTemp += generateRandomChar();
    }
    return randomPasswordTemp;
  };
  const setRandomPasswordInput = () => {
    setRandomPassword(randomPasswordInput(9));
  };


  const form = useRef();
  const serviceNumber = "service_kxsf35x";
  const templateNumber = "template_3rbfmpf";
  const publicKey = "cePsVHpGu1k1SaD5J";
  
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(serviceNumber,
                     templateNumber,
                     form.current,
                     publicKey)
      .then((result) => {
          console.log(result.text);
          console.log(usernameInput);
          console.log(randomPassword);
          updateEmployeePassword(usernameInput, randomPassword);
          toast.success("!המייל נשלח בהצלחה");
          resetTextHandler();
      }, (error) => {
          console.log(error.text);
      }); 
  };
  useEffect(() => {
    tippy("#facebook", {
      content: 'FaceBook',
    });
    tippy("#instagram", {
      content: 'Instagram',
    });
    tippy("#Website", {
      content: 'Website',
    });
    tippy('.loginControlImg',{
      content: "Green Art",
    });
  }, []);


  return (
    
    <div id="mainPageLoginForm">

      <div id="imgLoginForm"/>

      <div id="centerFlip">
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">

          <div key="front" id="innerLogInCover">

              <div className="loginControlImg"/>
              <div className="labelExplain"/>
              
              <div className="MainloginControlers1">
                  <div className="formPassword">
                    <div className="loginControl">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={usernameInputHandler}
                        required="required"/>
                        <PermIdentityIcon className="idIcon"/>
                      <span>תעודת זהות</span>
                    </div>
                    <div className="loginControl password-input-wrapper">               
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={passwordInputHandler}
                        required="required"/>
                      <span>סיסמא</span>
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={toggleShowPassword}
                        className="idIcon"/>
                    </div>
                    <div className="loginControl">
                      <Button onClick={loginHandler}
                              className="loginButton"
                              variant="primary"
                              type="button">
                        כניסה
                      </Button>
                    </div>
                  </div>
              </div>

              <div id="clickFlip">
                  <a href="#" onClick={handleClickFlip}>? שכחת סיסמא</a>
              </div>
          </div>

          <div key="back" id="innerLogInCover">

            <div className="loginControlImg"/>
            <div className="labelExplain">
              <label>נא למלא את הפרטים על מנת לקבל סיסמא חדשה</label>
            </div>

            <div className="MainloginControlers2">

              <form ref={form} onSubmit={sendEmail} className="formPassword">

                <div className="loginControlForm">
                  <input
                    name="user_name"
                    type="text"
                    value={usernameInput}
                    onChange={usernameInputHandler}
                    required="required"/>
                  <PermIdentityIcon className="idIcon"/>
                  <span>מספר תעודת זהות</span>
                </div>

                <div id="passwordUnvisibal">
                  <input
                    name="user_password"
                    value={randomPassword}
                    readOnly
                    />
                  </div>

                <div className="loginControlForm">
                  <input
                    name="user_Email"
                    type="text"
                    value={email}
                    onChange={emailInputHandler}
                    required="required"/>
                  <ForwardToInboxIcon className="idIcon"/>
                  <span>כתובת מייל</span>
                </div>
                
                <div className="loginControlForm">
                  <Button
                    onClick={setRandomPasswordInput}
                    className="loginButton"
                    type="submit">
                    שליחה
                  </Button>
                </div>
              </form>

            </div>

            <div id="clickFlip">
                <a href="#" onClick={handleClickFlip}>חזרה</a>
                <ArrowForwardIcon className="arrowICON"/>
            </div>
          </div>

        </ReactCardFlip>
      </div>
      
      <div className="iconSocial">
          <a href="https://www.facebook.com/משתלת-תמיר-2176069665745263/"
             target="_blank" 
             rel="noopener noreferrer"
             id="facebook">
              <div className="iconRap">
                  <img src='https://proj.ruppin.ac.il//cgroup96/prod/build/images/Facebook.jpeg'/>
              </div>
          </a>
        <a href="https://www.instagram.com/greenart_ltd/" 
           target="_blank" 
           rel="noopener noreferrer"
           id="instagram">
            <div className="iconRap">
                <img src='https://proj.ruppin.ac.il//cgroup96/prod/build/images/instagram.png'/>
            </div>
        </a>
        <a href="https://greenart-ltd.com" 
           target="_blank" 
           rel="noopener noreferrer"
           id="website">
            <div className="iconRap">
                <img src='https://proj.ruppin.ac.il//cgroup96/prod/build/images/GreenArtWeb.jpg'/>
            </div>
        </a>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default LoginForm;
