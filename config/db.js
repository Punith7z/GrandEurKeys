/**
 * Grandeur Keys - Curated Property Database
 * Interface delegating to the Property model as a single source of truth
 */

const Property = require('../models/propertyModel');

module.exports = {
    /**
     * Retrieve all properties in the system
     * @returns {Array} Array of all hotels and resorts
     */
    getAllProperties: () => {
        return Property.getAll();
    },

    /**
     * Filter properties by their classification (hotel or resort)
     * @param {string} type 
     * @returns {Array} Filtered list
     */
    getPropertiesByType: (type) => {
        if (!type) return Property.getAll();
        return Property.getAll().filter(p => p.type.toLowerCase() === type.toLowerCase());
    },

    /**
     * Locate a unique property by its ID
     * @param {string} id 
     * @returns {Object|undefined} The matched property object
     */
    getPropertyById: (id) => {
        return Property.getById(id);
    }
};