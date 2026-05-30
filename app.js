const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// 1. Initialize Express Application Core
const app = express();
const PORT = process.env.PORT || 8080;

// 2. Session Architecture (Maintains logged-in status & multi-stop cart selections)
app.use(session({
    secret: 'grandeur-keys-luxury-secret-key-1984',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Session active for 24 hours
        secure: false // Set to true if deploying behind HTTPS/SSL in production
    }
}));

// 3. Body Parsing Middleware (Handles standard forms and AJAX JSON payloads seamlessly)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. Static Asset Routing
app.use(express.static(path.join(__dirname, 'public')));

// 5. EJS Templating and Layout Engine Configuration
app.use(expressLayouts);
app.set('layout', 'layout'); // Targets views/layout.ejs as our core master frame
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 6. Global Context Middleware
// Seamlessly extracts currency selectors, active cart segments, and formatting helper functions
app.use((req, res, next) => {
    // Process optional query overrides or fall back to USD baseline
    if (req.query.currency) {
        req.session.currency = req.query.currency.toUpperCase();
    } else if (!req.session.currency) {
        req.session.currency = 'USD';
    }

    const { formatCurrency, CURRENCY_SYMBOLS } = require('./utils/currencyFormatter');

    // Bind session parameters directly to Express local variables so EJS templates can access them
    res.locals.user = req.session.user || null;
    res.locals.cart = req.session.cart || [];
    res.locals.activeCurrency = req.session.currency;
    res.locals.currencySymbols = CURRENCY_SYMBOLS;
    res.locals.formatCurrency = (amount) => formatCurrency(amount, req.session.currency);

    next();
});

// ==========================================================================
// ROUTING CHANNELS
// ==========================================================================

// Import Modular Routers
const apiRouter = require('./routes/api');
const webRouter = require('./routes/index');

// Mount Routers to Express Application
app.use('/api', apiRouter); // Mounts chatbot and booking addition endpoints
app.use('/', webRouter);    // Mounts landing, properties, checkout and success views

// 7. Graceful 404 Route Handler
app.use((req, res) => {
    res.status(404).render('index', {
        title: 'Route Unresolved | Grandeur Keys',
        featured: [],
        error: 'The requested luxury directory path could not be resolved.'
    });
});

// 8. Launch Luxury Server Engine
app.listen(PORT, () => {
    console.log(`
============================================================
  ✨  GRANDEUR KEYS LUXURY PORTAL RUNNING
  --------------------------------------------------------
  URL:                 http://localhost:${PORT}
  Environment:         Development / Apple Light Minimalist
  Multi-Currency:      USD, EUR, JPY, INR Active
  AI Concierge:        Online (Gemini 2.5 Flash Driven)
============================================================
    `);
});