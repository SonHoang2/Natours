const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/AppError');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // get the current booking tour
    const tour = await Tour.findById(req.params.tourId);

    // create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${process.env.CLIENT_URL}/?tour=${req.params.tourId
            }&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${process.env.CLIENT_URL}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`${process.env.SERVER_URL}/images/tours/${tour.imageCover}`]
                    }
                },
                quantity: 1
            }
        ],
        mode: 'payment',
    })

    res.status(200).json({
        status: 'success',
        session
    })
})

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    const { tour, user, price } = req.body;
    console.log(tour, user, price);
    if (!tour && !user && !price)
        return next(
            new AppError('Booking Error', 400)
        )

    await Booking.create({ tour, user, price });
    res.status(200).json({
        status: 'success'
    })
})

exports.getMyTours = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user.id });

    res.status(200).json({
        status: 'success',
        bookings
    })
})

exports.getCompareMonthlyDetail = catchAsync(async (req, res, next) => {
    const {firstMonth, secondMonth} = req.params;

    console.log(firstMonth, secondMonth);

    const firstMonthBooking = await Booking.aggregate([
    ]);
    
    res.status(200).json({
        status: 'success',
        data: req.body
    })
})

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleleBooking = factory.deleteOne(Booking);
exports.getCompareMonthly = factory.getCompareMonthly(Booking);