const mongoose = require('mongoose');
const beerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['lager', 'ale', 'stout','pilsner', 'ipa', 'other'],
        default: 'other',
    },
    abv: {
        type: Number,
        required: true,
        min: 0,
        max: 20,
    },
    description: {
        type: String,
        required: true,
        maxlength: 300,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
        user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                
            },
    
});
const Beer = mongoose.model("Beer", beerSchema);
module.exports = mongoose.models.Beer || mongoose.model("Beer", beerSchema);