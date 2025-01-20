# CryptoPlatform

[![CI](https://github.com/denivladislav/crypto-platform/actions/workflows/CI.yml/badge.svg)](https://github.com/denivladislav/crypto-platform/actions/workflows/CI.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/a7e2c9040819c4047121/maintainability)](https://codeclimate.com/github/denivladislav/crypto-platform/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a7e2c9040819c4047121/test_coverage)](https://codeclimate.com/github/denivladislav/crypto-platform/test_coverage)

json-server backend:
https://github.com/denivladislav/crypto-platform-backend

This cryptocurrency app consists of three parts – Watchlist, Converter and Wallet.

The app uses CoinMarketApi to retrieve the currencies data and json-server for Wallet assets and transactions.

https://github.com/user-attachments/assets/38d9fcf9-92fe-40b6-ad4f-1428f51263e3

### Stack
- Angular 18, NgRx, RxJS, Angular Material, Karma + Jasmine
- ESLint, stylelint, htmlhint, prettier, husky

### How To Use Locally:
```bash
# Install Dependencies.
$ npm run install

# Build Project.
$ make build

# Develop.
$ npm run start

# Lint.
$ npm run lint
```

### Deploy
This app is deployed to Vercel.
https://crypto-platform-ashen.vercel.app/

The backend (json-server) is also deployed to Vercel.
https://crypto-platform-backend.vercel.app/
