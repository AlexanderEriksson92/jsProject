const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: String,
    price: Number,
    weight: String,
    description: String,
    category: String,
    ExpirationDate: String,
    imageUrl: String,
    dateAdded: String
});

const food = mongoose.model('Food', foodSchema);

module.exports = food;