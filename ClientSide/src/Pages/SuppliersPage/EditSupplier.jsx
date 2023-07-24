import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker, { registerLocale } from "react-datepicker";

const EditSupplierPopUp = ({
  trigger,
  setTrigger,
  updateSupplier,
  supplier,
}) => {
  console.log(supplier);
  const [editForm, setEditForm] = useState({
    supplierName: supplier ? supplier.supplierName : "",
    contactName: supplier ? supplier.contactName : "",
    businessNumber: supplier ? supplier.businessNumber : "",
    repEmail: supplier ? supplier.repEmail : "",
    email: supplier ? supplier.email : "",
    address: supplier ? supplier.address : "",
    startWorkDate: supplier && supplier.startWorkDate ? new Date(supplier.startWorkDate) : new Date(),
  });

  useEffect(() => {
    if (supplier) {
      setEditForm({
        supplierName: supplier.supplierName,
        contactName: supplier.contactName,
        businessNumber: supplier.businessNumber,
        repEmail: supplier.repEmail,
        email: supplier.email,
        address: supplier.address,
        // startDate: supplier.startDate,
        startWorkDate: supplier.startWorkDate ? new Date(supplier.startWorkDate) : new Date()
      });
    }
  }, [supplier]);

  const handleInputChange = (event) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateChange = (date) => {
    console.log(date);  // Log the date object for debugging
    setEditForm({
      ...editForm,
      startWorkDate: date,
    });
  };
  

  const saveHandler = (e) => {
    e.preventDefault();
    const transformedData = {
      repName: editForm.supplierName,
      repLastName: editForm.contactName,
      repEmailAddress: editForm.repEmail,
      businessNumber: editForm.businessNumber,
      companyEmail: editForm.email,
      companyAddress: editForm.address,
      startWorkDate: editForm.startWorkDate,
    };
    updateSupplier(transformedData);
    console.log(transformedData);
    closeForm();
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
          <h1>עריכת ספק </h1>
        </div>

        <div className="innerSuppliers3">
          <div className="inputSuppliers">
            <input
              name="businessNumber"
              type="text"
              required="required"
              value={editForm.businessNumber}
              // onChange={handleInputChange}
              disabled
            />
          </div>
          <div className="inputSuppliers">
            <input
              name="supplierName"
              type="text"
              required="required"
              value={editForm.supplierName || ""}
              onChange={handleInputChange}
            />
            <span>שם הספק</span>
          </div>

          <div className="inputSuppliers">
            <input
              name="contactName"
              type="text"
              required="required"
              value={editForm.contactName}
              onChange={handleInputChange}
            />
            <span>שם איש קשר</span>
          </div>

          <div className="inputSuppliers">
            <input
              name="repEmail"
              type="text"
              required="required"
              value={editForm.repEmail}
              onChange={handleInputChange}
            />
            <span>טלפון </span>
          </div>

          <div className="inputSuppliers">
            <input
              name="email"
              type="text"
              required="required"
              value={editForm.email}
              onChange={handleInputChange}
            />
            <span>מייל איש קשר</span>
          </div>

          <div className="inputSuppliers">
            <input
              name="address"
              type="text"
              required="required"
              value={editForm.address}
              onChange={handleInputChange}
            />
            <span>כתובת חברה</span>
          </div>

          <div className="inputSuppliers">
          {/* <DatePicker
              name="StartWorkDate"
              type="text"
              required="required"
              value={editForm.startWorkDate}
              onChange={handleInputChange}
              disabled
            /> */}
            {/* <span>תחילת חוזה</span> */}
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

export default EditSupplierPopUp;
