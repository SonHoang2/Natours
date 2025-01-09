import { Router } from 'express';
import { aliasTopTours, getAllTours, getTourStats, getMonthlyPlan, getToursWithin, getDistances, getAllActiveTours, createTour, getTour, uploadTourImages, resizeTourImages, updateTour, deleteTour, getOneBySlug, searchTour, getCompareMonthly } from '../controllers/tourController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import reviewRouter from './reviewRoutes.js';

const router = Router();

router.use('/:tourId/reviews', reviewRouter)

router
    .route('/top-5-cheap')
    .get(
        aliasTopTours,
        getAllTours
    );

router
    .route('/tour-stats')
    .get(getTourStats);

router
    .route('/monthly-plan/:year')
    .get(
        protect,
        restrictTo('admin', 'lead-guide', 'guide'),
        getMonthlyPlan
    );

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin)

router
    .route('/distances/:latlng/unit/:unit')
    .get(getDistances)

router.get('/active', getAllActiveTours)

router
    .route('/')
    .get(
        protect,
        restrictTo('admin'),
        getAllTours
    )
    .post(
        protect,
        restrictTo('admin', 'lead-guide'),
        createTour
    );

router
    .route('/:id')
    .get(getTour)
    .patch(
        protect,
        restrictTo('admin', 'lead-guide'),
        uploadTourImages,
        resizeTourImages,
        updateTour
    )
    .delete(
        protect,
        restrictTo('admin', 'lead-guide'),
        deleteTour,
    );

router
    .route('/slug/:slug')
    .get(getOneBySlug)

router
    .route('/search/:name')
    .get(searchTour)

router
    .route('/comparison/last-current-month')
    .get(
        protect,
        restrictTo('admin'),
        getCompareMonthly
    )

export default router;
