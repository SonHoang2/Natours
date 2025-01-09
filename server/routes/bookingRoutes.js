import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import { getCheckoutSession, createBookingCheckout, getMyTours, getAllBookings, createBooking, getBooking, updateBooking, deleleBooking, getCompareMonthly, getCompareMonthlyDetail } from '../controllers/bookingController.js';
const router = Router();

router.use(protect);

router.get("/checkout-session/:tourId", getCheckoutSession)
router.post("/checkout-session/", createBookingCheckout)
router.get("/my-tours", getMyTours)

router.use(restrictTo('admin', 'lead-guide'));

router
    .route("/")
    .get(getAllBookings)
    .post(createBooking);

router
    .route('/:id')
    .get(getBooking)
    .patch(updateBooking)
    .delete(deleleBooking);

router
    .route('/comparison/last-current-month')
    .get(getCompareMonthly)

router
    .route('/comparison/last-current-month/detail')
    .get(getCompareMonthlyDetail)

export default router;