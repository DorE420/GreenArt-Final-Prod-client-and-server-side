import React, { useState, useEffect, useRef } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DataTable from "react-data-table-component";
import "./MainPageCss.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import { Stepper, Step, StepLabel } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import 'moment/locale/he';
import emailjs from "@emailjs/browser";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const urlGetCustomers ="https://proj.ruppin.ac.il/cgroup96/prod/api/customers/get";
const username = "cgroup96";
const password = "your_password";
const headers = new Headers();
headers.append("Authorization", "Basic" + btoa(username + ":" + password));

const CustomNoDataComponent = () => (
  <div className="no-data-message">
      לא נמצאו לקוחות מתאימים
  </div>
);

const NewCalendarEvent = ({trigger,setTrigger,addEvent}) => {

  const [dataInfoEvent,setDataInfoEvent] = useState([]);
  /*Step 1 - Event Info */
  const [eventName, setEventName] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [eventStartDate, setEventStartDate] = useState(null);
  const [eventEndDate, setEventEndDate] = useState(null);
  const [eventNotes, setEventNotes] = useState("");
  /*Step 2 - Event Costumer */
  const [dataInfoCustomers, setDataInfoCustomers] = useState([]);
  const [searchTextCustomer, setSearchTextCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  /*Step 3 - Event Inventories */
  const [dataInfoInventories, setDataInfoInventories] = useState([]);
  const [itemListEvent, setItemListEvent] = useState([]);
  const [itemListEventTemp, setItemListEventTemp] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);

  const handleRowClick = (row) => {
    const isRowSelected = visibleRows.some((item) => item.itemSerialNum === row.itemSerialNum)
    if(isRowSelected){
      const updatedVisibleRows = visibleRows.filter((item) => item.itemSerialNum !== row.itemSerialNum);
      setVisibleRows(updatedVisibleRows);
    } else {
      setVisibleRows((prevSelectedRows) => [...prevSelectedRows, row]);
    }
  };
  const conditionalRowStyles = [
    {
      when: (row) => row === selectedRow,
      style: {
        backgroundColor: '#17b1692f',
      },
    },
  ];

  useEffect(() => {
    fetch(urlGetCustomers, {
      method: "GET",
      headers: headers,
    })
      .then((res) => {
        console.log("res = ", res);
        console.log("res.status", res.status);
        console.log("res.ok", res.ok);
        return res.json();
      })
      .then((result) => {
        const updatedDatainfo = result.map((st) => {
          return {
            costumerNum: st.clientNumber,
            costumerName: st.clientName,
            costumerRepresentitveName: st.clientFirstName,
            costumerRepresentitveSurName: st.clientLastName,
            costumerRepresentitvePhone: st.clientPhoneNum,
            costumerRepresentitveEmail: st.representiveEmail,
          };
        });
        setDataInfoCustomers(updatedDatainfo);
      })
      .catch((error) => {
        console.log("Err post = ", error);
      });
  }, []);
  useEffect(() => {
    fetch("https://proj.ruppin.ac.il/cgroup96/prod/api/inventoryItems/get", {
      method: "GET",
      headers: headers,
    })
      .then((res) => {
        console.log("res=", res);
        console.log("res.status", res.status);
        console.log("res.ok", res.ok);
        return res.json();
      })
      .then((result) => {
        const updatedDatainfo = result.map((st) => {
          return {
            itemSerialNum: st.itemSerialNum,
            itemName: st.itemName,
            itemAmount: st.itemAmount,
            itemPrice: st.price,
          };
        });
        setDataInfoInventories(updatedDatainfo);
      })
      .catch((error) => {
        console.log("err post = ", error);
      });
  }, []);
  useEffect(() => {
    fetch("https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/get", {
      method: "GET",
      headers: headers,
    })
    .then((res) => {
      console.log("res=", res);
      console.log("res.status", res.status);
      console.log("res.ok", res.ok);
      return res.json();
    })
    .then((result) => {
      const updateDataInfo = result.map((st) => {
        return{
          eventID : st.eventSerialNum,
        };
      });
      setDataInfoEvent(updateDataInfo);
    })
    .catch((error) => {
      console.log("err post = " + error);
    });
  }, []);

  /*Creating New Serial ID For each New Event */
  const generateNewEventSerialNum = () => {
    const lastEvent = dataInfoEvent[dataInfoEvent.length - 1];
    const lastEventSerialNum = lastEvent ? lastEvent.eventID : 0;
    const newEventSerialNum = lastEventSerialNum + 1;
    return (newEventSerialNum);
  };
  /*Render Head Costumer Name with Serach option*/
  const CustomHeaderCustomer = () => {
    return (
      <div className="customSearchCustomer">
          <img src="data:image/png;base64,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"/>
          <input type="text"
                 placeholder={"שם לקוח"}
                 value={searchTextCustomer}
                 onChange={(e) => handleSearchCustomer(e.target.value)}/>
      </div>
    )
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState([]);
  const [step2Data, setStep2Data] = useState("");
  const [step3Data, setStep3Data] = useState([]);

  /*Event info - For Step 1*/
  const eventNameInput = (e) => {
    setEventName(e.target.value);
  };
  const eventAddressInput = (e) => {
    setEventAddress(e.target.value);
  };
  const handleStartDateChange = (momentDate) => {
    const yesterday = moment().subtract(1, 'day');
    if(moment.min(yesterday,momentDate) === yesterday){
      setEventStartDate(momentDate);
    }
    else{
      toast.error("לא ניתן להתחיל אירוע בזמן עבר");
    };
  };
  const valid = (dateSelection) => {
    return moment(dateSelection).subtract(-1, 'day') >= moment();
  };
  const handleEndDateChange = (momentDate) => {
    const startTime = moment().subtract(1, 'minute');
    if(moment.min(startTime,momentDate) === startTime){
      setEventEndDate(momentDate);
    }
    else{
      toast.error("תאריך סיום חיב להיות גדול מתאריך תחילת האירוע")
    };
  };
  const validEnd = (dateSelection) => {
    return moment(eventStartDate).add(-1, 'minute') <= moment(dateSelection);
  };
  const eventNotesInput = (e) => {
    setEventNotes(e.target.value);
  };
  /*get the Amount and set the input value */
  const getItemAmount = (itemserialNUM) => {
    const item = itemListEvent.find((itemTemp) => itemTemp.itemSerialNum === itemserialNUM);
    return item ? item.itemAmount : "";
  };
  /*Data for Step2 & Step 3 */
  const columnsCustomers = [
    {
      name: "",
      selector: (row) => row.costumerNum,
      width: "0%",
    },
    {
      name:(<CustomHeaderCustomer/>),
      selector: (row) => row.costumerName,
      width: "40%",
    },
    {
      name: "פרטי איש קשר",
      selector: (row) => row.costumerRepresentitvePhone,
      width: "50%",
      cell: (row) => (
        <div className="costumerInfo">
          <div>
            {row.costumerRepresentitveName} {row.costumerRepresentitveSurName}
          </div>
          <div>{row.costumerRepresentitvePhone}</div>
          <div>{row.costumerRepresentitveEmail}</div>
        </div>
      ),
    }
  ];
  const columnsInventories = [
    {
      name: "",
      selector: (row) => row.itemSerialNum,
      sortable: true,
      width: "10%",
      rigth: true,
    },
    {
      name: "שם המוצר",
      selector: (row) => row.itemName,
      sortable: true,
      width: "40%",
    },
    {
      name: "מלאי",
      selector: (row) => row.itemAmount,
      sortable: true,
      width: "15%",
      center: true,
      footer: "lin",
    },
    {
      name: "מחיר",
      selector: (row) => row.itemPrice,
      sortable: true,
      width: "15%",
      center: true,
    },
    {
      name: "כמות",
      selector: (row) => row.selectAmount,
      center: true,
      width: "20%",
      cell: (row) => (
        <>
        {visibleRows.some((item) => item.itemSerialNum === row.itemSerialNum)&& 
        <input type="text"
               value={getItemAmount(row.itemSerialNum)}
               pattern="[0-9]*"
               className="textInputAmount"
               onChange={(e) => {
                const input = e.target.value;
                const regex = /^[0-9]*$/;
                if(regex.test(input)){
                  amountInventoryChange(row.itemName, row.itemSerialNum, e.target.value);
                }
                else{toast.error("אנא הזן מספר בלבד")}}}/>}
      </>),
    },
  ];


  /*Get the number of item Selected to the event*/
  const numOfItem = () => {
    const visibleRowCount = (visibleRows.length);
    return visibleRowCount;
  };
  /*Get the Sum of all the amount items for the event*/
  const sumItemAmount = () => {
    const totalAmount = itemListEvent.reduce((accumulator, currentItem) => {
      const itemAmount = Number(currentItem.itemAmount);
      return accumulator + itemAmount;
    }, 0);
    return totalAmount;
  };
  /*Get the total price for the items event*/
  const eventTotalPrice = () => {
    let totalPrice = 0;
    itemListEvent.forEach((itemEvent) => {
      const itemNum = itemEvent.itemSerialNum;
      const itemAmount = itemEvent.itemAmount;
      const inventoryItem = dataInfoInventories.find((inventory) => inventory.itemSerialNum === itemNum);
      if(inventoryItem){
        const price = inventoryItem.itemPrice;
        totalPrice += (itemAmount * price);
      }
    });
    const formattedPrice = totalPrice.toLocaleString('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, 
    });
    return formattedPrice;
  };

  const handleSearchCustomer = (eValue) => {
    setSearchTextCustomer(eValue);
  };
  const filltereData = searchTextCustomer ? dataInfoCustomers.filter((customer) =>
  customer.costumerName.toLowerCase().includes(searchTextCustomer.toLowerCase())) : dataInfoCustomers ;
  
  /*change bgColor for the low data rows*/
  const changeBGlowItem = (itemNumTemp) => {

    const testAmount = itemListEvent.filter((item) => item.itemSerialNum === itemNumTemp);
    const originalAmount = dataInfoInventories.filter((item) => item.itemSerialNum === itemNumTemp);
  
    const biggerNum = Math.max(parseInt((testAmount.itemAmount),10),parseInt((originalAmount.itemAmount),10));
    if(biggerNum === testAmount){
      return true;
    }
    else{
      return false;
    }
  };

  /*Add every selcted Item to the Array */
  const amountInventoryChange = (name, num, amount) => {

    /*check Amount of each Item from data to value */
    const checkItem = dataInfoInventories.find((item) => item.itemSerialNum === num);
    const checkAmount = (checkItem && checkItem.itemAmount <= amount);
    if (checkAmount){
      toast.error(`${name} - מוצר אזל מהמלאי`);
    }

    if (amount) {
      const existingItemIndex = itemListEvent.find(
        (item) => item.itemSerialNum === num
      );
      if (existingItemIndex) {
        const updatedItems = itemListEvent.map((item) =>
          item.itemSerialNum === num ? { ...item, itemAmount: amount } : item
        );
        setItemListEvent(updatedItems);
      } else {
        const newItem = {itemName: name, itemSerialNum: num, itemAmount: amount};
        setItemListEvent([...itemListEvent, newItem]);
      }
    }
  };
  const handleStep1Next = () => {

    if (eventName === ""){
      toast.error("חובה להזין שם אירוע")
    }
    else if (eventStartDate === null){
      toast.error("חובה להזין תאריך ושעת תחילת אירוע")
    }
    else if (eventEndDate === null){
      toast.error("חובה להזין תאריך ושעת סיום אירוע")
    }
    else{
      const step1Data = {
        eventName,
        eventAddress,
        eventStartDate: eventStartDate.format('YYYY-MM-DDTHH:mm:ss'),
        eventEndDate: eventEndDate.format('YYYY-MM-DDTHH:mm:ss'),
        eventNotes,
      };
      setStep1Data(step1Data);
      setCurrentStep((prevStep) => prevStep + 1);
      toast.info("אנא בחר לקוח עבור האירוע");
    }
  };
  const handleStep2Next = () => {
    if(selectedCustomer === null){
      toast.error("חובה לבחור לקוח אירוע")
    }
    else{
      const step2Data = {
        selectedCustomer,
      };
      setStep2Data(step2Data);
      setCurrentStep((prevStep) => prevStep + 1);
      toast.info("אנא בחר פריט עבור האירוע, ולאחר מכן הזן כמות")
    }
  };
  const handleStep3Next = () => {   
    if(itemListEvent === null){
      toast.error("חובה לבחור פריט עבור האירוע")
    }
    else{
      const tempItems = (itemListEvent.map((item) => ({
        itemName: item.itemName,
        itemSerialNum: item.itemSerialNum,
        itemAmount: item.itemAmount,})
      ));
      setItemListEventTemp(tempItems);
      setCurrentStep((prevStep) => prevStep + 1);
      toast.warning("אנא עבור על פרטי ההזמנה, ולאחר מכן לחץ אישור");
    };
  };
  const handleStepSubmit = () => {
    if (eventStartDate && eventEndDate) {
      const formattedStartDate = eventStartDate.format('YYYY-MM-DDTHH:mm:ss');
      const formattedEndDate = eventEndDate.format('YYYY-MM-DDTHH:mm:ss');
    };
    const formEventData = {
      eventSerialNum: generateNewEventSerialNum(),
      event_name: step1Data.eventName,
      event_address: step1Data.eventAddress,
      event_startdate: step1Data.eventStartDate,
      event_enddate: step1Data.eventEndDate,
      event_notes: step1Data.eventNotes,
      clientNumber: selectedCustomer,
      ItemAllocations: itemListEventTemp,
    };

    addEvent(formEventData);
    resetTextHandler();
    setCurrentStep(1);
    setTrigger(false);
    toast.success("! אירוע נוסף בהצלחה")
  };
  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };
  const closeForm = () => {
    resetTextHandler();
    setCurrentStep(1);
    setVisibleRows(null);
    setTrigger(false);
  };


  /*Send Email to Customer - Event info */
  const serviceNum = "service_kxsf35x";
  const templateNum = "template_cnpnacl";
  const publicKey = "cePsVHpGu1k1SaD5J";

  const formCustomerEmail = useRef();
  const sendCustomerEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(serviceNum,
                     templateNum,
                     formCustomerEmail.current,
                     publicKey)
    .then((result) => {
      console.log(result.text);
      toast.success("!המייל נשלח בהצלחה");
    }, (error) => {
      console.log("err" + error);
      toast.error("לא ניתן לשלוח את המייל, אנא בדוק את פרטי הלקוח");
    });
  };

  /*accordion for confirmation event*/
  const stepProggras = ["אירוע","לקוח","מלאי","אישור"];
  const accordionData = [
    {
      header: (
        <div className="accordionHedaerInfo">
          <img src="data:image/png;base64,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"/>
          <label>פרטי האירוע</label>
        </div>),
      content: (
        <div className="accordionItemInfo">
            <div>
              {step1Data.eventName}
              <label> : שם</label>
            </div>
            <div>
              {step1Data.eventAddress}
              <label> : כתובת</label>
            </div>
            <div>
              {moment(step1Data.eventStartDate).format('llll')}
              <label> : תאריך התחלה</label>
            </div>
            <div>
              {moment(step1Data.eventEndDate).format('llll')}
              <label> : תאריך סיום</label>
            </div>
            <div>
              {step1Data.eventNotes}
              <label> : הערות</label>
            </div>
        </div>
      ),
    },
    {
      header: (
        <div className="accordionHedaerInfo">
          <img src="data:image/png;base64,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"/>
          <label>פרטי לקוח</label>
        </div>
      ),
      content: (
        <div className="accordionItemInfo">
          <div>
            {dataInfoCustomers.map((customer) => {
              if(customer.costumerNum === selectedCustomer){
              return(
                <div key={customer.costumerNum}>
                  <div>
                    <span>{customer.costumerNum}</span>
                    <label> : .מספר ח.פ</label>
                  </div>
                  <div>
                    <span>{customer.costumerName}</span>
                    <label> : שם</label>
                  </div>
                  <div>
                    <span>{customer.costumerRepresentitveName}</span>
                    <span>{customer.costumerRepresentitveSurName}</span>
                    <label> : שם נציג</label>
                  </div>
                  <div>
                    <span>{customer.costumerRepresentitvePhone}</span>
                    <label> : טלפון נציג</label>
                  </div>
                  <div>
                    <span>{customer.costumerRepresentitveEmail}</span>
                    <label> :  מייל נציג</label>
                  </div>
              </div>);}
            })}
          </div>
        </div>),
    },
    {
      header: (
        <div className="accordionHedaerInfo">
          <img src="data:image/png;base64,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"/>
          <label>מלאי אירוע</label>
        </div>
      ),
      content: (
        <div className="accordionItemInfoLast">
        {itemListEvent.map((item) => (
          <div key={item.itemSerialNum} className="accordionItemInfoLast-div">
            <div>
              <span>{item.itemSerialNum}</span>
              <label> : מס"ד</label>
            </div>
            <div>
              <span>{item.itemName} </span>
              <label> : שם פריט</label>
            </div>
            <div>
              <span>{item.itemAmount} </span>
              <label> : כמות</label>
            </div>
          </div>
        ))}
        </div>
      ),
    },
  ];

  /*Tippy for save btn*/
  useEffect(() => {
    tippy("#imgSaveEvent", {
      content: "שמירת אירוע",
    });
  },[]);
  /*Reset all the event from*/
  const resetTextHandler = () => {
    setEventName("");
    setEventAddress("");
    setEventStartDate(moment().format('llll'));
    setEventEndDate(moment().format('llll'));
    setEventNotes("");
    setSelectedCustomer("");
    setSearchTextCustomer("");
    setItemListEvent([]);
    setItemListEventTemp([]);
  };

  



  return trigger ? (
    <div className="popUpEvents">
      <div className="innerPopUpEvents">

        <div className="innerEvents1">
          <img onClick={closeForm}
               src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABC0lEQVR4nO3WSwrCMBAA0FxMQfAELUmuoKDYdtvcoRdrXKRbP5u6sUiXLpURAhohzWdKQRzoqpN5TEinIeQfhBDF+aZJkkXsZkANqOWWTOn6Wpa3S1Gc94wtQ1GZJPM2z4+dEH3DWOaE3qvqAU8orlFdx4orxraQoJPf8JPPtkMurDHrdEL0YHwtqNN01mbZwVzg07nZqXONOgIPRmPwaDQER0N9cHR06ITq0257Fz2Aakvn6J2G4qioKz4KCmE7SKPBcgAdBZeOKCreTPE5SYfhgPFj+QifiYSGy4AxGI3LiNkbjEuEgR+Eq6muPhCK0hXGZc/s/HXZ43xnXaTx2EGgcSd00gs9+fV4AvOoyXcAGhUDAAAAAElFTkSuQmCC"/>
        </div>

        <div className="innerEvents2">
          <Stepper activeStep={currentStep-1} alternativeLabel>
            {stepProggras.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>))}
          </Stepper>
        </div>

        <div className="innerEvents3">
          {currentStep === 1 && (
            <>
              <div className="Step1Main">

                <div className="Step1MainInner">

                  <div className="divInfoInput">
                    <img src="data:image/png;base64,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"/>
                    <span>שם אירוע</span>
                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) => eventNameInput(e)}/>
                  </div>
                  <div className="timeRange">
                      <div className="timeRange_rdt">
                        <Datetime
                          onChange={(e) => handleStartDateChange(e)} 
                          value={eventStartDate}
                          isValidDate={valid}
                          locale="he"/>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFAElEQVR4nO2dy4sVRxTGv3kk4AgxBl0kEXFEIyiDQh7MIhh14cbHWsdnVMSJgyNuErJLiM/8ARGzSIILwaXPlQomo2JU0ISoIIokIUSNkYx3dEi0woFKGA9VdW/fabvrnK4f1Gaonj5ffV2Prj59G0gkEvliUkGWNnjuJEOQDDGCL4TUQ1BxQxLPkgyJjGRIZCRDqm7IX+yErxdxUiFMYm1DbfXcOcdOejiZ8r8ZR1jbnEEBbI5gKWmElE1FGPIigIsRiDWRl/MAXkBBvArgQgSiTaTle9tGhULu9wIYADAYQSOYksugbYtNRfaMLPCApWOk6xEvQJse8QK06REvQJse8QK06REvQJse8QK06REvQJse8QK06REvQJueRgUMRbDtYWyp5aAnWhoV8GsERhhbfs5BT7Q0KuCHCIwwtlzOQU+0PGECWj31DkZghLHlgCfGNlaPtInjTybiZU+9bREYYWzZ4onxFVbvDwjkJhMxy1Pv7QiMMLbM8cTYxerdgECOMhErA3WvRWDGlUB8q1ldSmYQx3Ym4ptA3Y8iMKQ/EN9+VvczCGQeE3EfwBhP3XEA7pZoxi8AOjyx0d8fsPpzIRBamdxhQj4I1O8v0ZB1GdKefrfaRLKbifnN9gYX7QC+K8GM4wBaPDG9ZHvPyPo7IBhKMx1mgvYG6k8GcK/gO/OJgXi+ZPUfA3gNwtmdcYjoLiitiIyfGYhjg+OYnVDAWAC3mLC/AfQEjlngSOrOs9A88Gbg/LRE/4cdczMw8YvjHQCPHNsPnwQmyNl2SMnbjJ8ATPWck2L51LHtQ7G/BWWsdgil8i2AaZ5jJtjs+rzM+Mr2WBfTbCz8GIp5FZTyvscUeg6x1bMBSSug5QBuj8KIHwEs9MTUas9dcxxHw9ZaKGex3ZwzGXvLGAAfZ5xb7tr7CFpSZ+kVxsa4CBVhCoDTnoaoBXoL7H0M3URer/NcY0NgZyDUK4yNjWKsFK22YWtN9Jb/hrJ3Aeyxm5NX7bKUFhAhQr2iZmPyXQyVoBPACU8DDQH4MKetCjJwY+Aeh3YJ3sjhPCqo11hnAMwYxf+nZe6pOqZXulc003C1JoaTesPiqcA9SYL1Ft9qit5Smo760KR8MmBu6hUN0pIMiYepaciSMakPjHJS7wwMX2lSb6Kx2hC/6eIpq4E6C7oAKrN1kgdp62QES20GSjPbJXkT2kahGJdAOes92+9lDhUtgaHzaZ1MGdGssQLL7hVo4gEVPVxTRbfN2OBX367IJtAW21N5L37cwC6yGMY6nvZRksMyxEuPjXFkzLcCj39FsccxDKwVMt8ZVqhHQ1ui3BeQwz4W+7D0RLnPM6SSxogrlZQS/0TS7shopx88k8ZmpuFOZAuRhpnvyOLwJR3ETIfj9bz3oOCFna8hl/0aXtg5xkSsgFxWaXilrdGXPiXQpeGlT/4amKTVFWe8Y+NR7Q8HSKDNsb8lDn6XKx0jXY94Adr0iBegTY94Adr0iBegTY94Adr0iBegTY94Adr0iBegTY94Adr0iBegTY94Adr0iBcgTQ99Pq/PfmjyoSPgqpWHAM7aZ/DUNoVCqTCXImgEE2m5WORn88j9ZAbqmnKhqM/n9UVwBRohpbeMjxMfkp7Nl2OW5uEyPk7M36NIn+8u+fPdvFsmSm6fZEiYZEhkJEMio3RDUkGwDZIhiOsiSYagfBOSIaiwIYkEKsO/kv61yBF54K4AAAAASUVORK5CYII="/>
                        <span>תחילת אירוע</span>
                      </div>
                      <div className="timeRange_rdt">
                        <Datetime
                          onChange={(e) => handleEndDateChange(e)} 
                          value={eventEndDate}
                          isValidDate={validEnd}
                          locale="he"/>
                        <img className="imgTimeLeft"
                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE5ElEQVR4nO2dS4gdRRSGv5nRSKKoxJVRxBmiIhLBRWIUMQq68gG6kpjEoCLRCHEnmm18L11EdONj48KVUXcaSBxfk7gQ3MkEHyAmOEpiYmI0JYWljIfuO/2uc+rWB2d5b9d//q6u7qpT3ZDJZLrF5aBODnonG0I2xBk+EXIPYcwNyfyfbIgysiHKyIaMuyFHxQEvGeKgRrhU5Mbnqnc+Ewfdk035z4z3RG4+YQC2K7iVdEZi2xCGLAMOKhDrlMcXwNkMxMXAAQWindKYCzkaFO/+o8AscExBElzkOBZysW3InlEH2WDrOOt6zAtITY95AanpMS8gNT3mBaSmx7yA1PSYF5CaHvMCUtNjXkBqeswLSE2PeQGp6TEvIDU95gWkpucvIWASu0wJLV6bOX4RIi7ELiuFlp8xyLwQcQ12WSO0fINB3hciNmGXLUKLL2YwxzNCxBvY5S2hZRcGuUWIWACWY48VwK9Cy80YvTM5LIQ8hj22Cw0/BW0meUGI+RG4ADucD/wgNDyLYXyZ6Skh6BXs8Jpo+0lgFcaRvcTHg+jn4YJ2P0cCnAscEsJOAxvRyybgT9Hm+TDAJ8F1wAkh8AzwvLIBcgJ4smDa53dgLYmxpUCoj/3A6tiN45827C9on2/zZhJlY7hcSdEnwpk5FalXPFJSDusvW1tJnDvD5JxT0FtWl/SKfycQ72BMuBzYV5KI48ATPU/XT4ZjHC9pw77QxrFi1KXChd1HV/Vw3Blgb8kxY1461TANfDhAgiaWOAE+Bq7s4DhJ0HdvmanQKyyvaPbGzIjE+ev9jpqJmwy/KRsr9oZjZir0lqMlSfS7lK6okEE/KH80wtzcKyoykQ3Rw0y+ZNkY1GdbDurTIy5feVBvkKwp9JtunlgJmh7oBDBFnjpRxN2hAkX75OICcBeJ81DJmojW6fczRitlKvFAEBi7VzRZoPKLa0mxPlRsWF3CPQmsIxF8kcO3QqBfNbwPWyubh4IW87xYcBnY2kMPvLGH8U622/doUiuU293Rf58VzuTPF/33l6Ge6pyOjvGqaPsp64VyL/VUSnob8FXJ7aqP78Kdkzet61JSX/hnEp+MI0KMf+FZG64NT/CuYnwNbOi42PqwshuRytxaUMWxvIW5Owsuf1XC3829DJzX8NgrCrbntTVZxYad1xv+z9XhhZKuZcy32NeRxIadD4SI+xv8x70dv8/xdCj/qcvmFLa0td30+VTJk30Xsbvm2nwSmz6bboueKHl26TrernEXtrJg4nFsXhywawAzFm9E9SfAWLw4QIqvwuMDmlH36buJHlXUFbAe+COCIX6cuqcHPeqoI+Ai4PsIZiweEy7rUI9K6giQmytdhHinQz0qqSrg+pJVRBchbu9Aj1qqCiirfHcRYrYDPWqpImBNjw9/rmHc0EKPaqoI0DB2OBFvttCjmqUETBVMzzsFsVDyBJ+8ITcpSL4riQ3jaMjTChLvSmJnAz3qWUqAXGNwyseR5A2ZU5B4VxJzDfREZ1mYDPQfmvxNQRJd5PA5+DSswfvcDMqqUHITOwlOaRwc8rN53v1sBkuacmCoz+fFWLNwRqNt2VOjjxO/a72ar8MqzT0xPk4sq0Dy57sjf75bdstM5PxkQ0aTDVFGNkQZ0Q3JwcgcZEPQdZJkQ4hvQjaEMTYkk2Fs+BvWfwq868P8JQAAAABJRU5ErkJggg=="/>
                        <span>סיום אירוע</span>
                      </div>
                  </div>
                  <div className="divInfoInput">
                      <img src="data:image/png;base64,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"/>
                      <span>כתובת אירוע</span>
                      <input
                        type="text"
                        value={eventAddress}
                        onChange={eventAddressInput}/>
                  </div>
                  <div className="divInfoInput">
                      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE5UlEQVR4nO2dS6gcRRRAjzzzNGoU/zEPVNAH7jSCuhCVgB/EjeDCRUzURdCVgjs3giAKEV24Et24EM1TBr/5+IsaNYoYf0gUQdSFCwli3kvUKMaWkno4qbnVVT093XN75h6ozXRXT917prqru6t7oBnmgR6wBBRBcZ8tAHPoZb7j7R8I5hchkLDsUxrUfMfbP0AvI5jlsgV99Dre/gGkbh4r+9HHUsfbP0DY6KrLx03X2z9xARUdb//EBVR0vP0TF1Chsf0XAzuAgxUOcLGSCkh7Cam7PZfT7cBaKsj4XXFARceFLJffcqXs6EhARceFuLI1R8godlMmhKzcHMgRkkpo3fp1t980Tbe/cn0TggnRRGFCdFFMmpDFjl+cW2y4/a0LWej45euFhtvfupA5f/MmFYxbZw36mGu4/a0LwTd0S6T7L/plGmW00f6xCDHimBBlmBBlmBBlmBBlmJBJE2KFRnNgQtD1IzMhjF+CCWGChBijxYQow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4QoY41/fckG4KmcCjYNSBkmRBkmRBkmZLRcADwMfAb8DPwEfAjcD6zO2YAJGQ3HAI8BfyfemXV3akMmpD4n+V6QO+H68bKNmZD6Mj4aYhb8PbENmpDhOTHSM34EbgHO9uchm4S3RRyMHVNMyPAydkd+/S8AK4L1zxek3Cdt2IRUZxXwfmKX1BOk3Bms43Z1A5iQapwAvCfk7a8MKauD5e5fGQYwIdVk7BJy5t7Lex7wbULKqmDZH9KXmJA8jgfeFfL1GnBs36ueyqRcEXz+vfRFJiTNccDbQq7eAFYG65ZJCd+R/LT0ZSYkLWOnkKc3BRkpKWG5QapsQsplvCXkaKdfVkZKygexiiZEZqXfJYX5eccfT3JwUn4QtuHOR86NVTIhsozXhdzsqiDDcT1wSHiz6aVllUzIkcwCr0Z2MW7Ymst1flgbyrgsVdGEHCnjFSEnu9uS4TAh/8t4OSLDXbdqRYbDhPCfjJeEXOwBTm5ThgmhVMYpbcuYdiGzwItCDj4dl4xpFjIbkVF1NyUNbX+NDG2vztngNApZ4W8ihbG7mSKnNtQzrvF/vpZk2oTMAM8KcX/eoIxr+/4JL8k0CZkBnhFi/gI4rSEZ4bpJpkXI0cBzQrxfAqc3dMxAWDfJNAiZ8fcewli/zp1NWGM0VTm/ky5kJiLjG+CsFoa2JqSPoyIy9gJnUn83dUlGXRPSx61CQr6r2DPqyHCYkD6ky+h/AjfS3hm4CembjX5ASMiylJto53KICek7GStKintsYCPNX5syIZ5Hg2Tsi0i5ndEeM0JMiGdvkIz1wINCgv4B7kr0jNJ74AlMCHCOkPQzfIIeiUh5YsQ9Y2gho/6D+3GUq4KY7hDub5TtzqQSk7E+8dhaWVnKEbJdQUKLGmW/MO0/vM/xkBD3k0PI2FBDRuGH4UnW+ocRi46WnnDjaSlYZ52XdiXwAPAxcLiijI01ZbgcX5gjZFnKtpJxu+ayKYhlnbDONkFSFRm3lQhMFfe9W4GLmFI2D5E09+DM81V+wUY+ezIEHPKTqO/1PcJdETYa4itBwGE/0trsz+BTM9cNRsflwCf+0WQ3krq54h3BVvkXuqjUOn1LKZ0AAAAASUVORK5CYII="/>
                      <span>הערות</span>
                      <input
                        type="text"
                        value={eventNotes}
                        onChange={eventNotesInput}/>
                  </div>

                </div>
              </div>

              <div className="Step1Bottum">
              <ArrowBackIcon onClick={handleStep1Next} />
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div className="Step2Main">

                  <div className="Step2MainInner">
                    <DataTable
                      className="dataTableCustomers"
                      fixedHeader
                      striped={true}
                      columns={columnsCustomers}
                      data={filltereData}
                      noDataComponent={<CustomNoDataComponent/>}
                      conditionalRowStyles={conditionalRowStyles}
                      selectableRows={false}
                      selectableRowsSingle
                      pointerOnHover
                      onRowClicked={(row) => {
                        if(selectedCustomer === row.costumerNum){
                          setSelectedCustomer("");
                          setSelectedRow(null);
                        }
                        else{
                          setSelectedCustomer(row.costumerNum);
                          setSelectedRow(row);
                        }}}
                      direction="rtl"/>
                  </div>

                <div className="Step2Bottum">
                  <ArrowBackIcon onClick={handleStep2Next} />
                  <ArrowForwardIcon onClick={handlePrevious} />
                </div>

              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <div className="Step3Main">

                  <div className="Step3MainInner">
                    <DataTable
                      striped={true}
                      columns={columnsInventories}
                      data={dataInfoInventories}
                      selectableRows={false}
                      pointerOnHover
                      highlightOnHover
                      conditionalRowStyles={[
                        {
                          when: (row) => visibleRows.some((item) => item.itemSerialNum === row.itemSerialNum),
                          style: {backgroundColor: '#17b1692f'},
                        },
                        {
                          when: (row) => ((changeBGlowItem(row.itemSerialNum) &&
                                           visibleRows.some((item) => item.itemSerialNum === row.itemSerialNum))),
                          style: {backgroundColor: '#F08080'},
                        }]}
                      onRowClicked={(row) => handleRowClick(row)}
                      className="dataTableInventories"
                      direction="rtl"
                      fixedHeader/>
                  </div>

                  <div className="Step3MainFooter">
                    <div className="div1Footer">
                      <label> : סוג</label>
                      <span>{numOfItem()}</span>
                    </div>
                    <div className="div2Footer">
                      <label> : כמות</label>
                      <span>{sumItemAmount()}</span>
                    </div>
                    <div className="div3Footer">
                      <label> : מחיר</label>
                      <span>{eventTotalPrice()}</span>
                    </div>
                  </div>

                  <div className="Step2Bottum">
                    <ArrowBackIcon onClick={handleStep3Next} />
                    <ArrowForwardIcon onClick={handlePrevious} />
                </div>
              </div>
            </>
          )}
          {currentStep === 4 && (
            <div className="Step3Main">

                <div className="Step3MainInnerAccordion">

                  <Accordion id="accordionInfo">
                    {accordionData.map(({header, content}, i) => (
                      <AccordionItem header={header} key={i}>
                        {content}
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div className="Step3Bottum">
                  <img id="imgSaveEvent"
                       onClick={handleStepSubmit} 
                       src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACxElEQVR4nO1ZS28TQQxeARKceNyA3wH8ioLS/pgC50ZIoIqmXIFEXENpy0Ncc2jF2GmkqGlOFagNkk3Ko0cClw7yJi1JtZvMbGZnUymWLOWxM/N9Htvr8QTBVKYylbFFa33u07etO4rwARCuAGEDGA8Vw19R+Sy/KcLX8ow8K2OCrKX2vXYDCPKK4SswahtVDC0ZK3N4B77R2rgGDMvA2LEFHqEdmau+V7/qBbzi6hwQHjgAPqiEbZk7NeBlXT7fs7pOWQuyllPwlb3KJcWw6gG87sXHqqzpBLxYQ7KHL/DwX99WdOXC2AQ8uY2O3glcGj9gMwIPQoDgCAlnE4GvHdauKALOkgCIErYlbVsTAIZnPoG+//JhyP+wbAUeD/A6MP72Bb6480rfW5/Tj+Bx3DOdzdbmTXPrE+R9g59Zy4UaS4IgbwReiqywTvEBvlkaAC8q3999jnAnwn2jAlAqxSwsP7OW03fXZ/WLRjF2DDLeMnGfh5MIHrpuNG9AAFcmEjzLewHLIwkogp1JBA/dOGiM3gHGX25yt1nAFpsl4zkUw4/RO9A9Ao6c7MnWYmi9542X6VuejxX+OCEg4PuBDCPhDjyaERjlQpKjTV3BhduAtQsZBHGpGW3V/p1wa3m0CGLDNDqMRCrg2TCN2rzI4lzEpduA7YvMtpSIIpEKeDYsJZIUc3EkXIIH02IuaTl9OiZc+DwMus9CkPaB5piEc/BseaAZpxshLuPMbfhEC1bgQwI/4fKkHOrrSfum0laR1kZW4JWsTZBLBP5kJxgL2RHAp8FZbi2WXTV5P+7uXvTZ3AWCN7Jm4FLCnWBcSjMmFMGRuI3z9nq/SK9SMoN7q2M7cR/UViStub1iwoK3K6aIS76FRI0wwn0Zm8kl32mRIqvK1duK8H4vY23Lya7vmlVOedvhfwTzUlVOxDXrVKYSnH35B1WbEX5n/1fJAAAAAElFTkSuQmCC"/>
                  <ArrowForwardIcon onClick={handlePrevious} />
                </div>

            </div>
          )}
        </div>
      </div>
      <ToastContainer/>
    </div>
  ) : (
    ""
  );
};

export default NewCalendarEvent;