import React from "react";
import { Link } from "react-router-dom";

function Menu() {
    const isLoggedIn = localStorage.getItem('apiKey') !== null;

    const handleLogout = () => {
        fetch('http://localhost:5000/logout', {
            method: 'POST',
            headers: {
                'x-api-key': localStorage.getItem('apiKey'),
            },
        });
        localStorage.removeItem('apiKey');
        alert('Du är nu utloggad!');
        window.location.href = '/';
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Startsida</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/list">Lista</Link>
                    </li>
                    
                    {isLoggedIn ? (
                        <>
                        <li className="nav-item">
                        <Link className="nav-link" to="/add">Lägg till</Link>
                    </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-danger m-0" onClick={handleLogout}>Logga ut</button>
                        </li>
                        </>
                    ) : (
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Logga in</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Menu;
