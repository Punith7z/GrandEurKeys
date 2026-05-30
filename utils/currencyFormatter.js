const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    JPY: '¥',
    INR: '₹'
};

function formatCurrency(amount, currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0
    }).format(amount);
}

module.exports = { formatCurrency, CURRENCY_SYMBOLS };
