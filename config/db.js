/**
 * Grandeur Keys - Curated Property Database
 * Mock database interface containing high-end global properties
 */

const properties = [
    {
        id: "gk-prop-01",
        name: "The Obsidian Pavilion",
        type: "hotel",
        tagline: "Monolithic glass design meets urban sanctuary.",
        location: "Tokyo, Japan",
        pricePerNight: 850,
        rating: 4.92,
        primaryImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200",
        airbnbIcon: "🏢", // Skyline Hotels Category Icon
        amenities: [
            "24/7 Elite Concierge",
            "Helipad & Lounge Access",
            "Heated Rooftop Infinity Pool",
            "Integrated Home Automations",
            "Two Michelin Star Dining Rooms",
            "EV Charging Station"
        ]
    },
    {
        id: "gk-prop-02",
        name: "Amanpuri Whispers",
        type: "resort",
        tagline: "Secluded cliffside villas overlooking clear lagoons.",
        location: "Phuket, Thailand",
        pricePerNight: 1250,
        rating: 4.98,
        primaryImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200",
        airbnbIcon: "🏝️", // Secluded Resorts Category Icon
        amenities: [
            "Private White Sand Lagoon",
            "Open-Air Relaxation Pavilions",
            "Ancient Thai Wellness Spa",
            "Personal Chef & Butler",
            "Deep Sea Private Yacht Charter"
        ]
    },
    {
        id: "gk-prop-03",
        name: "The Lumina Crest",
        type: "hotel",
        tagline: "Breathtaking floor-to-ceiling vistas above the metropolitan clouds.",
        location: "New York, USA",
        pricePerNight: 920,
        rating: 4.89,
        primaryImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
        airbnbIcon: "🏢", // Skyline Hotels Category Icon
        amenities: [
            "Private Skylight Observation Deck",
            "Sommelier-Stocked Wine Vault",
            "Automated Robotic Valet",
            "In-Suite Peloton Studio",
            "Pre-stocked Espresso Bar"
        ]
    },
    {
        id: "gk-prop-04",
        name: "Elysian Valley Canopy",
        type: "resort",
        tagline: "Eco-villas floating seamlessly over lush emerald rainforests.",
        location: "Bali, Indonesia",
        pricePerNight: 1100,
        rating: 4.95,
        primaryImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200",
        airbnbIcon: "🏝️", // Secluded Resorts Category Icon
        amenities: [
            "Private Volcanic Stone Plunge Pool",
            "Outdoor Rainfall Showers",
            "Ayurvedic Yoga Pavilion",
            "Guided Canopy Walks",
            "Personal Host & Chauffeur"
        ]
    }
];

module.exports = {
    /**
     * Retrieve all properties in the system
     * @returns {Array} Array of all hotels and resorts
     */
    getAllProperties: () => {
        return properties;
    },

    /**
     * Filter properties by their classification (hotel or resort)
     * @param {string} type 
     * @returns {Array} Filtered list
     */
    getPropertiesByType: (type) => {
        if (!type) return properties;
        return properties.filter(p => p.type.toLowerCase() === type.toLowerCase());
    },

    /**
     * Locate a unique property by its ID
     * @param {string} id 
     * @returns {Object|undefined} The matched property object
     */
    getPropertyById: (id) => {
        return properties.find(p => p.id === id);
    }
};