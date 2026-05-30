/**
 * Grandeur Keys - Authentication Middleware
 * Seamlessly guards booking & checkout portals, redirecting to login if unauthenticated
 */

module.exports = {
    /**
     * Verifies that a user session exists before loading premium payment pipelines
     */
    requireAuth: (req, res, next) => {
        if (req.session && req.session.user) {
            // User is authenticated, proceed seamlessly
            return next();
        }

        // Capture their intended destination so we can drop them right back after login
        req.session.redirectTo = req.originalUrl;

        console.log(`[Shield] Unauthorized access to ${req.originalUrl}. Redirecting to login portal.`);
        res.redirect('/login');
    }
};