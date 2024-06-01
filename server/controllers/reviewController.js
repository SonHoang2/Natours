const Review = require('../models/reviewModel');
const catchAsync = require("../utils/catchAsync");
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
	if (!req.body.user) req.body.user = req.user.id;
  
  next();
}

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({user: req.user.id});
  console.log(reviews);
  res.status(200).json({
    status: 'success',
    reviews
  })
})
exports.getAllReviews =factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);