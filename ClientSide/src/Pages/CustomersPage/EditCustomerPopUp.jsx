import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CustomersCss.css";

const EditCustomerPopUp = ({
  trigger,
  setTrigger,
  updateCustomerItem,
  customer,
}) => {
  const [editForm, setEditForm] = useState({
    clientNumber: customer ? customer.costumerNum : "",
    clientName: customer ? customer.costumerName : "",
    clientAddress: customer ? customer.costumerAddress : "",
    clientEmail: customer ? customer.costumerEmail : "",
    clientFirstName: customer ? customer.costumerRepresentitveName : "",
    clientLastName: customer ? customer.costumerRepresentitveSurName : "",
    clientPhoneNum: customer ? customer.costumerRepresentitvePhone : "",
    representiveEmail: customer ? customer.costumerRepresentitveEmail : "",
  });

  useEffect(() => {
    if (customer) {
      setEditForm({
        clientNumber: customer.costumerNum,
        clientName: customer.costumerName,
        clientAddress: customer.costumerAddress,
        clientEmail: customer.costumerEmail,
        clientFirstName: customer.costumerRepresentitveName,
        clientLastName: customer.costumerRepresentitveSurName,
        clientPhoneNum: customer.costumerRepresentitvePhone,
        representiveEmail: customer.costumerRepresentitveEmail,
      });
    }
  }, [customer]);

  const handleInputChange = (event) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };

  const saveHandler = (e) => {
    e.preventDefault();
    const newItemInput = {
      clientNumber: editForm.clientNumber,
      clientName: editForm.clientName,
      clientAddress: editForm.clientAddress,
      clientEmail: editForm.clientEmail,
      clientFirstName: editForm.clientFirstName,
      clientLastName: editForm.clientLastName,
      clientPhoneNum: editForm.clientPhoneNum,
      representiveEmail: editForm.representiveEmail,
      key: editForm.clientNumber,
    };
    updateCustomerItem(newItemInput);
    closeForm();
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
          <h1>עריכת לקוח </h1>
        </div>
        <div className="innerPopUPMiddle">
          <div className="innerPopUP3">
            <div className="divInfoInput">
              <input
                type="text"
                name="clientNumber"
                value={editForm.clientNumber}
                required="required"
                disabled
              />
              <span>מספר לקוח</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="clientName"
                value={editForm.clientName}
                onChange={handleInputChange}
                required="required"
              />
              <span>שם לקוח</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="clientAddress"
                value={editForm.clientAddress}
                onChange={handleInputChange}
                required="required"
              />
              <span>כתובת חברה</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="clientEmail"
                value={editForm.clientEmail}
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
                value={editForm.clientFirstName}
                onChange={handleInputChange}
                required="required"
              />
              <span>שם נציג</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="clientLastName"
                value={editForm.clientLastName}
                onChange={handleInputChange}
                required="required"
              />
              <span>שם משפחה נציג</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="clientPhoneNum"
                value={editForm.clientPhoneNum}
                onChange={handleInputChange}
                required="required"
              />
              <span>טלפון נציג</span>
            </div>
            <div className="divInfoInput">
              <input
                type="text"
                name="representiveEmail"
                value={editForm.representiveEmail}
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
export default EditCustomerPopUp;
