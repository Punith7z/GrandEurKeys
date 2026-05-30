/**
 * Grandeur Keys - REST & AI API Router
 * Manages chatbot integration with Gemini, and booking creation endpoints
 */

const express = require('express');
const router = express.Router();
const Property = require('../models/propertyModel');
const bookingController = require('../controllers/bookingController');

const { GoogleGenAI } = require('@google/genai');

// Initialize Official Gemini SDK using environment variables
// Note: It automatically picks up GEMINI_API_KEY from process.env!
const ai = new GoogleGenAI({});

/**
 * POST /api/chat
 * Securely communicates with Gemini 2.5 Flash using the Official GenAI SDK
 */
router.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Missing prompt query message content." });
    }

    // 1. Gather all up-to-date hotel & resort profiles
    const allProperties = Property.getAll();

    // 2. Build the System Instruction to enforce Apple-like, high-end editorial tone
    const systemPrompt = `
You are the Grandeur Concierge, an elite, highly polished, and sophisticated AI Travel Assistant for the luxury hotel & resort booking platform "Grandeur Keys".
Your tone is respectful, warm, minimalist, and clear—mirroring Apple's official communications style. Always write concisely. Use brief formatting and bullet points when comparing places.

You have access to the following exclusive portfolio of properties on Grandeur Keys:
${JSON.stringify(allProperties, null, 2)}

Instructions:
1. Enthusiastically recommend ONLY the properties listed above. Do not invent properties outside this list.
2. Carefully match the user's specific request (e.g., location, type: hotel vs resort, amenities, price per night) to the properties in our database.
3. If they ask about pricing, mention the price per night clearly (e.g., "$850 per night").
4. Always wrap key property names in double asterisks, like **The Obsidian Pavilion** or **Amanpuri Whispers**, to make them stand out elegantly.
5. If the user's request doesn't match any property directly, politely recommend our closest luxury alternative and invite them to explore both Hotels and Resorts.
    `.trim();

    try {
        // 3. Generate response using the official SDK
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7
            }
        });

        const replyText = response.text;

        if (replyText) {
            res.status(200).json({ reply: replyText });
        } else {
            res.status(200).json({
                reply: "Our digital systems are currently undergoing a scheduled alignment. Please allow our human concierges to assist you shortly."
            });
        }
    } catch (error) {
        console.error('[AI Concierge SDK Error]:', error);
        res.status(500).json({
            error: "The AI concierge network is temporarily unavailable.",
            reply: "I apologize, but I am having trouble connecting to the Gemini engine right now. Please check your API Key configuration."
        });
    }
});

/**
 * POST /api/booking
 * Handles booking segment initialization or dynamic itinerary draft creations
 */
router.post('/booking', bookingController.initiateBooking);

/**
 * GET /api/booking/remove/:segmentId
 * Discards a specific segment from a Split Stay itinerary
 */
router.get('/booking/remove/:segmentId', bookingController.removeSegment);

module.exports = router;