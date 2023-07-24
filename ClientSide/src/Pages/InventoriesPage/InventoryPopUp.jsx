import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

function InventoryPopUp({ trigger, setTrigger, addInventoryItem,  }) {
  const [itemSerialNum, setSerialNum] = useState("");
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [itemDescription, setitemDescription] = useState("");
  const [employee_id, setemployee_id] = useState("");
  const [price, setPrice] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");

  const setSerialNumInput = (e) => {
    setSerialNum(e.target.value);
  };
  const setItemNameInput = (e) => {
    setItemName(e.target.value);
  };
  const setAmountInput = (e) => {
    setAmount(e.target.value);
  };
  const setitemDescriptionInput = (e) => {
    setitemDescription(e.target.value);
  };
  const setemployee_idInput = (e) => {
    setemployee_id(e.target.value);
  };
  const setPriceInput = (e) => {
    setPrice(e.target.value);
  };
  const setBuyingPriceInput = (e) => {
    setBuyingPrice(e.target.value);
  };

  const saveHandler = (e) => {
    e.preventDefault();
    const newItemInput = {
      itemSerialNum: itemSerialNum,
      itemName: itemName,
      itemDescription: itemDescription,
      itemAmount: amount,
      employee_id: employee_id,
      price: price,
      buyingPrice: buyingPrice,
    };
    addInventoryItem(newItemInput);
    resetTextHandler();
    setTrigger(false);
  };
  const resetTextHandler = () => {
    setSerialNum("");
    setItemName("");
    setAmount("");
    setitemDescription("");
    setemployee_id("");
    setPrice("");
    setBuyingPrice("");
  };
  const closeForm = () => {
    setTrigger(false);
  };

  return trigger ? (
    <div className="popUpInventories">
      <div className="innerPopUpInventories">
        <div className="innerInventories1">
          <HighlightOffIcon onClick={closeForm} />
        </div>

        <div className="innerInventories2">
          <h1>יצירת פריט מלאי חדש</h1>
        </div>

        <div className="innerInventories3">
            <div className="innerInventories3-Div">
              <input
                type="text"
                value={itemSerialNum}
                onChange={setSerialNumInput}
                required="required"/>
              <span>מספר פריט</span>
            </div>

            <div className="innerInventories3-Div">
              <input
                type="text"
                value={itemName}
                onChange={setItemNameInput}
                required="required"/>
              <span>שם פריט</span>
            </div>

            <div className="innerInventories3-Div">
              <input
                type="text"
                value={amount}
                onChange={setAmountInput}
                required="required"/>
              <span>כמות במלאי</span>
            </div>

            <div className="innerInventories3-Div">
              <input
                type="text"
                value={itemDescription}
                onChange={setitemDescriptionInput}
                required="required"/>
              <span>תיאור פריט</span>
            </div>

            <div className="innerInventories3-Div">
              <input
                type="text"
                value={price}
                onChange={setPriceInput}
                required="required"/>
              <span>מחיר</span>
            </div>

            <div className="innerInventories3-Div">
              <input
                type="text"
                value={buyingPrice}
                onChange={setBuyingPriceInput}
                required="required"/>
              <span>מחיר קניה</span>
            </div>
          
        </div>
        <div className="innerInventories4">
          <Button className="saveNewEmployee" onClick={saveHandler}>
            שמירת פריט מלאי
          </Button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
export default InventoryPopUp;
