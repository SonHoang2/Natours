import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const tourSchema = new Schema(
    {
        name: {
            type: String,
            require: [true, 'a tour must have a name'],
            unique: true,
            trim: true,
            maxLength: [40, 'A tour must have less or equal to 40 characters'],
            minLength: [10, 'A tour must have more or equal to 10 characters'],
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            require: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10) / 10
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            require: [true, 'a tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price
                },
                message: 'Discount price ({VALUE}) should be below regular price'
            }
        },
        summary: {
            type: String,
            trim: true,
            require: [true, 'A tour must have a description']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            // default: "tour-1-cover.jpg"
            require: [true, 'A tour must have a cover image']
        },
        images: [String],
        // images: {
        //   type: Array,
        //   default: ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
        // },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        },
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        guides: [
            {
                type: Schema.ObjectId,
                ref: 'User'
            }
        ],
        active: {
            type: Boolean,
            default: true,
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
});

// virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

// if name tour is updated, slug will be updated too
tourSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update.name) {
        update.slug = slugify(update.name, { lower: true });
        this.setUpdate(update);
    }
    next();
})

// run before .save() and .create()
tourSchema.pre('save', function (next) {
    console.log("hello from middleware");

    this.slug = slugify(this.name, { lower: true })
    next();
})

tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
})

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guides",
        select: "-__v -passwordChangedAt"
    });
    next();
})

// tourSchema.pre('aggregate', function(next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true }}});
//     console.log(this.pipeline());
//     next()
// })

const Tour = model('Tour', tourSchema);

export default Tour