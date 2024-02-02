const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
     apiKey: { type: String },
     apiKeyExpiresAt: { type: Date }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) 
        return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    });

userSchema.methods.comparePassword = async function(plaintext) {
    return await bcrypt.compare(plaintext, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;