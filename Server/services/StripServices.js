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

    if (!priceMap[plan] || !priceMap[plan][billingCycle]) {
      return res.status(400).json({ error: "Invalid plan or billing cycle" });
    }

    const priceId = priceMap[plan][billingCycle];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],

      metadata: {
        userId: req.user?.id,
        plan,
        billingCycle,
      },

      expand: ["subscription"],

      success_url: `${process.env.CLIENT_URL}/billing/success`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    return res.status(500).json({ error: "Stripe session failed" });
  }
};

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("Missing STRIPE_WEBHOOK_SECRET");
    return res.sendStatus(500);
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("Webhook signature error:", err.message);
    return res.sendStatus(400);
  }

  console.log("Stripe Event:", event.type);

  try {
    if (event.type === "customer.subscription.created") {
      const subscription = event.data.object;

      const { metadata } = subscription;

      const company = await Company.findOne({
        userId: metadata.userId,
      });

      if (!company) return res.sendStatus(200);

      const startDate = new Date();

      const endDate = new Date(startDate);
      if (metadata.billingCycle === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      company.subscription = {
        plan: metadata.plan,
        status: "ACTIVE",
        billingCycle: metadata.billingCycle,

        startDate,
        endDate,

        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,

        paymentId: null,
      };

      company.limits.maxJobs =
        metadata.plan === "PRO" ? 9999 : metadata.plan === "BASIC" ? 15 : 3;

      await company.save();

      console.log("Subscription Created");
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;

      const company = await Company.findOne({
        "subscription.stripeSubscriptionId": invoice.subscription,
      });

      if (!company) return res.sendStatus(200);

      const currentEnd = company.subscription?.endDate
        ? new Date(company.subscription.endDate)
        : new Date();

      const newEndDate = new Date(currentEnd);

      const cycle = company.subscription.billingCycle || "monthly";

      if (cycle === "yearly") {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      } else {
        newEndDate.setMonth(newEndDate.getMonth() + 1);
      }

      company.subscription.endDate = newEndDate;
      company.subscription.status = "ACTIVE";

      await company.save();

      console.log("Subscription Renewed");
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      const company = await Company.findOne({
        "subscription.stripeSubscriptionId": subscription.id,
      });

      if (!company) return res.sendStatus(200);

      company.subscription.status = "CANCELLED";
      company.subscription.plan = "FREE";
      company.subscription.billingCycle = null;

      company.limits.maxJobs = 3;

      await company.save();

      console.log("Subscription Cancelled");
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;

      const company = await Company.findOne({
        "subscription.stripeSubscriptionId": invoice.subscription,
      });

      if (!company) return res.sendStatus(200);

      company.subscription.status = "PAST_DUE";

      await company.save();

      console.log("Payment Failed");
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Webhook DB Error:", err);
    return res.sendStatus(500);
  }
};
