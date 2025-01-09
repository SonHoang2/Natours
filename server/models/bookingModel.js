import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
    tour: {
        type: Schema.ObjectId,
        ref: 'Tour',
        required: [true, "Booking must belong to a Tour!"]
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, "Booking must belong to a User!"]
    },
    price: {
        type: Number,
        required: [true, "Booking must have a price"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
})

bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name imageCover slug'
    })
    next();
})

const Booking = model('Booking', bookingSchema);

export default Booking;