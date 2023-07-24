
import React, { useState,useEffect } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

function UpdateInventoryItem({ trigger, setTrigger,onUpdateInventoryItem, currentItem, children }) {
  const [itemSerialNum, setSerialNum] = useState(currentItem.itemSerialNum);
  const [itemName, setItemName] = useState(currentItem.itemName);
  const [amount, setAmount] = useState(currentItem.itemAmount);
  const [itemDescription, setitemDescription] = useState(currentItem.itemDescription);
  const [employee_id, setemployee_id] = useState(currentItem.id);
  const [price, setPrice] = useState(currentItem.price);
  const [buyingPrice, setBuyingPrice] = useState(currentItem.buyingPrice);

  useEffect(() => {
    setSerialNum(currentItem.itemSerialNum);
    setItemName(currentItem.itemName);
    setAmount(currentItem.itemAmount);
    setitemDescription(currentItem.itemDescription);
    setemployee_id(currentItem.id);
    setPrice(currentItem.price);
    setBuyingPrice(currentItem.buyingPrice);
  }, [currentItem]);
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

  const updateHandler = (e) => {
    e.preventDefault();
    const updatedItem = {
      itemSerialNum: itemSerialNum,
      itemName: itemName,
      itemAmount: amount,
      itemDescription: itemDescription,
      employee_id: employee_id,
      price: price,
     buyingPrice: buyingPrice
    };
    onUpdateInventoryItem(currentItem.itemSerialNum, updatedItem);
    setTrigger(false);
  };
  const closeForm = () => {
    setTrigger(false);
  };

  return trigger ? (
    <div className="popUpInventories">
      <div className="innerPopUpInventories">

        <div className="innerInventories1">
          <HighlightOffIcon onClick={closeForm}/>
        </div>

        <div className="innerInventories2">
          <h1>עדכון פריט מלאי</h1>
        </div>

        <div className="innerInventories3">

          <div className="innerInventories3-Div">
              <input type="text"
                     value={itemSerialNum}
                     required="required"/>
              <span>מספר פריט</span>
          </div>
  
          <div className="innerInventories3-Div">
              <input type="text"
                     value={itemName}
                     onChange={setItemNameInput}
                     required="required"/>
              <span>שם פריט</span>
          </div>
  
          <div className="innerInventories3-Div">
            <input type="text"
                   value={amount}
                   onChange={setAmountInput}
                   required="required"/>
            <span>כמות במלאי</span>
          </div>
  
          <div className="innerInventories3-Div">
            <input type="text"
                   value={itemDescription}
                   onChange={setitemDescriptionInput}
                   required="required"/>
            <span>תיאור פריט</span>
          </div>

          <div className="innerInventories3-Div">
            <input type="text"
                   value={employee_id}
                   onChange={setemployee_idInput}
                   required="required"/>
            <span>תז עובד</span>
          </div>

          <div className="innerInventories3-Div">
            <input type="text"
                   value={price}
                   onChange={setPriceInput}
                   required="required"/>
            <span>מחיר</span>
          </div>

         <div className="innerInventories3-Div">
            <input type="text"
                   value={buyingPrice}
                   onChange={setBuyingPriceInput}
                   required="required"/>
            <span>מחיר קניה</span>
        </div>
        </div>
        
        <div className="innerInventories4">
          <Button className="login_Button" onClick={updateHandler}>
            עדכון פריט מלאי
          </Button>
        </div>
        {children}
      </div>
    </div>
  ) : (
    ""
  );
}
export default UpdateInventoryItem;