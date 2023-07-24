import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VehiclesCss.css";

function NewVehicles({ trigger, setTrigger, addVehiclesItem, children }) {
  const [licensePlateNum, setLicensePlateNum] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [manufacturingYear, setManufacturingYear] = useState("");
  const [vehicleOwnership, setVehicleOwnership] = useState("");

  const licenseHandler = (e) => {
    setLicensePlateNum(e.target.value);
  };
  const vehicleHandler = (e) => {
    setVehicleType(e.target.value);  
  };
  const vehicleColorHandler = (e) => {
    setVehicleColor(e.target.value);
 
  };
  const manufacturingYearHandler = (e) => {
    setManufacturingYear(e.target.value); 
  };
  const vehicleOwnershipHandler = (e) => {
    setVehicleOwnership(e.target.value); 
  };

  const saveHandler = (e) => {
    e.preventDefault();
    const newItemInput = {
      licensePlateNum: licensePlateNum,
      vehicleType: vehicleType,
      vehicleColor: vehicleColor,
      vehicleOwnership: vehicleOwnership,
      manufacturingYear: manufacturingYear,
      key: licensePlateNum,
    };
    addVehiclesItem(newItemInput);
    resetTextHandler();
    setTrigger(false);
  };
  const resetTextHandler = () => {
    setLicensePlateNum("");
    setVehicleType("");
    setVehicleColor("");
    setManufacturingYear("");
    setVehicleOwnership("");
  };
  const closeForm = () => {
    setTrigger(false);
  };

  return trigger ? (

    <div id="vehiclesPopUp">

      <div id="vehiclesInnerPopUp">

        <div className="innervehiclesInnerPopUp1">
          <HighlightOffIcon onClick={closeForm}/>
        </div>

        <div className="innervehiclesInnerPopUp2">
          <h1>הוספת רכב חדש</h1>
        </div>

        <div className="innervehiclesInnerPopUp3">
            <div className="divInfoInput">
              <input type="text"
                    value={licensePlateNum}
                    onChange={licenseHandler}
                    required="required"/>
              <span>מספר רישוי רכב</span>
            </div>
            <div className="divInfoInput">
              <input type="text"
                    value={vehicleType}
                    onChange={vehicleHandler}
                    required="required"/>
              <span>סוג רכב</span>
            </div>
            <div className="divInfoInput">
              <input type="text"
                    value={manufacturingYear}
                    onChange={manufacturingYearHandler}
                    required="required"/>
              <span>שנת ייצור</span>
            </div>
            <div className="divInfoInput">
              <input type="text"
                    value={vehicleColor}
                    onChange={vehicleColorHandler}
                    required="required"/>
              <span>צבע רכב</span>
            </div>
            <div className="divInfoInput">
              <input type="text"
                    value={vehicleOwnership}
                    onChange={vehicleOwnershipHandler}
                    required="required"/>
              <span>בעלות רכב</span>
            </div>
        </div>

        <div className="innervehiclesInnerPopUp4">
            <Button onClick={saveHandler}>
              {" "}
            שמירת רכב חדש
            </Button>
        </div>
        
      </div>
    </div>
  ) : ("");
}

export default NewVehicles;