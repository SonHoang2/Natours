import Review from '../models/reviewModel.js';
import catchAsync from "../utils/catchAsync.js";
import * as factory from './handlerFactory.js';
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const setTourUserIds = (req, res, next) => {
    if (!req.body.ttour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
}

export const getMyReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find({ user: req.user.id });
    console.log(reviews);
    res.status(200).json({
        status: 'success',
        reviews
    })
})

export const getGroupReviews = catchAsync(async (req, res, next) => {
    const { tourId } = req.params;

    console.log(tourId);

    const reviews = await Review.aggregate([
        {
            $match: {
                tour: new ObjectId(tourId)
            }
        },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: null,
                totalReviews: { $sum: "$count" },
                ratings: {
                    $push: {
                        rating: "$_id",
                        count: "$count"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalReviews: 1,
                ratings: 1,
            }
        }
    ]);
    
    res.status(200).json({
        status: 'success',
        total: reviews[0].totalReviews,
        data: {
            ratings: reviews[0].ratings
        }
    })
});

export const getReviewsByRating = catchAsync(async (req, res, next) => {
    const { rating, tourId } = req.params;
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)

    const reviews = await Review
        .find({ rating: rating, tour: tourId })
        .skip((page - 1) * limit)
        .limit(limit)

    const total = await Review.countDocuments({ rating: rating, tour: tourId });

    res.status(200).json({
        status: 'success',
        total: total,
        data: {
            doc: reviews
        }
    })
});

export const getAllReviews = factory.getAll(Review);
export const getReview = factory.getOne(Review);
export const createReview = factory.createOne(Review);
export const deleteReview = factory.deleteOne(Review);
export const updateReview = factory.updateOne(Review);
export const getCompareMonthly = factory.getCompareMonthly(Review);