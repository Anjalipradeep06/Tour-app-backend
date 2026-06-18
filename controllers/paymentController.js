import Stripe from "stripe";
import Booking from "../models/Booking.js";
import { sendEmail } from "../services/emailService.js";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createStripeSession = async (req, res) => {
  try {
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

      success_url: `${process.env.CLIENT_URL}/payment-success/${booking._id}`,

      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified",
      });
    }

    booking.paymentStatus = "paid";

    await booking.save();

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

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createStripeSession,
  verifyStripePayment,
};