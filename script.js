const API_BASE_URL = 'https://economia.awesomeapi.com.br/last/';
let ratesCache = {};
let lastUpdate = null;

// Every quote is denominated in BRL, so the amounts keep Brazilian number formatting.
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

async function getGoldPrice() {
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/last/XAU-BRL');
        const data = await response.json();
        if (data.XAUBRL) {
            return parseFloat(data.XAUBRL.bid) / 31.1;
        }
        throw new Error('Gold data unavailable');
    } catch (error) {
        console.error('Failed to fetch the gold price:', error);
        try {
            const usdResponse = await fetch(`${API_BASE_URL}USD-BRL`);
            const usdData = await usdResponse.json();
            const usdRate = parseFloat(usdData.USDBRL.bid);
            const goldGramUSD = 65;
            return goldGramUSD * usdRate;
        } catch (backupError) {
            console.error('Gold fallback calculation failed:', backupError);
            return 300;
        }
    }
}

async function getRates() {
    try {
        const currencies = {
            USD: "usd",
            EUR: "eur",
            GBP: "gbp",
            BTC: "bitcoin"
        };

        const rates = {};

        for (const [currCode, localName] of Object.entries(currencies)) {
            const response = await fetch(`${API_BASE_URL}${currCode}-BRL`);
            const data = await response.json();

            const currencyKey = `${currCode}BRL`;
            if (data[currencyKey]) {
                rates[localName] = {
                    price: parseFloat(data[currencyKey].bid),
                    change: parseFloat(data[currencyKey].pctChange)
                };
            }
        }

        const goldPrice = await getGoldPrice();
        rates.gold = {
            price: goldPrice,
            change: rates.usd ? rates.usd.change : 0
        };

        return rates;
    } catch (error) {
        console.error('Failed to fetch rates:', error);
        return null;
    }
}

function updateUI(rates) {
    for (const [currency, data] of Object.entries(rates)) {
        const priceElement = document.getElementById(`${currency}-price`);
        const changeElement = document.getElementById(`${currency}-change`);

        if (priceElement) {
            priceElement.textContent = `R$ ${formatCurrency(data.price)}`;
        }

        if (changeElement) {
            const changeClass = data.change >= 0 ? 'positive' : 'negative';
            changeElement.textContent = `${data.change}%`;
            changeElement.className = `change ${changeClass}`;
        }
    }
}

async function updateRates() {
    const now = new Date();
    if (!lastUpdate || (now - lastUpdate) > 30000) { // 30 seconds
        const newRates = await getRates();
        if (newRates) {
            ratesCache = newRates;
            lastUpdate = now;
            updateUI(newRates);
        }
    }
}

function convertValue(amount, currency) {
    if (!ratesCache[currency]) return null;

    const rate = ratesCache[currency].price;
    const decimals = currency === 'bitcoin' ? 8 : 2;
    const convertedValue = (amount / rate).toFixed(decimals);

    const unit = currency === 'bitcoin' ? 'BTC' :
                currency === 'gold' ? 'grams' :
                currency.toUpperCase();

    return { value: convertedValue, unit };
}

document.getElementById('convert-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;

    const result = convertValue(amount, currency);
    if (result) {
        const resultDiv = document.getElementById('result');
        const convertedAmount = document.getElementById('converted-amount');

        convertedAmount.textContent = `${result.value} ${result.unit}`;
        resultDiv.classList.remove('hidden');
    }
});

// Refresh rates every 30 seconds
setInterval(updateRates, 30000);

// First load
updateRates();
