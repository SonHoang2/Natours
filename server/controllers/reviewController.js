const Review = require('../models/reviewModel');
const catchAsync = require("../utils/catchAsync");
const factory = require('./handlerFactory');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
}

exports.getMyReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find({ user: req.user.id });
    console.log(reviews);
    res.status(200).json({
        status: 'success',
        reviews
    })
})

exports.getGroupReviews = catchAsync(async (req, res, next) => {
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
    console.log(reviews);

    res.status(200).json({
        status: 'success',
        total: reviews[0].totalReviews,
        data: {
            ratings: reviews[0].ratings
        }
    })
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);