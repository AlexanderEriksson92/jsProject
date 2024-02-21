import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Registrerar användare
function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Lösenorden matchar inte');
            return;
        }
        const user = {
            username: username,
            password: password,
            email: email
        };

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            alert('Du är nu registrerad!');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }

return (
    <div className='container'>
        <form onSubmit={handleSubmit}>
            <div>
                <h1>Registrera dig</h1>
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
            <div>
                <label>Upprepa Lösenord:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <div>
                <label>E-post:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary">Registrera dig</button>
        </form>
        <Link to="/login" className='login-link'>Redan registrerad? Logga in här</Link>
    </div>
  );
}

export default RegisterForm;