const express = require('express');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.use(authController.protect);

router.get("/checkout-session/:tourId", bookingController.getCheckoutSession)
router.post("/checkout-session/", bookingController.createBookingCheckout)
router.get("/my-tours", bookingController.getMyTours)

router.use(authController.restrictTo('admin', 'lead-guide'));

router
    .route("/")
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking);

router
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleleBooking);

router
    .route('/comparison/last-current-month')
    .get(bookingController.getCompareMonthly)

router
    .route('/comparison/last-current-month/detail')
    .get(bookingController.getCompareMonthlyDetail)

module.exports = router;