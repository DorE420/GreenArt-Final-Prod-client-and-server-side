import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CustomersCss.css";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";


const NewCustomers = ({ trigger, setTrigger, addCustomers, children }) => {
  const [formData, setFormData] = useState({
    clientNumber: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    clientFirstName: "",
    clientLastName: "",
    clientPhoneNum: "",
    representiveEmail: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const saveHandler = (e) => {
    e.preventDefault();
    console.log("*************************");
    addCustomers(formData);
    resetTextHandler();
    setTrigger(false);
  };

  const resetTextHandler = () => {
    setFormData({
      clientNumber: "",
      clientName: "",
      clientAddress: "",
      clientEmail: "",
      clientFirstName: "",
      clientLastName: "",
      clientPhoneNum: "",
      representiveEmail: "",
    });
  };

  const closeForm = () => {
    setTrigger(false);
  };

  return trigger ? (
    <div className="costumerPopUp">
      <div className="costumerInnerPopUp">
        <div className="innerPopUP1">
          <HighlightOffIcon onClick={closeForm} />
        </div>
        <div className="innerPopUP2">
          <h1>הוספת לקוח חדש</h1>
        </div>
        <div className="innerPopUPMiddle">
          <div className="innerPopUP3">
            <div className="divInfoInput">
              <input
                type="text"
                name="clientNumber"
                value={formData.clientNumber}
                onChange={handleInputChange}
                required="required"
              />
              <span>מספר לקוח</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                required="required"
              />

              <span>שם לקוח</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleInputChange}
                required="required"
              />
              <span>כתובת חברה</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                required="required"
              />
              <span>כתובת מייל</span>
            </div>
          </div>
          <div className="innerPopUP4">
            <div className="divInfoInput">
              <input
                type="text"
                name="clientFirstName"
                value={formData.clientFirstName}
                onChange={handleInputChange}
                required="required"
              />
              <span>שם נציג</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="clientLastName"
                value={formData.clientLastName}
                onChange={handleInputChange}
                required="required"
              />
              <span>שם משפחה נציג</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="clientPhoneNum"
                value={formData.clientPhoneNum}
                onChange={handleInputChange}
                required="required"
              />
              <span>טלפון נציג</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="representiveEmail"
                value={formData.representiveEmail}
                onChange={handleInputChange}
                required="required"
              />
              <span>מייל נציג</span>
            </div>
          </div>
        </div>
        <div className="innerPopUP5">
          <Button onClick={saveHandler}>שמירה</Button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default NewCustomers;
