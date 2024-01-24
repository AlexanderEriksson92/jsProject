import React, { useEffect, useState } from 'react';

function FoodList() {

    const [food, setFood] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/food')
            .then((response) => response.json())
            .then((data) => setFood(data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="container">
        <ul className="list-unstyled">
                {food.map((foodItem) => (
                    <li key={foodItem.id} className='food-item'>
                        <div className="food-image">
                            <img src={foodItem.imageUrl}/>
                        </div>
                        <div className="food-info">
                            <p><strong>Name:</strong> {foodItem.name}</p>
                            <p><strong>Price:</strong> {foodItem.price}</p>
                            <p><strong>Weight:</strong> {foodItem.weight}</p>
                            <p><strong>Description:</strong> {foodItem.description}</p>
                            <p><strong>Category:</strong> {foodItem.category}</p>
                            <p><strong>Expiration Date:</strong> {foodItem.ExpirationDate}</p>
                            <p><strong>Date Added:</strong> {foodItem.dateAdded}</p> 
                             <div className="food-buttons">
                            <button className="btn btn-primary">Edit</button>
                            <button className="btn btn-danger">Delete</button>
                        </div>
                        </div>
                      
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FoodList;