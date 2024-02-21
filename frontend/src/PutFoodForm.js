import React, { useState } from 'react';
import './FoodForm.css'

function FoodForm() {
  const isLoggedIn = localStorage.getItem('apiKey') !== null;
  const [foodItem, setFoodItem] = useState({
    id: '',
    name: '',
    price: '',
    weight: '',
    description: '',
    category: 'Dryck',
    ExpirationDate: '',
    dateAdded: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

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
    setUploading(true);
    let imageUrl = '';

    if (image) {
      const formData = new FormData();
      formData.append('image', image);

      try {
        const imgResponse = await fetch(`https://api.imgbb.com/1/upload?key=8bcd15382e0ccf4836c2d58cbc158977`, {
          method: 'POST',
          body: formData
        });

        if (!imgResponse.ok) {
          throw new Error(`HTTP error! status: ${imgResponse.status}`);
        }

        const imgData = await imgResponse.json();
        imageUrl = await imgData.data.url;
        console.log(imageUrl);
      }
      catch (error) {
        console.error('Error:', error);
      }
    }
    if (imageUrl) {
      console.log("Bild URL: " + imageUrl);
    }
    
    const date = new Date().toISOString();
    const foodItemAndDate = { ...foodItem, imageUrl: imageUrl, dateAdded: date };
    try {
      const apiKey = localStorage.getItem('apiKey');
      console.log(foodItemAndDate);
      const response = await fetch('http://localhost:5000/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(foodItemAndDate)

      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setMessage('Matvara tillagd!');

      setFoodItem({
        id: '',
        name: '',
        price: '',
        weight: '',
        description: '',
        category: '',
        ExpirationDate: '',
        imageUrl: '',
        dateAdded: ''
      });


    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='food-form'>
       {message && <div className='alert alert-success'>{message}</div>}
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
        <option>Välj</option>
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
      <input type="file" name="image" onChange={handleImageChange} />
      {error && <div className='alert error-alert'>{error}</div>}
      <button type="submit">Lägg till matvara</button>
    </form>
  );
}

export default FoodForm;