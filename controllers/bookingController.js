const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // Get  the currently booked store
    const tour = await Tour.findById(req.params.tourId);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    unit_amount: tour.price * 100,
                    currency: 'inr',
                    product_data: {
                        name: `${tour.name} tour`,
                        description: tour.summary,
                        images: [
                            `https://www.natours.dev/img/tours/${tour.imageCover}`,
                        ],
                    },
                },

                quantity: 1,
            },
        ],
    });

    // Create session as response
    res.status(200).json({
        status: 'success',
        session,
    });
});
