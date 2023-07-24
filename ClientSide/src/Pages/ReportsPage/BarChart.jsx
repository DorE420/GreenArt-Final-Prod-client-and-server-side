import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell, ResponsiveContainer } from 'recharts';
import Select from 'react-select';
import "./ReportsCss.css";

const convertToHebrewMonth = (englishMonth) => {
  const monthMapping = {
    "January": "ינואר",
    "February": "פברואר",
    "March": "מרץ",
    "April": "אפריל",
    "May": "מאי",
    "June": "יוני",
    "July": "יולי",
    "August": "אוגוסט",
    "September": "ספטמבר",
    "October": "אוקטובר",
    "November": "נובמבר",
    "December": "דצמבר",
  };
  return monthMapping[englishMonth] || englishMonth;
};
const years = [
  { label: '2020', value: 2020 },
  { label: '2021', value: 2021 },
  { label: '2022', value: 2022 },
  { label: '2023', value: 2023 },
]
const months = [
  { label: 'ינואר', value: 'January' },
  { label: 'פברואר', value: 'February' },
  { label: 'מרץ', value: 'March' },
  { label: 'אפריל', value: 'April' },
  { label: 'מאי', value: 'May' },
  { label: 'יוני', value: 'June' },
  { label: 'יולי', value: 'July' },
  { label: 'אוגוסט', value: 'August' },
  { label: 'ספטמבר', value: 'September' },
  { label: 'אוקטובר', value: 'October' },
  { label: 'נובמבר', value: 'November' },
  { label: 'דצמבר', value: 'December' },
];
const monthColorMapping = {
  "January": "#1f77b4",
  "February": "#aec7e8",
  "March": "#ff7f0e",
  "April": "#ffbb78",
  "May": "#2ca02c",
  "June": "#98df8a",
  "July": "#d62728",
  "August": "#ff9896",
  "September": "#9467bd",
  "October": "#c5b0d5",
  "November": "#8c564b",
  "December": "#c49c94",
};


const CustomizedAxisTick = props => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={10} y={0} dy={15} textAnchor="center" fill="#666" transform="rotate(0)">
        {convertToHebrewMonth(payload.value)}
      </text>
    </g>
  );
};
const CustomizedYAxisTick = props => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={10} dx={-30} textAnchor="end" fill="#666">
        {payload.value}
      </text>
    </g>
  );
};

<YAxis tick={<CustomizedYAxisTick/>}/>

const EventsBarChart = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState(years.find(year => year.value === 2023));
  const [selectedMonths, setSelectedMonths] = useState(months);

  const isEventInSelectedMonths = (event) => {
    return selectedMonths.some(selectedMonth => selectedMonth.value === event.Month);
  };
  const filteredData = data.filter(event =>
    event.Year === selectedYear.value && isEventInSelectedMonths(event)
  );

  return (
    <div className="chartDivInner">
      <div className="selectOption">
      <Select
        id="selectYEAR"
        options={years}
        value={selectedYear}
        onChange={option => setSelectedYear(option)}/>
      <Select
        id="selectMonth"
        options={months}
        value={selectedMonths}
        onChange={options => setSelectedMonths(options)}
        isMulti/>
      </div>
      <div className="barCharClass">
      {/*<ResponsiveContainer width="100%" aspect={3}>*/}
      <BarChart
        width={1000}
        height={300}
        data={filteredData}
        margin={{ top: 5, right: 20, left: 10, bottom: 30 }}>

      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey="Month" tick={<CustomizedAxisTick/>} interval={0}/>
      <YAxis tick={<CustomizedYAxisTick/>}/>
      <Tooltip/>
      <Bar width={"80%"} dataKey="Events" fill={({ index }) => monthColorMapping[filteredData[index].Month]}>
        {filteredData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={monthColorMapping[entry.Month]} />
        ))}
      </Bar>
    </BarChart>
    {/*</ResponsiveContainer>*/}
    </div>
    </div>
  );
};

export default EventsBarChart;