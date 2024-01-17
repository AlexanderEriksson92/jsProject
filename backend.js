const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/FoodDB', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  // Start the server
  const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    


var Food = require('./Food');

// Post 
app.post('/food', (req, res) => {
  const newFood = new Food({
    name: req.body.name,
    price: req.body.price,
    weight: req.body.weight,
    description: req.body.description,
    category: req.body.category,
    ExpirationDate: req.body.ExpirqationDate,
    dateAdded: req.body.dateAdded
  });
  newFood.save().then(food => res.json(food));
});

// Get
app.get('/food', (req, res) => {
  Food.find().then(food => res.json(food));
});

// Get by id
app.get('/food/:id', (req, res) => {
  Food.findById(req.params.id).then(food => res.json(food));
});

// Update
app.put('/food/:id', async (req, res) => {
  try {
    const updateFood = await Food.findById(req.params.id);
    updateFood.name = req.body.name;
    updateFood.price = req.body.price;
    updateFood.description = req.body.description;
    updateFood.category = req.body.category;
    updateFood.ExpirationDate = req.body.ExpirationDate;
    updateFood.dateAdded = req.body.dateAdded;
    const food = await updateFood.save();
    res.json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  });