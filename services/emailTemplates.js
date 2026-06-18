export const bookingConfirmedEmail = (tour, booking) => ({
  subject: "🎉 Booking Confirmed",
  html: `
    <h2>Booking Confirmed 🎉</h2>
    <p>Your booking has been confirmed.</p>

    <ul>
      <li><strong>Tour:</strong> ${tour.title}</li>
      <li><strong>Date:</strong> ${new Date(
        booking.bookingDate
      ).toLocaleDateString()}</li>
      <li><strong>Participants:</strong> ${booking.participants}</li>
      <li><strong>Total Amount:</strong> ₹${booking.totalAmount}</li>
    </ul>

    <p>We look forward to hosting you!</p>
  `,
});

export const bookingUpdatedEmail = (tour, booking) => ({
  subject: "✏️ Booking Updated",
  html: `
    <h2>Booking Updated ✏️</h2>

    <p>Your booking details have been updated.</p>

    <ul>
      <li><strong>Tour:</strong> ${tour.title}</li>
      <li><strong>Date:</strong> ${new Date(
        booking.bookingDate
      ).toLocaleDateString()}</li>
      <li><strong>Participants:</strong> ${booking.participants}</li>
      <li><strong>Total Amount:</strong> ₹${booking.totalAmount}</li>
    </ul>
  `,
});

export const bookingCancelledEmail = (tour, booking) => ({
  subject: "❌ Booking Cancelled",
  html: `
    <h2>Booking Cancelled ❌</h2>

    <p>Your booking has been cancelled successfully.</p>

    <ul>
      <li><strong>Tour:</strong> ${tour.title}</li>
      <li><strong>Date:</strong> ${new Date(
        booking.bookingDate
      ).toLocaleDateString()}</li>
    </ul>
  `,
});

export const paymentCompletedEmail = (tour, booking) => ({
  subject: "💳 Payment Successful",
  html: `
    <h2>Payment Successful 💳</h2>

    <p>We have received your payment.</p>

    <ul>
      <li><strong>Tour:</strong> ${tour.title}</li>
      <li><strong>Amount:</strong> ₹${booking.totalAmount}</li>
      <li><strong>Payment Method:</strong> ${booking.paymentMethod}</li>
    </ul>
  `,
});

export const bookingCompletedEmail = (tour) => ({
  subject: "🎉 Trip Completed",
  html: `
    <h2>Thank You for Travelling with Us 🎉</h2>

    <p>We hope you enjoyed your <strong>${tour.title}</strong> experience.</p>

    <p>We would love to hear your feedback!</p>
  `,
});