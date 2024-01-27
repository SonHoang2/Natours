const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            require: [true, 'Review can not be empty!']
        },
        rating: {
            type: Number,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0']
        },
        createAt: {
            type: Date,
            default: Date.now()
        },
        Tour: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Tour',
                require: [true, 'Review must belong to a tour.']
            }
        ],
        User: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                require: [true, 'Review must belong to a user.']
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
