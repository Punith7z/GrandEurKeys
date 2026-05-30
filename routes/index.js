const express = require('express');
const router = express.Router();
const Property = require('../models/propertyModel');
const nodemailer = require('nodemailer');
const { getBookingConfirmationHTML, getWelcomeEmailHTML } = require('../services/emailTemplates');

// 1. Portal Landing Overview Frame
router.get('/', (req, res) => {
    const properties = Property.getAll();
    const featured = properties.filter(p => p.isFeatured);
    res.render('index', {
        title: 'Grandeur Keys | Curated Residences',
        featured
    });
});

// 2. Dynamic Property Directory Core
router.get('/properties', (req, res) => {
    let properties = Property.getAll();
    const filter = req.query.type;

    if (filter === 'hotel' || filter === 'resort') {
        properties = properties.filter(p => p.type === filter);
    }

    res.render('properties', {
        title: 'Explore Portfolios | Grandeur Keys',
        properties,
        activeTab: filter || 'all'
    });
});

// 3. Detailed Residency Information and Core AI Split Engine Hook
router.get('/properties/:id', (req, res) => {
    const property = Property.getById(req.params.id);
    if (!property) return res.status(404).send('Residency Unresolved.');

    const mockContextSegment = { propertyId: property.id };
    const optimizedSplitSuggestion = Property.getOptimizedSplitSuggestion(mockContextSegment);

    res.render('property-details', {
        title: `${property.name} | Portfolio Details`,
        property,
        suggestion: optimizedSplitSuggestion
    });
});

// 4. Checkout Ledger View Controller
router.get('/checkout', (req, res) => {
    const cart = req.session.cart || [];

    let roomCharge = 0;
    cart.forEach(item => {
        roomCharge += item.pricingBreakdown.finalPrice;
    });

    const serviceFees = roomCharge * 0.08;
    const taxes = roomCharge * 0.12;
    const grandTotal = roomCharge + serviceFees + taxes;

    res.render('checkout', {
        title: 'Secure Settlement | Grandeur Keys',
        cart,
        bill: { roomCharge, serviceFees, taxes, grandTotal }
    });
});

// 4.5 Stripe Mock Checkout View Controller
router.get('/stripe-checkout', (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.redirect('/properties');

    let roomCharge = 0;
    cart.forEach(item => {
        roomCharge += item.pricingBreakdown.finalPrice;
    });

    const serviceFees = roomCharge * 0.08;
    const taxes = roomCharge * 0.12;
    const grandTotal = roomCharge + serviceFees + taxes;

    res.render('stripe-checkout', {
        title: 'Checkout | Stripe',
        cart,
        bill: { grandTotal },
        layout: false
    });
});

// 5. Process Transaction Engine Portal
router.post('/checkout/pay', (req, res) => {
    const cart = req.session.cart || [];

    let roomCharge = 0;
    cart.forEach(item => { roomCharge += item.pricingBreakdown.finalPrice; });
    const grandTotal = roomCharge * 1.20;

    const confirmationNumber = `GK-TXN-${Math.floor(10000 + Math.random() * 90000)}`;

    const confirmedOrder = {
        confirmationNumber,
        transactionDate: new Date(),
        totalCharged: grandTotal,
        currencyCode: req.session.currency || 'USD',
        customer: {
            name: req.body.cardHolder || 'Elite Guest',
            email: req.body.email || 'guest@grandeurkeys.com'
        },
        cart: [...cart]
    };

    Property.saveOrder(confirmedOrder);

    req.session.cart = [];
    req.session.lastOrder = confirmedOrder;

    // Send the beautiful email asynchronously
    (async () => {
        try {
            let transporter;
            
            // If real SMTP credentials are provided in .env, use them to send REAL emails!
            if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD && !process.env.SMTP_EMAIL.includes('your_official_email')) {
                transporter = nodemailer.createTransport({
                    service: 'gmail', // Use standard Gmail
                    auth: {
                        user: process.env.SMTP_EMAIL,
                        pass: process.env.SMTP_PASSWORD
                    }
                });
                console.log("[SMTP] Using real Gmail account to send receipt.");
            } else {
                // Fallback: Create ethereal test account on the fly for demonstration
                let testAccount = await nodemailer.createTestAccount();
                transporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
                console.log("[SMTP] Using Ethereal sandbox for mock email.");
            }

            const senderAddress = process.env.SMTP_EMAIL || '"Grandeur Keys Concierge" <concierge@grandeurkeys.com>';

            let info = await transporter.sendMail({
                from: senderAddress,
                to: confirmedOrder.customer.email,
                bcc: process.env.SMTP_EMAIL, // Also send a copy to the official inbox
                subject: "Your Grandeur Keys Residency is Confirmed",
                html: getBookingConfirmationHTML(confirmedOrder),
            });

            console.log("=========================================");
            console.log("💌  EMAIL RECEIPT SENT SUCCESSFULLY");
            if (info.messageId && !transporter.options.host) {
                // If there's no custom host configured, it means we used the Gmail 'service' shorthand
                console.log(`Real email successfully delivered to ${confirmedOrder.customer.email}`);
            } else if (transporter.options.host === "smtp.ethereal.email") {
                console.log("Preview your beautiful HTML Email here:");
                console.log(nodemailer.getTestMessageUrl(info));
            } else {
                console.log(`Real email successfully delivered to ${confirmedOrder.customer.email}`);
            }
            console.log("=========================================");
        } catch (err) {
            console.error("Failed to send email:", err);
        }
    })();

    res.json({ redirectUrl: '/success' });
});

// 6. Transaction Success Landing Frame
router.get('/success', (req, res) => {
    const order = req.session.lastOrder;
    if (!order) return res.redirect('/');

    res.render('success', {
        title: 'Residency Confirmed | Grandeur Keys',
        order
    });
});

// 7. Auth Login GET Route
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Sign In | Grandeur Keys',
        error: req.query.error ? 'Authentication failed. Please check credentials.' : null
    });
});

// 8. Auth Login POST Route
router.post('/login', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.redirect('/login?error=1');
    }
    // Simulate login by setting session
    req.session.user = { name, email };
    
    // Asynchronously send the Welcome email
    (async () => {
        try {
            let transporter;
            if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD && !process.env.SMTP_EMAIL.includes('your_official_email')) {
                transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD }
                });
            } else {
                let testAccount = await nodemailer.createTestAccount();
                transporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email", port: 587, secure: false,
                    auth: { user: testAccount.user, pass: testAccount.pass }
                });
            }

            const senderAddress = process.env.SMTP_EMAIL || '"Grandeur Keys Concierge" <concierge@grandeurkeys.com>';
            let info = await transporter.sendMail({
                from: senderAddress,
                to: email,
                subject: "Welcome to Grandeur Keys",
                html: getWelcomeEmailHTML(name),
            });

            console.log("=========================================");
            console.log("💌  WELCOME EMAIL SENT SUCCESSFULLY");
            if (info.messageId && !transporter.options.host) {
                console.log(`Real welcome email successfully delivered to ${email}`);
            } else if (transporter.options.host === "smtp.ethereal.email") {
                console.log("Preview your Welcome Email here:");
                console.log(nodemailer.getTestMessageUrl(info));
            }
            console.log("=========================================");
        } catch (err) {
            console.error("Failed to send welcome email:", err);
        }
    })();

    res.redirect('/');
});

// 9. Auth Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;