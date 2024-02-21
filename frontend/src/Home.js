import React, { useEffect, useState } from 'react';
import { formatDate, getImageUrl } from './utils';
import './FoodList.css';

function Home() {
    const [latestFood, setLatestFood] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/food')
            .then((response) => response.json())
            .then((data) => {
                setLatestFood(data.slice(0, 5));
            })
            .catch((error) => console.log(error));
    }, []);
    const [data, setData] = useState([]);
    return (
        <div className="container">
            <h1 className='h1 m-2'>Senaste 5 inläggen</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Bild</th>
                        <th>Namn</th>
                        <th>Pris</th>
                        <th>Vikt</th>
                        <th>Beskrivning</th>
                        <th>Utgångsdatum</th>
                        <th>Lagt till</th>
                    </tr>
                </thead>
                <tbody>
                    {latestFood.map(item => (
                        <tr key={item.id} className='food-item'>
                            <td><img src={getImageUrl(item.imageUrl)} className='food-item-image' alt="food" /></td>
                            <td data-label="Namn:">{item.name}</td>
                            <td data-label="Pris:">{item.price} kr</td>
                            <td data-label="Vikt:">{item.weight} g</td>
                            <td data-label="Beskrivning:">{item.description}</td>
                            <td data-label="Utgångsdatum:">{formatDate(item.ExpirationDate)}</td>
                            <td data-label="Lagt till:">{formatDate(item.dateAdded)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Home;