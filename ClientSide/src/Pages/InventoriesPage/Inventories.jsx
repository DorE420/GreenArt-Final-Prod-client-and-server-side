import React, { useState, useEffect, useCallback } from "react";
import "./InventoriesCss.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "react-data-table-component";
import InventoriePopUp from "./InventoryPopUp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UpdateInventoryPopUp from "./UpdateInventoryPopUp";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Catalog from "../CatalogPage/Catalog";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const url =
  "https://proj.ruppin.ac.il/cgroup96/prod/api/inventoryItems/get?timestamp=" +
  Date.now();

const urlpost =
  "https://proj.ruppin.ac.il/cgroup96/prod/api/inventoryItems/post";
const urldelete =
  "https://proj.ruppin.ac.il/cgroup96/prod/api/inventoryItems/delete";
const username = "cgroup96";
const password = "your_password";

const headers = new Headers();
headers.append("Authorization", "Basic " + btoa(username + ":" + password));

function Inventories() {
  const [datainfo, setDatainfo] = useState([]);
  const [buttonPopUp, setButtonPopUp] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [showEditPopup, setShowEditPopup] = useState(false);
  const refreshData = useCallback(
    () => setDataUpdated(!dataUpdated),
    [dataUpdated]
  );
  const [filterInventoriesData, setFilterInventoriesData] = useState("");
  const [changeCatalog, setChangeCatalog] = useState(true);

  function addInventoryItem(item, refreshData) {
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
        refreshData();
      })
      .catch((error) => {
        console.log("err post=", error);
      });
  }

  function deleteInventoryItem(itemId) {
    fetch(urldelete, {
      method: "DELETE",
      headers: {
        ...headers, 
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({ itemSerialNum: itemId }),
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

  function updateInventoryItem(itemId, updatedItem) {
    const urlUpdate = `https://proj.ruppin.ac.il/cgroup96/prod/api/inventoryItems/put`;

    fetch(urlUpdate, {
      method: "PUT",
      headers: {
        ...headers, 
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({ ...updatedItem, itemSerialNum: itemId }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        refreshData();
      })
      .catch((error) => {
        console.log("err update=", error);
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
            key: st.itemSerialNum,
            setting: <button>עריכה</button>,
            itemSerialNum: st.itemSerialNum,
            itemName: st.itemName,
            itemAmount: st.itemAmount,
            itemDescription: st.itemDescription,
            id: st.employee_id,
            itemPicture: st.itemPicture,
            price: st.price,
           buyingPrice: st.buyingPrice,
          };
        });
        setDatainfo(updatedDatainfo);
      })
      .catch((error) => {
        console.log("err post=", error);
      });
  }, [dataUpdated]);

  const columns = [
    {
      name: "מסד",
      selector: "itemSerialNum",
      sortable: true,
      right: true,
      width: "6%",
      cell: (row) => {
        return <div className="idInventories">{row.itemSerialNum}</div>;
      },
    },
    {
      name: "תמונת פריט",
      selector: "itemPicture",
      right: true,
      width: "10%",
      cell: (row) => {
        return (
          <div className="imgBXTbaleItem">
            <img src={row.itemPicture} alt="Image"/>
          </div>
        );
      },
    },
    {
      name: "שם המוצר",
      selector: "itemName",
      sortable: true,
      right: true,
      width: "15%",
    },
    {
      name: "תיאור פריט",
      selector: "itemDescription",
      sortable: true,
      right: true,
      width: "20%",
    },
    {
      name: "כמות",
      selector: "itemAmount",
      sortable: true,
      right: true,
      width: "10%",
    },
    {
      name: "מחיר",
      selector: "price",
      sortable: true,
      right: true,
      width: "10%",
      cell: (row) => `₪ ${row.price}`,
    },
    {
      name: "מחיר קניה",
      selector: "buyingPrice",
      sortable: true,
      right: true,
      width: "10%",
      cell: (row) => `₪ ${row.buyingPrice}`,
    },
    {
      name: "עדכון",
      selector: "setting",
      right: true,
      width: "8%",
      cell: (row) => (
        <EditIcon
          onClick={() => {
            setShowEditPopup(true);
            setCurrentItem(row);
          }}
        >
          עדכון פריט
        </EditIcon>
      ),
    },
    {
      name: "מחיקה",
      selector: "delete",
      right: true,
      width: "7%",
      cell: (row) => (
        <DeleteIcon
          key="deleteIcon"
          onClick={() => deleteInventoryItem(row.itemSerialNum)}
        >
          מחיקת פריט
        </DeleteIcon>
      ),
    },
  ];
  const reversedColumns = [...columns].reverse();

  const filteredData = filterInventoriesData
    ? datainfo.filter((item) =>
        item.itemName
          .toLowerCase()
          .includes(filterInventoriesData.toLowerCase())
      )
    : datainfo;



  return (
    <div id="mainBodyInventories">
      {changeCatalog ? (
        <>
          <div id="headerInventories">
            <h1>מלאי</h1>
            <div className="buttomHeader"
                 onClick={() => setChangeCatalog(!changeCatalog)}>
              <span>קטלוג</span>
              <KeyboardArrowLeftIcon className="icon"/>
            </div>
          </div>

          <div id="innerMainInventories">
            <div id="innerMainInventories1">
              <div id="headerInnerMainInventories">
                <div className="searchBox">
                  <input
                    type={"text"}
                    value={filterInventoriesData}
                    onChange={(e) => setFilterInventoriesData(e.target.value)}
                    required="required"/>
                  <span>שם פריט</span>
                </div>

                <div className="addBOX"
                     onClick={() => {setButtonPopUp(true);}}>
                  <AddOutlinedIcon className="icon"/>
                </div>
              </div>
              <InventoriePopUp
                trigger={buttonPopUp}
                setTrigger={setButtonPopUp}
                addInventoryItem={(item) => addInventoryItem(item, refreshData)}/>
              <UpdateInventoryPopUp
                trigger={showEditPopup}
                setTrigger={setShowEditPopup}
                onUpdateInventoryItem={updateInventoryItem}
                currentItem={currentItem}/>
              <div id="dataTableInventories">
              <DataTable
                columns={reversedColumns}
                data={filteredData}
                fixedHeader
                striped={true}/>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div id="headerInventories">
            <h1>קטלוג מוצרים</h1>
            <div
              className="buttomHeader"
              onClick={() => setChangeCatalog(!changeCatalog)}>
              <KeyboardArrowRightIcon className="icon"/>
              <span>מלאי</span>
            </div>
          </div>

          <div id="innerMainInventories">
            <div id="innerMainInventories1">
              <div id="innerMainInventories1BodyCatalog">
                <Catalog/>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Inventories;
