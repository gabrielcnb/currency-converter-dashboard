# Currency Converter Dashboard

![JavaScript](https://img.shields.io/badge/JavaScript-ES2017+-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

Browser-based dashboard that displays live BRL exchange rates for USD, EUR, GBP, BTC, and gold, with a real-time currency converter.

No build step, no dependencies, no backend -- pure HTML, CSS, and vanilla JavaScript.

## Features

- Live rate cards for Bitcoin, gold (XAU), US dollar, euro, and British pound (all in BRL)
- 24h percentage change indicator with positive/negative color coding
- Auto-refresh every 30 seconds with client-side cache
- BRL converter: enter any amount in reais and convert to any listed asset
- Output precision: 8 decimal places for BTC, grams for gold, 2 decimals for fiat
- Gold price fallback: calculates from USD/BRL if XAU-BRL endpoint fails
- Free API, no key required (AwesomeAPI)

## Stack

| Component | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript |
| Icons | Font Awesome 6 (CDN) |
| Rate data | [AwesomeAPI](https://economia.awesomeapi.com.br) |

## Getting Started

No installation required. Open `index.html` in any modern browser:

```bash
git clone https://github.com/gabrielcnb/currency-converter-dashboard.git
cd currency-converter-dashboard
start index.html
```

Rates load automatically and refresh every 30 seconds.

### Usage

1. Rate cards populate on page load with current BRL prices.
2. Enter a BRL amount, select a target asset, and click "Converter".
3. The converted value appears below the form.

## License

[MIT](LICENSE)
