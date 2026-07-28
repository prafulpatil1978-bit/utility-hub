document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const convertBtn = document.getElementById('convertBtn');
    const convertedAmountSpan = document.getElementById('convertedAmount');

    const API_KEY = 'YOUR_EXCHANGERATE_API_KEY'; // Replace with your actual API key
    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

    let exchangeRates = {};

    // Fetch currencies and populate dropdowns
    async function fetchCurrencies() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.result === 'success') {
                exchangeRates = data.conversion_rates;
                const currencies = Object.keys(exchangeRates);
                currencies.forEach(currency => {
                    const option1 = document.createElement('option');
                    option1.value = currency;
                    option1.textContent = currency;
                    fromCurrencySelect.appendChild(option1);

                    const option2 = document.createElement('option');
                    option2.value = currency;
                    option2.textContent = currency;
                    toCurrencySelect.appendChild(option2);
                });
                // Set default selections
                fromCurrencySelect.value = 'USD';
                toCurrencySelect.value = 'EUR';
            } else {
                console.error('Error fetching currencies:', data['error-type']);
                convertedAmountSpan.textContent = 'Error loading currencies.';
            }
        } catch (error) {
            console.error('Network error:', error);
            convertedAmountSpan.textContent = 'Network error loading currencies.';
        }
    }

    // Perform currency conversion
    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || amount <= 0) {
            convertedAmountSpan.textContent = 'Please enter a valid amount.';
            return;
        }

        if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
            convertedAmountSpan.textContent = 'Invalid currency selected.';
            return;
        }

        const rateFromUSD = exchangeRates[fromCurrency];
        const rateToUSD = exchangeRates[toCurrency];

        // Convert from 'fromCurrency' to USD, then from USD to 'toCurrency'
        const amountInUSD = amount / rateFromUSD;
        const convertedAmount = amountInUSD * rateToUSD;

        convertedAmountSpan.textContent = convertedAmount.toFixed(2);
    }

    // Event Listeners
    convertBtn.addEventListener('click', convertCurrency);
    fromCurrencySelect.addEventListener('change', convertCurrency);
    toCurrencySelect.addEventListener('change', convertCurrency);
    amountInput.addEventListener('input', convertCurrency); // Real-time conversion

    // Initial fetch and conversion
    fetchCurrencies().then(() => {
        convertCurrency();
    });
});
