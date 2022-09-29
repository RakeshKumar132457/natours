const Tour = require('./../models/tourModel');

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
// FUNCTIONS for TOURS
exports.getAllTours = async (req, res) => {
    /* res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours,
        },
    }); */

    try {
        // BUILD QUERY
        // 1a) Filtering
        const queryObj = { ...req.query };
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
        let query = Tour.find(JSON.parse(queryString));

        /* 
        let query = await Tour.find()
            .where('duration')
            .equals(5)
            .where('difficulty')
            .equals('easy'); 
        */

        // 2) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const allTours = await query;

        res.status(200).json({
            status: 'success',
            results: allTours.length,
            data: {
                tours: allTours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getTour = async (req, res) => {
    /* const id = req.params.id * 1;

    const tour = tours.find((el) => el.id === id);
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour,
            time: req.requestedTime,
        },
    }); */

    try {
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({_id : req.params.id})

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Tour not found!!',
        });
    }
};

exports.createTour = async (req, res) => {
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

    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid Data Sent!!',
        });
    }
};

exports.updateTour = async (req, res) => {
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

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'ID not found!!',
        });
    }
};

exports.deleteTour = async (req, res) => {
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

    try {
        // Don't send any data for delete operations
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.json(404).json({
            status: 'fail',
            message: 'ID not found!!',
        });
    }
};
