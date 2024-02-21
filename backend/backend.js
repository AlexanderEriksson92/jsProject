const express = require('express');
const mongoose = require('mongoose');
const Food = require('./Food');
const app = express();
app.use(express.json());
const cors = require('cors');
const User = require('./User');
const crypto = require('crypto');
const moment = require('moment');

app.use(cors());
// Anslut till databasen och startar servern
mongoose.connect('mongodb://127.0.0.1:27017/FoodDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Post 
app.post('/food', authenticate, async (req, res) => {
  console.log("req body: ", req.body);
  try {
    // Hitta det högsta id:t och öka med 1
    const highestId = await Food.find().sort('-id').limit(1);
    let newId = 1;
    if (highestId.length > 0) {
      newId = highestId[0].id + 1;
    }
    const dateAdded = moment(req.body.dateAdded).format('YYYY-MM-DD');

    // Skapar nytt objekt med värden från body
    const newFood = new Food({
      id: newId,
      name: req.body.name,
      price: req.body.price,
      weight: req.body.weight,
      description: req.body.description,
      category: req.body.category,
      ExpirationDate: req.body.ExpirationDate,
      imageUrl: req.body.imageUrl,
      dateAdded: dateAdded,
    });
    // Spara den nya matvaran
    const savedFood = await newFood.save();
    res.json(savedFood);
    console.log("saved food: ", savedFood);
  } catch (err) {
    console.error("Error saving food: ", err);
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
    if (isNaN(foodId)) {
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
app.put('/food/:id', authenticate, async (req, res) => {                            // Uppdaterar objekt med ID 
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
      imageUrl: req.body.imageUrl,
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
// Loggar ut och raderar API-nyckel
app.post ('/logout', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
      return res.status(401).json({ message: 'Missing X-API-Key header' });
  }
  try {
    const user = await User.findOne({ apiKey });
    if (!user) {
        return res.status(401).json({ message: 'Invalid API key' });
    }
    user.apiKey = null;
    user.apiKeyExpiresAt = null;
    await user.save();
  }
  catch (err) {
    console.error("Logout error: ", err);
    res.status(500).json({ message: err.message });
  }
});

// Loggar in en användare
app.post('/login', async (req, res) => {
  console.log("Login request received with body:", req.body);
  try {
      const { username, password } = req.body;
      console.log("Username:", username);
      const user = await User.findOne({ username });
      console.log("User found:", user);
      if (!user) {
          return res.status(400).json({ message: 'Användaren finns inte.' });
      }
      const passwordMatch = await user.comparePassword(password);
      console.log("Password match:", passwordMatch);
      if (!passwordMatch) {
          return res.status(400).json({ message: 'Fel lösenord.' });
      }

      // Generera och tilldela API-nyckel
      const apiKey = crypto.randomBytes(20).toString('hex');
      user.apiKeyExpiresAt = new Date(); 
      user.apiKey = apiKey;
      console.log("Generated API key:", apiKey);
      try {
          await user.save();
          console.log("API key saved to database", user);
      } catch (err) {
          console.error("Error saving API key to database:", err);
          res.status(500).json({ message: err.message });
      }

      // Skickar tillbaka API-nyckeln
      res.json({ apiKey });

  } catch (err) {
      console.error("Login error: ", err);
      res.status(500).json({ message: err.message });
  }
});
 
  // Registrerar en användare
  app.post('/register', async (req, res) => {
    console.log("Register request received", req.body);
    try {
      const { username, email, password } = req.body;
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Användarnamn eller e-post finns redan.' });
      }
      const user = new User({ username, email, password });
      await user.save();
      res.json({ message: 'Användare registrerad!' });
    } catch (err) {
      console.error("Register error: ", err);
      res.status(500).json({ message: err.message });
    }
  });

function authenticate(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const anHour = 60 * 60 * 1000;
  if (new Date() - User.apiKeyExpiresAt > anHour) {
    User.apiKey = null;
    User.apiKeyExpiresAt = null;
    User.save();
    return res.status(401).json({ message: 'API-nyckeln har gått ut.' });
  }

  User.findOne({ apiKey }).then(user => {
      if (!user) {
          console.log('Invalid API Key'); // Loggar om nyckeln är ogiltig
          return res.status(401).json({ message: 'Ogiltig API-nyckel.' });
      }
      console.log('API Key validated for user:', user.username); // Loggar användarnamn om nyckeln är giltig
      req.user = user;
      next();
  }).catch(err => {
      console.error('Error during authentication:', err); // Loggar eventuella fel under autentisering
      res.status(500).json({ message: err.message });
  });
}

 
// Raderar ett objekt med ID
app.delete('/food/:id', authenticate, async (req, res) => {
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