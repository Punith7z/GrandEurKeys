/**
 * Grandeur Keys - Property Controller
 * Coordinates filtering, rendering grids, and mapping detail views
 */

const db = require('../config/db');
const { formatCurrency } = require('../utils/currencyFormatter');

module.exports = {
    /**
     * Fetch and render the filterable grid of luxury properties
     */
    getProperties: (req, res) => {
        const typeFilter = req.query.type; // Capture e.g., ?type=hotel or ?type=resort
        let propertiesList;
        let activeTab = 'all';

        if (typeFilter && (typeFilter === 'hotel' || typeFilter === 'resort')) {
            propertiesList = db.getPropertiesByType(typeFilter);
            activeTab = typeFilter;
        } else {
            propertiesList = db.getAllProperties();
        }

        // Dynamic page title matching Apple's elegant copywriting
        const pageTitle = activeTab === 'hotel'
            ? 'Skyline Hotels | Grandeur Keys'
            : activeTab === 'resort'
                ? 'Secluded Resorts | Grandeur Keys'
                : 'Curated Destinations | Grandeur Keys';

        res.render('properties', {
            title: pageTitle,
            properties: propertiesList,
            activeTab: activeTab,
            formatCurrency // Pass the clean currency formatter to EJS view
        });
    },

    /**
     * Retrieve a single property profile for the deep-dive details layout
     */
    getPropertyDetails: (req, res) => {
        const propertyId = req.params.id;
        const property = db.getPropertyById(propertyId);

        if (!property) {
            // Gracefully render custom modern error if ID is missing
            return res.status(404).render('index', {
                title: 'Destination Not Found | Grandeur Keys',
                error: 'The requested luxury property could not be located in our archives.'
            });
        }

        // Fetch other curated listings to populate a "Similar Escapes" block at the bottom
        const allProperties = db.getAllProperties();
        const suggestedProperties = allProperties
            .filter(p => p.id !== property.id)
            .slice(0, 3); // Display up to 3 options

        res.render('details', {
            title: `${property.name} | Grandeur Keys`,
            property: property,
            suggested: suggestedProperties,
            formatCurrency
        });
    }
};