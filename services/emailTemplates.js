/**
 * Grandeur Keys - Premium HTML Email Templates
 * Beautifully styled, Apple-inspired responsive emails
 */

/**
 * Generates the clean HTML Welcome Email layout
 * @param {string} userName - The name of the registered guest
 * @returns {string} Fully responsive HTML content
 */
const getWelcomeEmailHTML = (userName) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Grandeur Keys</title>
    <style>
        /* Modern reset styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Text", Helvetica, Arial, sans-serif; }

        /* Structural Layout */
        .wrapper { width: 100%; table-layout: fixed; background-color: #f5f5f7; padding-bottom: 40px; padding-top: 40px; }
        .main-card { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(0, 0, 0, 0.04); overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02); }
        
        /* Editorial Content Details */
        .header-section { padding: 40px 40px 24px 40px; border-bottom: 1px solid rgba(0,0,0,0.03); text-align: left; }
        .body-section { padding: 40px 40px 48px 40px; }
        .footer-section { padding: 24px 40px; background-color: #f5f5f7; text-align: center; border-top: 1px solid rgba(0, 0, 0, 0.02); }

        /* Typography */
        .brand-logo { font-size: 16px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.01em; text-decoration: none; }
        .title { font-size: 24px; font-weight: 500; color: #1d1d1f; letter-spacing: -0.022em; margin-top: 0; margin-bottom: 24px; line-height: 1.25; }
        .paragraph { font-size: 14px; font-weight: 400; color: #515154; line-height: 1.6; margin-top: 0; margin-bottom: 24px; }
        .salutation { font-size: 16px; font-weight: 600; color: #1d1d1f; margin-bottom: 12px; }
        
        /* Premium Accent CTA Button */
        .cta-button { display: inline-block; background-color: #1d1d1f; color: #ffffff !important; font-size: 13px; font-weight: 500; padding: 12px 24px; border-radius: 980px; text-decoration: none; transition: background-color 0.2s ease; letter-spacing: -0.01em; }
        
        .footer-text { font-size: 11px; color: #86868b; line-height: 1.5; margin: 0; }
        .footer-links { margin-top: 12px; }
        .footer-links a { font-size: 11px; color: #0071e3; text-decoration: none; margin: 0 8px; }
        .footer-links a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td>
                <table class="main-card" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <!-- Premium Brand Header -->
                    <tr>
                        <td class="header-section">
                            <a href="#" class="brand-logo">Grandeur Keys</a>
                        </td>
                    </tr>
                    
                    <!-- Core Welcome Body -->
                    <tr>
                        <td class="body-section">
                            <h1 class="title">Your journey with us<br>begins here.</h1>
                            <p class="salutation">Hello ${userName},</p>
                            <p class="paragraph">
                                Welcome to Grandeur Keys. We are thrilled to have you join our private circle. Our mission is to seamlessly connect you to the world’s most exceptionally designed hotels and secluded resorts.
                            </p>
                            <p class="paragraph">
                                From city skylines to pristine island canopies, your custom profile is now active. Our AI Concierge is available 24/7 to help curate your dynamic itineraries and customize amenities to your precise standards.
                            </p>
                            <div style="margin-top: 36px;">
                                <a href="http://localhost:3000/" class="cta-button">Explore Curated Stays</a>
                            </div>
                        </td>
                    </tr>

                    <!-- Elegant Footer -->
                    <tr>
                        <td class="footer-section">
                            <p class="footer-text">This is an automated welcome email from Grandeur Keys Inc.</p>
                            <p class="footer-text" style="margin-top: 4px;">One Apple Park Way, Cupertino, CA 95014</p>
                            <div class="footer-links">
                                <a href="#">Our Philosophy</a>
                                <a href="#">Privacy Policy</a>
                                <a href="#">Support</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

/**
 * Generates the clean HTML Booking Confirmation Email layout
 * @param {Object} order - The completed order object
 * @returns {string} Fully responsive HTML content
 */
const getBookingConfirmationHTML = (order) => {
    let segmentsHTML = '';
    order.cart.forEach((segment, index) => {
        segmentsHTML += `
            <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <p style="font-size: 11px; color: #86868b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Stop ${index + 1}</p>
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1d1d1f; font-weight: 500;">${segment.propertyName}</h3>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #515154;">Location: ${segment.location}</p>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #515154;">Check-In: ${new Date(segment.checkIn).toLocaleDateString()}</p>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #515154;">Check-Out: ${new Date(segment.checkOut).toLocaleDateString()}</p>
                <p style="margin: 0; font-size: 14px; color: #515154;">Guests: ${segment.guests} &nbsp;|&nbsp; Nights: ${segment.totalNights}</p>
            </div>
        `;
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Residency Confirmation</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Text", Helvetica, Arial, sans-serif; }

        .wrapper { width: 100%; table-layout: fixed; background-color: #f5f5f7; padding-bottom: 40px; padding-top: 40px; }
        .main-card { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(0, 0, 0, 0.04); overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02); }
        
        .header-section { padding: 40px 40px 24px 40px; border-bottom: 1px solid rgba(0,0,0,0.03); text-align: left; }
        .body-section { padding: 40px 40px 48px 40px; }
        .footer-section { padding: 24px 40px; background-color: #f5f5f7; text-align: center; border-top: 1px solid rgba(0, 0, 0, 0.02); }

        .brand-logo { font-size: 16px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.01em; text-decoration: none; }
        .title { font-size: 24px; font-weight: 500; color: #1d1d1f; letter-spacing: -0.022em; margin-top: 0; margin-bottom: 8px; line-height: 1.25; }
        .subtitle { font-size: 14px; color: #86868b; margin-top: 0; margin-bottom: 32px; }
        .paragraph { font-size: 14px; font-weight: 400; color: #515154; line-height: 1.6; margin-top: 0; margin-bottom: 24px; }
        .salutation { font-size: 16px; font-weight: 600; color: #1d1d1f; margin-bottom: 12px; }
        
        .receipt-box { background: #fbfbfd; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 24px; margin-bottom: 32px; }
        .total-row { display: flex; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 16px; margin-top: 16px; }
        
        .footer-text { font-size: 11px; color: #86868b; line-height: 1.5; margin: 0; }
    </style>
</head>
<body>
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td>
                <table class="main-card" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td class="header-section">
                            <a href="#" class="brand-logo">Grandeur Keys</a>
                        </td>
                    </tr>
                    <tr>
                        <td class="body-section">
                            <h1 class="title">Residency Confirmed.</h1>
                            <p class="subtitle">Receipt #${order.confirmationNumber}</p>
                            
                            <p class="salutation">Dear ${order.customer.name},</p>
                            <p class="paragraph">
                                Your secure payment of <strong>$${order.totalCharged.toLocaleString()}</strong> has been processed successfully. Your private itinerary is perfectly arranged.
                            </p>
                            
                            <div class="receipt-box">
                                ${segmentsHTML}
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 16px;">
                                    <tr>
                                        <td style="font-size: 16px; font-weight: 600; color: #1d1d1f;">Grand Total Charged</td>
                                        <td style="font-size: 16px; font-weight: 600; color: #1d1d1f; text-align: right;">$${order.totalCharged.toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p class="paragraph">
                                If you require immediate assistance, custom jet transfers, or tailored culinary menus prior to arrival, simply interact with our AI Concierge on the platform.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer-section">
                            <p class="footer-text">This is an automated encrypted receipt from Grandeur Keys Inc.</p>
                            <p class="footer-text" style="margin-top: 4px;">One Apple Park Way, Cupertino, CA 95014</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

module.exports = { getWelcomeEmailHTML, getBookingConfirmationHTML };