import Stripe from "stripe";
import Booking from "../models/Booking.js";
import { sendEmail } from "../services/emailService.js";
import { paymentCompletedEmail } from "../services/emailTemplates.js";
import { createNotification } from "../utils/notificationHelper.js";

/* ----------------------------------------
   Safe Stripe initialization
-----------------------------------------*/
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      "Stripe is not configured (missing STRIPE_SECRET_KEY)"
    );
  }

  return new Stripe(key);
};

/* ----------------------------------------
   Create Stripe Checkout Session
-----------------------------------------*/
const createStripeSession = async (req, res) => {
  try {
    const stripe = getStripe();

    const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "");

    if (!clientUrl) {
      return res.status(500).json({
        success: false,
        message: "CLIENT_URL is not configured",
      });
    }

    const booking = await Booking.findById(
      req.params.bookingId
    ).populate("tour", "title");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Booking is already paid",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: booking.tour.title,
              description: `Booking for ${booking.participants} participant(s)`,
            },

            unit_amount: Math.round(
              Number(booking.totalAmount) * 100
            ),
          },

          quantity: 1,
        },
      ],

      mode: "payment",

      metadata: {
        bookingId: booking._id.toString(),
      },

      success_url: `${clientUrl}/payment-success/${booking._id}`,
      cancel_url: `${clientUrl}/payment-cancel`,
    });

    return res.status(200).json({
      success: true,
      message: "Stripe session created successfully",
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe session error:", error.message);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create Stripe session",
    });
  }
};

/* ----------------------------------------
   Verify Stripe Payment
-----------------------------------------*/
const verifyStripePayment = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.bookingId
    )
      .populate("tour")
      .populate("user", "email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Already paid? Return success immediately
    if (booking.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        booking,
      });
    }

    booking.paymentStatus = "paid";

    await booking.save();
    await createNotification(
      booking.user._id,
      "Payment Successful 💳",
      `Your payment of ₹${booking.totalAmount} for ${booking.tour.title} has been received successfully.`
    );

    // Send response immediately
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });

    // Background email
    sendEmail({
      to: booking.user.email,
      ...paymentCompletedEmail(booking.tour, booking),
    }).catch((error) => {
      console.error("Email error:", error.message);
    });
  } catch (error) {
    console.error(
      "Verify payment error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Payment verification failed",
    });
  }
};

export {
  createStripeSession,
  verifyStripePayment,
};