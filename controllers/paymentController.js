/**
 * Grandeur Keys - Payment Controller
 * Coordinates order summaries, billing tallies, and transaction approvals
 */

const { formatCurrency } = require('../utils/currencyFormatter');
const db = require('../config/db');

module.exports = {
    /**
     * Render the payment checkout dashboard
     */
    renderCheckout: (req, res) => {
        const cart = req.session.cart || [];

        // Guard: If there are no active room reservations, redirect them to browse
        if (cart.length === 0) {
            return res.redirect('/properties');
        }

        // Tally global financials across all segments in our cart (for Split Stays)
        let totalRoomCharge = 0;
        let totalServiceFees = 0;
        let totalTaxes = 0;

        cart.forEach(segment => {
            totalRoomCharge += segment.pricingBreakdown.roomTotal;
            totalServiceFees += segment.pricingBreakdown.serviceFee;
            totalTaxes += segment.pricingBreakdown.taxes;
        });

        const grandTotal = totalRoomCharge + totalServiceFees + totalTaxes;

        res.render('checkout', {
            title: 'Complete Your Order | Grandeur Keys',
            cart: cart,
            bill: {
                roomCharge: totalRoomCharge,
                serviceFees: totalServiceFees,
                taxes: totalTaxes,
                grandTotal: grandTotal
            },
            formatCurrency
        });
    },

    /**
     * Handle mock payment processing and transaction settlement
     */
    processPayment: (req, res) => {
        const { cardHolder, cardNumber, expiry, cvc } = req.body;
        const cart = req.session.cart || [];

        if (cart.length === 0) {
            return res.status(400).json({ error: "Your booking cart is currently empty." });
        }

        // Clean validation for cardholder inputs
        if (!cardHolder || !cardNumber || !expiry || !cvc) {
            return res.status(400).json({ error: "Please populate all payment credential fields." });
        }

        // Simple format checks (Credit card mock verification logic)
        const cleanCard = cardNumber.replace(/\s+/g, '');
        if (cleanCard.length < 15 || cleanCard.length > 16) {
            return res.status(400).json({ error: "Invalid payment card number." });
        }

        // Generate a random high-end transaction reference
        const confirmationNumber = `GK-TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create the final purchase record in session state for our success view to display
        req.session.completedOrder = {
            confirmationNumber: confirmationNumber,
            customer: req.session.user,
            cart: [...cart], // Deep copy current cart values
            transactionDate: new Date(),
            totalCharged: cart.reduce((acc, segment) => acc + segment.pricingBreakdown.finalPrice, 0)
        };

        // Clear the booking draft so they don't double checkout
        req.session.cart = [];

        console.log(`[Billing Engine] Transaction successful. Confirmation: ${confirmationNumber}`);

        res.status(200).json({
            success: true,
            redirectUrl: `/checkout/success?ref=${confirmationNumber}`
        });
    },

    /**
     * Render the beautiful transaction complete landing screen
     */
    renderSuccess: (req, res) => {
        const order = req.session.completedOrder;
        const ref = req.query.ref;

        // Ensure the order corresponds to their active checkout session
        if (!order || order.confirmationNumber !== ref) {
            return res.redirect('/');
        }

        res.render('success', {
            title: 'Your Stay is Secured | Grandeur Keys',
            order: order,
            formatCurrency
        });
    }
};