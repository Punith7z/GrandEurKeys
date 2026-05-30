/**
 * Grandeur Keys - Booking Controller
 * Manages reservation drafts, date math, and coordinates multi-stop Split Stays
 */

const Property = require('../models/propertyModel');

module.exports = {
    /**
     * Initializes or processes a booking reservation draft in the session
     */
    initiateBooking: (req, res) => {
        const { propertyId, checkIn, checkOut, guests } = req.body;

        if (!propertyId || !checkIn || !checkOut) {
            return res.status(400).json({ error: "Missing essential reservation dates." });
        }

        const property = Property.getById(propertyId);
        if (!property) {
            return res.status(404).json({ error: "Selected property not found." });
        }

        // 1. Calculate Night Counts cleanly using Date objects
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ error: "Departure date must occur after the arrival date." });
        }

        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
        const totalNights = Math.ceil(timeDifference / (1000 * 3600 * 24));

        // 2. Compute dynamic price details matching high-end platform billing layouts
        const roomTotal = property.pricePerNight * totalNights;
        const cleanServiceFee = Math.round(roomTotal * 0.08); // Transparent flat 8% fee
        const taxes = Math.round((roomTotal + cleanServiceFee) * 0.12); // Standard 12% luxury tax
        const finalPrice = roomTotal + cleanServiceFee + taxes;

        // 3. Store reservation object in guest session
        // Supporting Split Stays: Store as an array in the session so multiple stops can be bundled together!
        const bookingSegment = {
            id: `gk-segment-${Date.now()}`,
            propertyId: property.id,
            propertyName: property.name,
            propertyImage: property.primaryImage,
            location: property.location,
            pricePerNight: property.pricePerNight,
            checkIn: checkIn,
            checkOut: checkOut,
            guests: parseInt(guests || '1'),
            totalNights: totalNights,
            pricingBreakdown: {
                roomTotal: roomTotal,
                serviceFee: cleanServiceFee,
                taxes: taxes,
                finalPrice: finalPrice
            }
        };

        // Initialize user cart array in session if empty
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Overwrite or append based on selection. For simple single stays, we set the active segment.
        // If they chose a Split Stay configuration, we let them append it!
        const isSplitStay = req.body.splitStay === 'true';
        if (isSplitStay) {
            req.session.cart.push(bookingSegment);
        } else {
            req.session.cart = [bookingSegment]; // Overwrites with a fresh, clean single reservation
        }

        console.log(`[Draft Engine] Created booking draft segment for: ${property.name} (${totalNights} Nights)`);

        // Seamlessly direct user forward to secure Stripe checkout
        res.status(200).json({ redirectUrl: '/stripe-checkout' });
    },

    /**
     * Clears specific booking segments from a split itinerary draft
     */
    removeSegment: (req, res) => {
        const { segmentId } = req.params;
        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(segment => segment.id !== segmentId);
        }
        res.redirect('/checkout');
    }
};