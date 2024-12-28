const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fetchCurrencyConversion = async (endPoint) => {
    try {
        const res = await fetch(endPoint);
        const data = await res.json();

        if (data.rates) {
            return data.rates;
        }
        return null;
    } catch (error) {
        return null;                                                // Return null in case of error
    }
};

const currencyConveraterFormUSD = async (currency, amount) => {
    try {
        const toCurrency = currency == 356 ? 'INR' : 'THB';
        const endPoint = `https://api.frankfurter.app/latest?amount=${amount}&from=USD&to=${toCurrency}`;

        const rates = await fetchCurrencyConversion(endPoint);
        return rates ? rates[toCurrency] : amount;
    } catch (error) {
        return amount;                                            // Return the original amount in case of error
    }
};

const currencyConveraterToTHB = async (currency, amount) => {
    try {

        if (!currency || currency == 764) {
            return amount; // THB conversion not needed
        }

        const fromCurrency = currency == 356 ? 'INR' : 'USD';
        const endPoint = `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=THB`;

        const rates = await fetchCurrencyConversion(endPoint);

        return rates ? rates.THB : amount;
    } catch (error) {
        return amount;                                            // Return the original amount in case of error
    }
};

const currencyConveraterToUSD = async (currency, amount) => {
    try {


        if (!currency) {
            return amount; // THB conversion not needed
        }

        const fromCurrency = currency == 356 ? 'INR' : 'THB';
        const endPoint = `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=USD`;

        const rates = await fetchCurrencyConversion(endPoint);

        return rates ? rates.USD : amount;
    } catch (error) {
        return amount; // Return the original amount in case of error
    }
};

const currencyConveraterFormTHB = async (currency, amount) => {
    try {
        if (currency == 764) {
            return amount;
        }

        const toCurrency = currency == 356 ? 'INR' : 'USD';
        const endPoint = `https://api.frankfurter.app/latest?amount=${amount}&from=THB&to=${toCurrency}`;

        const rates = await fetchCurrencyConversion(endPoint);
        return rates ? rates[toCurrency] : amount;
    } catch (error) {
        return amount;                                            // Return the original amount in case of error
    }
};

module.exports = { currencyConveraterFormUSD, currencyConveraterToTHB, currencyConveraterToUSD, currencyConveraterFormTHB };
