import multer from 'multer';
import sharp from 'sharp';
import AppError from '../utils/AppError.js';
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';
import APIFeatures from '../utils/apiFeatures.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError("Not an image! Please upload only images.", 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

export const uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

export const resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files) return next();
    if (!req.files.imageCover || !req.files.images) return next();
    // Cover image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`images/tours/${req.body.imageCover}`)
    // Images
    req.body.images = await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`images/tours/${filename}`)

            return filename;
        })
    )
    console.log(req.files);
    console.log(req.body.images);
    next();
})

export const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

export const getAllTours = factory.getAll(Tour);
export const getTour = factory.getOne(Tour, { path: "reviews" });
export const createTour = factory.createOne(Tour);
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);
export const getCompareMonthly = factory.getCompareMonthly(Tour);

export const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
        // {
        //   $match: { _id: { $ne: 'EASY' } }
        // }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});

export const getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitude and longtitude in the format lat, lng',
                400
            )
        )
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
})

export const getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitude and longtitude in the format lat, lng',
                400
            )
        )
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    // convert string to number
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: "distance",
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            distances
        }
    });
})

export const searchTour = catchAsync(async (req, res, next) => {
    const tours = await Tour
        .find({ name: { $regex: req.params.name, $options: 'i' } })
        .limit(5)
        .select('name slug imageCover');

    console.log(tours);

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
})

export const getOneBySlug = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug });

    if (!tour) {
        return next(new AppError('No tour found with that name', 404));
    }

    if (!tour.active) {
        return next(new AppError('Tour was deleted', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
})

export const getAllActiveTours = catchAsync(async (req, res, next) => {
    const tours = new APIFeatures(Tour.find({ active: true }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const doc = await tours.query;

    const total = await Tour.countDocuments({ active: true });

    res.status(200).json({
        status: 'success',
        results: doc.length,
        total: total,
        data: {
            doc
        }
    });
})
