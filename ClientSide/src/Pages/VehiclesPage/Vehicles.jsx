import React, { useState, useEffect, useCallback } from "react";
import "./VehiclesCss.css";
import VehiclesPopUp from "./VehiclesPopUp";
import DataTable from "react-data-table-component";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BuildIcon from "@mui/icons-material/Build";
import {Menu,MenuHandler,MenuList,MenuItem,} from "@material-tailwind/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NewVehicleMaintenance from "./NewVehicleMaintenance";
import EditVehiclePopUp from "./EditVehiclePopUp";
import DeletePopup from "./DeletePopup";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';


const url ="https://proj.ruppin.ac.il/cgroup96/prod/api/vehicleList/get?timestamp=" + Date.now();
const urlpost = "https://proj.ruppin.ac.il/cgroup96/prod/api/vehicleList/post";
const urldelete ="https://proj.ruppin.ac.il/cgroup96/prod/api/vehicleList/delete";

const username = "cgroup96";
const password = "your_password";

const urlmaintencepost ="https://proj.ruppin.ac.il/cgroup96/prod/api/vehicleAdd/post";
const urlputvehicle ="https://proj.ruppin.ac.il/cgroup96/prod/api/vehicleList/put";
const headers = new Headers();
headers.append("Authorization", "Basic " + btoa(username + ":" + password));

const NoDataComponentVehiclesInfo = () => {
  return(
    <div className="noDataFound">
      <h1>אנא בחר רכב בעל היסטורית טיפולים</h1>
    </div>
  );
};

const Vehicles = () => {

  const [datainfo, setDatainfo] = useState([]);
  const [buttonPopUp, setButtonPopUp] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [licenseNumToDelete, setLicenseNumToDelete] = useState(null);
  const [maintenancePopUp, setMaintenancePopUp] = useState(false);
  const [updateVehicleVisible, setUpdateVehicleVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedLicenseForMaintenance, setSelectedLicenseForMaintenance] = useState(null);
  const [filterVehiclesData, setFilterVehiclesData] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const refreshData = useCallback(
    () => setDataUpdated(!dataUpdated),
    [dataUpdated]
  );
  const conditionalRowStyles = [
    {
      when: (row) => row === selectedRow,
      style: {
        backgroundColor: '#17b1692f',
      },
    },
  ];
  const closeUpdateVehiclePopup = () => {
    setSelectedVehicle(null);
    setUpdateVehicleVisible(false);
  };
  function addMaintenanceItem(item, refreshData) {
    fetch(urlmaintencepost, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        refreshData();
      })
      .catch((error) => {
        console.log("err post=", error);
      });
  }
  function deleteMaintenance(maintenanceId) {
    const deletemainturl ="https://proj.ruppin.ac.il/cgroup96/prod/api/vehicleMaintence/delete";
    fetch(deletemainturl, {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ maintenance_id: maintenanceId }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {

        refreshData();
        fetchMaintenanceData(licenseNumToDelete);
      })
      .catch((error) => {
        console.log("err delete=", error);
      });
  }
  function showDeleteConfirmation(licenseNum) {
    setLicenseNumToDelete(licenseNum);
    setShowDeleteConfirm(true);
  }
  function addVehiclesItem(item, refreshData) {
    fetch(urlpost, {
      method: "POST",
      headers: {
        ...headers, 
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(item),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        toast.success("הוספת רכב הושלמה")
        refreshData();
      })
      .catch((error) => {
        console.log("err post=", error);
      });
  }
  function updateVehiclesItem(item, refreshData) {
    fetch(urlputvehicle, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        refreshData();
      })
      .catch((error) => {
        console.log("err post=", error);
      });
  }
  const openEditPopup = (vehicle) => {
    setSelectedVehicle(vehicle);
    setUpdateVehicleVisible(true);
  };
  function deleteVehicle(itemId) {
    fetch(urldelete, {
      method: "DELETE",
      headers: {
        ...headers, 
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({ licensePlateNum: itemId }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        refreshData();
      })
      .catch((error) => {
        console.log("err delete=", error);
      });
  }
  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        const updatedDatainfo = result.map((st) => {
          return {
            setting: <button>עריכה</button>,
            licenseNum: st.licensePlateNum,
            vehicleType1: st.vehicleType,
            vehicleColor1: st.vehicleColor,
            vehicleOwnership1: st.vehicleOwnership,
            manufacturingYear1: st.manufacturingYear,
            key: st.licensePlateNum,
          };
        });
        setDatainfo(updatedDatainfo);
      })
      .catch((error) => {
        console.log("err post=", error);
      });
  }, [dataUpdated]);


  const columnsLeftData = [
    {
      name: "",
      sortable: true,
      right: true,
      width: "100%",
      cell: (row) => (
        <div className="dataMaintance">
          <div className="dataMaintanceright">
            <div className="infoDataMaintanceright">
              <span>:תאריך</span>
              <div>{new Date(row.DateandTime).toLocaleDateString('en-GB')}</div>

            </div>
            <br/>
            <div className="infoDataMaintanceright">
              <span>: מוסך מטפל</span>
              <div>{row.GarageName}</div>
            </div>
            <br/>
            <div className="infoDataMaintanceright">
              <span>: סוג טיפול</span>
              <div>{row.maintanceName}</div>
            </div>
          </div>

          <div className="dataMaintanceleft">
            <div>
              <Menu className="menuListRow">
                <MenuHandler>
                  <MoreVertIcon/>
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={() => deleteMaintenance(row.maintID)}>
                    <DeleteIcon/>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
      ),
      headers: (
        <div className="dataMaintance">
          <div className="dataMaintanceright">
            <span>טיפולי רכב</span>
          </div>

          <div className="dataMaintanceleft">
            <AddCircleIcon onClick={() => {
              if (selectedLicenseForMaintenance) {
                  setMaintenancePopUp(true);
              } else {
                  toast.warning("לא נבחר רכב עבור טיפול");}}}
                className="iconBC"/>
          </div>
        </div>
      ),
    }
  ];
  const reversedColumns = [...columnsLeftData].reverse();

  function fetchMaintenanceData(licenseNum) {

    const maintenanceUrl = `https://proj.ruppin.ac.il/cgroup96/prod/api/vehicleMaintenance/add`;

    fetch(maintenanceUrl, {
      method: "POST",
      headers: {
        ...headers, 
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({ vehicle_id: licenseNum }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        const updatedMaintenanceData = result.map((item) => {
          return {
            maintID: item.maintenance_id,
            DateandTime: item.maintenance_date,
            GarageName: item.garageName,
            maintanceName: item.maintenance_description,
            Setting: <button>עריכה</button>,
          };
        });
        setMaintenanceData(updatedMaintenanceData); 
      })
      .catch((error) => console.log("Error fetching maintenance data:", error));
  }
  const columns = [
    {
      name: "עריכה",
      selector: "action",
      sortable: false,
      center: true,
      button: true,
      width: "8%",
      cell: (row) => (
        <div>
          <EditIcon onClick={() => openEditPopup(row)} />
        </div>
      ),
    },
    {
      name: "מחיקה",
      selector: "action",
      sortable: false,
      center: true,
      button: true,
      width: "7%",
      cell: (row) => (
        <div>
          <DeleteIcon onClick={() => showDeleteConfirmation(row.licenseNum)} />
        </div>
      ),
    },
    {
      name: " סוג רכב",
      selector: "vehicleType1",
      sortable: true,
      right: true,
      width: "20%",
    },
    {
      name: " בעלות",
      selector: "vehicleOwnership1",
      sortable: true,
      right: true,
      width: "20%",
    },
    {
      name: "צבע",
      selector: "vehicleColor1",
      sortable: true,
      right: true,
      width: "15%",
    },
    {
      name: "שנת יצור",
      selector: "manufacturingYear1",
      sortable: true,
      right: true,
      width: "15%",
    },
    {
      name: "מספר רישוי",
      selector: "licenseNum",
      sortable: true,
      right: true,
      width: "15%",
    }
  ];

  const filteredData = filterVehiclesData ? datainfo.filter((item) =>
  item.licenseNum.toString().toLowerCase().includes(filterVehiclesData.toLowerCase())
  ) : datainfo;

  return (
    <div id="mainBodyVehicles">

      <div id="headerVehicles">
        <h1>רכבים</h1>
      </div>

      <div id="bigInnerMainVehiclesFirst">

        <div id="bigInnerMainVehicles">

        <div id="headerbigInnerMainVehicles">
            <div onClick={() => {setButtonPopUp(true)}} className="addBOX">
              <AddOutlinedIcon className="icon"/>
            </div>
            <div className="searchBox">
              <input type={"text"}
                    value={filterVehiclesData}
                    onChange={(e) => setFilterVehiclesData(e.target.value)}
                    required="required"/>
              <span>מספר רכב</span>
            </div> 
        </div>

        <div id="innerMainVehicles">

          <VehiclesPopUp
            trigger={buttonPopUp}
            setTrigger={setButtonPopUp}
            addVehiclesItem={(item) => addVehiclesItem(item, refreshData)}/>

          <EditVehiclePopUp
            trigger={updateVehicleVisible}
            setTrigger={setUpdateVehicleVisible}
            vehicle={selectedVehicle}
            visible={updateVehicleVisible}
            onClose={closeUpdateVehiclePopup}
            updateVehiclesItem={(item) => updateVehiclesItem(item, refreshData)}/>

          <DeletePopup
            show={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onDelete={() => {
              deleteVehicle(licenseNumToDelete);
              setShowDeleteConfirm(false);}}/>

          <NewVehicleMaintenance
            trigger={maintenancePopUp}
            setTrigger={setMaintenancePopUp}
            addMaintenanceItem={(item) => addMaintenanceItem(item, refreshData)}
            vehicles={datainfo}
            selectedLicenseForMaintenance={selectedLicenseForMaintenance}/>

          <div id="vehiclesTable">
            <DataTable
              columns={columns}
              data={filteredData}
              fixedHeader
              className="dataTableVehicles"
              selectableRows={false}
              selectableRowsSingle
              onRowClicked={(row) => {fetchMaintenanceData(row.licenseNum);
                                      setSelectedLicenseForMaintenance(row.licenseNum)
                                      setSelectedRow(row)}}
              conditionalRowStyles={conditionalRowStyles}
              noDataComponent={<NoDataComponentVehiclesInfo/>}/>
          </div>

        <div id="vehiclesInfo">
          <div className="vehiclesInfoHeader">
            <BuildIcon onClick={() => setMaintenancePopUp(!maintenancePopUp)}/>
            <h1>היסטורית טיפולים</h1>
          </div>
          <div className="vehiclesInfoMain">
          <DataTable columns={reversedColumns}
                     data={maintenanceData}
                     noDataComponent={<NoDataComponentVehiclesInfo/>}/>
          </div>
        </div>

      </div>
      </div>
    </div>
    </div>
  );
};

export default Vehicles;

