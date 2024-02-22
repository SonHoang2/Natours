const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/AppError');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync( async (req, res, next) => {
  // get the current booking tour
  const tour = await Tour.findById(req.params.tourId);

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${process.env.BASEURL}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${process.env.BASEURL}/tour/${tour.slug}`,
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
            images: ["https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/398663733_1549813845823451_1387334711463430120_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeHmd8uVeUuAAn3_JWcqcI6lgznWn4Ehq06DOdafgSGrTpxVMelQfCP_0l-SMcTIJ2JLA9uFa2dZwr1xX_Vn7Z8v&_nc_ohc=DcQK5zoiQD8AX_n9z2e&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfDwx7qa8EsrakxsDf3aHZzywekO-gjgoG_TXjLgrz2wMg&oe=65D537E2"]
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
  console.log( tour, user, price );
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
  const bookings = await Booking.find({user: req.user.id});

  const tourIDs = bookings.map(booking => booking.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs }});
  
  console.log(tours);
  res.status(200).json({
    status: 'success',
    tours
  })
})


exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleleBooking = factory.deleteOne(Booking);