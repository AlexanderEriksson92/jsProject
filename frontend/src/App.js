import React, { useState, useEffect } from 'react';
import './App.css';
import './FoodList.css'

import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes
} from "react-router-dom";
import FoodForm from './PutFoodForm';
import FoodList from './FoodList';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Menu from './Menu';

function App() {
    const apiKey = localStorage.getItem('apiKey');
    console.log(apiKey);
    return (
        <Router>
            <div className="App">
            <Menu />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/list" element={<FoodList />} />
                    <Route path="/add" element={<FoodForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

