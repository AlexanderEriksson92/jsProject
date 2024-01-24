import React, { useState, useEffect } from 'react';
import './App.css';
import './FoodList.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Routes
} from "react-router-dom";
import FoodForm from './PutFoodForm';
import FoodList from './FoodList';
import Home from './Home';

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Startsida</Link>
                        </li>
                        <li>
                            <Link to="/list">Lista</Link>
                        </li>
                        <li>
                            <Link to="/add">Lägg till</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/list" element={<FoodList />} />
                    <Route path="/add" element={<FoodForm />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

