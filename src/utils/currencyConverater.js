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
        return null; // Return null in case of error
    }
};

const currencyConveraterFormUSD = async (currency_code, currency) => {
    try {
        const toCurrency = currency_code == 356 ? 'INR' : 'THB';
        const endPoint = `https://api.frankfurter.app/latest?amount=${currency}&from=USD&to=${toCurrency}`;

        const rates = await fetchCurrencyConversion(endPoint);
        return rates ? rates[toCurrency] : currency;
    } catch (error) {
        return currency; // Return the original currency in case of error
    }
};

const currencyConveraterToTHB = async (currency_code, currency) => {
    try {

        if (!currency_code || currency_code == 764) {
            return currency; // THB conversion not needed
        }

        const fromCurrency = currency_code == 356 ? 'INR' : 'USD';
        const endPoint = `https://api.frankfurter.app/latest?amount=${currency}&from=${fromCurrency}&to=THB`;

        const rates = await fetchCurrencyConversion(endPoint);

        return rates ? rates.THB : currency;
    } catch (error) {
        return currency; // Return the original currency in case of error
    }
};

const currencyConveraterToUSD = async (currency_code, currency) => {
    try {
        

        if (!currency_code) {
            return currency; // THB conversion not needed
        }

        const fromCurrency = currency_code == 356 ? 'INR' : 'THB';
        const endPoint = `https://api.frankfurter.app/latest?amount=${currency}&from=${fromCurrency}&to=USD`;

        const rates = await fetchCurrencyConversion(endPoint);

        return rates ? rates.USD : currency;
    } catch (error) {
        return currency; // Return the original currency in case of error
    }
};

module.exports = { currencyConveraterFormUSD, currencyConveraterToTHB, currencyConveraterToUSD };
