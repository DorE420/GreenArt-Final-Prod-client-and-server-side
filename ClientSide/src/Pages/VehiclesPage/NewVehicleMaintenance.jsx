import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VehiclesCss.css";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import he from "date-fns/locale/he";
import "react-datepicker/dist/react-datepicker.css";

registerLocale('he', he);
setDefaultLocale('he');


function NewVehicleMaintenance({
  trigger,
  setTrigger,
  addMaintenanceItem,
  selectedLicenseForMaintenance,})
{
  const [maintenanceId, setMaintenanceId] = useState("");
  const [maintenanceDescription, setMaintenanceDescription] = useState("");
  const [garageName, setGarageName] = useState("");
  const [maintenanceDate, setMaintenanceDate] = useState(new Date());

  const maintenanceIdHandler = (e) => {
    setMaintenanceId(e.target.value);
  };
  const maintenanceDateHandler = (e) => {
    setMaintenanceDate(e.target.value);
  };
  const maintenanceDescriptionHandler = (e) => {
    setMaintenanceDescription(e.target.value);
  };
  const garageNameHandler = (e) => {
    setGarageName(e.target.value);
  };

  const closeForm = () => {
    setTrigger(false);
  };
  const resetTextHandler = () => {
    setMaintenanceId("");
    setMaintenanceDate("");
    setMaintenanceDescription("");
    setGarageName("");
  };
  const saveHandler = (e) => {
    e.preventDefault();
    const newItemInput = {
      maintenance_id: maintenanceId,
      maintenance_date: maintenanceDate,
      maintenance_description: maintenanceDescription,
      garageName: garageName,
      vehicle_id: selectedLicenseForMaintenance,
    };
    addMaintenanceItem(newItemInput);
    resetTextHandler();
    setTrigger(false);
  };

  return trigger ? (

    <div id="vehiclesPopUp">

      <div id="vehiclesInnerPopUp">

        <div className="innervehiclesInnerPopUp1">
          <HighlightOffIcon onClick={closeForm}/>
        </div>

        <div className="innervehiclesInnerPopUp2">
          <h1>טיפול רכב חדש</h1>
        </div>

        <div className="innervehiclesInnerPopUp3">
          <div className="divInfoInput">
              <input type="text"
                    value={selectedLicenseForMaintenance}
                    required="required"/>
            <span>מספר רישוי רכב</span>
          </div>
          <div className="divTimeInput">
            <span>תאריך טיפול</span>
            <DatePicker
                className="dateInputMaintenance"
                selected={maintenanceDate}
                onChange={(date) => setMaintenanceDate(date)}
                locale={he}/>
          </div>
          <div className="divInfoInput">
              <input type="text"
                    value={maintenanceDescription}
                    onChange={maintenanceDescriptionHandler}
                    required="required"/>
            <span>תיאור טיפול</span>
          </div>
          <div className="divInfoInput">
              <input type="text"
                    value={garageName}
                    onChange={garageNameHandler}
                    required="required"/>
            <span>שם המוסך</span>
          </div>
          <div className="divInfoInput">
              <input type="text"
                    value={maintenanceId}
                    onChange={maintenanceIdHandler}
                    required="required"/>
            <span>מספר טיפול</span>
          </div>
        </div>

        <div className="innervehiclesInnerPopUp4">
          <Button className="login_Button" onClick={saveHandler}>
            שמור
          </Button>
        </div>

      </div>
    </div>
  ) : ("");
}
export default NewVehicleMaintenance;
