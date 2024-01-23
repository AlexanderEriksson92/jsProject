import React, { useState, useEffect } from 'react';
import './App.css';
import PutFoodForm from './PutFoodForm';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/food')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
        
                {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
              <PutFoodForm />

            </header>
        </div>
    );
}

export default App;

