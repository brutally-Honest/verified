const _ = require("lodash");
const Payment = require("../models/payment-model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentsCltr = {};

paymentsCltr.create = async (req, res) => {
  console.log("api called");
  const body = _.pick(req.body, [
    "email",
    "name",
    "duration",
    "id",
    "group",
    "amount",
    "phone",
    "product_description",
    "product_name",
  ]);
  // console.log(body);
  const lineItems = {
    price_data: {
      currency: "inr",
      product_data: {
        name: body.product_name,
        description: body.product_description,
      },
      unit_amount: body.amount * 100,
      recurring: {
        interval: body.duration,
      },
    },
    quantity: 1,
  };
  try {
    let customer;

    const existingCustomers = await stripe.customers.list({
      email: body.email,
      limit: 1,
    });
    // console.log(existingCustomers);

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];

      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      });

      // console.log(subscriptions,'Active subscriptions of customer');

      if (subscriptions.data.length > 0) {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: customer.id,
          return_url: process.env.RETURN_URL,
        });
        return res.json({ redirectUrl: stripeSession.url });
      }
    } else {
      customer = await stripe.customers.create({
        email: body.email,
        metadata: {
          userId: body.id,
          groupId:body.group
        },
        name: body.name,
        phone: body.phone,
      });
      console.log(customer, "New Customer Created");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      line_items: [lineItems],
      billing_address_collection: "auto",
      customer: customer.id,
    });

    console.log("Checkout Session created!");
    res.json({ id: session.id });
  } catch (e) {
    console.log(e);
  }
};
paymentsCltr.all = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (e) {
    res.status(500).json(e);
  }
};
paymentsCltr.myPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ payer: req.params.id });
    res.json(payments);
  } catch (e) {
    // res.status(500).json(e);
    next(e)
  }
};


module.exports = paymentsCltr;
