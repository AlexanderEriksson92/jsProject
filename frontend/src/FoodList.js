import React, { useEffect, useState } from 'react';

function FoodList() {
    const [food, setFood] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedFoodItem, setEditedFoodItem] = useState({});
    const [deleteMessage, setDeleteMessage] = useState('');
    const handleChange = (e) => {
        setEditedFoodItem({ ...editedFoodItem, [e.target.name]: e.target.value });
    };

    const startEditing = (foodItem) => {                                                    // Om användaren klickar på edit så kommer den här funktionen att köras 
        setEditingId(foodItem.id);                                                          // Sätter editingId till matvarans id 
        setEditedFoodItem({ ...foodItem });                                                 // Sätter editedFoodItem till matvaran som ska ändras                       
    };
    const handleInputChange = async (e) => {                                                // const som hanterar ändringar i matvaran                  
        setEditedFoodItem({ ...editedFoodItem, [e.target.name]: e.target.value });          // Sätter editedFoodItem till matvaran som ska ändras
    };
    const cancelEditing = () => {
        setEditingId(null);
    };

    const handleEdit = async (id) => {         
        const apiKey = localStorage.getItem('apiKey');  
        console.log('API Key in handleEdit:', apiKey);                                          
        try {
            const response = await fetch(`http://localhost:5000/food/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
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
    const handleDelete = async (id) => {
        const apiKey = localStorage.getItem('apiKey');
        console.log('API Key in handleDelete:', apiKey);
        const confirmed = window.confirm('Är du säker på att du vill ta bort matvaran?'); // Ger användaren möjligen att bekräfta att den vill radera matvaran
        
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:5000/food/${id}`, {
                    method: 'DELETE',
                    'x-api-key': apiKey,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const foodItemToDelete = food.find((foodItem) => foodItem.id === id);
                const foodItemName = foodItemToDelete ? foodItemToDelete.name : 'Okänd matvara';


                setFood(food.filter((foodItem) => foodItem.id !== id));
                setDeleteMessage(`${foodItemName} har raderats.`);
                // Sätter en timeout på 3 sekunder
                setTimeout(() => {
                    setDeleteMessage('');
                }, 3000);
            } catch (error) {
                console.log(error);
            }
        }
    };
    useEffect(() => {
        fetch('http://localhost:5000/food')
            .then((response) => response.json())
            .then((data) => setFood(data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="container">
            {deleteMessage && <div className="alert alert-success">{deleteMessage}</div>}
            <ul className="list-unstyled">
                {food.map((foodItem) => (
                    <li key={foodItem.id} className='food-item'>
                        <div className="food-image">
                            {foodItem.imageUrl ? (
                                <img src={foodItem.imageUrl} alt={foodItem.name} />
                            ) : (
                                <img src="https://i.ibb.co/xSwX9Bf/3f338739-34e1-4e43-90a7-6f9ffcfd139b.webp" alt="Default" />
                            )}
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
                                    <button className="btn btn-success" onClick={() => handleEdit(foodItem.id)}>Save</button>
                                    <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
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
                                        <button className="btn btn-danger" onClick={() => handleDelete(foodItem.id)}>Delete</button>
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