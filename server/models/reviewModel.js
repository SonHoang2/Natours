import { Schema, model } from "mongoose";
import { findByIdAndUpdate } from './tourModel.js';

const reviewSchema = new Schema(
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
        createdAt: {
            type: Date,
            default: Date.now()
        },
        tour: {
            type: Schema.ObjectId,
            ref: 'Tour',
            require: [true, 'Review must belong to a tour.']
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User',
            require: [true, 'Review must belong to a user.']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name photo"
    }).populate({
        path: "tour",
        select: "name slug imageCover"
    })
    next();
})

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])

    console.log(stats);

    if (stats.length > 0) {
        await findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].nRating
        })
    } else {
        await findByIdAndUpdate(tourId, {
            ratingsAverage: 4.5,
            ratingsQuantity: 0
        })
    }
}

reviewSchema.post('save', function (doc, next) {
    //this point to current review
    this.constructor.calcAverageRatings(this.tour);
    next();
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.clone().findOne();
    next();
})

reviewSchema.post(/^findOneAnd/, async function (doc, next) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
    next();
})


const Review = model('Review', reviewSchema);
export default Review;
