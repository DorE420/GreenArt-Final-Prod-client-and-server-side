import {React , useState , useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CompponetsCSS/LayOutTestCSS.css";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import LogoutIcon from "@mui/icons-material/Logout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AvatarImg from "../images/profileEmployee.png";
import { Link } from "react-router-dom"; 

const urlGetEmployee = "https://proj.ruppin.ac.il/cgroup96/prod/api/employee/get";
const username = 'cgroup96';
const password = 'your_password';
const headers = new Headers();
headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));


const SideToolBar = ({ userInfo }) => {
    
    const [imgEmployee, setImgEmployee] = useState(null);
    const [nameEmployee, setNameEmployee] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [employeeData, setEmployeeData] = useState({});
    const handleClick = (item) => {
      setActiveItem(item);
    };

    const setEmplolyeeImgInput = (e) => {
        const file = e.target.files[0];
        setImgEmployee(URL.createObjectURL(file));
    };
    const setNameEmployeeInput = (e) => {
        setNameEmployee(e.target.value);
    };
    useEffect(() => {
        fetch(urlGetEmployee, {
          method: 'GET',
          headers: headers
        })
        .then(res => {
          console.log('res = ', res);
          console.log('res.status', res.status);
          console.log('res.ok', res.ok);
          return res.json()
        })
        .then(result => {
          console.log("fetch Employee = ", result);
          const updatedName = result.map(st => {
            return{
                employeeFirstname: st.employee_name,
                employeeLastname: st.employee_familyname,
            };
          });
          const updateImg = result.map(st => {
            return{
                employeeImage: st.employee_picture
            };
          });
          console.log(updatedName, updateImg);
          setEmplolyeeImgInput(updateImg);
          setNameEmployeeInput(updatedName);
        })
        .catch(error => {
          console.log("Err post = ", error);
        });
      }, [""]);
  const handleLogout = () => {
    console.log("*************");
    window.location.href = "/";
  };


  const fetchEmployeeData = () => {
    fetch('https://proj.ruppin.ac.il/cgroup96/prod/api/employee/get')
      .then(response => response.json())
      .then(data => {
        const employee = data.find(emp => emp.employee_id == userInfo.username);
        setEmployeeData(employee); 
      })
      .catch(error => console.error("Error fetching employee data: ", error));
  };
  useEffect(() => {
    fetchEmployeeData();
  }, [userInfo]);


  const employeePic=employeeData ? employeeData.employee_picture : 'Loading...';

    return (
      <div className="sideBar">
        <div className="divTop">
          <ul>
            <Link to={"/"}>
              <li>
                <a href="#">
                  <span className="icon">
                    <FontAwesomeIcon icon={faLeaf} />
                  </span>
                </a>
              </li>
            </Link>
          </ul>
        </div>

        <div className="divCenter">
          <ul>
            <Link to={"/"}>
              <li className={activeItem === "option7" ? "active" : ""}>
                <a href="#" onClick={() => handleClick("option7")}>
                  <span className="icon">
                    <HomeOutlinedIcon />
                  </span>
                  <span className="text">בית</span>
                </a>
              </li>
            </Link>
            <Link to={"/MainPage"}>
              <li className={activeItem === "option1" ? "active" : ""}>
                <a href="#" onClick={() => handleClick("option1")}>
                  <span className="icon">
                    <CalendarMonthOutlinedIcon />
                  </span>
                  <span className="text">אירועים</span>
                </a>
              </li>
            </Link>
            <Link to={"/Customers"}>
              <li className={activeItem === "option2" ? "active" : ""}>
                <a href="#" onClick={() => handleClick("option2")}>
                  <span className="icon">
                    <Diversity1OutlinedIcon />
                  </span>
                  <span className="text">לקוחות</span>
                </a>
              </li>
            </Link>
            <Link to={"/Suppliers"}>
              <li className={activeItem === "option3" ? "active" : ""}>
                <a href="#" onClick={() => handleClick("option3")}>
                  <span className="icon">
                    <EngineeringOutlinedIcon />
                  </span>
                  <span className="text">ספקים</span>
                </a>
              </li>
            </Link>
            <Link to={"/Team"}>
              <li className={activeItem === "option4" ? "active" : ""}>
                <a href="#" onClick={() => handleClick("option4")}>
                  <span className="icon">
                    <AccountCircleOutlinedIcon />
                  </span>
                  <span className="text">עובדים</span>
                </a>
              </li>
            </Link>
            <Link to={"/Vehicles"}>
              <li className={activeItem === "option5" ? "active" : ""}>
                <a href="#" onClick={() => handleClick("option5")}>
                  <span className="icon">
                    <LocalShippingOutlinedIcon />
                  </span>
                  <span className="text">רכבים</span>
                </a>
              </li>
            </Link>
            <Link to={"/Inventories"}>
              <li className={activeItem === "option6" ? "active" : ""}>
                <a href="#" onClick={() => handleClick("option6")}>
                  <span className="icon">
                    <ProductionQuantityLimitsIcon />
                  </span>
                  <span className="text">מלאי</span>
                </a>
              </li>
            </Link>
          </ul>
        </div>

        <div className="divBottum">
          <ul>
            <Link to={"/Setting"}>
              <li className={activeItem === "option8" ? "active" : ""}>
                <a href="#" onClick={() => handleClick("option8")}>
                  <span className="icon">
                    <div className="imgBX">
                      {imgEmployee ? (
                        <img src={employeePic} alt="Employee" />
                      ) : (
                        <img src={employeePic} alt="Avatar" />
                      )}
                    </div>
                  </span>
                  <div className="text">
                    {nameEmployee ? (
                      <span>{nameEmployee}</span>
                    ) : (
                      <span>פרטים אישיים</span>
                    )}
                  </div>
                </a>
              </li>
            </Link>
            <Link>
              <li>
                <a href="#" onClick={handleLogout}>
                  <span className="icon">
                    <LogoutIcon />
                  </span>
                  <span className="text">יציאה</span>
                </a>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    );
};

export default SideToolBar;