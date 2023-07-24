import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import MainPage from "../Pages/MainPage/MainPage";
import Customers from "../Pages/CustomersPage/Customers";
import Suppliers from "../Pages/SuppliersPage/Suppliers";
import Team from "../Pages/TeamPage/Team";
import Reports from "../Pages/ReportsPage/Reports";
import Vehicles from "../Pages/VehiclesPage/Vehicles";
import Catalog from "../Pages/CatalogPage/Catalog";
import Inventories from "../Pages/InventoriesPage/Inventories";
import Setting from "../Pages/SettingPage/Setting";
import LoginForm from "./LogInFile/LoginForm";
import SideToolBar from "./SideToolBar";



export const MainLayout = ({ userInfo }) => {

    return(
        <div id="container">
            <div id="mainBody">
                <Routes>
                    <Route path="/" element={<Reports/>}/>
                    <Route path="/mainpage" element={<MainPage/>}/>
                    <Route path="/customers" element={<Customers/>}/>
                    <Route path="/suppliers" element={<Suppliers/>}/>
                    <Route path="/team" element={<Team/>}/>
                    <Route path="/vehicles" element={<Vehicles/>}/>
                    <Route path="/catalog" element={<Catalog/>}/>
                    <Route path="/inventories" element={<Inventories/>}/>
                    <Route path="/setting" element={<Setting userInfo={userInfo}/>}/>
                    <Route path="/loginform" element={<LoginForm/>}/>
                </Routes>
            </div>
            
            <SideToolBar userInfo={userInfo}/>
        </div>
    )
}

export default MainLayout;