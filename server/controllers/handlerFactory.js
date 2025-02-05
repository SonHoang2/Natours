import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import APIFeatures from '../utils/apiFeatures.js';

export const deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    });

export const updateOne = Model =>
    catchAsync(async (req, res, next) => {
        // if avatar is uploaded
        if (req.file) req.body.photo = req.file.filename;

        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    });

export const createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: doc
            }
        });
    });

export const getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    });

export const getAll = Model =>
    catchAsync(async (req, res, next) => {
        // To allow for nested GET reviews on tour
        const { tourId } = req.params;
        let filter = {};
        if (tourId) filter = { tour: tourId };

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const doc = await features.query;

        const total = await Model.countDocuments(filter);

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: doc.length,
            total: total,
            data: {
                doc
            }
        });
    });

export const getCompareMonthly = Model =>
    catchAsync(async (req, res, next) => {
        const thisMonth = new Date().getMonth() + 1;
        const lastMonth = thisMonth - 1;
        const thisYear = new Date().getFullYear();

        const thisMonthTotal = await Model
            .find({
                createdAt: {
                    $gte: new Date(`${thisYear}-${thisMonth}-01`),
                    $lte: new Date(`${thisYear}-${thisMonth}-31`)
                }
            })
            .countDocuments();

        const lastMonthTotal = await Model
            .find({
                createAt: {
                    $gte: new Date(`${thisYear}-${lastMonth}-01`),
                    $lte: new Date(`${thisYear}-${lastMonth}-31`)
                }
            })
            .countDocuments();

        res.status(200).json({
            status: 'success',
            data: {
                thisMonthTotal,
                lastMonthTotal
            }
        });
    });
