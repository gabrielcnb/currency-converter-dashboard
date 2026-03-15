# currency-converter-dashboard

Browser-based dashboard that displays live BRL exchange rates for USD, EUR, GBP, BTC, and gold, with a BRL-to-any conversion form.

## Screenshot

![Dashboard UI](docs/screenshot.png)

*No screenshot available yet. Place a screenshot at `docs/screenshot.png`.*

## Features

- Live rate cards for Bitcoin, gold (XAU), US dollar, euro, and British pound — all quoted in BRL
- Percentage change indicator per asset with positive/negative color coding
- Auto-refresh every 30 seconds with client-side cache to avoid redundant API calls
- BRL converter: enter any amount in reais and convert to any listed asset
- Output precision: 8 decimal places for Bitcoin, grams for gold, 2 decimal places for fiat
- Gold price fallback: if the XAU-BRL endpoint fails, calculates from USD/BRL rate using a USD/oz reference
- No build step, no dependencies, no backend — pure HTML, CSS, and vanilla JavaScript

## Stack

| Component | Technology | Purpose |
|---|---|---|
| Markup | HTML5 | Page structure and rate cards |
| Styling | CSS3 | Layout, card styles, change color coding |
| Logic | Vanilla JavaScript (ES2017+) | API calls, rate caching, conversion, DOM updates |
| Icons | Font Awesome 6 (CDN) | Asset icons in rate cards |
| Rate data | AwesomeAPI (`economia.awesomeapi.com.br`) | Live FX, crypto, and gold rates — no API key required |

## Setup / Installation

No installation required. Open `index.html` directly in any modern browser:

```bash
git clone https://github.com/gabrielcnb/currency-converter-dashboard.git
cd currency-converter-dashboard

# Windows
start index.html
# macOS
open index.html
# Linux
xdg-open index.html
```

## Usage

**Viewing live rates:**
Open `index.html`. Rate cards populate on load. Each card shows the current BRL bid price and the 24h percentage change. Rates refresh automatically every 30 seconds.

**Converting a value:**
1. Enter a BRL amount in the "Valor em reais" field.
2. Select the target asset from the dropdown (Bitcoin, Ouro, Dólar, Euro, Libra).
3. Click "Converter". The converted result appears below the form.

**API endpoints used:**
```
GET https://economia.awesomeapi.com.br/last/USD-BRL
GET https://economia.awesomeapi.com.br/last/EUR-BRL
GET https://economia.awesomeapi.com.br/last/GBP-BRL
GET https://economia.awesomeapi.com.br/last/BTC-BRL
GET https://economia.awesomeapi.com.br/last/XAU-BRL
```

**Rate caching:**
Rates are cached in a module-level object (`ratesCache`) and only re-fetched when more than 30 seconds have elapsed since `lastUpdate`.

## File Structure

```
currency-converter-dashboard/
├── index.html   # Dashboard layout and rate card structure
├── style.css    # Card styling, layout, positive/negative color states
├── script.js    # API calls, caching, conversion logic, DOM updates
└── README.md
```

## Known Limitations

- All rates are BRL-denominated. Cross-currency conversion (e.g. USD to EUR) is not supported.
- Gold price fallback uses a hardcoded USD/oz reference (65 USD) when the XAU-BRL endpoint is unavailable.
- Requires an active internet connection. No offline mode.
