const catchAsync = require('./../Utils/catchError')
const AppError = require('./../Utils/appErros')
const Tour = require('./../model/tourModel')
const bookings = require('./../model/bookingModel')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.CreateSession = catchAsync(async (request, response, next) => {
    const id = request.params.tourId;
    const tour = await Tour.findById(id);
    // Create a stripe session
    const dirict_url = `${request.protocol}://${request.get('host')}/api/v1/bookings/susses/?tour=${id}&user=${request.user._id}&price=${tour.price}`
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: dirict_url,
        cancel_url: `${request.protocol}://${request.get('host')}/api/v1/tours/`,
        customer_email: request.user.email,
        client_reference_id: id,
        line_items: [{
            price_data: {
                currency: 'usd', product_data: {
                    name: tour.name,
                }, unit_amount: tour.price * 100,
            }, quantity: 1,
        },],
        mode: 'payment'
    });

    response.status(200).json({
        status: 'ok', session
    })
})

exports.successCheckout = catchAsync(async (request, response, next) => {
    const {tour, user, price} = request.query;
    if (!tour || !user || !price) return next(new AppError('some data lost, try again', 404));

    const Obj = new bookings({
        tour: tour, user: user, price: +price, createdAt: Date.now(), paid: true
    })

    await Obj.save();
    response.status(200).json({
        status: "success", bookDetails: Obj
    })

})