const catchAsync = require('./../Utils/catchError')
const Tour = require('./../model/tourModel')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.CreateSession = catchAsync(async (request, response, next) => {
    const id = request.params.tourId;
    const tour = await Tour.findById(id);
    // Create a stripe session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${request.protocol}://${request.get('host')}/`,
        cancel_url: `${request.protocol}://${request.get('host')}/`,
        customer_email: request.user.email,
        client_reference_id: id,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: tour.name,
                    },
                    unit_amount: tour.price * 100
                },
                quantity: 1
            }
        ],
        mode: 'payment'
    });

    response.status(200).json({
        status: 'ok',
        session
    })
})