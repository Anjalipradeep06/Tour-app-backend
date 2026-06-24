export const bookingConfirmedEmail = (tour, booking) => ({
  subject: `🎉 Booking Confirmed - ${tour.title}`,
  html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Booking Confirmed</title>
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

  <!-- Success Banner -->
  <tr>
    <td align="center" style="padding:40px 30px 20px;">
      <div style="
        width:80px;
        height:80px;
        border-radius:50%;
        background:#dcfce7;
        line-height:80px;
        font-size:40px;">
        🎉
      </div>

      <h2 style="margin-top:20px;color:#111827;">
        Booking Confirmed!
      </h2>

      <p style="
        color:#6b7280;
        max-width:500px;
        margin:auto;
        line-height:1.7;">
        Thank you for choosing Meridian.
        Your reservation has been successfully confirmed.
        We can't wait to make your trip unforgettable.
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
              Booking Summary
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
              background:#dcfce7;
              color:#166534;
              padding:6px 12px;
              border-radius:999px;
              font-size:12px;
              font-weight:600;">
              CONFIRMED
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