import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TeamCss.css";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import UploadIcon from "@mui/icons-material/Upload";
import "react-datepicker/dist/react-datepicker.css";

const UpdateEmployee = ({
  trigger,
  setTrigger,
  editEmployee,
  currentEmployee,
  children,
}) => {

  const [employee, setEmployee] = useState({
      employeeId: "",
      employeeName: "",
      employeeSurname: "",
      employeePosition: "",
      employeePhone: "",
      employeeEmail: "",
      employeeGender: "זכר",
      employeePassword: "",
  });
 const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentEmployee) {
      setEmployee({
        employeeId: currentEmployee.employeeId,
        employeeName: currentEmployee.employeeFirstname,
        employeeSurname: currentEmployee.employeeLastname,
        employeePosition: currentEmployee.employeePosition,
        employeePhone: currentEmployee.employeePhone,
        employeeEmail: currentEmployee.employeeEmail,
        employeeGender: currentEmployee.employeeGender,
        employeePassword: currentEmployee.employeePassword,
      });
    }
  }, [currentEmployee]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (event) => {
      setEmployee({
        ...employee,
        [event.target.name]: event.target.value,
      });
    };
  

    const saveHandler = (e) => {
      e.preventDefault();
      const updatedEmployeeInput = {
        employee_id: employee.employeeId,
        employee_name: employee.employeeName,
        employee_familyname: employee.employeeSurname,
        employee_position: employee.employeePosition,
        employee_PhoneNumber: employee.employeePhone,
        employee_email: employee.employeeEmail,
        employee_pw: employee.employeePassword,
        employee_gender: employee.employeeGender,
      };
      editEmployee(updatedEmployeeInput);
      resetForm();
      setTrigger(false);
    };
  const resetForm = () => {
    setEmployee({
      employeeId: "",
      employeeName: "",
      employeeSurname: "",
      employeePosition: "",
      employeePhone: "",
      employeeEmail: "",
      employeeGender: employee.employeeGender,
      employeeBirthDate: null,
      employeePassword: employee.employeePassword,
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
            <h1>עדכון איש צוות קיים</h1>
          </div>
          <div className="innerEmloyee3">
            <div className="innerDiv3-2">
              <div className="innerDivUploadImg">
                <div onClick={handleUploadClick}>
                  <span>לחץ/י להעלאת תמונה</span>
                  <UploadIcon />
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleInputChange}
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
                    value={employee.employeeId}
                    onChange={handleInputChange}
                    disabled
                    required
                  />
                </div>
                <div className="input1">
                  <input
                    name="employeePosition"
                    type="text"
                    value={employee.employeePosition}
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
                    value={employee.employeeSurname}
                    onChange={handleInputChange}
                    required
                  />
                  <span>שם משפחה</span>
                </div>
                <div className="input1">
                  <input
                    name="employeeName"
                    type="text"
                    value={employee.employeeName}
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
                    value={employee.employeePhone}
                    onChange={handleInputChange}
                    required
                  />
                  <span>מספר טלפון</span>
                </div>
                <div className="input1">
                  <input
                    name="employeeEmail"
                    type="text"
                    value={employee.employeeEmail}
                    onChange={handleInputChange}
                    required
                  />
                  <span>כתובת מייל</span>
                </div>
              </div>
              <div className="leftinnerDiv-3">
                <div className="input1">
                  <input
                    name="employeeGender"
                    type="text"
                    value={employee.employeeGender}
                    onChange={handleInputChange}
                    disabled
                  />
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

export default UpdateEmployee;
