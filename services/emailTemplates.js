export const bookingUpdatedEmail = (tour, booking) => ({
  subject: `✏️ Booking Updated - ${tour.title}`,
  html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Booking Updated</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr>
    <td align="center"
      style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:40px 20px;">

      <h1 style="margin:0;color:#ffffff;font-size:32px;">
        MERIDIAN
      </h1>

      <p style="color:#dbeafe;margin-top:10px;font-size:16px;">
        Your Journey Begins Here
      </p>
    </td>
  </tr>

  <!-- Info Banner -->
  <tr>
    <td align="center" style="padding:40px 30px 20px;">
      <div style="
        width:80px;
        height:80px;
        border-radius:50%;
        background:#dbeafe;
        line-height:80px;
        font-size:40px;">
        ✏️
      </div>

      <h2 style="margin-top:20px;color:#111827;">
        Booking Updated!
      </h2>

      <p style="
        color:#6b7280;
        max-width:500px;
        margin:auto;
        line-height:1.7;">
        Your booking details have been successfully updated.
        Please review the changes below.
      </p>
    </td>
  </tr>

  <!-- Booking Details Card -->
  <tr>
    <td style="padding:20px 30px;">
      <table width="100%"
        style="
          background:#f8fafc;
          border:1px solid #e5e7eb;
          border-radius:12px;
          padding:20px;">

        <tr>
          <td colspan="2">
            <h3 style="margin-top:0;color:#111827;">
              Updated Booking Summary
            </h3>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Tour
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${tour.title}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Travel Date
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${new Date(booking.bookingDate).toLocaleDateString()}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Guests
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${booking.participants}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Payment Method
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;text-transform:uppercase;">
            ${booking.paymentMethod}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Booking Status
          </td>
          <td style="padding:10px 0;">
            <span style="
              background:#dbeafe;
              color:#1e40af;
              padding:6px 12px;
              border-radius:999px;
              font-size:12px;
              font-weight:600;
              text-transform:uppercase;">
              ${booking.status}
            </span>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Total Amount
          </td>
          <td style="
            padding:10px 0;
            color:#2563eb;
            font-size:22px;
            font-weight:700;">
            ₹${booking.totalAmount}
          </td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td align="center" style="padding:20px 30px 40px;">

      <a href="${process.env.CLIENT_URL}/bookings/${booking._id}"
      style="
        display:inline-block;
        background:#2563eb;
        color:#ffffff;
        text-decoration:none;
        padding:14px 28px;
        border-radius:8px;
        font-weight:600;">
        View Booking
      </a>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="
      background:#f8fafc;
      padding:25px;
      text-align:center;
      border-top:1px solid #e5e7eb;">

      <p style="margin:0;color:#6b7280;font-size:14px;">
        Thank you for choosing Meridian Travel.
      </p>

      <p style="
        margin-top:10px;
        color:#9ca3af;
        font-size:12px;">
        © 2026 Meridian. All Rights Reserved.
      </p>

    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
});

export const bookingCancelledEmail = (tour, booking) => ({
  subject: `❌ Booking Cancelled - ${tour.title}`,
  html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Booking Cancelled</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr>
    <td align="center"
      style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:40px 20px;">

      <h1 style="margin:0;color:#ffffff;font-size:32px;">
        MERIDIAN
      </h1>

      <p style="color:#dbeafe;margin-top:10px;font-size:16px;">
        Your Journey Begins Here
      </p>
    </td>
  </tr>

  <!-- Cancelled Banner -->
  <tr>
    <td align="center" style="padding:40px 30px 20px;">
      <div style="
        width:80px;
        height:80px;
        border-radius:50%;
        background:#fee2e2;
        line-height:80px;
        font-size:40px;">
        ❌
      </div>

      <h2 style="margin-top:20px;color:#111827;">
        Booking Cancelled
      </h2>

      <p style="
        color:#6b7280;
        max-width:500px;
        margin:auto;
        line-height:1.7;">
        Your booking has been cancelled as requested.
        If this wasn't you, please contact our support team right away.
      </p>
    </td>
  </tr>

  <!-- Booking Details Card -->
  <tr>
    <td style="padding:20px 30px;">
      <table width="100%"
        style="
          background:#f8fafc;
          border:1px solid #e5e7eb;
          border-radius:12px;
          padding:20px;">

        <tr>
          <td colspan="2">
            <h3 style="margin-top:0;color:#111827;">
              Cancelled Booking Details
            </h3>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Tour
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${tour.title}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Travel Date
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${new Date(booking.bookingDate).toLocaleDateString()}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Guests
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${booking.participants}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Booking Status
          </td>
          <td style="padding:10px 0;">
            <span style="
              background:#fee2e2;
              color:#991b1b;
              padding:6px 12px;
              border-radius:999px;
              font-size:12px;
              font-weight:600;">
              CANCELLED
            </span>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Total Amount
          </td>
          <td style="
            padding:10px 0;
            color:#2563eb;
            font-size:22px;
            font-weight:700;">
            ₹${booking.totalAmount}
          </td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td align="center" style="padding:20px 30px 40px;">

      <a href="${process.env.CLIENT_URL}/tours"
      style="
        display:inline-block;
        background:#2563eb;
        color:#ffffff;
        text-decoration:none;
        padding:14px 28px;
        border-radius:8px;
        font-weight:600;">
        Browse Other Tours
      </a>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="
      background:#f8fafc;
      padding:25px;
      text-align:center;
      border-top:1px solid #e5e7eb;">

      <p style="margin:0;color:#6b7280;font-size:14px;">
        We hope to see you again soon at Meridian Travel.
      </p>

      <p style="
        margin-top:10px;
        color:#9ca3af;
        font-size:12px;">
        © 2026 Meridian. All Rights Reserved.
      </p>

    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
});

export const paymentCompletedEmail = (tour, booking) => ({
  subject: `💳 Payment Received - ${tour.title}`,
  html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Payment Received</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr>
    <td align="center"
      style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:40px 20px;">

      <h1 style="margin:0;color:#ffffff;font-size:32px;">
        MERIDIAN
      </h1>

      <p style="color:#dbeafe;margin-top:10px;font-size:16px;">
        Your Journey Begins Here
      </p>
    </td>
  </tr>

  <!-- Payment Banner -->
  <tr>
    <td align="center" style="padding:40px 30px 20px;">
      <div style="
        width:80px;
        height:80px;
        border-radius:50%;
        background:#dcfce7;
        line-height:80px;
        font-size:40px;">
        💳
      </div>

      <h2 style="margin-top:20px;color:#111827;">
        Payment Received!
      </h2>

      <p style="
        color:#6b7280;
        max-width:500px;
        margin:auto;
        line-height:1.7;">
        We've successfully received your payment.
        Your booking is now fully confirmed and paid.
      </p>
    </td>
  </tr>

  <!-- Booking Details Card -->
  <tr>
    <td style="padding:20px 30px;">
      <table width="100%"
        style="
          background:#f8fafc;
          border:1px solid #e5e7eb;
          border-radius:12px;
          padding:20px;">

        <tr>
          <td colspan="2">
            <h3 style="margin-top:0;color:#111827;">
              Payment Summary
            </h3>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Tour
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${tour.title}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Travel Date
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${new Date(booking.bookingDate).toLocaleDateString()}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Payment Method
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;text-transform:uppercase;">
            ${booking.paymentMethod}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Payment Status
          </td>
          <td style="padding:10px 0;">
            <span style="
              background:#dcfce7;
              color:#166534;
              padding:6px 12px;
              border-radius:999px;
              font-size:12px;
              font-weight:600;">
              PAID
            </span>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Amount Paid
          </td>
          <td style="
            padding:10px 0;
            color:#2563eb;
            font-size:22px;
            font-weight:700;">
            ₹${booking.totalAmount}
          </td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td align="center" style="padding:20px 30px 40px;">

      <a href="${process.env.CLIENT_URL}/bookings/${booking._id}"
      style="
        display:inline-block;
        background:#2563eb;
        color:#ffffff;
        text-decoration:none;
        padding:14px 28px;
        border-radius:8px;
        font-weight:600;">
        View Booking
      </a>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="
      background:#f8fafc;
      padding:25px;
      text-align:center;
      border-top:1px solid #e5e7eb;">

      <p style="margin:0;color:#6b7280;font-size:14px;">
        Thank you for choosing Meridian Travel.
      </p>

      <p style="
        margin-top:10px;
        color:#9ca3af;
        font-size:12px;">
        © 2026 Meridian. All Rights Reserved.
      </p>

    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
});

export const bookingCompletedEmail = (tour, booking) => ({
  subject: `🎉 Trip Completed - ${tour.title}`,
  html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Trip Completed</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr>
    <td align="center"
      style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:40px 20px;">

      <h1 style="margin:0;color:#ffffff;font-size:32px;">
        MERIDIAN
      </h1>

      <p style="color:#dbeafe;margin-top:10px;font-size:16px;">
        Your Journey Begins Here
      </p>
    </td>
  </tr>

  <!-- Completed Banner -->
  <tr>
    <td align="center" style="padding:40px 30px 20px;">
      <div style="
        width:80px;
        height:80px;
        border-radius:50%;
        background:#fef3c7;
        line-height:80px;
        font-size:40px;">
        🎉
      </div>

      <h2 style="margin-top:20px;color:#111827;">
        Trip Completed!
      </h2>

      <p style="
        color:#6b7280;
        max-width:500px;
        margin:auto;
        line-height:1.7;">
        We hope you had an amazing time with us.
        Thank you for travelling with Meridian — we'd love to host you again.
      </p>
    </td>
  </tr>

  <!-- Booking Details Card -->
  <tr>
    <td style="padding:20px 30px;">
      <table width="100%"
        style="
          background:#f8fafc;
          border:1px solid #e5e7eb;
          border-radius:12px;
          padding:20px;">

        <tr>
          <td colspan="2">
            <h3 style="margin-top:0;color:#111827;">
              Trip Summary
            </h3>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Tour
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${tour.title}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Travel Date
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${new Date(booking.bookingDate).toLocaleDateString()}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Guests
          </td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">
            ${booking.participants}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#6b7280;">
            Trip Status
          </td>
          <td style="padding:10px 0;">
            <span style="
              background:#fef3c7;
              color:#92400e;
              padding:6px 12px;
              border-radius:999px;
              font-size:12px;
              font-weight:600;">
              COMPLETED
            </span>
          </td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td align="center" style="padding:20px 30px 40px;">

      <a href="${process.env.CLIENT_URL}/tours"
      style="
        display:inline-block;
        background:#2563eb;
        color:#ffffff;
        text-decoration:none;
        padding:14px 28px;
        border-radius:8px;
        font-weight:600;">
        Explore More Tours
      </a>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="
      background:#f8fafc;
      padding:25px;
      text-align:center;
      border-top:1px solid #e5e7eb;">

      <p style="margin:0;color:#6b7280;font-size:14px;">
        Thank you for choosing Meridian Travel.
      </p>

      <p style="
        margin-top:10px;
        color:#9ca3af;
        font-size:12px;">
        © 2026 Meridian. All Rights Reserved.
      </p>

    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
});