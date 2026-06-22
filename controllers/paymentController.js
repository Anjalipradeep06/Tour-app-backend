import Stripe from "stripe";
import Booking from "../models/Booking.js";
import { sendEmail } from "../services/emailService.js";

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
    ).populate("tour");

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

    const successUrl = `${clientUrl}/payment-success/${booking._id}`;
    const cancelUrl = `${clientUrl}/payment-cancel`;

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

      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Stripe session created successfully",
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Stripe session error:",
      error.message
    );

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
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // IMPORTANT: Return success if already paid
    if (booking.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        booking,
      });
    }

    booking.paymentStatus = "paid";
    await booking.save();

    try {
      await sendEmail({
        to: booking.user.email,
        subject: "Payment Successful 🎉",

        text: `Your payment for "${booking.tour.title}" has been received successfully.

Booking Details:
- Tour: ${booking.tour.title}
- Booking Date: ${new Date(
          booking.bookingDate
        ).toLocaleDateString()}
- Participants: ${booking.participants}
- Total Amount: $${booking.totalAmount}

Thank you for booking with us!`,
      });
    } catch (emailError) {
      console.error(
        "Email error:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      booking,
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