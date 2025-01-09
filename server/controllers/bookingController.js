const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/AppError');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // get the current booking tour
    console.log(process.env.CLIENT_URL);
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
    const today = new Date();
    const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    let currentMonth = await Booking.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: firstDayCurrentMonth,
                    $lt: today
                }
            }
        },
        {
            $addFields: {
                dayOfMonth: { $dayOfMonth: "$createdAt" }
            }
        },
        {
            $addFields: {
                dayGroup: {
                    $switch: {
                        branches: [
                            { case: { $lte: ["$dayOfMonth", 7] }, then: 7 },
                            { case: { $and: [{ $gt: ["$dayOfMonth", 7] }, { $lte: ["$dayOfMonth", 14] }] }, then: 14 },
                            { case: { $and: [{ $gt: ["$dayOfMonth", 14] }, { $lte: ["$dayOfMonth", 21] }] }, then: 21 },
                            { case: { $and: [{ $gt: ["$dayOfMonth", 21] }, { $lte: ["$dayOfMonth", 28] }] }, then: 28 },
                            { case: { $gt: ["$dayOfMonth", 28] }, then: "other" }
                        ],
                    }
                }
            }
        },
        {
            $group: {
                _id: "$dayGroup",
                totalMoney: { $sum: "$price" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    let lastMonth = await Booking.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: firstDayLastMonth,
                    $lt: lastDayLastMonth
                }
            }
        },
        {
            $addFields: {
                dayOfMonth: { $dayOfMonth: "$createdAt" }
            }
        },
        {
            $addFields: {
                dayGroup: {
                    $switch: {
                        branches: [
                            { case: { $lte: ["$dayOfMonth", 7] }, then: 7 },
                            { case: { $and: [{ $gt: ["$dayOfMonth", 7] }, { $lte: ["$dayOfMonth", 14] }] }, then: 14 },
                            { case: { $and: [{ $gt: ["$dayOfMonth", 14] }, { $lte: ["$dayOfMonth", 21] }] }, then: 21 },
                            { case: { $and: [{ $gt: ["$dayOfMonth", 21] }, { $lte: ["$dayOfMonth", 28] }] }, then: 28 },
                            { case: { $gt: ["$dayOfMonth", 28] }, then: "other" }
                        ],
                    }
                }
            }
        },
        {
            $group: {
                _id: "$dayGroup",
                totalMoney: { $sum: "$price" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const allGroup = [7, 14, 21, 28, "other"];

    function fillMissingGroups(allGroup, month) {
        // Convert the month array into a map for easier lookup
        const monthMap = new Map(month.map(item => [item._id, item]));

        // Iterate over allGroup to check for missing groups
        allGroup.forEach(group => {
            // If a group is missing, add it with totalMoney: 0
            if (!monthMap.has(group)) {
                monthMap.set(group, { _id: group, totalMoney: 0 });
            }
        });

        // Convert the map back into an array
        return Array.from(monthMap.values());
    }

    // Apply the function
    currentMonth = fillMissingGroups(allGroup, currentMonth);
    lastMonth = fillMissingGroups(allGroup, lastMonth);

    res.status(200).json({
        status: 'success',
        data: {
            currentMonth,
            lastMonth
        }
    })
})

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleleBooking = factory.deleteOne(Booking);
exports.getCompareMonthly = factory.getCompareMonthly(Booking);