const API_BASE_URL = 'https://economia.awesomeapi.com.br/last/';
let ratesCache = {};
let lastUpdate = null;

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
        throw new Error('Dados do ouro não disponíveis');
    } catch (error) {
        console.error('Erro ao obter preço do ouro:', error);
        try {
            const usdResponse = await fetch(`${API_BASE_URL}USD-BRL`);
            const usdData = await usdResponse.json();
            const usdRate = parseFloat(usdData.USDBRL.bid);
            const goldGramUSD = 65;
            return goldGramUSD * usdRate;
        } catch (backupError) {
            console.error('Erro no cálculo de backup do ouro:', backupError);
            return 300;
        }
    }
}

async function getRates() {
    try {
        const currencies = {
            USD: "dolar",
            EUR: "euro",
            GBP: "libra",
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
        rates.ouro = {
            price: goldPrice,
            change: rates.dolar ? rates.dolar.change : 0
        };

        return rates;
    } catch (error) {
        console.error('Erro ao obter taxas:', error);
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
    if (!lastUpdate || (now - lastUpdate) > 30000) { // 30 segundos
        const newRates = await getRates();
        if (newRates) {
            ratesCache = newRates;
            lastUpdate = now;
            updateUI(newRates);
        }
    }
}

function convertValue(valor, moeda) {
    if (!ratesCache[moeda]) return null;
    
    const rate = ratesCache[moeda].price;
    const decimals = moeda === 'bitcoin' ? 8 : 2;
    const convertedValue = (valor / rate).toFixed(decimals);
    
    const unit = moeda === 'bitcoin' ? 'BTC' : 
                moeda === 'ouro' ? 'gramas' : 
                moeda.toUpperCase();
                
    return { value: convertedValue, unit };
}

document.getElementById('convert-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const valor = parseFloat(document.getElementById('valor').value);
    const moeda = document.getElementById('moeda').value;
    
    const resultado = convertValue(valor, moeda);
    if (resultado) {
        const resultadoDiv = document.getElementById('resultado');
        const valorConvertido = document.getElementById('valor-convertido');
        
        valorConvertido.textContent = `${resultado.value} ${resultado.unit}`;
        resultadoDiv.classList.remove('hidden');
    }
});

// Atualiza as taxas a cada 30 segundos
setInterval(updateRates, 30000);

// Primeira atualização
updateRates();