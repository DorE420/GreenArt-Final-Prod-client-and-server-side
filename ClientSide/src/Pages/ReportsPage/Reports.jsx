import React, { useEffect, useState } from "react";
import "./ReportsCss.css";
import { useNavigate } from 'react-router-dom';
import Weather from './Weather';
import { Link } from "react-router-dom";
import EventsBarChart from './BarChart';
import InventoryAlert from './InventoryAlert';
import DataTable from "react-data-table-component";
import { Box, Tabs, Tab, AppBar} from '@mui/material';
import { TabContext, TabList, TabPanel} from '@mui/lab';
import img1 from "./ReportMainImg/Blue-1-Report.png";
import img2 from "./ReportMainImg/Blue-2-Report.png";
import img3 from "./ReportMainImg/Blue-3-Report.png";

const username = "your_username";
const password = "your_password";
const headers = new Headers();
headers.append("Authorization", "Basic " + btoa(username + ":" + password));

const Reports = () => {
  
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [forecast, setForecast] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [mostProfitablePlants, setMostProfitablePlants] = useState([]); 
  const [leastProfitablePlants, setLeastProfitablePlants] = useState([]);

  /*Event for the week*/
  useEffect(() => {
    fetch('https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/GetWeeksEvents')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("No upcoming event found.");
        }
      })
      .then(data => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError("Error retrieving event data.");
        setIsLoading(false);
      });
  }, []);
  /*Event Monthly - for Grid*/
  useEffect(() => {
    fetch('https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/getMonthlyEventCountsbyYear')
      .then(response => response.json())
      .then(data => setEventsData(data));
  }, []);

  /*gets the Event with Items from now On */
  const [eventFromOn, setEventFromOn] = useState([]);
  const [eventFromOnInvent,setEventFromOnInvent] = useState([]);
  useEffect(() => {
    fetch("https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/get", {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((result) => {
        setEventFromOn(result);
  
        const fetchEventDetailsPromises = result.map((event) => {
          return fetch(
            `https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/GetEventWithItems/${event.eventSerialNum}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .catch((error) => console.error("Failed to fetch event details:", error));
        });
        Promise.all(fetchEventDetailsPromises)
          .then((eventDetailsArray) => {
            setEventFromOnInvent(eventDetailsArray);
          })
          .catch((error) => console.error("Failed to fetch event details:", error));
      })
      .catch((error) => {
        console.log("Err post =", error);
      });
  }, []);
  /*event From now on*/
  const CheckEventOn = () => {
    const currentDate = new Date();
    const futureEvents = eventFromOn.filter(event => {
      const eventStartDate = new Date(event.event_startdate);
      return eventStartDate >= currentDate;
    });
    return futureEvents.length;
  };

  /*Get the inventory for the price*/
  const [inventoryArray1,setInventoryArray1] = useState([]);
  useEffect(() => {
    fetch("https://proj.ruppin.ac.il/cgroup96/prod/api/inventoryItems/get", {
      method: "GET",
      headers: headers,
    })
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      setInventoryArray1(result);
    })
    .catch((error) => {
      console.log("Err post = ", error);
    });
  },[]);

  /*Expected Income from Today - ON*/
  const calculateExpectedIncome = (eventsArray,inventoryArray) => {

    const currentDate = new Date();
    const futureEvents = eventFromOnInvent.filter((event) => new Date(event.event_startdate) > currentDate);

    const expectedIncomePerEvent = futureEvents.map((event) => {
    const items = event.ItemAllocations;
    const eventTotalIncome = items.reduce((totalIncome, item) => {
      const inventoryItem = inventoryArray.find((invItem) => invItem.itemSerialNum === item.itemSerialNum);

      if (inventoryItem) {
        const cleanPrice = inventoryItem.price - inventoryItem.buyingPrice;
        const itemTotalIncome = cleanPrice * item.itemAmount;
        return totalIncome + itemTotalIncome;
      } else {
        console.error(`Item with serial number ${item.itemSerialNum} not found in inventory.`);
        return totalIncome;
      }
    }, 0);
      
    return {
      eventSerialNum: event.eventSerialNum,
      eventName: event.event_name,
      totalIncome: eventTotalIncome,
    };
  });

    return expectedIncomePerEvent;
  };
  const totalIncomeExpected = calculateExpectedIncome(eventFromOnInvent,inventoryArray1);
  const totalExpectedIncome = totalIncomeExpected.reduce(
    (total, event) => total + event.totalIncome,0
  );
  


  /*for the Costumer Info*/
  const [dataInfoCostumer, setDataInfoCostumer] = useState([]);
  useEffect(() => {
    fetch("https://proj.ruppin.ac.il/cgroup96/prod/api/customers/get", {
      method: "GET",
      headers: headers,
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setDataInfoCostumer(result);
      })
      .catch((error) => {
        console.log("Err post = ", error);
      });
  }, []);

  /*Top, Buttom 3 - items Sales */
  useEffect(() => {
    fetch('https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/ThreeMostProfitablePlants')
      .then(response => response.json())
      .then(data => setMostProfitablePlants(data)) 
      .catch(error => console.error('Error:', error));
  }, []);
  useEffect(() => {
    fetch('https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/ThreeMostUnprofitablePlants')
      .then(response => response.json())
      .then(data => setLeastProfitablePlants(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const YOUR_API_KEY='35692c91cefbe51497e2f6acc072b796';

  /*Gets the weather*/
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=022878df34b94fbd849114111232506&q=Tel Aviv&days=3&aqi=no&alerts=no`
        );
        const data = await response.json();
        setForecast(data.forecast.forecastday);
      } catch (error) {
        console.error('Failed to fetch weather data: ', error);
      }
    };
    fetchWeather();
  }, []);
  /*for the List of week Event*/
  const columnsEvents = [
    {
      selector: (row) => row.eventSerialNum,
      width: "100%",
      right: false,
      cell : (row) => {
        return(
        <div className="dataEventPerWeek">
          <div className="infoPerEvent-Header">
            <label> : תאריך אירוע</label>
            <label>{new Date(row.event_enddate).toLocaleDateString()} - {new Date(row.event_startdate).toLocaleDateString()}</label>
          </div>
          <div className="infoPerEvent-Main">
            <label>שם אירוע : {row.event_name}</label>
            <label>כתובת : {row.event_address}</label>
          </div>
        </div>);
      },
    },
  ];

  /*for the TAB box*/
  const [tabValue, setTabValue] = useState('1');
  const changeTabs = (event, newValue) => {
    setTabValue(newValue);
  };
  const formattedPrice = (num) => {
    const newNum = num.toLocaleString('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, 
    });
    return newNum;
  };


  return (
  <div id="mainBodyReports">

      <div id="mainBodyIMG">
        <div className="mainBodyIMGBlurrt">
        
        <div id="headerReports">
          <h1>Green Art - ברוך הבא למערכת</h1>    
        </div>

        <div id="innerMainReports">

        {/*isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>*/}
        {events && (

        <div id="upcomingEventRight">
          <div className="upcomingEventRightHeader">
            <h1>אירועים לשבוע הקרוב</h1>
            <Weather forecast={forecast} />
          </div>
          <div className="upcomingEventRightHeaderBody">
            <DataTable className="dataTABLEmain"
                       columns={columnsEvents}
                       highlightOnHover
                       data={events}
                       striped={true}
                       noTableHead={true}/>
            <Link to="/MainPage">
              <button>עבור לדף אירועים</button>
            </Link>
          </div>
        </div>)}

        <div id="leftDiv">
          <div className="leftDiv1">
            <div className="leftDiv1Inner">
              <div className="leftDiv1Inner-Div">
                <label className="importLabel">{<CheckEventOn/>}</label>
                <label className="innerDivTitle">אירועים עתידיים</label>
              </div>
              <img src={img3} alt="img3" className="leftDiv1Inner-Img"/>
            </div>
            <div className="leftDiv1Inner">
              <div className="leftDiv1Inner-Div">
                <label className="importLabel">{formattedPrice(totalExpectedIncome)}</label>
                <label className="innerDivTitle">הכנסות צפויות</label>
              </div>
              <img src={img2} alt="img2" className="leftDiv1Inner-Img"/>
            </div>
            <div className="leftDiv1Inner">
              <div className="leftDiv1Inner-Div">
                <label className="importLabel">{dataInfoCostumer.length}</label>
                <label className="innerDivTitle">לקוחות קיימים</label>
              </div>
              <img src={img1} alt="img1" className="leftDiv1Inner-Img"/>
            </div>
          </div>
          
          <div className="leftDiv2">
            <TabContext value={tabValue}>
              <div className="tabsHeaders">
              <TabList onChange={changeTabs}>
                <Tab label="אירועים בפריסה חודשית" value="1"/>
                <Tab label="נמכרים ביותר" value="2"/>
                <Tab label="פחות נמכרים" value="3"/>
                <Tab label="מלאי חריג" value="4"/>
              </TabList>
              </div>
              <TabPanel value="1" className="tabPanelTemplate_Step2">
                <EventsBarChart data={eventsData}/>
              </TabPanel>
              <TabPanel value="2" className="tabPanelTemplate_Step2">
              {mostProfitablePlants.map((plant, index) => (
                <div key={index} className="top3Items">
                <div className="top3Items-Top">
                <div className="labelItemsSold">
                  <label>{plant.PlantName}</label>
                </div>
                <div>
                  <label>מספר סידורי - </label>
                  <label className="intLabel">{plant.PlantId}</label>
                </div>
                <div>
                  <label>אירועים עתידיים - </label>
                  <label className="intLabel">{plant.TimesRented}</label>
                </div>
                <div>
                  <label>צפי רווח - </label>
                  <label className="intLabel">{formattedPrice(plant.TotalProfit)}</label>
                </div>
                </div>
                <div className="imgItemSold">
                  <img src={plant.PlantPicture} alt={plant.PlantName}/>
                </div>
                </div>))}
              </TabPanel>
              <TabPanel value="3" className="tabPanelTemplate_Step2">
              {leastProfitablePlants.map((plant, index) => (
                <div key={index} className="top3Items">
                <div className="top3Items-Top">
                <div className="labelItemsSold itemButom">
                  <label>{plant.PlantName}</label>
                </div>
                <div>
                  <label>מספר סידורי - </label>
                  <label className="intLabel">{plant.PlantId}</label>
                </div>
                <div>
                  <label>אירועים עתידיים - </label>
                  <label className="intLabel">{plant.TimesRented}</label>
                </div>
                <div>
                  <label>צפי רווח - </label>
                  <label className="intLabel">{formattedPrice(plant.TotalProfit)}</label>
                </div>
                </div>
                <div className="imgItemSold">
                  <img src={plant.PlantPicture} alt={plant.PlantName}/>
                </div>
            </div>))}
            </TabPanel>
            <TabPanel value="4">
              <div className="itemAlert">
              <InventoryAlert/>
              </div>
            </TabPanel>
            </TabContext>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>); 
};
export default Reports;