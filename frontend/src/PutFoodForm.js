import React, { useState } from 'react';

function FoodForm() {
    
    const [foodItem, setFoodItem] = useState({
      id: '',
      name: '',
      price: '',
      weight: '',
      description: '',
      category: '',
      ExpirationDate: '',
      dateAdded: ''
    });
  
    const handleChange = (e) => {
      setFoodItem({ ...foodItem, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:5000/food', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(foodItem)
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(data);
       
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
        <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={foodItem.name} onChange={handleChange} />
        <input type="number" name="price" value={foodItem.price} onChange={handleChange} />
        <input type="text" name="weight" value={foodItem.weight} onChange={handleChange} />
        <input type="text" name="description" value={foodItem.description} onChange={handleChange} />
        <select name="category" value={foodItem.category} onChange={handleChange}>
          <option value="Soppa">Soppa</option>
          
          <option value="Frukt">Frukt</option>
            <option value="Grönsaker">Grönsaker</option>
            <option value="Kött">Kött</option>
            <option value="Fisk">Fisk</option>
            <option value="Mejeri">Mejeri</option>
            <option value="Bröd">Bröd</option>
            <option value="Annat">Annat</option>
        </select>
        <input type="date" name="ExpirationDate" value={foodItem.ExpirationDate} onChange={handleChange} />
        <button type="submit">Lägg till matvara</button>
      </form>
    );
  }
  
  export default FoodForm;