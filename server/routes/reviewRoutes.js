import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import { getMyReviews, getGroupReviews, getReviewsByRating, getAllReviews, setTourUserIds, createReview, getReview, updateReview, deleteReview, getCompareMonthly } from '../controllers/reviewController.js';

// allow access params from other router
const router = Router({ mergeParams: true });

router.use(protect);

router.get("/me", getMyReviews)

router.get("/group", getGroupReviews)

router.get("/ratings/:rating", getReviewsByRating)

router
    .route('/')
    .get(getAllReviews)
    .post(
        restrictTo('user'),
        setTourUserIds,
        createReview
    )

router.route('/:id')
    .get(getReview)
    .patch(
        restrictTo('user', 'admin'),
        updateReview
    )
    .delete(
        restrictTo('user', 'admin'),
        deleteReview
    )

router
    .route('/comparison/last-current-month')
    .get(
        protect,
        restrictTo('admin'),
        getCompareMonthly
    )

export default router;