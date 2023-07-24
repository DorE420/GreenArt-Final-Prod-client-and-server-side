import React, { useState, useEffect, useCallback } from "react";
import "./CustomersCss.css";
import NewCustomers from "./NewCustomers";
import DataTable from "react-data-table-component";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeletePopup from "./DeletePopup";
import EditCustomerPopUp from "./EditCustomerPopUp";
import { ToastContainer, toast } from "react-toastify";

const NoDataComponentCustomer = () => {
  return(
    <div className="noDataFound">
      <h1>לא נמצא לקוח מתאים</h1>
    </div>
  );
};


const url = "https://proj.ruppin.ac.il/cgroup96/prod/api/customers/get";
const urlPost = "https://proj.ruppin.ac.il/cgroup96/prod/api/customers/post";
const urlDelete =
  "https://proj.ruppin.ac.il/cgroup96/prod/api/customers/delete";
const urlPut = "https://proj.ruppin.ac.il/cgroup96/prod/api/customers/put";
const username = "cgroup96";
const password = "your_password";

const headers = new Headers();
headers.append("Authorization", "Basic" + btoa(username + ":" + password));

const Customers = () => {
  const [dataInfo, setDataInfo] = useState([]);
  const [addNewCustomers, setAddNewCustomers] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const refreshData = useCallback(() => setDataUpdated(!dataUpdated),[dataUpdated]);
  const [filterCustomersData, setFilterCustomersData] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  function addCustomers(customer, refreshData) {
    fetch(urlPost, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })
      .then((res) => {
        console.log("res=", res);
        console.log("res.status", res.status);
        console.log("res.ok", res.ok);
        return res.json();
      })
      .then((result) => {
        console.log("Add Customer result = ", result);
        toast.success("הוספת לקוח הושלמה");
        refreshData();
      })
      .catch((error) => {
        console.log("Err post = ", error);
      });
  }

  function deleteCustomer(customerId) {
    fetch(urlDelete, {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientNumber: customerId }),
    })
      .then((res) => {
        console.log("Customer number is: ", customerId);
        console.log("res = ", res);
        console.log("res.status", res.status);
        console.log("res.ok", res.ok);
  
        // If response is OK, toast success, else toast error
        if (res.ok) {
          toast.success("מחיקת לקוח הושלמה");
        } else {
          toast.error("מחיקת הלקוח נכשלה, הלקוח מעורב באירוע");
        }
  
        return res.json();
      })
      .then((result) => {
        console.log("Delete customer result = ", result);
        if (result.ok) {
          refreshData();
        }
      })
      .catch((error) => {
        console.log("Err delete = ", error);
        toast.error("מחיקת הלקוח נכשלה, הלקוח מעורב באירוע");
      });
  }

  function editCustomer(customer, refreshData) {
    fetch(urlPut, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })
      .then((res) => res.json())
      .then((result) => {
        toast.success("עריכת לקוח הושלמה");
        refreshData();
      })
      .catch((error) => console.log("Err edit = ", error));
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
            costumerNum: st.clientNumber,
            costumerName: st.clientName,
            costumerAddress: st.clientAddress,
            costumerEmail: st.clientEmail,
            costumerRepresentitveName: st.clientFirstName,
            costumerRepresentitveSurName: st.clientLastName,
            costumerRepresentitvePhone: st.clientPhoneNum,
            costumerRepresentitveEmail: st.representiveEmail,
          };
        });
        setDataInfo(updatedDatainfo);
      })
      .catch((error) => {
        console.log("Err post = ", error);
      });
  }, [dataUpdated]);

  const columns = [
    {
      name: "מספר ח.פ",
      selector: "costumerNum",
      sortable: true,
      center: true,
      width: "10%",
    },
    {
      name: "שם חברה",
      selector: "costumerName",
      sortable: true,
      right: true,
      width: "14%",
    },
    {
      name: "כתובת חברה",
      selector: "costumerAddress",
      sortable: true,
      right: true,
      width: "15%",
    },
    {
      name: "כתובת מייל",
      selector: "costumerEmail",
      sortable: true,
      right: true,
      width: "18%",
    },
    {
      name: "שם איש קשר",
      selector: "costumerRepresentitveName",
      right: true,
      width: "9%",
      cell: (row) => (
        <div>
          <div>
            {row.costumerRepresentitveName} {row.costumerRepresentitveSurName}{" "}
          </div>
        </div>
      ),
    },
    {
      name: "טלפון איש קשר",
      selector: "costumerRepresentitvePhone",
      right: true,
      width: "9%",
      cell: (row) => <div>{row.costumerRepresentitvePhone}</div>,
    },
    {
      name: "מייל איש קשר",
      selector: "costumerRepresentitveEmail",
      right: true,
      width: "20%",
      cell: (row) => <div>{row.costumerRepresentitveEmail}</div>,
    },
    {
      name: "",
      selector: "action",
      center: true,
      width: "4%",
      cell: (row) => (
        <div>
          <Menu className="menuListRow">
            <MenuHandler>
              <MoreVertIcon />
            </MenuHandler>
            <MenuList>
              <MenuItem>
                <EditIcon
                  onClick={() => {
                    setCurrentCustomer(row);
                    setEditPopupVisible(true);}}/>
              </MenuItem>
              <MenuItem>
                <DeleteIcon
                  onClick={() => {
                    setCustomerId(row.costumerNum);
                    setShowDeleteConfirm(true);}}/>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      ),
    },
  ];
  const reversedColumns = [...columns].reverse();

  const filteredData = filterCustomersData
    ? dataInfo.filter((item) =>
        item.costumerName
          .toLowerCase()
          .includes(filterCustomersData.toLowerCase())
      )
    : dataInfo;

  return (
    <div id="mainBodyCustomers">
      <ToastContainer/>
      <div id="headerCustomers">
        <h1>לקוחות</h1>
      </div>
      <div id="innerMainCustomers">
        <NewCustomers
          trigger={addNewCustomers}
          setTrigger={setAddNewCustomers}
          addCustomers={(item) => addCustomers(item, refreshData)}/>
        <div id="inner1MainCustomers">
          <div id="innerRightCusotmer">
            <div className="headerInnerRightCusotmer">
              <div className="searchBox">
                <input
                  type={"text"}
                  value={filterCustomersData}
                  onChange={(e) => setFilterCustomersData(e.target.value)}
                  required="required"/>
                <span>שם לקוח</span>
              </div>
              <div onClick={() => setAddNewCustomers(true)} className="addBOX">
                <AddOutlinedIcon className="icon"/>
              </div>
            </div>
            <div className="mainInnerRightCusotmer">
              <DataTable
                columns={reversedColumns}
                data={filteredData}
                fixedHeader
                striped={true}
                noDataComponent={<NoDataComponentCustomer/>}/>
            </div>
          </div>

          <DeletePopup
            show={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onDelete={() => {
              deleteCustomer(customerId);
              setShowDeleteConfirm(false);}}/>

          <EditCustomerPopUp
            trigger={editPopupVisible}
            setTrigger={setEditPopupVisible}
            updateCustomerItem={(item) => editCustomer(item, refreshData)}
            customer={currentCustomer}/>
        </div>
      </div>
    </div>
  );
};

export default Customers;
