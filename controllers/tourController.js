const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

// FILE OPERATION
/* const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
 

// MIDDLEWARE TOURS
exports.checkID = (req, res, next, val) => {
    const id = req.params.id * 1;
    if (id > tours.length - 1) {
        return res.status(404).json({
            status: 'fail',
            message: 'ID not found!!',
        });
    }
    next();
};

exports.checkBody = (req, res, next) => {
    if (req.body.name == undefined || req.body.price == undefined) {
        res.status(400).json({
            status: 'fail',
            message: 'Bad request',
        });
    }
    next();
}; 
 */

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price, ratingsAverage, summary, difficulty';
    next();
};

// FUNCTIONS for TOURS
exports.getAllTours = catchAsync(async (req, res, next) => {
    /* res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours,
        },
    }); */

    //try {
    // BUILD QUERY
    // 1a) Filtering
    /* const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];

        excludeFields.forEach((el) => delete queryObj[el]); 

        // 1b) Advance Filtering
        // { difficulty: 'easy', duration: { $gte: '5' } } -> Mongo Query
        // { difficulty: 'easy', duration: { gte: '5' } }  -> req.query
        // gte, gt, lte, lt

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        ); 

        // EXECUTE QUERY
        //let query = Tour.find(JSON.parse(queryString));

        
        let query = await Tour.find()
            .where('duration')
            .equals(5)
            .where('difficulty')
            .equals('easy'); 
        

        // 2) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        } 

        // 3) Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        } 

        // 4) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query.skip(skip).limit(limit);
        if (req.query.page) {
            const newTours = await Tour.countDocuments();
            if (skip >= newTours) throw new Error("This page doesn't exist");
        } 
        */

    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();
    const allTours = await features.query;

    res.status(200).json({
        status: 'success',
        results: allTours.length,
        data: {
            tours: allTours,
        },
    });
    /*}  catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    } */
});

exports.getTour = catchAsync(async (req, res, next) => {
    /* const id = req.params.id * 1;

    const tour = tours.find((el) => el.id === id);
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour,
            time: req.requestedTime,
        },
    }); */

    //try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id : req.params.id})

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour,
        },
    });
    /* } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Tour not found!!',
        });
    } */
});

exports.createTour = catchAsync(async (req, res, next) => {
    /* const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                tours: newTour,
            });
        }
    ); */

    //try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
    /* } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid Data Sent!!',
        });
    } */
});

exports.updateTour = catchAsync(async (req, res, next) => {
    // Basic updating logic. Improve upon it.
    /*  const updatedTours = tours.map((el) => {
        if (el.id === id) {
            return (el = req.body);
        } else {
            return el;
        }
    });

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(updatedTours),
        (err) => {
            res.status(200).json({
                status: 'success',
                data: {
                    tour: updatedTours,
                },
            });
        }
    ); */

    //try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
    /* } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'ID not found!!',
        });
    } */
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    /*  const updatedTours = tours.filter((el) => el.id !== id);
    const deletedData = tours.filter((el) => el.id === id);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(updatedTours),
        (err) => {
            res.status(204).json({
                status: 'success',
                data: null,
            });
        }
    ); */

    //try {
    // Don't send any data for delete operations
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
    /* } catch (err) {
        res.json(404).json({
            status: 'fail',
            message: 'ID not found!!',
        });
    } */
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    // try {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
        /* {
                $match: { _id: { $ne: 'EASY' } },
            }, */
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    });
    /* } catch (err) {
        res.json(404).json({
            status: 'fail',
            message: 'ID not found!!',
        });
    } */
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    //try {
    const year = req.param.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    // FIXME : Change the date
                    $gte: new Date(`2021-01-01`),
                    $lte: new Date(`2021-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },

        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numTourStarts: -1 },
        },
        {
            $limit: 12,
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan,
        },
    });
    /*  } catch (err) {
        res.json(404).json({
            status: 'fail',
            message: 'ID not found!!',
        });
    } */
});
