const express = require('express');
const mongoose = require('mongoose');
const Food = require('./Food');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
// Anslut till databasen och startar servern
mongoose.connect('mongodb://127.0.0.1:27017/FoodDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
// Post 
app.post('/food', async (req, res) => {
  try {
  // Hitta det högsta id:t och öka med 1
  const highestId = await Food.find().sort('-id').limit(1);
  let newId = 1;
  if (highestId.length > 0) {
    newId = highestId[0].id + 1;
  }
  
  // Skapar nytt objekt med värden från body
  const newFood = new Food({                                        
    id: newId,
    name: req.body.name,
    price: req.body.price,
    weight: req.body.weight,
    description: req.body.description,
    category: req.body.category,
    ExpirationDate: req.body.ExpirationDate,
    dateAdded: req.body.dateAdded
  });
  // Spara den nya matvaran
  await newFood.save();
  res.json(newFood);
} catch (err) {
  res.status(500).json({ message: err.message });
}
});

// Hämtar alla objekt
app.get('/food', (req, res) => {
  Food.find().then(food => res.json(food));
});

// Hämtar ett objekt med ID
app.get('/food/:id', async (req, res) => {
  
  try {
    const foodId = parseInt(req.params.id);
    if (isNaN(foodId)){
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const food = await Food.findOne({ id: foodId });
    if (!food) {
        return res.status(404).send('Food item not foundasd.');
    }
    res.json(food);
  } catch (err) {
    console.error("Error when fetching food:", err);
    res.status(500).json({ message: err.message });
  }
});

// Uppdaterar ett objekt med ID
app.put('/food/:id', async (req, res) => {                            // Uppdaterar objekt med ID 
  try {

    const updateId = parseInt(req.params.id);
    if (isNaN(updateId)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const updateData = {
      name: req.body.name,
      price: req.body.price,
      weight: req.body.weight,
      description: req.body.description,
      category: req.body.category,
      ExpirationDate: req.body.ExpirationDate,
      dateAdded: req.body.dateAdded
    };

     const updateFood = await Food.findOneAndUpdate({ id: updateId }, updateData, { new: true });
      if (!updateFood) {
          return res.status(404).send('Food item not found.');
      }

      res.json(updateFood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  });

  // Raderar ett objekt med ID
  app.delete('/food/:id', async (req, res) => {
    try {
      
      const deleteId = parseInt(req.params.id);
      if (isNaN(deleteId)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      const deletedFood = await Food.findOneAndDelete({ id: deleteId });
      if (!deletedFood) {
          return res.status(404).send('Food item not found.');
      }

      res.send(`Food item with id ${deleteId} has been deleted.`);
  } catch (error) {
      res.status(500).send(error.message);
  }
});