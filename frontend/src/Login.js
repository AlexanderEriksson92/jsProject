import React, { useState } from "react";
import { Form, Link } from "react-router-dom";

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { username, password };

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            localStorage.setItem('apiKey', data.apiKey);

            alert('Du är nu inloggad!');
            window.location.href = '/list';
        } catch (error) {
            console.log(error);
            alert(error.message + 'Något gick fel, försök igen!');
        }
    };

    return (

        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <h1>Logga in</h1>
                    <label>Användarnamn:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Lösenord:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Logga in</button>
            </form >
            <Link to="/register">Registrera dig</Link>
        </div >
    );
}
export default LoginForm;
