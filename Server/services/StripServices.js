import Stripe from "stripe";
import { Company } from "../model/CompanyModel.js";
import "dotenv/config";

const stripe = new Stripe(process.env.SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { plan, billingCycle } = req.body;

    const priceMap = {
      BASIC: {
        monthly: "price_1TQJgORampXar8B3d9mjMuUc",
        yearly: "price_1TQJngRampXar8B34mgcbyHD",
      },
      PRO: {
        monthly: "price_1TQJz1RampXar8B3mXOf73Fp",
        yearly: "price_1TQJzyRampXar8B3mVAIgRTu",
      },
    };

    if (!priceMap[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const priceId = priceMap[plan][billingCycle];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      metadata: {
        userId: req.user?.id,
        plan,
        billingCycle,
      },

      //client url
      success_url: `${process.env.CLIENT_URL}/billing/success`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });
    console.log(session);

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Stripe session failed" });
  }
};

export const stripeWebhookHandler = async (req, res) => {
  console.log("running...");
  const sig = req.headers["stripe-signature"];

  let event;

  console.log(event);

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("not found STRIPE_WEBHOOK_SECRET");
    return;
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log(" Webhook signature error:", err.message);
    return res.sendStatus(400);
  }

  console.log(" Event:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const { userId, plan, billingCycle } = session.metadata;

        const company = await Company.findOne({ userId });

        if (!company) {
          console.log(" Company not found");
          break;
        }

        const startDate = new Date();
        const endDate = new Date();

        if (billingCycle === "yearly") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }

        company.subscription = {
          plan,
          status: "ACTIVE",
          startDate,
          endDate,
          paymentId: session.payment_intent,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        };

        company.limits.maxJobs =
          plan === "PRO" ? 9999 : plan === "BASIC" ? 15 : 3;

        await company.save();

        console.log(" Subscription Activated");
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;

        const company = await Company.findOne({
          "subscription.stripeSubscriptionId": invoice.subscription,
        });

        if (company) {
          const newEndDate = new Date(company.subscription.endDate);

          newEndDate.setMonth(newEndDate.getMonth() + 1);

          company.subscription.endDate = newEndDate;
          company.subscription.status = "ACTIVE";

          await company.save();

          console.log(" Subscription Renewed");
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        const company = await Company.findOne({
          "subscription.stripeSubscriptionId": subscription.id,
        });

        if (company) {
          company.subscription.status = "CANCELLED";
          company.subscription.plan = "FREE";
          company.limits.maxJobs = 3;

          await company.save();

          console.log(" Subscription Cancelled");
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;

        const company = await Company.findOne({
          "subscription.stripeSubscriptionId": invoice.subscription,
        });

        if (company) {
          company.subscription.status = "EXPIRED";

          await company.save();

          console.log(" Payment Failed");
        }

        break;
      }

      default:
        console.log("Unhandled event:", event.type);
    }
  } catch (err) {
    console.error(" Webhook DB Error:", err);
  }

  res.json({ received: true });
};
