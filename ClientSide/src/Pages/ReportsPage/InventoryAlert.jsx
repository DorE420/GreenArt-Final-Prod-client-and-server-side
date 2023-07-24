import React, { useEffect, useState } from 'react';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import './InventoryAlert.css';

const InventoryAlert = () => {

  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('https://proj.ruppin.ac.il/cgroup96/prod/api/inventoryItems/getLowStockItems') 
      .then(response => response.json())
      .then(data => setItems(data));
  }, []);

  return (
  <>
    <label className="itemAlertTitle">שים לב! מלאי הפרטי נמוך - אנא בדוק צורך בחידוש מלאי</label>
    {items.length === 0 && <p>כל הפריטים בכמות מספקת</p>}
    {items.length > 0 && (
    <div className="itemAlertList">
      {items.map((item, index) => (
      <div key={index} className="itemAlertList-1">
        <LocalFloristIcon id="itemAlertList-Icon"/>
        <div className="itemAlertList-Label">
          <label className="itemAlertList-innerAmount">{item.itemAmount}</label>
          <label>{item.itemName} : כמות במלאי - </label>
        </div>
      </div>))}
    </div>)}
  </>
  );
};

export default InventoryAlert;
