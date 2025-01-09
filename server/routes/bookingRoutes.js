import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as bookingController from '../controllers/bookingController.js';
const router = Router();

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
    .delete(bookingController.deleteBooking);

router
    .route('/comparison/last-current-month')
    .get(bookingController.getCompareMonthly)

router
    .route('/comparison/last-current-month/detail')
    .get(bookingController.getCompareMonthlyDetail)

export default router;