import React, { useState, useEffect, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import NewCalendarEvent from "./NewCalendarEvent";
import Popover from "@mui/material/Popover";
import "./MainPageCss.css";
import moment from "moment";
import "moment/locale/he";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

const urlGetEvents =
  "https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/get";
const urlPostEvent =
  "https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/addwithinv";
const urlDeleteEvent =
  "https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/delete";
const urlGetCustomers =
  "https://proj.ruppin.ac.il/cgroup96/prod/api/customers/get";

const username = "your_username";
const password = "your_password";

const headers = new Headers();
headers.append("Authorization", "Basic " + btoa(username + ":" + password));

function addEvent(event, refreshData) {
  fetch(urlPostEvent, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
    .then((res) => {
      console.log("res = ", res);
      console.log("res.status", res.status);
      console.log("res.ok", res.ok);
      return res.json();
    })
    .then((result) => {
      console.log("Add Event result = ", result);
      refreshData();
    })
    .catch((error) => {
      console.log("Err post = ", error);
    });
}

function MainPage() {
  const calendarRef = useRef(null);

  const [dataEventInfo, setDataEventInfo] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [addNewEvent, setAddNewEvent] = useState(false);
  const refreshData = useCallback(
    () => setDataUpdated(!dataUpdated),
    [dataUpdated]
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataInfoCustomers, setDataInfoCustomers] = useState([]);

  /*Fetch - Get all the Event with Inventory & forEach inventory Array*/
  useEffect(() => {
    fetch(urlGetEvents, {
      method: "GET",
      headers: headers,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch event data");
        }
        return res.json();
      })
      .then((result) => {
        const fetchPromises = result.map((st) => {
          return fetchEventDetails(st.eventSerialNum);
        });
        Promise.all(fetchPromises)
          .then((itemAllocations) => {
            const updateDataInfo = result.map((st, index) => {
              const itemAllocationSum = itemAllocations[index].reduce(
                (sum, item) => sum + item.itemAmount,
                0
              );
              let backgroundColor = "";
              let borderColor = "";
              if (itemAllocationSum <= 50) {
                backgroundColor = "#ACE1AF";
                borderColor = "#8FBC8B";
              } else if (50 < itemAllocationSum && itemAllocationSum <= 100) {
                backgroundColor = "#72A0C1";
                borderColor = "#002D62";
              } else {
                backgroundColor = "#F08080";
                borderColor = "#FBCEB1";
              }
              let textColor = "#0d6efd";
              return {
                id: st.eventSerialNum,
                title: st.event_name,
                start: st.event_startdate,
                end: st.event_enddate,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                textColor: textColor,
                extendedProps: {
                  eventNotes: st.event_notes,
                  eventAddress: st.event_address,
                  employeeID: st.employee_id,
                  clientNumber: st.clientNumber,
                  ItemAllocations: itemAllocations[index],
                },
              };
            });
            setDataEventInfo(updateDataInfo);
          })
          .catch((error) => {
            console.log("Error fetching item allocations:", error);
          });
      })
      .catch((error) => {
        console.log("Error fetching event data:", error);
      });
  }, [dataUpdated]);
  const fetchEventDetails = (eventSerialNum) => {
    return fetch(
      `https://proj.ruppin.ac.il/cgroup96/prod/api/GreenEvents/GetEventWithItems/${eventSerialNum}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        return data.ItemAllocations;
      })
      .catch((error) => {
        console.error("Failed to fetch event details:", error);
        return [];
      });
  };
  /*Get fot the Costumer */
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
  }, [dataUpdated]);
  /*Delete the Event*/
  function deleteEvent(EventID) {
    fetch(urlDeleteEvent, {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventSerialNum: EventID }),
    })
      .then((res) => {
        console.log("Event number is: ", EventID);
        console.log("res = ", res);
        console.log("res.status", res.status);
        console.log("res.ok", res.ok);
        return res.json();
      })
      .then((result) => {
        console.log("Delete Event result = ", result);
        refreshData();
      })
      .catch((error) => {
        console.log("Err delete = ", error);
      });
  }

  const hebrewCalendar = {
    code: "he",
    week: { dow: 0, doy: 1 },
    businessHours: {
      daysOfWeek: [0, 1, 2, 3, 4, 5],
      startTime: "00:00",
      endTime: "23:59",
    },
    buttonText: {
      prev: "הקודם",
      next: "הבא",
      today: "היום",
      month: "חודש",
      week: "שבוע",
      day: "יום",
      list: "אירועים",
    },
    weekText: "שבוע",
    allDayText: "כל היום",
    moreLinkText: "עוד",
    noEventsText: "אין אירועים להצגה",
    eventLimitText: "עוד",

    dayPopoverFormat: { weekday: "long", month: "numeric", day: "numeric" },
    slotLabelFormat: { hour: "numeric", minute: "2-digit", hour12: false },
    columnHeaderFormat: {
      weekday: "long",
      month: "numeric",
      day: "numeric",
      agenda: "list",
    },
    eventTimeFormat: { hour: "numeric", minute: "2-digit", hour12: false },
  };
  const columnHeaderText = (date) => {
    const dayName = date.toLocaleDateString(undefined, { weekday: "long" });
    const dayDate = date.getDate();
    return `${dayName}<br>${dayDate}`;
  };

  /*Code For the Full Calendar Header Change View*/
  const handleDayButtonClick = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView("timeGridDay");
    }
  };
  const handleWeekButtonClick = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView("timeGridWeek");
    }
  };
  const handleMonthButtonClick = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView("dayGridMonth");
    }
  };
  const handleListYearButtonClick = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView("listYear");
    }
  };
  /*The Day header for each view */
  const viewDayHeaderFormat = (info) => {
    const { view } = info;
    let dayHeaderFormat = "dddd";

    if (view.type === "timeGridDay") {
      dayHeaderFormat = "dddd, MMMM Do";
    } else if (view.type === "timeGridWeek") {
      dayHeaderFormat = "MMMM Do";
    } else if (view.type === "dayGridMonth") {
      dayHeaderFormat = "dddd, MMMM Do";
    } else if (view.type === "listYear") {
      dayHeaderFormat = "YYYY";
    }
    view.setOption("dayHeaderFormat", dayHeaderFormat);
  };
  /*Print option*/
  const handlePrintButtonClick = () => {
    const calendarElement = document.getElementById("calanderRight");
    const originalVisibility = calendarElement.style.visibility;
    calendarElement.style.visibility = "visible";

    window.print();
    calendarElement.style.visibility = originalVisibility;
  };
  /*Set The title for the full Caledar*/
  const [viewTitle, setViewTitle] = useState("");
  useEffect(() => {
    const updateViewTitle = () => {
      const activeView = calendarRef.current.getApi().view;
      let title = "";

      if (activeView.type === "dayGridMonth") {
        title = moment(activeView.current).format("MMMM");
      } else if (activeView.type === "timeGridWeek") {
        const startDate = activeView.currentStart;
        const endDate = activeView.currentEnd;
        title = `${moment(startDate).format("L")} - ${moment(endDate).format(
          "L"
        )}`;
      } else if (activeView.type === "timeGridDay") {
        const currentDate = activeView.currentStart;
        title = moment(currentDate).form("ll");
      }
      setViewTitle(title);
    };

    const calendarApi = calendarRef.current.getApi();
    updateViewTitle();
    calendarApi.on("viewDidMount", updateViewTitle);
    return () => {
      calendarApi.off("viewDidMount", updateViewTitle);
    };
  }, []);

  /*PopUP Delete Event */
  const costumBTN = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const alertDeleteEventButtons = (eventID) => {
    costumBTN
      .fire({
        title: " ? האם אתה בטוח",
        text: " ! לאחר מחיקה, לא יהיה ניתן לבטל פעולה זו",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "מחק",
        cancelButtonText: "בטל",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteEvent(eventID);
          costumBTN.fire("נמחק", " ! האירוע נמחק בהצלחה", "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          costumBTN.fire(" ! בוטל", "האירוע שמור במערכת", "error");
        }
      });
  };

  /*Render the PopUP info for each Event in the Calendar*/
  const [datePerEventTemp, setDatePerEventTemp] = useState([]);
  const eventInfoClick = (eventClickInfo) => {
    setAnchorEl(eventClickInfo.el);
    const datePerEvent = {
      id: eventClickInfo.event?.id,
      titel: eventClickInfo.event?.title,
      start: moment(eventClickInfo.event?.start, "DD MM YYYY hh:mm:ss").format(
        "llll"
      ),
      end: moment(eventClickInfo.event?.end, "DD MM YYYY hh:mm:ss").format(
        "llll"
      ),
      backgroundColor: eventClickInfo.event?.backgroundColor,
      borderColor: eventClickInfo.event?.borderColor,
      clientNum: eventClickInfo.event?.extendedProps?.clientNumber,
      address: eventClickInfo.event?.extendedProps?.eventAddress,
      note: eventClickInfo.event?.extendedProps?.eventNotes,
    };
    setDatePerEventTemp([datePerEvent]);
  };
  const closePopoverEvent = () => {
    setAnchorEl(null);
  };

  const findClientInfo = (clientID) => {
    return dataInfoCustomers.map((item) => {
      if (item.costumerNum === clientID) {
        return item.costumerName;
      } else {
        return "";
      }
    });
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const RenderEventInfo = () => {
    return (
      <>
        {datePerEventTemp.map((item) => (
          <div key={item.id} className="eventInfoPopUP">
            <div
              className="eventInfoPopUPInnerClose"
              onClick={closePopoverEvent}
            >
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACPklEQVR4nO3bS0oDURCF4eMuxIEIugDfxq6gLs+Z23PiDnzF9DwSyAUJJm0Hu++pqvNDZiJVfl7TaVpAKaWUUkoppZRSSql8HSNvxyDrEUAL4AH5MgBfAJ4A7IEEY7F6ZUOxFUbZvzrKT4xsKLaGUR3lN4wsKLYBoxrKNozoKNaBMTrKCYD5HwZarL5uijhNe+6+/FmNUvPH35JIJ8XYd86EYl52zYBi3naMjGJed4uIYt53ioRiUXaJgGIBdgiDYo5nD4diDmcOi2KOZg2PYg5mTINixLOlQzHCmdKiGNEsyI5iBDNQVRPFhMGDYsLgQTFh8KCYMHhQTBg8KCYMHhQTBg+KCYMHxYTBg2LC4HpKcJ70aUrak7LQvSlfKG2GG4VeUFph8KC0wuBBaYUxbI1AeGr0J4unRm/qPDW67OWp0QdDnxhz3ToZtlsAs56XtgyPGIXsdgeMklCIMEpCqYRxv+V7CYUIoyQUIoySUHp2AeB9IIySUAbCuMPuCYUIoySUf8CYAZjg/xLKWucVMUpC+YHxVhmjlB6lD8bnwBjpURgx0p4UZox0KH0xbirOGh7lzBFGeBSPGGFRPGOEQ4mAEQYlEoZ7lCXGaw+Ma/ip8YZyGhjDHUoGDDcofTA+nGPQo/R5A1/ear9E3n9EnYwx1CGAl0QnY9eT8gzgACPVhbLEuELcmg6UUTG6UKJjdKFUwdiEkgVjE0pVjHWUbBjrKBQYpaPV1VfWJgD2aw+hlFJKKaWUUkoppRRG7Bvth+BAB0h1gQAAAABJRU5ErkJggg==" />
            </div>

            <div
              style={{
                backgroundColor: item.backgroundColor,
                borderColor: item.borderColor,
              }}
              className="eventInfoPopUPInner-Header"
            >
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACrklEQVR4nO2cTW7UQBhEaxPuwE/WuQpwkqBwsaBIkQhXACJIcoQZiWQJiEzYN7LUbMzEf7jdX5XrSV5FnZnXz23HM7EBY4wxJh5JfKOj9oQlB3GQ0NTeg5NXSHcQdhK7D72Amg+9gJoPvYCaD72Amg+9gJoPvYCaD72Amg+9gJoPvYCaD72Amg+9gJoPvYCaD72Amg+9gJoPvYCaD72Amg+9gJoPvYCaD72Amg+9gJoPvUA0nycA3gK4BPB7zxvyhlFz0MzhZwAneW5H8QzAjScdpXa6awBPx6wMx0DxI8AVgIMhQZrDlA9HWGQO3gwJctka9D4fwsz/8RzARWtuPw0Z+NAa1PwiMw8vWnO7o/jzTpzR8+sgZXGQYDhIMBykIIcAzvLJudnOARz1jHGQgjF+7Jngn/lnj+EghTjruOB71zHOQQqx6why3zHOQSoE+dUxzkEKcd4R5LRjnIMU4iifwNsT/D1/RPIYDlKQw3wCv8/baU+MBgcJhoMEw0GC4SDBcJBgOEgwHCQYDhKMakHU/5VoKg4CB9m7J6htU/EKgYNM2xOCI7dC2EkOEgsHCYaDBMNBgrGaIK8BbANcV2wBvAo0L9Ve+FuAGClvd4HmpdoLO0iwIM1hYhNgdWwAvAw0L/VfODgOEoxqQXYz3fTpFTLTTZ/t26IvJkZxkH9jfJhyW/RJoZNm7euQbc91Rh8l3tPx0EdrXC8Y5G6BGClvt4GCfBn6aA3kB6NcLRTkdoVBvo55+MxfDvKzOD7uebrDnEGWug7Z9FxnlA7ykOfyeMzKmJOhQVhI7D70Amo+9AJqPvQCaj5DBdb2fUg1hgqs7eP3ajgIaZC1fR9SDXoBNR96ATUfegE1H3oBNR96ATUfegE1nyS+0VF7wpKDOEhoau/BySvEGGMMVsQf/xshb3ZDvjsAAAAASUVORK5CYII=" />
              <label>{item.titel}</label>
            </div>
            <div className="eventInfoPopUPInner">
              <div className="eventInfoPopUPInnerDate">
                <label>{item.start}</label>
                <label>{item.end}</label>
              </div>

              <img src="data:image/png;base64,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" />
            </div>
            <div className="eventInfoPopUPInner">
              <label>{item.note}</label>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE50lEQVR4nO2dW2tcVRTHf2SwERq1ii3EgEUhH6CisYj2M9h+B+/vWhBvNM82+iVsTNM+2Yvfwl58KZTqg0Zti0la60jJkQVrYNizT+bc9sw6c9YPNgxnZl/W+s/Zl3X2noE0LAObwA6QBUmurQNL2GW55e0fMeZexJAw/WXUqOWWt3+EzQLGDNI57LHZ8vaPELvN89Lf2GOn5e0fIWx02fenTdvbP3MGZS1v/8wZlLW8/TNnUGax/a8AV4AHJQa4vDTOIOsppG554tPLwDFKiPGPYYOylgsySA+LinKlJQZlLRdE0g9FBGmim3JBKOSb3SKCjHNo3fx1y09N6vaXzu+C4IJYInNBbJHNmiDbLQ/ObSdu/8QFWW95+Ho9cfsnLsiSPrwZZ4x85gXssZS4/RMXBG3ouZzbf1vfsyjGJNo/FUGcfFwQY7ggxnBBjOGCGMMFmTVBPJHUBy4Itr5kLgjTF8EFYYYEcZrFBTGGC2IMF8QYLogxXBBjuCDGcEGM4YIYwwUxhgtiDBfEGC6IMVwQY7ggxnBBjOGCGMMFMYYLYgwXxBguiDFcEGO4IMZwQYzhghjDBTGGC2IMF8QYLogxXBBjnAUe++73eswBK8Bp4DxwDbgP9DXd12sb+pkVzZPHceCWH0cozyKwCvxa4dzHL5pXyojxHHC1SCP8fAg8C3wDPGrgQM4jLetQxNc9F2Q8p4A/EpyU2tKyS9PVO6Sn3+Q8h8qP9H8HvAO8BhwGntB0WMeNd/WHaXb3KWet6J3RZUGeBC7kOPB34EPgYIny5LMf6V0RK/OC1lmIrgnSAy5G7P4X+AJYqFG25P1KZ2IxUXwMiRDrpuSb/QbN8WbOuCRrkrF06Q45FbH3BvBigrqOAjeDuvaAk+MydkWQZ4DfIj/b93LCOo9G7pQtnWbTdUG+jYwZZbqp3WAGVpS3ImOKdJudFmQxsuiTAbwMdfz0aWTxuNhlQVYjU9uys6k6fpoHbgf5V1NU1AbmNM40bKOsM8pS10/vBfnv5AUkZ12QlcgKvMyiryk/LURW9K+mqMg6pwP7JBxShSb8FP6K9iepKrLM+cA+iU1VoQk/hd3WRqqKLHM9sE+6sCo04afjQRnXUlVkmbuBfc9XLKcJPx2JLEyTVGSZfmDfgYrlNOGn+cjiNElFlum7ILPZZe0EU+cqeJdFc4N6E/igzui0Vx67Tov3fdrLyMJwmn+7tBG05eMuDuorgX27FUMndVmI/KtqJ0Mnc5HgomxIKEvV5yEDPgja0NngYiz8Lk/tnqIcdfw0rwIM5z+ToqI2P6D6smQZdfz0eZC38w+oYrtN+ro7JPU65ATwX2TzHF2+Q4SnI5sc7k5pk0Ns32/nBBlsA9oL7L2pjmual4Cfg7qk7rcn/Qf3ltLZiL1rkc/9qbtDmuJEzr+Hfl0k82UDjssSpccarhiml7Ovt6+7Q6pGgwezqc9ytpJuFt1Kegx4aMB5WaJ0Sw/LhI7L22x9W5/sldmVsqDrjHBqOyyG1FkYEeXSmG31bU4/Rr6dPe3SwjFlkB7oM3CJP72ukdoDmo7oNXnv+326/T3tpkodR+g6J/c5RlAnbRXZx+vEOdTwkba1cVNbp/iK/kwk9lUk3dG8uVtEHSojQT85xib7piRk/hNwb+hYtLyWa/KehNAlarvfsehc/ge/HJnj47x7BgAAAABJRU5ErkJggg==" />
            </div>

            <div className="eventInfoPopUPInner">
              <label>{findClientInfo(item.clientNum)}</label>
              <img src="data:image/png;base64,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" />
            </div>

            <div className="eventInfoButton">
              <div onClick={() => alertDeleteEventButtons(item.id)}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADGklEQVR4nO2dS25TMRiFD4N2DwWyIBhQQFgdwAJatcuj7IASlbZLiMT7IUYNsyIZWXImVtL7sp0Tn/+TPIx9jr97b3KtSgUMwzAMoz32AZwBmAP4C8BPHGGODwBO49zGAB4CuMkgYdO4BnBgRvrfGTcFZazGFYA9k9LNWQUZq3FiQrqZJ5v2FsCjDBv3GMB5MveFCelmmWxa2MhczJK5b01INz4ZuzZ/c3gTwoU3IVx4EzKOpwAWFX+i+h0ZYU+eYAt8ISjvScdXE4KtS9i6kHBb2iMLPI+slDRY63j2vvQB1frSB1TrSx9QrS99QLW+9AHV+tIHVOtLH1CtL31Atb70AdX60gdU60sfUK0vfUC1vvQB1frSB1TrSx9QrS99QLW+9AHV+tIHVOtLH1CtL31Atb70AdX6Tg3oAPwB8B3Ac5TnBYAfcc1XIz7ftJAHcWN8HHcAjlCOo7jGar3fI+ZoWkjgV/L5UlJSGWH8HDFP80Jertmo3FLWybiLaw+leSGIz/J0w/4BeIPpuA1zvx45n4SQUlJyy5ASkltKCRlyQnJJKSVDUshUKSVlyAoZK6W0DGkhQ6XUkAF1IX2l1JIRkBfSJaWmjIAJ6XjbLv2Wn2JCOu6UWnfGChPSU0oNGQETkrDuOyPHMUtfTEgPGTWlmJCIfakTXTHunp+2JY/u1yF/h7ge7xk1pUgLcQNe+mpJkRXiRryB15AiKcRNOA4pLUVOiMtwNlVSipQQl/GgsJQUGSGuwKltCSkSQlzBI/TcUpoXcrjFP5QLaw+leSGfC8u4T8qnEfM0L+RbBRmbpIS1h9K8kMN4pS5GPkLGrLeIaz4b8fnmhewa9H3pA6r1pQ+o1pc+oFpf+oBqfekDqvWlD6jWlz6gWl/6gGp96QOq9aUPqNaXPqBaX/qAan3pA6r1pQ+o1pc+oFpf+oBqfekDqvW9LfiP6dmYJV1DdzrmScjzRqXMALxLul6AkNM1t7HKOAYh+wCuCTbHVx6XAPZAygGAK4JN8pXGx9iZmnC1nAB4D2BJsGk+81jGbsfMd4ZhGIYBOf4De7UwAyLLJagAAAAASUVORK5CYII=" />
              </div>
              <div>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE5UlEQVR4nO2dS6gcRRRAjzzzNGoU/zEPVNAH7jSCuhCVgB/EjeDCRUzURdCVgjs3giAKEV24Et24EM1TBr/5+IsaNYoYf0gUQdSFCwli3kvUKMaWkno4qbnVVT093XN75h6ozXRXT917prqru6t7oBnmgR6wBBRBcZ8tAHPoZb7j7R8I5hchkLDsUxrUfMfbP0AvI5jlsgV99Dre/gGkbh4r+9HHUsfbP0DY6KrLx03X2z9xARUdb//EBVR0vP0TF1Chsf0XAzuAgxUOcLGSCkh7Cam7PZfT7cBaKsj4XXFARceFLJffcqXs6EhARceFuLI1R8godlMmhKzcHMgRkkpo3fp1t980Tbe/cn0TggnRRGFCdFFMmpDFjl+cW2y4/a0LWej45euFhtvfupA5f/MmFYxbZw36mGu4/a0LwTd0S6T7L/plGmW00f6xCDHimBBlmBBlmBBlmBBlmJBJE2KFRnNgQtD1IzMhjF+CCWGChBijxYQow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4Qow4QoY41/fckG4KmcCjYNSBkmRBkmRBkmZLRcADwMfAb8DPwEfAjcD6zO2YAJGQ3HAI8BfyfemXV3akMmpD4n+V6QO+H68bKNmZD6Mj4aYhb8PbENmpDhOTHSM34EbgHO9uchm4S3RRyMHVNMyPAydkd+/S8AK4L1zxek3Cdt2IRUZxXwfmKX1BOk3Bms43Z1A5iQapwAvCfk7a8MKauD5e5fGQYwIdVk7BJy5t7Lex7wbULKqmDZH9KXmJA8jgfeFfL1GnBs36ueyqRcEXz+vfRFJiTNccDbQq7eAFYG65ZJCd+R/LT0ZSYkLWOnkKc3BRkpKWG5QapsQsplvCXkaKdfVkZKygexiiZEZqXfJYX5eccfT3JwUn4QtuHOR86NVTIhsozXhdzsqiDDcT1wSHiz6aVllUzIkcwCr0Z2MW7Ymst1flgbyrgsVdGEHCnjFSEnu9uS4TAh/8t4OSLDXbdqRYbDhPCfjJeEXOwBTm5ThgmhVMYpbcuYdiGzwItCDj4dl4xpFjIbkVF1NyUNbX+NDG2vztngNApZ4W8ihbG7mSKnNtQzrvF/vpZk2oTMAM8KcX/eoIxr+/4JL8k0CZkBnhFi/gI4rSEZ4bpJpkXI0cBzQrxfAqc3dMxAWDfJNAiZ8fcewli/zp1NWGM0VTm/ky5kJiLjG+CsFoa2JqSPoyIy9gJnUn83dUlGXRPSx61CQr6r2DPqyHCYkD6ky+h/AjfS3hm4CembjX5ASMiylJto53KICek7GStKintsYCPNX5syIZ5Hg2Tsi0i5ndEeM0JMiGdvkIz1wINCgv4B7kr0jNJ74AlMCHCOkPQzfIIeiUh5YsQ9Y2gho/6D+3GUq4KY7hDub5TtzqQSk7E+8dhaWVnKEbJdQUKLGmW/MO0/vM/xkBD3k0PI2FBDRuGH4UnW+ocRi46WnnDjaSlYZ52XdiXwAPAxcLiijI01ZbgcX5gjZFnKtpJxu+ayKYhlnbDONkFSFRm3lQhMFfe9W4GLmFI2D5E09+DM81V+wUY+ezIEHPKTqO/1PcJdETYa4itBwGE/0trsz+BTM9cNRsflwCf+0WQ3krq54h3BVvkXuqjUOn1LKZ0AAAAASUVORK5CYII=" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div id="mainBodyMainPage">
      <div id="headerMainPage">
        <h1>לוח אירועים</h1>
      </div>

      <div id="innerMainPage">
        <div id="calanderRightHead">
          <div id="calanderRightHeadInner1">
            <div id="innerCalendarHeaderRight">
              <div onClick={() => setAddNewEvent(true)}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAExUlEQVR4nO2a709bZRTHiXuj7/W9/ivWN/4BjS6BC4woCWYmove2VdouLJq4Be4kUtfe2wIDSsMoxXUIUubQ0hITdfycY4MhyV6MURO7JVOm45jztPfikK4/LnD7tOebnITQ2+f2+eT73HOe59yaGhKJRCLpmrNYgMKSk0FeqxA8y+EA/FOWKeQ9BgRQNmYIAigTQDDzsUIOlAkgkANlfjM7LWH5mAFSWGgnMncERsjrQPt5FTBIz0rjQgBLFAE0KAJoUATQoAigQRFAgyKABkUADYoAGhQBNCgCyDvAxPLdZ6LcPs8nArhMAIEcuExLuGplNzuJ8C4CaFAEsNwBJsq8ziv7MiZR5oAI4DIBBHJgFctOdaAxEUCDIoAGVbVlzP10CmIrSWgf80Hr0Dl4p9cFDX47NAYc0NJ/BpyRC+C5HoTpm0nYSqdyzq+qAMaX1iG59gu0X+kGQZWKirPRbkiu3YCnu0+rE2BodgZOD3yqA2nq+RhcV2XoTvTB0EIEoncmYHIjxgL/HlocZZ+5op3sWu17tsvnYeneavUA/H7xNnz2dUAH0NzvhC8TvTCxHoOp364VFHitJ9EH7wXP6OME4iOw88+Tyk4i6cePwBX5gk24IWCHju988M36VMHg9ge6U55R2Vg4pnusC6QOb2UCTD9+xJYbc90lJwwuhEsGtz8G58PQfKmNjX3K28YgVhTAnb+f6M57P3QWxlbHDw2eFpFb42xs9jy96IL6HveLFQPQ/8Nl3XlHAe+/EDUn1qnixYpIIkv3VtmEGgP2opbtfhWznLVnouCX3uQaYHxpHcThc2wymDCKcVOpADHkGUVz4a/WYesJbgH2zXyrlyrFZlsjACc3pqFl0M3uXatKb3MLUAx1sklgnVfs88wIQAzPbG/WhdIsl0nkfjql7zCKKZIPCyA6vqnHAYIi7db6PnyNO4DTN5MMIG7PSsmo+1XKGM5oZgUIitTMHUDP9SD78bh/NQsg3pstY0Ua4A5gW+QC+/F4MGAWwOBCWMvGP3EHsKU/s9G/cnuiIEBGddA98N4ZB4oPuAN4KuBgPx5LCrMATt6NaZn4LwJYbQBbaAkbEyURg/qqnMoYVeznt5COdpoGkOtCeiudgnrVZtpWbnxtKlMJKNJufY/t1ZwAN7cflm18MtrFHIANILMOEwRFjP8PHi8Aozfm2CSwe4YNoOMCiOWLdpxVp4hvcQtw48Ef0Br6nE0Eu2fHBbAze6AqKNJK3gNVsyFt5olrKwuZNqbfDgPzI8d6pF/rs71+IDyeAG5uP4Su2FC2qdTGGj+lZNRCYvTWVXh3r6nkyQmPN4BrW7+DY0TW25pHARHHPB1qZ/eoV20/FtzW5CWkDi9remtOHCxiOeeLgfmw7jxBle6c9La+/Fx4PAK0ZyE2eZ36qx3YPct1WlNQtt2YZgmjwW/Tndfod7xSU8myDn/wEja9tZeCsNzAmq2Yrh0WyfgdrVTRnnl5l20lqc7/0RvYt917vc3Btl64fw0uhtlhKDoMA//G/2F3D6/Rzhq1UuW52baSZR22nhB84klsPeKWq+AXLPFaRYxjkex2u18wex415SBsPeKmHxtAgiL9LChiSlDEHRaqtI19jexnzQfubfPoXxZHXVhW/ua6AAAAAElFTkSuQmCC" />
                <label>אירוע חדש</label>
              </div>
              <div onClick={handleDayButtonClick}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAACCElEQVR4nO3XzUrDQBSG4d5b7kMXKt6Bioo30MXcQMCqG5cWzErFrlp0I06xrfhPiyJx5cZdjqRYS6qhNcfJnGS+F2YbyMOXNK1UEEIIfdfyPMLxUg2mTgV43v8AfiiFo8YGAFS8QQBQAZBsvlawQAVAwgJVcX/Z8QirnAFxPPwTaRkYwtQFrlV9ig9KNnIBYMYAyAyAzADIDIDMAMgMgMwAyAyAzJwG1P0e9V7uWddwFlD3r2lhe50WaxvUeb7NfB0nAfUX3py/MjwcROcAdb+XwIvPvL9Kp72zTNdzClBPLG+Ed3TVzHxNZwC1ATxnALUhPCcAtUG80gNqw3ilBtQ54JUWUOeEV0pAnSNe6QDbg3zxSgXYtoBnDTCiiPbPA7p5fTT69+yk2yLT5Q4YUUR7zfrwJpdqm9R9uSvk8qwB7jYPEje7vLOVeYk2l2cNMNCNxA1nXaLt5Vl9BwZMRCl4Vn+Fg4yIkvCsf8YEf0SUhifiOzCYEVEingjAWRCl4okBjKtfHP9AjD9xDi8b1j9VCgGYtsTJI2V5IgHTlphYXkfG8sQCpiFKxBMLOPk4S3tsCwE4QpSMJx4w7uFtQJITDyg9ADIDIDMAMgMgMwAyAyAzADIDIDMAMgMgMwDmDfgUvuOEYwMAhrxBADAEINl8rWCBIQCpUAvE8X81AGDVMCBCCFXc6RORuwfBem9YfAAAAABJRU5ErkJggg==" />
                <label>יום</label>
              </div>
              <div onClick={handleWeekButtonClick}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABGklEQVR4nO3YMWrDUBgEYR1aRe7gXpVPE5QbuE6tW7wQs05lYwwxysbfwF++ZphFoGkCAPwwL+tw600Hd1Mhb/0dge/beOjmF3lH4ELgUOC2/xRNeCFwKHDbf1ImvBA4GkvyEVkIHArc9p/Un52wW/2NmZ8Qwt0C3w7H8X2P8nH6PN9/fXfxQuCJwDMKDCZcJsKEA4FBgWUiTDgQGBRYJsKEA4FBgWUiTDgQGBRYJsKEA4FBgWUiTDgQGBRYJsKEA4FBgWUiTDgQGBRYJsKEA4FBgWUiTDgQGBRYJsKEA4FBgWUiTDgQGBRYJsKEA4FBgWUiTDgQGBRYJsKEA4FBgWUiTDgQGBRYJsKEWwS641UHBB6eLBAAptfhC3TK+Xdb2J6YAAAAAElFTkSuQmCC" />
                <label>שבוע</label>
              </div>
              <div onClick={handleMonthButtonClick}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABKklEQVR4nO3XMWrDQBCGUd1Nl9IdXOwFfB3hC2wdSK0uTcoNKRJjiBHkj61V9D6Yyt1jZI2GQZL03WUcmxnvGqyuCrzxbwDfSzHlagCwZAsBsABsW/6t2MACsNnAst83u0e4PBnQjL5ELg9YhNUNnE7n9jm67csF4C8DGAYwDGAYwDCAYQDDAIYBDAMYBnDvgHN9uZnefl8LYAXYbGD1CB+2aeuXyN4DGAawd8C58zuv+zNm7hwIYAXYbOCBm9yBWQDDAIY5Y6o7sLkDq0P6bnPnXxrdP8L/PYBhAMMAhh3+DkwDGAYwDGCYl0gYwDCAYQDDAIYBDAMYBjAMYBjAMIBhAJ8N+Lq8meVqAHDJFgLgArBt+bdiAxeAbVcbaM4/GgA8PRhQkobj9AH5hIuQReMLUgAAAABJRU5ErkJggg==" />
                <label>חודש</label>
              </div>
              <div onClick={handleListYearButtonClick}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABSUlEQVR4nO3aMQrCQBBG4dwtfU4TQbzCFttZpfEQYh+EnMAuB0gpNilXLBQERZIfM7P6HkyZwo9NdiMpCiIielRvjymH6crSZD4uFWuY+lcA2yFNmnrh6+4/aIxx0qjXAVgCmFiBA7cwz8B3sYlENpGRXThxjGk5B3KQHjlIR95E2lxf5bxP5/3PBO/TeQVchybdhp67uwA4MwDFABQDUAxAK8Cw2rkaqwC0BuxPF9MJua9AABsAlViBYgCKASjGMUYMQDFe5cQAFANQDEAxAMUA/DXAarN3NQBu/hQwHM6mA+ABwMQKnBG3sFjFMxBAF7tw5WSyPcZUTiY7wNwCUAxAMQDFABQD0BrQ+rvAYPzdIIBeAK0/c+uNvhsEUAxAMQDFABQDUIxjjBiAYrzKiQEoBqAYgGIAigG4NCDTvDQAMHwZkIio+J+ufaXR65J/PvMAAAAASUVORK5CYII=" />
                <label>רשימה</label>
              </div>
            </div>
            <div id="innerCalendarHeaderLeft">
              <div onClick={handlePrintButtonClick}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABPklEQVR4nO2XMW7CQBBF9xQgJOi8orcPYM0UPsesb0CTc/gSFCAkbpFELnOOBAWkFFSLHIwEimAXcHY2ZJ70Gwr4z/MRQilBEP4PVb21IaJE4AxygVomdB8yoZppQohom4S6ALafJwJ/9gJENCKiBRFtjDGWM7TvsCzLcnxN+Q/u4uZnVk03H4FFBGXtmcx9BNhnY9r0Xie2/zI5fm3tFOAubY7SlO8/nwi4v9jcpY0jImDkAkYmdJHDz3isUS64C6II4ANOKE1Tq7W2SZIEidbaZlnWncChPE6/giRpJToTaJ7G9xsGEtBdX4DrHxneKLCJVQAAPp0CALC8RmDw9HZ3Kv8LzHwExoi4ik0AAN7zPB8qH4qiGCHiHADW3BOCfYeZd/lLhBJQv0VXExKBW3nICVUisA13AUEQVHTsABN3zNX4tTuWAAAAAElFTkSuQmCC" />
              </div>
            </div>
          </div>
        </div>

        {/*POPUP for new Event*/}
        <NewCalendarEvent
          trigger={addNewEvent}
          setTrigger={setAddNewEvent}
          addEvent={(item) => addEvent(item, refreshData)}
        />

        <div id="calanderRight">
          {/*Full calendar for all the Event*/}
          <FullCalendar
            ref={calendarRef}
            locale={hebrewCalendar}
            headerToolbar={{ center: "prev title next", start: "", end: "" }}
            direction={"rtl"}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialView="dayGridMonth"
            height={"100%"}
            events={dataEventInfo}
            selectable={true}
            viewDayHeaderFormat={viewDayHeaderFormat}
            eventClick={eventInfoClick}
          />
          {/*on Click event - Show Info */}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={closePopoverEvent}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <RenderEventInfo />
          </Popover>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MainPage;
