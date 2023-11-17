const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
      const tours = await features.query;
      console.log(req.query);

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'failure',
      message: err
    })
  }
};

exports.getTour = async (req, res) => { 
  try {
    const tour = await Tour.findById(req.params.id);
    console.log(tour);
    res.status(200).json({
      status:'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      message: err
    })
  }
};

exports.createTour = async (req, res) => {
  try {
    console.log(req.body);
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status:'success',
      data: {
        tour: newTour
      }
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failure',
      message: 'invalid data sent!'
    })
  }
};

exports.updateTour = async (req, res) => {
  try {
    console.log(req.params, req.body);
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status:'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err
    })
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status:'success'
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err
    })
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: {$toUpper: '$difficulty'},
          numTours: { $sum: 1},
          numRatings: { $sum: '$ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price'}
        }
      }, 
      {
        $sort: { avgPrice: 1}
      },
      {
        $match: { _id: { $ne: 'EASY' }}
      }
    ])
    res.status(200).json({
      status:'success',
      data: {
        stats
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failure',
      message: err
    })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

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
          _id: { $month: '$startDates'},
          numTourStarts: { $sum: 1}
        }
      },
      {
        $sort: { numTourStarts: -1}
      },
      {
        $limit: 6
      }
    ])

    res.status(200).json({
      status:'success',
      data: {
        plan
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failure',
      message: err
    })
  }
}