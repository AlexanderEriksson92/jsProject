import React, { useEffect, useState } from 'react';

function FoodList() {

    const [food, setFood] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedFoodItem, setEditedFoodItem] = useState({});
    const handleChange = (e) => {
        setEditedFoodItem({ ...editedFoodItem, [e.target.name]: e.target.value });
    };

    const startEditing = (foodItem) => {
        setEditingId(foodItem.id);
        setEditedFoodItem({ ...foodItem });
    };
    const handleInputChange = async (e) => {
        setEditedFoodItem({ ...editedFoodItem, [e.target.name]: e.target.value });
    };
    const handleEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/food/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedFoodItem),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setFood(
                food.map((foodItem) => (foodItem.id === id ? editedFoodItem : foodItem))
            );
            setEditingId({});
        } catch (error) {
            console.log(error);
        }
        setEditingId(null);
    }

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
                            <img src={foodItem.imageUrl} />
                        </div>
                        <div className="food-info">
                            {editingId === foodItem.id ? (
                                <div className="food-edit-box">
                                    <input type="text" name="name" value={editedFoodItem.name} onChange={handleInputChange} />
                                    <input type="text" name="price" value={editedFoodItem.price} onChange={handleInputChange} />
                                    <input type="text" name="weight" value={editedFoodItem.weight} onChange={handleInputChange} />
                                    <input type="text" name="description" value={editedFoodItem.description} onChange={handleInputChange} />
                                    <input type="text" name="category" value={editedFoodItem.category} onChange={handleInputChange} />
                                    <input type="text" name="ExpirationDate" value={editedFoodItem.ExpirationDate} onChange={handleInputChange} />
                                    <input type="text" name="dateAdded" value={editedFoodItem.dateAdded} onChange={handleInputChange} />
                                   
                                    <button onClick={() => handleEdit(foodItem.id)}>Save</button>
                                </div>
                            ) : (
                                <div>
                                    <h2>{foodItem.name}</h2>
                                    <p><strong>Price:</strong> {foodItem.price}</p>
                                    <p><strong>Weight:</strong> {foodItem.weight}</p>
                                    <p><strong>Description:</strong> {foodItem.description}</p>
                                    <p><strong>Category:</strong> {foodItem.category}</p>
                                    <p><strong>Expiration Date:</strong> {foodItem.ExpirationDate}</p>
                                    <p><strong>Date Added:</strong> {foodItem.dateAdded}</p>
                                    <div className="food-buttons">
                                    <button className="btn btn-primary" onClick={() => startEditing(foodItem)}>Edit</button>
                                        <button className="btn btn-danger">Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FoodList;