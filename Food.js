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
    ExpirationDate: Date,
    dateAdded: Date
});

const food = mongoose.model('Food', foodSchema);

module.exports = food;