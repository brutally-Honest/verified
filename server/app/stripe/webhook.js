const GroupAdmin = require("../models/groupAdmin-model");
const Payment = require("../models/payment-model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_ENDPOINT
    );
    console.log("Webhook verified");
  } catch (e) {
    console.log(e);
    return res.status(400).send(`Webhook Error:${e.message}`);
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;

    // On payment successful, get subscription and customer details
    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.subscription
    );
    const customer = await stripe.customers.retrieve(
      event.data.object.customer
    );

    console.log(subscription, "Subscription", customer, "Customer");

    if (
      invoice.billing_reason === "subscription_create" ||
      invoice.billing_reason === "subscription_cycle" ||
      invoice.billing_reason === "subscription_update"
    ) {
      // DB code to update the database for first subscription payment

      const subscriptionDocument = {
        amount:(subscription.plan.amount)/100,
        payer: customer?.metadata?.userId,
        group:customer.metadata.groupId,
        subscriptionId: event.data.object.subscription,
        endsAt:subscription.current_period_end*1000,
        plan:subscription.plan.interval
      };

      // // Insert the document into the collection
      const result = new Payment(subscriptionDocument);
      await result.save();
      await GroupAdmin.findOneAndUpdate({_id:customer?.metadata?.userId},{$push:{payment:{paymentId:result._id}}})
      console.log(`Subscription payment successful`,result);
    }
  }

  // // For canceled/renewed subscription
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;
    // console.log(event);
    if (subscription.cancel_at_period_end) {
      console.log(`Subscription ${subscription.id} was canceled.`);
      // DB code to update the customer's subscription status in your database
    } else {
      console.log(`Subscription ${subscription.id} was restarted.`);
      // get subscription details and update the DB
    }
  }

  res.status(200).end();
};

module.exports = stripeWebhook;
