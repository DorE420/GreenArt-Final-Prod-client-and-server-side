import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DatePicker, { registerLocale } from "react-datepicker";
import he from "date-fns/locale/he";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("he", he);

const NewSuppliers = ({ trigger, setTrigger, addSupplier, children }) => {

  const [supplierData, setSupplierData] = useState({
    businessNumber: "",
    startWorkDate: new Date(),
    companyAddress: "",
    companyEmail: "",
    repName: "",
    repLastName: "",
    repEmailAddress: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSupplierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDateChange = (date) => {
    setSupplierData((prevData) => ({
      ...prevData,
      startWorkDate: date,
    }));
  };
  const saveHandler = (e) => {
    e.preventDefault();
    setTrigger(false);
    console.log("*************************");
    console.log(supplierData);
    console.log("*************************");
    addSupplier(supplierData);
    resetTextHandler();
  };
  const resetTextHandler = () => {
    setSupplierData({
      businessNumber: "",
      startWorkDate: new Date(),
      companyAddress: "",
      companyEmail: "",
      repName: "",
      repLastName: "",
      repEmailAddress: "",
    });
  };
  const closeForm = () => {
    setTrigger(false);
  };

  return trigger ? (
    <div id="popUpSuplliers">
      <div id="innerPopUpSuplliers">
        <div className="innerSuppliers1">
          <HighlightOffIcon onClick={closeForm} />
        </div>

        <div className="innerSuppliers2">
          <h1>הוספת ספק חדש</h1>
        </div>

        <div className="innerSuppliers3">
          <div className="inputSuppliers">
            <input
              name="businessNumber"
              type="text"
              required="required"
              value={supplierData.businessNumber}
              onChange={handleInputChange}
            />
            <span>ח"פ</span>
          </div>

          <div className="inputSuppliers">
            <input
              name="repName"
              type="text"
              required="required"
              value={supplierData.repName}
              onChange={handleInputChange}
            />
            <span>שם ספק</span>
          </div>

          <div className="inputSuppliers">
            <input
              name="companyAddress"
              type="text"
              required="required"
              value={supplierData.companyAddress}
              onChange={handleInputChange}
            />
            <span>כתובת ספק</span>
          </div>

          <div className="inputSuppliers">
            <input
              name="repLastName"
              type="text"
              required="required"
              value={supplierData.repLastName}
              onChange={handleInputChange}
            />
            <span>שם איש קשר</span>
          </div>

          <div className="inputSuppliers">
            <input
              name="companyEmail"
              type="text"
              required="required"
              value={supplierData.companyEmail}
              onChange={handleInputChange}
            />
            <span>כתובת מייל</span>
          </div>
          <div className="inputSuppliers">
            <input
              name="repEmailAddress"
              type="text"
              required="required"
              value={supplierData.repEmailAddress}
              onChange={handleInputChange}
            />
            <span>טלפון </span>
          </div>


        </div>

        <div className="innerSuppliers4">
          <Button className="login_Button" onClick={saveHandler}>
            {" "}
            שמירה
          </Button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};
export default NewSuppliers;
