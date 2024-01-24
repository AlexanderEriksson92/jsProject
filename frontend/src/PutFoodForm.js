import React, { useState } from 'react';

import './FoodForm.css'
import e from 'cors';
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
const [message, setMessage] = useState('');
const [error, setError] = useState('');
  const handleChange = (e) => {
    setFoodItem({ ...foodItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodItem.name || !foodItem.price || !foodItem.weight || !foodItem.description || !foodItem.category || !foodItem.ExpirationDate) {
      setError('Alla fält måste vara ifyllda');
      return;
    }
    setError('');
    const date = new Date().toISOString();
    const foodItemAndDate = { ...foodItem, dateAdded: date };
    try {
      const response = await fetch('http://localhost:5000/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodItemAndDate)

      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage('Matvara tillagd!');

      setFoodItem({
        id: '',
        name: '',
        price: '',
        weight: '',
        description: '',
        category: '',
        ExpirationDate: '',
        dateAdded: ''
      });
     

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='food-form'>
      <label htmlFor="name">Name: </label>
      <input type="text" name="name" value={foodItem.name} onChange={handleChange} />
      <label htmlFor="price">Price: </label>
      <input type="number" name="price" value={foodItem.price} onChange={handleChange} />
      <label htmlFor="weight">Weight: </label>
      <input type="text" name="weight" value={foodItem.weight} onChange={handleChange} />
      <label htmlFor="description">Description: </label>
      <input type="text" name="description" value={foodItem.description} onChange={handleChange} />
      <label htmlFor="category">Category: </label>
      <select name="category" value={foodItem.category} onChange={handleChange}>
        <option value="Dryck">Dryck</option>
        <option value="Soppa">Soppa</option>
        <option value="Frukt">Frukt</option>
        <option value="Grönsaker">Grönsaker</option>
        <option value="Kött">Kött</option>
        <option value="Fisk">Fisk</option>
        <option value="Mejeri">Mejeri</option>
        <option value="Bröd">Bröd</option>
        <option value="Annat">Annat</option>
      </select>
      <label htmlFor="ExpirationDate">Expiration Date</label>
      <input type="date" name="ExpirationDate" value={foodItem.ExpirationDate} onChange={handleChange} />
     {message && <div className='alert message-alert'>{message}</div>}
      {error && <div className='alert error-alert'>{error}</div>} 
     <button type="submit">Lägg till matvara</button>
    </form>

  );
}

export default FoodForm;