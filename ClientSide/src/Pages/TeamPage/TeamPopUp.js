import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TeamCss.css";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import UploadIcon from "@mui/icons-material/Upload";
import "react-datepicker/dist/react-datepicker.css";
import AvatarEmployee from "../../images/profileEmployee.png";

const TeamPopUp = ({ trigger, setTrigger, addEmployee, children }) => {
  const [employeeImg, setEmployeeImg] = useState(null);
  const fileInputRef = useRef(null);

  const [employeeForm, setEmployeeForm] = useState({
    employeeId: "",
    employeeName: "",
    employeeSurname: "",
    employeePosition: "",
    employeePhone: "",
    employeeEmail: "",
    employeeGender: "זכר",
    employeePassword: "",
  });

const handleInputChange = (event) => {
  setEmployeeForm({
    ...employeeForm,
    [event.target.name]: event.target.value,
  });
};

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const saveHandler = (e) => {
    e.preventDefault();
const newEmployeeInput = {
  employee_picture: employeeImg,
  employee_id: employeeForm.employeeId,
  employee_name: employeeForm.employeeName,
  employee_familyname: employeeForm.employeeSurname,
  employee_PhoneNumber: employeeForm.employeePhone,
  employee_email: employeeForm.employeeEmail,
  employee_gender: employeeForm.employeeGender ? employeeForm.employeeGender:"זכר",
  employee_Position: employeeForm.employeePosition,
  employee_pw: employeeForm.employeePassword,
};
    addEmployee(newEmployeeInput);
    resetForm();
    setTrigger(false);
  };

const resetForm = () => {
  setEmployeeImg("");
  setEmployeeForm({
    employeeId: "",
    employeeName: "",
    employeeSurname: "",
    employeePosition: "",
    employeePhone: "",
    employeeEmail: "",
    employeeGender: "",
    employeePassword: "",
    employeeBirthDate: "",
  });
};


  const closeForm = () => {
    resetForm();
    setTrigger(false);
  };

  return (
    trigger && (
      <div className="popUp">
        <div className="innerPopUp">
          <div className="innerEmloyee1">
            <HighlightOffIcon onClick={closeForm} />
          </div>

          <div className="innerEmloyee2">
            <h1>יצירת איש צוות חדש</h1>
          </div>

          <div className="innerEmloyee3">
            <div className="innerDiv3-2">
              <div className="innerDivUploadImg">
                <div className="imgEmployee">
                  {employeeImg ? (
                    <img src={employeeImg} alt="Avatar" />
                  ) : (
                    <img src={AvatarEmployee} alt="Avatar" />
                  )}
                </div>
                <div onClick={handleUploadClick}>
                  <span>לחץ/י להעלאת תמונה</span>
                  <UploadIcon />
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => setEmployeeImg(e.target.files[0])}
                  />
                </div>
              </div>
            </div>

            <div className="innerDiv3-1">
              <div className="leftinnerDiv-3">
                <div className="input1">
                  <input
                    name="employeeId"
                    type="text"
                    value={employeeForm.employeeId}
                    onChange={handleInputChange}
                    required
                  />
                  <span>מספר תעודת זהות</span>
                </div>
                <div className="input1">
                  <input
                    name="employeePosition"
                    type="text"
                    value={employeeForm.employeePosition}
                    onChange={handleInputChange}
                    required
                  />
                  <span>תפקיד</span>
                </div>
              </div>

              <div className="leftinnerDiv-3">
                <div className="input1">
                  <input
                    name="employeeSurname"
                    type="text"
                    value={employeeForm.employeeSurname}
                    onChange={handleInputChange}
                    required
                  />
                  <span>שם משפחה</span>
                </div>
                <div className="input1">
                  <input
                    name="employeeName"
                    type="text"
                    value={employeeForm.employeeName}
                    onChange={handleInputChange}
                    required
                  />
                  <span>שם פרטי</span>
                </div>
              </div>

              <div className="leftinnerDiv-3">
                <div className="input1">
                  <input
                    name="employeePhone"
                    type="text"
                    value={employeeForm.employeePhone}
                    onChange={handleInputChange}
                    required
                  />
                  <span>מספר טלפון</span>
                </div>
                <div className="input1">
                  <input
                    name="employeeEmail"
                    type="text"
                    value={employeeForm.employeeEmail}
                    onChange={handleInputChange}
                    required
                  />
                  <span>כתובת מייל</span>
                </div>
              </div>

              <div className="leftinnerDiv-3">
                <div className="input1">
                  <input
                    name="employeePassword"
                    type="password"
                    value={employeeForm.employeePassword}
                    onChange={handleInputChange}
                    required
                  />
                  <span>סיסמא</span>
                </div>
                <div className="input1">
                  <select
                    name="employeeGender"
                    className="genderSelect"
                    value={employeeForm.employeeGender}
                    onChange={handleInputChange}
                    placeholder="מגדר"
                  >
                    <option value="זכר">זכר</option>
                    <option value="נקבה">נקבה</option>
                    <option value="אחר">אחר</option>
                  </select>
                </div>
              </div>

              <div className="leftinnerDiv-3">
                <Button className="saveNewEmployee" onClick={saveHandler}>
                  שמירה
                </Button>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    )
  );
};

export default TeamPopUp;
