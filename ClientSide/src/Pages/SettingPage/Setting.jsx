import React, { useEffect, useState } from "react";
import "./SettingCss.css";
import imgBG from "../ReportsPage/Green-Wave.png";


const Setting = ({ userInfo }) => {

  const [isHovered, setIsHovered] = useState(false);
  const white ={background: 'white'};
  const green ={background: 'green'};
  const [color, setColor] =useState(white);
  const [employeeData, setEmployeeData] = useState({});
 

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
  const employeeName = employeeData ? employeeData.employee_name : 'Loading...';
  const employeeFName = employeeData ? employeeData.employee_familyname : 'Loading...';
  const employeeEmail = employeeData ? employeeData.employee_email : 'Loading...';
  const employeeGender = employeeData ? employeeData.employee_gender : 'Loading...';
  const employeePosition = employeeData ? employeeData.employee_position : 'Loading...';
  const employeeBirthdate = employeeData ? new Date(employeeData.employee_startDate).toLocaleDateString() : 'Loading...';
  return (

    <div id="mainBodySetting">

      <div id="headerSetting">
        <h1>פרטים אישיים </h1>
      </div>

      <div id="innerMainSetting">
        <div className="imgBG-Setting">

        <div id="infoEmployeeRight">

          <div className="innerEmployeeRightTop">
            <div className="imgSettingContainer">
              <img src={employeePic} className="imgSetting" alt="ProfileImg"/>
            </div>

            <div className="textInfoRight">
              <label>שם:{employeeName} {employeeFName}</label>
              <label>מייל:{employeeEmail}</label>
              <label>תפקיד:{employeePosition}</label>
              <label>מגדר:{employeeGender}</label>
              <label>תאריך לידה:{employeeBirthdate}</label>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Setting;