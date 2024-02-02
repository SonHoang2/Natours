const express = require('express');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

// allow access params from other router
const router = express.Router({ mergeParams: true});

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )

router.route('/:id')
  .get(reviewController.getReview)
	.delete(reviewController.deleteReview)
  .patch(reviewController.updateReview)

module.exports = router;