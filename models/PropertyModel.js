const fs = require('fs');
const path = require('path');
// Ensure the data/db.json folder structure exists!
const dbPath = path.join(__dirname, '../data/db.json');

function readDatabase() {
    const rawData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(rawData);
}

function writeDatabase(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

const Property = {
    getAll: () => {
        return readDatabase().properties;
    },

    getById: (id) => {
        if (!id) return null;
        return readDatabase().properties.find(p => String(p.id).trim() === String(id).trim()) || null;
    },

    saveOrder: (order) => {
        const db = readDatabase();
        db.orders.push(order);
        writeDatabase(db);
        return order;
    },

    getOptimizedSplitSuggestion: (currentCartItem) => {
        if (!currentCartItem) return null;
        const allProperties = Property.getAll();
        const baseProperty = Property.getById(currentCartItem.propertyId);
        if (!baseProperty) return null;

        return allProperties.find(candidate => {
            if (candidate.id === baseProperty.id) return false;
            const isGeographicallyLinked = candidate.location.split(',')[1]?.trim() === baseProperty.location.split(',')[1]?.trim();
            return isGeographicallyLinked;
        }) || allProperties.find(p => p.id !== baseProperty.id);
    }
};

module.exports = Property;