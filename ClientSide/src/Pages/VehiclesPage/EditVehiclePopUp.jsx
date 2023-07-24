import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VehiclesCss.css";

const EditVehiclePopUp = ({
  trigger,
  setTrigger,
  updateVehiclesItem,
  vehicle,
}) => {
  const [editForm, setEditForm] = useState({
    licenseNum: vehicle ? vehicle.licenseNum : "",
    vehicleType1: vehicle ? vehicle.vehicleType1 : "",
    vehicleColor1: vehicle ? vehicle.vehicleColor1 : "",
    vehicleOwnership1: vehicle ? vehicle.vehicleOwnership1 : "",
    manufacturingYear1: vehicle ? vehicle.manufacturingYear1 : "",
  });
  useEffect(() => {
    if (vehicle) {
      setEditForm({
        licenseNum: vehicle.licenseNum,
        vehicleType1: vehicle.vehicleType1,
        vehicleColor1: vehicle.vehicleColor1,
        vehicleOwnership1: vehicle.vehicleOwnership1,
        manufacturingYear1: vehicle.manufacturingYear1,
      });
    }
  }, [vehicle]);

const handleInputChange = (event) => {
  setEditForm({
    ...editForm,
    [event.target.name]: event.target.value,
  });
};
  const saveHandler = (e) => {
    e.preventDefault();
    const newItemInput = {
      licensePlateNum: editForm.licenseNum,
      vehicleType: editForm.vehicleType1,
      vehicleColor: editForm.vehicleColor1,
      vehicleOwnership: editForm.vehicleOwnership1,
      manufacturingYear: editForm.manufacturingYear1,
      key: editForm.licenseNum,
    };
     updateVehiclesItem(newItemInput); 
    closeForm();
  }
  const closeForm = () => {
    setTrigger(false);
  };
  return trigger ? (
    <>
      <div id="vehiclesPopUp">

        <div id="vehiclesInnerPopUp">

          <div className="innervehiclesInnerPopUp1">
            <HighlightOffIcon onClick={closeForm}/>
          </div>

          <div className="innervehiclesInnerPopUp2">
            <h1>עריכת פרטי רכב</h1>
          </div>

          <div className="innervehiclesInnerPopUp3">
            <div className="divInfoInput">
              <input type="text"
                     name="vehicleType1"
                     value={editForm.licenseNum}
                     required="required"/>
              <span>מספר רישוי רכב</span>
            </div>
            <div className="divInfoInput">
              <input type="text"
                     name="vehicleType1"
                     value={editForm.vehicleType1}
                     onChange={handleInputChange}
                     required="required"/>
              <span>סוג רכב</span>
            </div>
            <div className="divInfoInput">
              <input type="text"
                     name="manufacturingYear1"
                     value={editForm.manufacturingYear1}
                     onChange={handleInputChange}
                     required="required"/>
              <span>שנת ייצור</span>
            </div>
            <div className="divInfoInput">
              <input type="text"
                     name="vehicleColor1"
                     value={editForm.vehicleColor1}
                     onChange={handleInputChange}
                     required="required"/>
              <span>צבע רכב</span>
            </div>
            <div className="divInfoInput">
              <input type="text"
                     name="vehicleOwnership1"
                     value={editForm.vehicleOwnership1}
                     onChange={handleInputChange}
                     required="required"/>
              <span>בעלות רכב</span>
            </div>
          </div>

          <div className="innervehiclesInnerPopUp4">
            <Button onClick={saveHandler}>
                {" "}
                שמירת עדכונים
            </Button>
          </div>
          
        </div>
      </div>
    </>
  ) : (
    ""
  );
};
export default EditVehiclePopUp;
