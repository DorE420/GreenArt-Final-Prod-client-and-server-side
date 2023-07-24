import React, { useState, useEffect, useCallback } from "react";
import "./TeamCss.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "react-data-table-component";
import TeamPopUp from "./TeamPopUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import img1 from "../TeamPage/TeamIcons/Icon2.jpg";
import UpdateEmployee from "./UpdateEmployee";
import { ToastContainer, toast } from "react-toastify";
import DeleteAlert from "./DeleteAlert";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import ReactModal from 'react-modal';
const urlGet = "https://proj.ruppin.ac.il/cgroup96/prod/api/employee/get";
const urlPost = "https://proj.ruppin.ac.il/cgroup96/prod/api/employee/post";
const urlDelete = "https://proj.ruppin.ac.il/cgroup96/prod/api/employee/delete";
const urlPut = "https://proj.ruppin.ac.il/cgroup96/prod/api/employee/put";
const username = "cgroup96";
const password = "your_password";

const headers = new Headers();
headers.append("Authorization", "Basic " + btoa(username + ":" + password));

ReactModal.setAppElement('#root');

const Team = () => {
  const [employeeDataInfo, setEmployeeDataInfo] = useState([]);
  const [employeeDataUpdate, setEmployeeDataUpdate] = useState(false);
  const [employeePopUp, setEmployeePopUp] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [filterEmployeeData, setFilterEmployeeData] = useState("");
  const [updateEmployeePopUp, setUpdateEmployeePopUp] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);


  const refreshData = useCallback(
    () => setEmployeeDataUpdate((prev) => !prev),
    []
  );
  function addEmployee(item, refreshData) {
    fetch(urlPost, {
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
        toast.success("הוספת עובד הושלמה");
        refreshData();
      })
      .catch((error) => {
        console.log("Err post = ", error);
      });
  }
  function deleteEmployee(employeeId) {
    fetch(urlDelete, {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employee_id: employeeId }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        refreshData();
      })
      .catch((error) => {
        console.log("Err delete = ", error);
      });
  }

  function editEmployee(updatedEmployeeData) {
    fetch(urlPut, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEmployeeData),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        toast.success("עדכון עובד הושלם");
        refreshData();
      })
      .catch((error) => {
        console.log("Err put = ", error);
      });
  }
  useEffect(() => {
    fetch(urlGet, {
      method: "GET",
      headers: headers,
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        const updatedDatainfo = result.map((st) => {
          return {
            employeeId: st.employee_id,
            employeeFirstname: st.employee_name,
            employeeLastname: st.employee_familyname,
            employeePhone: st.employee_PhoneNumber,
            employeeEmail: st.employee_email,
            employeeGender: st.employee_gender,
            employeePosition: st.employee_position,
            employeePassword: st.employee_pw,
            employeePicture:st.employee_picture
          };
        });
        setEmployeeDataInfo(updatedDatainfo);
      })
      .catch((error) => {
        console.log("Err post = ", error);
      });
  }, [employeeDataUpdate]);

  const iconEmployee = [
    "../TeamIcons/Icon1.jpg",
    "../TeamIcons/Icon2.jpg",
    "../TeamIcons/Icon3.jpg",
    "../TeamIcons/Icon4.jpg",
    "../TeamIcons/Icon5.jpg",
    "../TeamIcons/Icon6.jpg",
  ];
  const randomIndex = Math.floor(Math.random() * iconEmployee.length);
  const randomImage = iconEmployee[randomIndex];

  const openModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImage(null);
  };

  const columnsEmployee = [
    {
      name: "",
      selector: "",
      width: "10%",
      center: true,
      cell: (row) => {
        return (
          <div className="imgBXTbaleEmployee">
          <img 
            src={row.employeePicture} 
            alt="Avatar" 
            onClick={() => openModal(row.employeePicture)}
          />
        </div>
        );
      },
    },
    {
      name: "תעודת זהות",
      selector: "employeeId",
      sortable: true,
      right: true,
      width: "15%",
    },
    {
      name: "שם פרטי",
      selector: "employeeFirstname",
      sortable: true,
      right: true,
      width: "15%",
    },
    {
      name: "שם משפחה",
      selector: "employeeLastname",
      sortable: true,
      right: true,
      width: "15%",
    },
    {
      name: "פרטי עובד",
      selector: "employeeInformation",
      right: true,
      width: "30%",
      cell: (row) => (
        <div className="infoDivEmployee">
          <div>
            {row.employeePhone}
            <label> : טלפון</label>
          </div>
          <div>
            {row.employeeEmail}
            <label> : מייל</label>
          </div>
          <div>
            {row.employeeGender}
            <label> : מגדר</label>
          </div>
        </div>
      ),
    },
    {
      name: "תפקיד",
      selector: "employeePosition",
      sortable: true,
      right: true,
      width: "10%",
    },
    {
      name: "",
      selector: "setting",
      center: true,
      width: "5%",
      cell: (row) => (
        <div>
          <div>
            <Menu>
              <MenuHandler>
                <MoreVertIcon />
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <EditIcon
                    onClick={() => {
                      setSelectedEmployee(row);
                      setUpdateEmployeePopUp(true);
                    }}
                  />
                </MenuItem>
                <MenuItem>
                  <DeleteIcon
                    onClick={() => {
                      setEmployeeIdToDelete(row.employeeId);
                      setShowDeleteConfirm(true);
                    }}
                  />
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      ),
    },
  ];
  const reversedColumnsEmployee = [...columnsEmployee].reverse();

  const filteredData = filterEmployeeData
    ? employeeDataInfo.filter((item) =>
        item.employeeFirstname
          .toLowerCase()
          .includes(filterEmployeeData.toLowerCase())
      )
    : employeeDataInfo;


  return (
    <div id="mainBodyTeam">
      <ToastContainer />
      <div id="headerTeam">
        <h1>צוות עובדים</h1>
      </div>
      <div id="innerMainTeam">
        <TeamPopUp
          trigger={employeePopUp}
          setTrigger={setEmployeePopUp}
          addEmployee={(item) => addEmployee(item, refreshData)}
          currentEmployee={currentEmployee}
          refreshData={refreshData}
        />
        <UpdateEmployee
          trigger={updateEmployeePopUp}
          setTrigger={setUpdateEmployeePopUp}
          editEmployee={(updatedEmployeeData) => editEmployee(updatedEmployeeData)
          }
          currentEmployee={selectedEmployee}
        />

        <DeleteAlert
          show={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onDelete={() => {
            deleteEmployee(employeeIdToDelete);
            setShowDeleteConfirm(false);
          }}
        />
         <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Employee Image"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
          },
          content: {
            width: '50%',
            height: '50%',
            margin: 'auto'
          }
        }}
      >
        <button onClick={closeModal} className="close-button">סגור</button>
        {currentImage && <img src={currentImage} alt="Employee" style={{width: '100%', height: 'auto'}}/>}
      </ReactModal>
        <div className="JobInfo">
          <div className="headerInnerInfo">
            <div
              onClick={() => {
                setEmployeePopUp(true);
                setCurrentEmployee("");
              }}
              className="addBOX"
            >
              <AddOutlinedIcon className="icon" />
            </div>

            <div className="right">
              <div className="searchBox">
                <input
                  type={"text"}
                  value={filterEmployeeData}
                  onChange={(e) => setFilterEmployeeData(e.target.value)}
                  required="required"
                />
                <span>שם עובד/ת</span>
              </div>
            </div>
          </div>
          <div className="mainInfo">
            <DataTable
              columns={reversedColumnsEmployee}
              data={filteredData}
              highlightOnHover
              fixedHeader
              className="dataTableEmployee"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
