import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as reviewController from '../controllers/reviewController.js';

// allow access params from other router
const router = Router({ mergeParams: true });

router.use(authController.protect);

router.get("/me", reviewController.getMyReviews);

router.get("/group", reviewController.getGroupReviews);

router.get("/ratings/:rating", reviewController.getReviewsByRating);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router.route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    );

router
    .route('/comparison/last-current-month')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        reviewController.getCompareMonthly
    );

export default router;