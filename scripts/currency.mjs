const API_KEY = 'a2a86a8b3dfe41555661a5ea'; 
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

// Function to fetch exchange api 
export async function getExchangeRate(targetCurrency = "USD") {
    try {
        // We fetch the conversion from GHS to the target (USD, EUR, etc.)
        const response = await fetch(`${BASE_URL}/pair/GHS/${targetCurrency}`);

        if (!response.ok) throw new Error("Currency fetch failed");

        const data = await response.json();

        // This object returns 'conversion_rate' and 'time_last_update_utc'
        return {
            rate: data.conversion_rate,
            symbol: getCurrencySymbol(targetCurrency),
            code: targetCurrency
        };
    } catch (error) {
        console.error("ExchangeRate-API Error:", error);
        return { rate: 1, symbol: "GHS", code: "GHS" }; // Fallback to GHS incase I reach my 1500 a month limit or api somehow does work 
    }
}

function getCurrencySymbol(code) {
    const symbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'GHS': '₵' };
    return symbols[code] || code;
}